#!/usr/bin/env python3
"""
HH application tracker.

Stores evaluated hh.ru vacancies, sent applications, cover letters, selected
resumes, and salary ranges in a private SQLite database.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sqlite3
import sys
from pathlib import Path
from typing import Any


DEFAULT_DB = Path("applications/_tracking/hh_applications.sqlite")

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


RESUME_EXPECTATIONS = {
    "Fractional CTO / Interim CTO": (5000, "EUR"),
    "Fractional CTO / Interim CTO / Технический руководитель": (5000, "EUR"),
    "Digital Transformation Lead / IT Transformation Manager": (4000, "EUR"),
    "Руководитель цифровой трансформации / IT Transformation Lead": (4000, "EUR"),
    "Technical Product Lead / Product Owner": (4000, "EUR"),
    "Технический Product Lead / Product Owner": (4000, "EUR"),
    "Systems Architect / Solutions Architect": (4000, "EUR"),
    "Системный архитектор / Solution Architect": (4000, "EUR"),
    "Head of Engineering / Engineering Manager": (4500, "EUR"),
    "Руководитель разработки / Engineering Manager": (4500, "EUR"),
}


def utc_now() -> str:
    return dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat()


def connect(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS hh_vacancies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hh_vacancy_id TEXT,
            url TEXT NOT NULL UNIQUE,
            title TEXT,
            company TEXT,
            salary_raw TEXT,
            salary_min INTEGER,
            salary_max INTEGER,
            salary_currency TEXT,
            salary_period TEXT,
            salary_after_taxes INTEGER,
            experience TEXT,
            employment TEXT,
            schedule TEXT,
            work_hours TEXT,
            workplace TEXT,
            location TEXT,
            applicant_location TEXT,
            skills_json TEXT NOT NULL DEFAULT '[]',
            description TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS hh_application_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vacancy_id INTEGER NOT NULL,
            decision TEXT NOT NULL,
            decision_reason TEXT,
            selected_resume TEXT,
            selected_resume_expected_amount INTEGER,
            selected_resume_expected_currency TEXT,
            cover_letter TEXT,
            status TEXT,
            employer_questions_json TEXT NOT NULL DEFAULT '[]',
            source_resume_list_title TEXT,
            source_suitable_count INTEGER,
            notes TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (vacancy_id) REFERENCES hh_vacancies(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_hh_vacancies_salary
            ON hh_vacancies(salary_currency, salary_min, salary_max);

        CREATE INDEX IF NOT EXISTS idx_hh_vacancies_role
            ON hh_vacancies(title, company);

        CREATE INDEX IF NOT EXISTS idx_hh_events_decision
            ON hh_application_events(decision, created_at);

        CREATE INDEX IF NOT EXISTS idx_hh_events_resume
            ON hh_application_events(selected_resume, created_at);
        """
    )
    conn.commit()


def normalize_text(value: Any) -> str:
    text = str(value or "").replace("\u00a0", " ")
    text = "".join(char for char in text if not 0xD800 <= ord(char) <= 0xDFFF)
    return re.sub(r"\s+", " ", text).strip()


def extract_hh_id(url: str) -> str:
    match = re.search(r"/vacancy/(\d+)|vacancyId=(\d+)", url or "")
    if not match:
        return ""
    return next(group for group in match.groups() if group)


def parse_salary(raw_salary: str) -> dict[str, Any]:
    text = normalize_text(raw_salary).lower()
    if not text:
        return {
            "salary_min": None,
            "salary_max": None,
            "salary_currency": "",
            "salary_period": "",
            "salary_after_taxes": None,
        }

    currency = ""
    if any(token in text for token in ["₽", "руб", "rub"]):
        currency = "RUB"
    elif any(token in text for token in ["€", "eur"]):
        currency = "EUR"
    elif any(token in text for token in ["$", "usd"]):
        currency = "USD"

    after_taxes = 1 if any(token in text for token in ["after taxes", "на руки", "net"]) else 0
    period = "month" if any(token in text for token in ["month", "месяц", "мес"]) else ""

    numbers = [int(re.sub(r"\D", "", item)) for item in re.findall(r"\d[\d\s\u00a0]*", text)]
    numbers = [number for number in numbers if number > 0]

    salary_min = None
    salary_max = None

    if numbers:
        if re.search(r"\b(to|до)\b", text) and not re.search(r"\b(from|от)\b", text):
            salary_max = numbers[0]
        elif re.search(r"\b(from|от)\b", text) and not re.search(r"\b(to|до)\b", text):
            salary_min = numbers[0]
        elif len(numbers) >= 2:
            salary_min = min(numbers[0], numbers[1])
            salary_max = max(numbers[0], numbers[1])
        else:
            salary_min = numbers[0]

    return {
        "salary_min": salary_min,
        "salary_max": salary_max,
        "salary_currency": currency,
        "salary_period": period,
        "salary_after_taxes": after_taxes,
    }


def as_json(value: Any) -> str:
    return json.dumps(value if value is not None else [], ensure_ascii=False, sort_keys=True)


def upsert_log(conn: sqlite3.Connection, payload: dict[str, Any]) -> int:
    vacancy = payload.get("vacancy") or payload
    url = normalize_text(vacancy.get("url"))
    if not url:
        raise ValueError("payload must include vacancy.url or url")

    now = utc_now()
    salary_raw = normalize_text(vacancy.get("salary") or vacancy.get("salary_raw"))
    salary = parse_salary(salary_raw)
    skills = vacancy.get("skills") or []

    conn.execute(
        """
        INSERT INTO hh_vacancies (
            hh_vacancy_id, url, title, company, salary_raw, salary_min, salary_max,
            salary_currency, salary_period, salary_after_taxes, experience, employment,
            schedule, work_hours, workplace, location, applicant_location, skills_json,
            description, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(url) DO UPDATE SET
            title = excluded.title,
            company = excluded.company,
            salary_raw = excluded.salary_raw,
            salary_min = excluded.salary_min,
            salary_max = excluded.salary_max,
            salary_currency = excluded.salary_currency,
            salary_period = excluded.salary_period,
            salary_after_taxes = excluded.salary_after_taxes,
            experience = excluded.experience,
            employment = excluded.employment,
            schedule = excluded.schedule,
            work_hours = excluded.work_hours,
            workplace = excluded.workplace,
            location = excluded.location,
            applicant_location = excluded.applicant_location,
            skills_json = excluded.skills_json,
            description = excluded.description,
            updated_at = excluded.updated_at
        """,
        (
            extract_hh_id(url),
            url,
            normalize_text(vacancy.get("title")),
            normalize_text(vacancy.get("company")),
            salary_raw,
            salary["salary_min"],
            salary["salary_max"],
            salary["salary_currency"],
            salary["salary_period"],
            salary["salary_after_taxes"],
            normalize_text(vacancy.get("experience")),
            normalize_text(vacancy.get("employment")),
            normalize_text(vacancy.get("schedule")),
            normalize_text(vacancy.get("workHours") or vacancy.get("work_hours")),
            normalize_text(vacancy.get("workplace")),
            normalize_text(vacancy.get("location")),
            normalize_text(vacancy.get("applicantLocation") or vacancy.get("applicant_location")),
            as_json(skills),
            normalize_text(vacancy.get("description")),
            now,
            now,
        ),
    )

    vacancy_id = conn.execute("SELECT id FROM hh_vacancies WHERE url = ?", (url,)).fetchone()["id"]

    selected_resume = normalize_text(payload.get("selected_resume") or payload.get("selectedResume"))
    expected_amount = payload.get("selected_resume_expected_amount")
    expected_currency = normalize_text(payload.get("selected_resume_expected_currency"))
    if selected_resume in RESUME_EXPECTATIONS and not expected_amount:
        expected_amount, expected_currency = RESUME_EXPECTATIONS[selected_resume]

    conn.execute(
        """
        INSERT INTO hh_application_events (
            vacancy_id, decision, decision_reason, selected_resume,
            selected_resume_expected_amount, selected_resume_expected_currency,
            cover_letter, status, employer_questions_json, source_resume_list_title,
            source_suitable_count, notes, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            vacancy_id,
            normalize_text(payload.get("decision") or "applied"),
            normalize_text(payload.get("decision_reason") or payload.get("decisionReason")),
            selected_resume,
            expected_amount,
            expected_currency,
            str(payload.get("cover_letter") or payload.get("coverLetter") or ""),
            normalize_text(payload.get("status")),
            as_json(payload.get("employer_questions") or payload.get("employerQuestions") or []),
            normalize_text(payload.get("source_resume_list_title") or payload.get("sourceResumeListTitle")),
            payload.get("source_suitable_count") or payload.get("sourceSuitableCount"),
            normalize_text(payload.get("notes")),
            now,
        ),
    )
    conn.commit()
    return vacancy_id


def read_payload(path: str | None) -> dict[str, Any]:
    if path and path != "-":
        return json.loads(Path(path).read_text(encoding="utf-8"))
    if hasattr(sys.stdin, "buffer"):
        return json.loads(sys.stdin.buffer.read().decode("utf-8"))
    return json.loads(sys.stdin.read())


def print_stats(conn: sqlite3.Connection) -> None:
    total = conn.execute("SELECT COUNT(*) AS c FROM hh_application_events").fetchone()["c"]
    applied = conn.execute(
        "SELECT COUNT(*) AS c FROM hh_application_events WHERE decision = 'applied'"
    ).fetchone()["c"]
    print(f"events: {total}")
    print(f"applied: {applied}")
    print()

    print("decisions:")
    for row in conn.execute(
        """
        SELECT decision, COUNT(*) AS count
        FROM hh_application_events
        GROUP BY decision
        ORDER BY count DESC
        """
    ):
        print(f"  {row['decision']}: {row['count']}")
    print()

    print("RUB salary ranges by selected resume:")
    rows = conn.execute(
        """
        SELECT
            e.selected_resume,
            COUNT(*) AS count,
            ROUND(AVG(COALESCE(v.salary_max, v.salary_min))) AS avg_visible_salary,
            MIN(COALESCE(v.salary_min, v.salary_max)) AS min_visible_salary,
            MAX(COALESCE(v.salary_max, v.salary_min)) AS max_visible_salary
        FROM hh_application_events e
        JOIN hh_vacancies v ON v.id = e.vacancy_id
        WHERE v.salary_currency = 'RUB'
          AND (v.salary_min IS NOT NULL OR v.salary_max IS NOT NULL)
        GROUP BY e.selected_resume
        ORDER BY avg_visible_salary DESC
        """
    ).fetchall()
    if not rows:
        print("  no RUB salary data yet")
    for row in rows:
        print(
            f"  {row['selected_resume'] or '(none)'}: "
            f"n={row['count']}, avg={row['avg_visible_salary']}, "
            f"min={row['min_visible_salary']}, max={row['max_visible_salary']}"
        )
    print()

    print("latest applications:")
    for row in conn.execute(
        """
        SELECT e.created_at, e.decision, e.selected_resume, e.status,
               v.title, v.company, v.salary_raw, v.url
        FROM hh_application_events e
        JOIN hh_vacancies v ON v.id = e.vacancy_id
        ORDER BY e.created_at DESC
        LIMIT 10
        """
    ):
        print(
            f"  {row['created_at']} | {row['decision']} | {row['status']} | "
            f"{row['title']} / {row['company']} | {row['salary_raw']} | "
            f"{row['selected_resume']}"
        )


def list_events(conn: sqlite3.Connection, limit: int) -> None:
    for row in conn.execute(
        """
        SELECT e.id, e.created_at, e.decision, e.selected_resume, e.status,
               v.title, v.company, v.salary_raw, v.url
        FROM hh_application_events e
        JOIN hh_vacancies v ON v.id = e.vacancy_id
        ORDER BY e.created_at DESC
        LIMIT ?
        """,
        (limit,),
    ):
        print(
            json.dumps(
                {
                    "id": row["id"],
                    "created_at": row["created_at"],
                    "decision": row["decision"],
                    "selected_resume": row["selected_resume"],
                    "status": row["status"],
                    "title": row["title"],
                    "company": row["company"],
                    "salary": row["salary_raw"],
                    "url": row["url"],
                },
                ensure_ascii=False,
            )
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Track hh.ru applications in SQLite.")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help=f"SQLite DB path. Default: {DEFAULT_DB}")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="Create the SQLite schema.")

    log_parser = sub.add_parser("log", help="Insert/update a vacancy and append an application event.")
    log_parser.add_argument("--json", dest="json_path", default="-", help="Payload JSON path, or '-' for stdin.")

    stats_parser = sub.add_parser("stats", help="Print aggregate salary/application stats.")
    stats_parser.set_defaults(command="stats")

    list_parser = sub.add_parser("list", help="List latest events as JSON lines.")
    list_parser.add_argument("--limit", type=int, default=20)

    args = parser.parse_args()
    conn = connect(args.db)
    init_db(conn)

    if args.command == "init":
        print(f"initialized {args.db}")
    elif args.command == "log":
        payload = read_payload(args.json_path)
        vacancy_id = upsert_log(conn, payload)
        print(f"logged vacancy_id={vacancy_id}")
    elif args.command == "stats":
        print_stats(conn)
    elif args.command == "list":
        list_events(conn, args.limit)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
