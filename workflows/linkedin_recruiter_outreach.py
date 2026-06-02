#!/usr/bin/env python3
"""
LinkedIn recruiter outreach helper.

This script intentionally does not scrape LinkedIn and does not send automated
messages. It imports the official LinkedIn Connections CSV export, finds likely
HR/recruiter/talent contacts by title keywords, stores them in SQLite, prepares
message drafts, and opens profiles for manual review/sending.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import os
import random
import re
import sqlite3
import subprocess
import sys
import textwrap
import time
import webbrowser
from pathlib import Path


DEFAULT_DB = Path("data/linkedin_recruiter_outreach.sqlite")

RECRUITER_PATTERNS = [
    r"\brecruit(er|ing|ment)?\b",
    r"\btalent\b",
    r"\btalent acquisition\b",
    r"\bsourc(er|ing)?\b",
    r"\bhr\b",
    r"\bhuman resources\b",
    r"\bpeople\b",
    r"\bpeople operations\b",
    r"\bpeople partner\b",
    r"\bstaffing\b",
    r"\bheadhunter\b",
    r"\bcareer consultant\b",
    r"\bваканс",
    r"\bрекрут",
    r"\bhr\b",
    r"\bљудски ресурси\b",
]

DEFAULT_MESSAGE_TEMPLATE = """Hi {first_name},

I’m checking whether you might have roles where my background could be relevant.

Short version: I’m a technology leader / systems architect with 18 years across internal systems, ERP/CRM, automation, infrastructure, Supabase/PostgreSQL, low-code/hybrid delivery, and IT leadership. I’m strongest in messy implementation environments: old systems, unclear workflows, access rules, data models, rollout, and adoption.

If you have CTO / Head of Engineering / Head of IT / Solution Architect / Implementation Lead / Technical Product roles where this profile could fit, I’d be glad to send a focused CV.

Best,
Anton"""


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

        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT,
            last_name TEXT,
            full_name TEXT NOT NULL,
            profile_url TEXT UNIQUE,
            email TEXT,
            company TEXT,
            position TEXT,
            connected_on TEXT,
            is_recruiting_contact INTEGER NOT NULL DEFAULT 0,
            match_reason TEXT,
            source TEXT NOT NULL DEFAULT 'linkedin_connections_csv',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS outreach (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            contact_id INTEGER NOT NULL UNIQUE,
            status TEXT NOT NULL DEFAULT 'queued',
            message TEXT NOT NULL,
            notes TEXT,
            opened_at TEXT,
            sent_at TEXT,
            replied_at TEXT,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_contacts_recruiting
            ON contacts(is_recruiting_contact, company, position);

        CREATE INDEX IF NOT EXISTS idx_outreach_status
            ON outreach(status, updated_at);
        """
    )
    conn.commit()


def normalize_header(header: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", header.strip().lower()).strip("_")


def get_value(row: dict[str, str], *names: str) -> str:
    for name in names:
        key = normalize_header(name)
        if key in row and row[key].strip():
            return row[key].strip()
    return ""


def detect_recruiter(position: str, company: str = "") -> tuple[bool, str]:
    haystack = f"{position} {company}".lower()
    hits = []
    for pattern in RECRUITER_PATTERNS:
        if re.search(pattern, haystack, flags=re.IGNORECASE):
            hits.append(pattern)
    if hits:
        return True, ", ".join(hits[:4])
    return False, ""


def render_message(template: str, contact: sqlite3.Row | dict[str, str]) -> str:
    first = (contact["first_name"] or "").strip()
    if not first:
        first = (contact["full_name"] or "there").split()[0]
    values = {
        "first_name": first,
        "full_name": contact["full_name"] or "",
        "company": contact["company"] or "",
        "position": contact["position"] or "",
    }
    return template.format(**values)


def load_template(path: Path | None) -> str:
    if not path:
        return DEFAULT_MESSAGE_TEMPLATE
    return path.read_text(encoding="utf-8")


def upsert_contact(conn: sqlite3.Connection, contact: dict[str, str], template: str) -> int:
    now = utc_now()
    is_recruiter, reason = detect_recruiter(contact["position"], contact["company"])
    contact["is_recruiting_contact"] = 1 if is_recruiter else 0
    contact["match_reason"] = reason

    existing = None
    if contact["profile_url"]:
        existing = conn.execute(
            "SELECT * FROM contacts WHERE profile_url = ?", (contact["profile_url"],)
        ).fetchone()
    if existing is None and contact["email"]:
        existing = conn.execute(
            "SELECT * FROM contacts WHERE email = ? AND full_name = ?",
            (contact["email"], contact["full_name"]),
        ).fetchone()

    if existing:
        contact_id = existing["id"]
        conn.execute(
            """
            UPDATE contacts
               SET first_name = ?, last_name = ?, full_name = ?, email = ?,
                   company = ?, position = ?, connected_on = ?,
                   is_recruiting_contact = ?, match_reason = ?, updated_at = ?
             WHERE id = ?
            """,
            (
                contact["first_name"],
                contact["last_name"],
                contact["full_name"],
                contact["email"],
                contact["company"],
                contact["position"],
                contact["connected_on"],
                contact["is_recruiting_contact"],
                contact["match_reason"],
                now,
                contact_id,
            ),
        )
    else:
        cur = conn.execute(
            """
            INSERT INTO contacts (
                first_name, last_name, full_name, profile_url, email, company,
                position, connected_on, is_recruiting_contact, match_reason,
                created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                contact["first_name"],
                contact["last_name"],
                contact["full_name"],
                contact["profile_url"] or None,
                contact["email"],
                contact["company"],
                contact["position"],
                contact["connected_on"],
                contact["is_recruiting_contact"],
                contact["match_reason"],
                now,
                now,
            ),
        )
        contact_id = int(cur.lastrowid)

    if is_recruiter:
        row = conn.execute("SELECT * FROM contacts WHERE id = ?", (contact_id,)).fetchone()
        message = render_message(template, row)
        conn.execute(
            """
            INSERT INTO outreach (contact_id, status, message, updated_at)
            VALUES (?, 'queued', ?, ?)
            ON CONFLICT(contact_id) DO UPDATE SET
                message = excluded.message,
                updated_at = excluded.updated_at
            WHERE outreach.status IN ('queued', 'opened')
            """,
            (contact_id, message, now),
        )

    return contact_id


def import_csv(conn: sqlite3.Connection, csv_path: Path, template: str) -> None:
    init_db(conn)
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise RuntimeError("CSV has no header row")
        normalized_rows = []
        for row in reader:
            normalized_rows.append({normalize_header(k): (v or "") for k, v in row.items()})

    imported = 0
    matched = 0
    for row in normalized_rows:
        first = get_value(row, "First Name", "FirstName", "First")
        last = get_value(row, "Last Name", "LastName", "Last")
        full_name = " ".join(x for x in [first, last] if x).strip()
        if not full_name:
            full_name = get_value(row, "Name", "Full Name")
        if not full_name:
            continue

        contact = {
            "first_name": first,
            "last_name": last,
            "full_name": full_name,
            "profile_url": get_value(row, "URL", "Profile URL", "LinkedIn Profile", "LinkedIn"),
            "email": get_value(row, "Email Address", "Email"),
            "company": get_value(row, "Company", "Current Company"),
            "position": get_value(row, "Position", "Title", "Job Title"),
            "connected_on": get_value(row, "Connected On", "Connected"),
        }
        upsert_contact(conn, contact, template)
        imported += 1
        if detect_recruiter(contact["position"], contact["company"])[0]:
            matched += 1

    conn.commit()
    print(f"Imported/updated contacts: {imported}")
    print(f"Likely HR/recruiter/talent contacts queued: {matched}")


def list_contacts(conn: sqlite3.Connection, status: str | None, limit: int) -> None:
    init_db(conn)
    if status:
        rows = conn.execute(
            """
            SELECT c.*, o.status, o.updated_at AS outreach_updated_at
              FROM contacts c
              JOIN outreach o ON o.contact_id = c.id
             WHERE o.status = ?
             ORDER BY o.updated_at ASC
             LIMIT ?
            """,
            (status, limit),
        ).fetchall()
    else:
        rows = conn.execute(
            """
            SELECT c.*, o.status, o.updated_at AS outreach_updated_at
              FROM contacts c
              LEFT JOIN outreach o ON o.contact_id = c.id
             WHERE c.is_recruiting_contact = 1
             ORDER BY COALESCE(o.updated_at, c.updated_at) ASC
             LIMIT ?
            """,
            (limit,),
        ).fetchall()

    for row in rows:
        print(
            f"[{row['id']}] {row['full_name']} | {row['position']} | "
            f"{row['company']} | status={row['status'] or '-'}"
        )
        if row["profile_url"]:
            print(f"    {row['profile_url']}")


def copy_to_clipboard(text: str) -> bool:
    if os.name == "nt":
        subprocess.run("clip", input=text, text=True, check=True)
        return True
    if sys.platform == "darwin":
        subprocess.run("pbcopy", input=text, text=True, check=True)
        return True
    for cmd in ("wl-copy", "xclip", "xsel"):
        try:
            if cmd == "xclip":
                subprocess.run([cmd, "-selection", "clipboard"], input=text, text=True, check=True)
            elif cmd == "xsel":
                subprocess.run([cmd, "--clipboard", "--input"], input=text, text=True, check=True)
            else:
                subprocess.run([cmd], input=text, text=True, check=True)
            return True
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue
    return False


def get_next(conn: sqlite3.Connection, contact_id: int | None = None) -> sqlite3.Row | None:
    init_db(conn)
    if contact_id:
        return conn.execute(
            """
            SELECT c.*, o.status, o.message
              FROM contacts c
              JOIN outreach o ON o.contact_id = c.id
             WHERE c.id = ?
            """,
            (contact_id,),
        ).fetchone()
    return conn.execute(
        """
        SELECT c.*, o.status, o.message
          FROM contacts c
          JOIN outreach o ON o.contact_id = c.id
         WHERE o.status IN ('queued', 'opened')
         ORDER BY
              CASE WHEN c.connected_on IS NULL OR c.connected_on = '' THEN 1 ELSE 0 END,
              c.connected_on DESC,
              o.updated_at ASC
         LIMIT 1
        """
    ).fetchone()


def open_next(conn: sqlite3.Connection, contact_id: int | None, copy: bool) -> None:
    row = get_next(conn, contact_id)
    if not row:
        print("No queued contacts found.")
        return

    now = utc_now()
    conn.execute(
        "UPDATE outreach SET status = 'opened', opened_at = COALESCE(opened_at, ?), updated_at = ? WHERE contact_id = ?",
        (now, now, row["id"]),
    )
    conn.commit()

    print(f"{row['full_name']} | {row['position']} | {row['company']}")
    print("")
    print(row["message"])
    print("")

    if copy:
        ok = copy_to_clipboard(row["message"])
        print("Message copied to clipboard." if ok else "Could not copy to clipboard.")

    if row["profile_url"]:
        print(f"Opening: {row['profile_url']}")
        webbrowser.open(row["profile_url"])
    else:
        print("No profile URL for this contact.")


def queued_contacts(conn: sqlite3.Connection, limit: int) -> list[sqlite3.Row]:
    init_db(conn)
    return conn.execute(
        """
        SELECT c.*, o.status, o.message
          FROM contacts c
          JOIN outreach o ON o.contact_id = c.id
         WHERE o.status IN ('queued', 'opened')
         ORDER BY
              CASE WHEN c.connected_on IS NULL OR c.connected_on = '' THEN 1 ELSE 0 END,
              c.connected_on DESC,
              o.updated_at ASC
         LIMIT ?
        """,
        (limit,),
    ).fetchall()


def manual_campaign(
    conn: sqlite3.Connection,
    limit: int,
    copy: bool,
    min_delay: int,
    max_delay: int,
) -> None:
    if min_delay < 0 or max_delay < 0 or max_delay < min_delay:
        raise ValueError("Delay must be non-negative and max-delay must be >= min-delay")

    rows = queued_contacts(conn, limit)
    if not rows:
        print("No queued contacts found.")
        return

    print(
        "Manual campaign mode. The script will not send LinkedIn messages.\n"
        "It opens each profile, optionally copies the draft, waits for your manual action,\n"
        "then records the status and waits before the next profile.\n"
    )

    for idx, row in enumerate(rows, start=1):
        now = utc_now()
        conn.execute(
            "UPDATE outreach SET status = 'opened', opened_at = COALESCE(opened_at, ?), updated_at = ? WHERE contact_id = ?",
            (now, now, row["id"]),
        )
        conn.commit()

        print("=" * 72)
        print(f"{idx}/{len(rows)} | [{row['id']}] {row['full_name']}")
        print(f"{row['position']} | {row['company']}")
        if row["profile_url"]:
            print(row["profile_url"])
        print("")
        print(row["message"])
        print("")

        if copy:
            ok = copy_to_clipboard(row["message"])
            print("Message copied to clipboard." if ok else "Could not copy to clipboard.")

        if row["profile_url"]:
            webbrowser.open(row["profile_url"])
            print("Profile opened. If LinkedIn asks for login, log in manually in the browser.")

        choice = input(
            "After manual action: [Enter]=mark sent, s=skip/opened, n=not relevant, q=quit: "
        ).strip().lower()

        if choice == "q":
            print("Stopped by user.")
            break
        if choice == "n":
            mark(conn, row["id"], "not_relevant", "Marked not relevant during manual campaign")
        elif choice == "s":
            print(f"Contact {row['id']} left as opened.")
        else:
            mark(conn, row["id"], "sent", "Sent manually in LinkedIn during manual campaign")

        if idx < len(rows):
            delay = random.randint(min_delay, max_delay)
            if delay:
                print(f"Waiting {delay} seconds before next profile...")
                time.sleep(delay)


def mark(conn: sqlite3.Connection, contact_id: int, status: str, notes: str | None) -> None:
    init_db(conn)
    now = utc_now()
    fields = ["status = ?", "updated_at = ?"]
    values: list[str | int | None] = [status, now]
    if status == "sent":
        fields.append("sent_at = COALESCE(sent_at, ?)")
        values.append(now)
    if status == "replied":
        fields.append("replied_at = COALESCE(replied_at, ?)")
        values.append(now)
    if notes is not None:
        fields.append("notes = ?")
        values.append(notes)
    values.append(contact_id)
    conn.execute(f"UPDATE outreach SET {', '.join(fields)} WHERE contact_id = ?", values)
    conn.commit()
    print(f"Contact {contact_id} marked as {status}.")


def export_queue(conn: sqlite3.Connection, output: Path) -> None:
    init_db(conn)
    rows = conn.execute(
        """
        SELECT c.full_name, c.first_name, c.last_name, c.profile_url, c.email,
               c.company, c.position, c.connected_on, c.match_reason,
               o.status, o.message, o.notes
          FROM contacts c
          JOIN outreach o ON o.contact_id = c.id
         WHERE c.is_recruiting_contact = 1
         ORDER BY o.status, c.connected_on DESC
        """
    ).fetchall()
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys() if rows else ["empty"])
        writer.writeheader()
        for row in rows:
            writer.writerow(dict(row))
    print(f"Exported {len(rows)} rows to {output}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Safe LinkedIn recruiter outreach helper using official Connections CSV export."
    )
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help=f"SQLite DB path. Default: {DEFAULT_DB}")
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("init", help="Create SQLite schema.")

    p_import = sub.add_parser("import-csv", help="Import official LinkedIn Connections CSV export.")
    p_import.add_argument("csv_path", type=Path)
    p_import.add_argument("--template", type=Path, help="Optional UTF-8 text message template.")

    p_list = sub.add_parser("list", help="List likely recruiting contacts.")
    p_list.add_argument("--status", choices=["queued", "opened", "sent", "replied", "not_relevant", "snoozed"])
    p_list.add_argument("--limit", type=int, default=50)

    p_open = sub.add_parser("open-next", help="Print/copy next message and open profile for manual sending.")
    p_open.add_argument("--id", type=int, help="Specific contact id instead of next queued contact.")
    p_open.add_argument("--copy", action="store_true", help="Copy message to clipboard.")

    p_campaign = sub.add_parser(
        "manual-campaign",
        help="Open queued profiles one by one for manual sending with an optional random delay.",
    )
    p_campaign.add_argument("--limit", type=int, default=10)
    p_campaign.add_argument("--copy", action="store_true", help="Copy each draft to clipboard.")
    p_campaign.add_argument("--min-delay", type=int, default=60, help="Minimum delay between contacts, seconds.")
    p_campaign.add_argument("--max-delay", type=int, default=300, help="Maximum delay between contacts, seconds.")

    p_mark = sub.add_parser("mark", help="Mark contact outreach status.")
    p_mark.add_argument("id", type=int)
    p_mark.add_argument("status", choices=["queued", "opened", "sent", "replied", "not_relevant", "snoozed"])
    p_mark.add_argument("--notes")

    p_export = sub.add_parser("export", help="Export recruiting queue to CSV.")
    p_export.add_argument("output", type=Path)

    args = parser.parse_args()
    conn = connect(args.db)

    if args.cmd == "init":
        init_db(conn)
        print(f"Initialized {args.db}")
    elif args.cmd == "import-csv":
        template = load_template(args.template)
        import_csv(conn, args.csv_path, template)
    elif args.cmd == "list":
        list_contacts(conn, args.status, args.limit)
    elif args.cmd == "open-next":
        open_next(conn, args.id, args.copy)
    elif args.cmd == "manual-campaign":
        manual_campaign(conn, args.limit, args.copy, args.min_delay, args.max_delay)
    elif args.cmd == "mark":
        mark(conn, args.id, args.status, args.notes)
    elif args.cmd == "export":
        export_queue(conn, args.output)


if __name__ == "__main__":
    main()
