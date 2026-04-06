# CV Repository Editor

Desktop editor for the CV repository, built in PySide6.

## What it edits

- `data/anton_nazarov_profile.json` through a tree view and raw JSON editor
- `portfolio/*/README.md` case-study files
- text-based repository files in `data/`, `details/`, `workflows/`, plus root resume files

## Run

```powershell
cd D:\Git\CV
python editor\app.py
```

If PySide6 is missing:

```powershell
python -m pip install PySide6
```

## Notes

- The editor writes directly into the repository files.
- JSON save formats the canonical profile with two-space indentation.
- `applications/` stays free for vacancy-specific materials and tailored resumes.
