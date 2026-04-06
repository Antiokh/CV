import json
import re
import sys
from copy import deepcopy
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

try:
    from PySide6.QtCore import QDate, Qt
    from PySide6.QtGui import QAction, QCursor, QFont, QGuiApplication
    from PySide6.QtWidgets import (
        QApplication,
        QCheckBox,
        QComboBox,
        QDateEdit,
        QFileDialog,
        QFormLayout,
        QGroupBox,
        QHBoxLayout,
        QInputDialog,
        QLabel,
        QLineEdit,
        QListWidget,
        QListWidgetItem,
        QMainWindow,
        QMessageBox,
        QPushButton,
        QPlainTextEdit,
        QStackedWidget,
        QTableWidget,
        QTableWidgetItem,
        QSplitter,
        QStatusBar,
        QTabWidget,
        QTextBrowser,
        QTextEdit,
        QToolBar,
        QTreeWidget,
        QTreeWidgetItem,
        QVBoxLayout,
        QWidget,
    )
except ImportError:  # pragma: no cover
    print("PySide6 is required for this editor.")
    print("Install it with: python -m pip install PySide6")
    sys.exit(1)


TEXT_EXTENSIONS = {".md", ".txt", ".json", ".py"}
APP_ROOT = Path(__file__).resolve().parent
REPO_ROOT = APP_ROOT.parent
PROFILE_PATH = REPO_ROOT / "data" / "anton_nazarov_profile.json"
ROOT_TEXT_FILES = {
    "README.md",
    "RESUME.md",
    "RESUME_RU_EN_SR.md",
}
ALLOWED_DIRS = ("data", "details", "workflows")


@dataclass
class TreePointer:
    parent: Any
    key: Any
    value: Any
    path: str


def pretty_json(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False, indent=2)


FULL_DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
YEAR_MONTH_PATTERN = re.compile(r"^\d{4}-\d{2}$")
MONTH_DATE_KEYS = {"start_date", "end_date"}
FULL_DATE_KEYS = {"profile_version", "registration_date", "issue_date", "valid_until"}


def looks_like_year_month(key: Any, value: Any) -> bool:
    return isinstance(value, str) and (
        YEAR_MONTH_PATTERN.match(value) is not None or str(key) in MONTH_DATE_KEYS
    )


def looks_like_full_date(key: Any, value: Any) -> bool:
    return isinstance(value, str) and (
        FULL_DATE_PATTERN.match(value) is not None or str(key) in FULL_DATE_KEYS
    )


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", value.strip().lower())
    return slug.strip("_")


def normalize_lookup(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def lines_to_text(values: list[str] | None) -> str:
    return "\n".join(values or [])


def text_to_lines(value: str) -> list[str]:
    return [line.strip() for line in value.splitlines() if line.strip()]


def parse_markdown_title(markdown_text: str) -> str:
    for line in markdown_text.splitlines():
        stripped = line.strip()
        if stripped.startswith("# "):
            return stripped[2:].strip()
    return ""


def portfolio_folder_options(repo_root: Path) -> list[str]:
    return sorted(
        [
            child.name
            for child in (repo_root / "portfolio").iterdir()
            if child.is_dir() and (child / "README.md").exists()
        ]
    )


def best_portfolio_match(project_name: str, repo_root: Path) -> str | None:
    target = normalize_lookup(project_name)
    best_slug = None
    for slug in portfolio_folder_options(repo_root):
        if normalize_lookup(slug) == target:
            return slug
        if target and target in normalize_lookup(slug):
            best_slug = slug
    return best_slug


def build_dummy_value(key: Any, value: Any) -> Any:
    key_text = str(key or "")
    if isinstance(value, dict):
        return {child_key: build_dummy_value(child_key, child_value) for child_key, child_value in value.items()}
    if isinstance(value, list):
        if not value:
            return []
        return [build_dummy_value(0, value[0])]
    if value is None:
        return None
    if isinstance(value, bool):
        return False
    if isinstance(value, int):
        return 0
    if isinstance(value, float):
        return 0.0
    if looks_like_year_month(key_text, value):
        return date.today().strftime("%Y-%m")
    if looks_like_full_date(key_text, value):
        return date.today().strftime("%Y-%m-%d")
    lowered = key_text.lower()
    if "name" in lowered or "title" in lowered:
        return "New item"
    if "role" in lowered:
        return "Role"
    if "summary" in lowered or "description" in lowered or "why" in lowered:
        return "TODO"
    if "url" in lowered or "link" in lowered:
        return "https://example.com"
    return ""


class MarkdownEditor(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout(self)
        self.tabs = QTabWidget()
        layout.addWidget(self.tabs)

        self.preview = QTextBrowser()
        self.editor = QPlainTextEdit()
        mono = QFont("Consolas")
        mono.setStyleHint(QFont.Monospace)
        self.editor.setFont(mono)

        self.tabs.addTab(self.preview, "Preview")
        self.tabs.addTab(self.editor, "Edit")
        self.tabs.setCurrentIndex(0)
        self.editor.textChanged.connect(self.refresh_preview)

    def set_text(self, text: str, is_markdown: bool = True):
        self.editor.setPlainText(text)
        self.refresh_preview(is_markdown=is_markdown)
        self.tabs.setCurrentIndex(0)

    def refresh_preview(self, *, is_markdown: bool | None = None):
        text = self.editor.toPlainText()
        if is_markdown is None:
            is_markdown = True
        if is_markdown:
            self.preview.setMarkdown(text)
        else:
            self.preview.setPlainText(text)

    def text(self) -> str:
        return self.editor.toPlainText()


class JsonInspector(QWidget):
    def __init__(self, save_callback):
        super().__init__()
        self.save_callback = save_callback
        self.data = {}
        self.current_item = None
        self.current_pointer = None

        layout = QVBoxLayout(self)

        actions = QHBoxLayout()
        self.reload_button = QPushButton("Reload")
        self.format_button = QPushButton("Format JSON")
        self.save_button = QPushButton("Save profile")
        actions.addWidget(self.reload_button)
        actions.addWidget(self.format_button)
        actions.addWidget(self.save_button)
        actions.addStretch(1)
        layout.addLayout(actions)

        splitter = QSplitter(Qt.Horizontal)
        layout.addWidget(splitter, 1)

        self.tree = QTreeWidget()
        self.tree.setHeaderLabels(["Path", "Preview"])
        self.tree.setMinimumWidth(360)
        splitter.addWidget(self.tree)

        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        splitter.addWidget(right_panel)
        splitter.setSizes([760, 760])
        splitter.setStretchFactor(0, 1)
        splitter.setStretchFactor(1, 1)

        self.mode_tabs = QTabWidget()
        right_layout.addWidget(self.mode_tabs, 1)

        visual_editor = QWidget()
        visual_layout = QVBoxLayout(visual_editor)
        visual_layout.setContentsMargins(0, 0, 0, 0)

        details_box = QGroupBox("Selected node")
        details_layout = QFormLayout(details_box)
        self.path_label = QLabel("Select a node")
        self.type_label = QLabel("-")
        self.key_edit = QLineEdit()
        self.smart_stack = QStackedWidget()
        self.smart_text = QLineEdit()
        self.smart_bool = QComboBox()
        self.smart_bool.addItems(["false", "true", "null"])
        self.smart_date = QDateEdit()
        self.smart_date.setDisplayFormat("yyyy-MM-dd")
        self.smart_date.setCalendarPopup(True)
        self.smart_month = QDateEdit()
        self.smart_month.setDisplayFormat("yyyy-MM")
        self.smart_month.setCalendarPopup(True)
        self.smart_stack.addWidget(self.smart_text)
        self.smart_stack.addWidget(self.smart_bool)
        self.smart_stack.addWidget(self.smart_date)
        self.smart_stack.addWidget(self.smart_month)
        self.value_edit = QTextEdit()
        self.value_edit.setMinimumHeight(140)
        editor_row = QWidget()
        editor_row_layout = QHBoxLayout(editor_row)
        editor_row_layout.setContentsMargins(0, 0, 0, 0)
        editor_row_layout.setSpacing(12)
        editor_fields = QWidget()
        editor_fields_layout = QVBoxLayout(editor_fields)
        editor_fields_layout.setContentsMargins(0, 0, 0, 0)
        editor_fields_layout.setSpacing(10)
        editor_fields_layout.addWidget(self.smart_stack)
        editor_fields_layout.addWidget(self.value_edit, 1)
        button_column = QWidget()
        button_column_layout = QVBoxLayout(button_column)
        button_column_layout.setContentsMargins(0, 0, 0, 0)
        button_column_layout.setSpacing(8)
        self.apply_button = QPushButton("Apply to node")
        self.add_object_button = QPushButton("Add object field")
        self.add_array_button = QPushButton("Add array item")
        self.duplicate_button = QPushButton("Duplicate template")
        self.delete_button = QPushButton("Delete node")
        for button in (
            self.apply_button,
            self.add_object_button,
            self.add_array_button,
            self.duplicate_button,
            self.delete_button,
        ):
            button.setMinimumWidth(170)
            button_column_layout.addWidget(button)
        button_column_layout.addStretch(1)
        editor_row_layout.addWidget(editor_fields, 1)
        editor_row_layout.addWidget(button_column, 0)

        details_layout.addRow("Path", self.path_label)
        details_layout.addRow("Type", self.type_label)
        details_layout.addRow("Key", self.key_edit)
        details_layout.addRow("Editor", editor_row)
        visual_layout.addWidget(details_box)

        raw_box = QGroupBox("Raw JSON")
        raw_layout = QVBoxLayout(raw_box)
        self.raw_editor = QPlainTextEdit()
        self.raw_editor.setFont(self._mono_font())
        raw_layout.addWidget(self.raw_editor)
        raw_editor_tab = QWidget()
        raw_editor_layout = QVBoxLayout(raw_editor_tab)
        raw_editor_layout.setContentsMargins(0, 0, 0, 0)
        raw_editor_layout.addWidget(raw_box, 1)

        self.mode_tabs.addTab(visual_editor, "Visual")
        self.mode_tabs.addTab(raw_editor_tab, "Raw JSON")

        self.tree.itemSelectionChanged.connect(self.on_item_selected)
        self.apply_button.clicked.connect(self.apply_node_changes)
        self.add_object_button.clicked.connect(self.add_object_field)
        self.add_array_button.clicked.connect(self.add_array_item)
        self.duplicate_button.clicked.connect(self.duplicate_template)
        self.delete_button.clicked.connect(self.delete_node)
        self.format_button.clicked.connect(self.reformat_raw)
        self.save_button.clicked.connect(self.save_all)

    def _mono_font(self):
        font = QFont("Consolas")
        font.setStyleHint(QFont.Monospace)
        return font

    def set_data(self, data: Any):
        self.data = data
        self.refresh()

    def select_path(self, path: str):
        self._select_path(path)

    def refresh(self):
        self.tree.clear()
        self._populate_tree(self.tree.invisibleRootItem(), self.data, "$")
        self.tree.expandToDepth(1)
        self.raw_editor.setPlainText(pretty_json(self.data))
        self.current_item = None
        self.current_pointer = None
        self.path_label.setText("Select a node")
        self.type_label.setText("-")
        self.key_edit.setText("")
        self.smart_text.setText("")
        self.smart_stack.setCurrentWidget(self.smart_text)
        self.value_edit.setPlainText("")
        self.mode_tabs.setCurrentIndex(0)

    def _populate_tree(self, parent_item: QTreeWidgetItem, value: Any, path: str):
        if isinstance(value, dict):
            for key, child in value.items():
                child_path = f"{path}.{key}" if path != "$" else f"$.{key}"
                item = QTreeWidgetItem([str(key), self._preview(child)])
                item.setData(0, Qt.UserRole, child_path)
                parent_item.addChild(item)
                self._populate_tree(item, child, child_path)
        elif isinstance(value, list):
            for index, child in enumerate(value):
                child_path = f"{path}[{index}]"
                item = QTreeWidgetItem([f"[{index}]", self._preview(child)])
                item.setData(0, Qt.UserRole, child_path)
                parent_item.addChild(item)
                self._populate_tree(item, child, child_path)

    def _preview(self, value: Any) -> str:
        if isinstance(value, dict):
            return f"object ({len(value)})"
        if isinstance(value, list):
            return f"array ({len(value)})"
        text = str(value)
        return text if len(text) <= 60 else f"{text[:57]}..."

    def _get_pointer(self, path: str) -> TreePointer:
        if path == "$":
            return TreePointer(parent=None, key=None, value=self.data, path=path)

        current = self.data
        parent = None
        key = None
        rest = path[2:] if path.startswith("$.") else path[1:]
        tokens = []
        buffer = ""
        i = 0
        while i < len(rest):
            char = rest[i]
            if char == ".":
                if buffer:
                    tokens.append(buffer)
                    buffer = ""
                i += 1
                continue
            if char == "[":
                if buffer:
                    tokens.append(buffer)
                    buffer = ""
                end = rest.index("]", i)
                tokens.append(int(rest[i + 1 : end]))
                i = end + 1
                continue
            buffer += char
            i += 1
        if buffer:
            tokens.append(buffer)

        for token in tokens:
            parent = current
            key = token
            current = current[token]
        return TreePointer(parent=parent, key=key, value=current, path=path)

    def on_item_selected(self):
        items = self.tree.selectedItems()
        if not items:
            return
        item = items[0]
        pointer = self._get_pointer(item.data(0, Qt.UserRole))
        self.current_item = item
        self.current_pointer = pointer
        self.path_label.setText(pointer.path)
        self.type_label.setText(type(pointer.value).__name__)
        self.key_edit.setText("" if pointer.key is None or isinstance(pointer.key, int) else str(pointer.key))
        self.value_edit.setPlainText(self._value_for_editor(pointer.value))
        self._sync_smart_editor(pointer)

    def _value_for_editor(self, value: Any) -> str:
        if isinstance(value, (dict, list)):
            return pretty_json(value)
        if value is None:
            return "null"
        if isinstance(value, bool):
            return "true" if value else "false"
        return str(value)

    def _parse_editor_value(self) -> Any:
        if self.current_pointer and not isinstance(self.current_pointer.value, (dict, list)):
            current = self.current_pointer.value
            key = self.current_pointer.key
            if isinstance(current, bool) or current is None:
                selected = self.smart_bool.currentText()
                if selected == "true":
                    return True
                if selected == "false":
                    return False
                return None
            if looks_like_full_date(key, current):
                return self.smart_date.date().toString("yyyy-MM-dd")
            if looks_like_year_month(key, current):
                return self.smart_month.date().toString("yyyy-MM")
            return self.smart_text.text()
        text = self.value_edit.toPlainText().strip()
        if not text:
            return ""
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return text

    def apply_node_changes(self):
        if not self.current_pointer:
            return

        pointer = self.current_pointer
        new_value = self._parse_editor_value()

        if pointer.parent is None:
            self.data = new_value
        elif isinstance(pointer.parent, dict):
            new_key = self.key_edit.text().strip() or str(pointer.key)
            if new_key != pointer.key:
                items = list(pointer.parent.items())
                rebuilt = {}
                for key, value in items:
                    if key == pointer.key:
                        rebuilt[new_key] = new_value
                    else:
                        rebuilt[key] = value
                pointer.parent.clear()
                pointer.parent.update(rebuilt)
            else:
                pointer.parent[pointer.key] = new_value
        elif isinstance(pointer.parent, list):
            pointer.parent[pointer.key] = new_value

        self.refresh()
        self._select_path(pointer.path if pointer.parent is not None else "$")

    def _sync_smart_editor(self, pointer: TreePointer):
        value = pointer.value
        key = pointer.key
        if isinstance(value, (dict, list)):
            self.smart_stack.setCurrentWidget(self.smart_text)
            self.smart_text.setText("")
            return
        if isinstance(value, bool) or value is None:
            self.smart_stack.setCurrentWidget(self.smart_bool)
            if value is True:
                self.smart_bool.setCurrentText("true")
            elif value is False:
                self.smart_bool.setCurrentText("false")
            else:
                self.smart_bool.setCurrentText("null")
            return
        if looks_like_full_date(key, value):
            self.smart_stack.setCurrentWidget(self.smart_date)
            parsed = QDate.fromString(value, "yyyy-MM-dd")
            self.smart_date.setDate(parsed if parsed.isValid() else QDate.currentDate())
            return
        if looks_like_year_month(key, value):
            self.smart_stack.setCurrentWidget(self.smart_month)
            parsed = QDate.fromString(f"{value}-01", "yyyy-MM-dd")
            self.smart_month.setDate(parsed if parsed.isValid() else QDate.currentDate())
            return
        self.smart_stack.setCurrentWidget(self.smart_text)
        self.smart_text.setText("" if value is None else str(value))

    def add_object_field(self):
        if not self.current_pointer or not isinstance(self.current_pointer.value, dict):
            QMessageBox.information(self, "Object required", "Select an object node first.")
            return
        base_name = "new_field"
        name = base_name
        index = 1
        while name in self.current_pointer.value:
            index += 1
            name = f"{base_name}_{index}"
        self.current_pointer.value[name] = ""
        target_path = f"{self.current_pointer.path}.{name}" if self.current_pointer.path != "$" else f"$.{name}"
        self.refresh()
        self._select_path(target_path)

    def add_array_item(self):
        if not self.current_pointer or not isinstance(self.current_pointer.value, list):
            QMessageBox.information(self, "Array required", "Select an array node first.")
            return
        self.current_pointer.value.append("")
        target_path = f"{self.current_pointer.path}[{len(self.current_pointer.value) - 1}]"
        self.refresh()
        self._select_path(target_path)

    def duplicate_template(self):
        if not self.current_pointer:
            return
        pointer = self.current_pointer
        if isinstance(pointer.parent, list):
            template = deepcopy(pointer.value)
            new_value = build_dummy_value(pointer.key, template)
            insert_index = int(pointer.key) + 1
            pointer.parent.insert(insert_index, new_value)
            self.refresh()
            self._select_path(f"{pointer.path[:pointer.path.rfind('[')]}[{insert_index}]")
            return
        if isinstance(pointer.parent, dict) and isinstance(pointer.value, dict):
            new_key = f"{pointer.key}_copy"
            counter = 1
            while new_key in pointer.parent:
                counter += 1
                new_key = f"{pointer.key}_copy_{counter}"
            pointer.parent[new_key] = build_dummy_value(new_key, deepcopy(pointer.value))
            self.refresh()
            parent_path = pointer.path.rsplit(".", 1)[0] if "." in pointer.path else "$"
            target_path = f"{parent_path}.{new_key}" if parent_path != "$" else f"$.{new_key}"
            self._select_path(target_path)
            return
        QMessageBox.information(
            self,
            "Template copy",
            "Select an object in a list or an object field to duplicate its structure.",
        )

    def delete_node(self):
        if not self.current_pointer or self.current_pointer.parent is None:
            QMessageBox.information(self, "Delete blocked", "Root node cannot be deleted.")
            return
        parent_path = self.current_pointer.path.rsplit(".", 1)[0] if "." in self.current_pointer.path else "$"
        if isinstance(self.current_pointer.parent, dict):
            del self.current_pointer.parent[self.current_pointer.key]
        elif isinstance(self.current_pointer.parent, list):
            del self.current_pointer.parent[self.current_pointer.key]
            parent_path = self.current_pointer.path[: self.current_pointer.path.rfind("[")]
        self.refresh()
        self._select_path(parent_path)

    def _select_path(self, path: str):
        target = self.tree.findItems("", Qt.MatchContains | Qt.MatchRecursive, 0)
        for item in target:
            if item.data(0, Qt.UserRole) == path:
                self.tree.setCurrentItem(item)
                return

    def reformat_raw(self):
        try:
            self.data = json.loads(self.raw_editor.toPlainText())
        except json.JSONDecodeError as error:
            QMessageBox.critical(self, "JSON error", str(error))
            return
        self.refresh()

    def save_all(self):
        try:
            data = json.loads(self.raw_editor.toPlainText())
        except json.JSONDecodeError:
            data = self.data
        self.data = data
        self.save_callback(self.data)
        self.refresh()


class PortfolioEditor(QWidget):
    def __init__(self, repo_root: Path, save_callback):
        super().__init__()
        self.repo_root = repo_root
        self.save_callback = save_callback
        self.current_project_dir = None

        layout = QVBoxLayout(self)
        buttons = QHBoxLayout()
        self.reload_button = QPushButton("Reload projects")
        self.new_button = QPushButton("New project")
        self.save_button = QPushButton("Save README")
        buttons.addWidget(self.reload_button)
        buttons.addWidget(self.new_button)
        buttons.addWidget(self.save_button)
        buttons.addStretch(1)
        layout.addLayout(buttons)

        self.filter_edit = QLineEdit()
        self.filter_edit.setPlaceholderText("Filter projects by slug or README text")
        layout.addWidget(self.filter_edit)

        splitter = QSplitter(Qt.Horizontal)
        layout.addWidget(splitter, 1)

        self.project_list = QListWidget()
        splitter.addWidget(self.project_list)

        right = QWidget()
        right_layout = QVBoxLayout(right)
        splitter.addWidget(right)
        splitter.setSizes([320, 1020])

        meta_box = QGroupBox("Project details")
        meta_layout = QFormLayout(meta_box)
        self.project_path = QLabel("-")
        self.project_title = QLabel("-")
        self.media_count = QLabel("0")
        meta_layout.addRow("Folder", self.project_path)
        meta_layout.addRow("Title", self.project_title)
        meta_layout.addRow("Media files", self.media_count)
        right_layout.addWidget(meta_box)

        self.markdown = MarkdownEditor()
        right_layout.addWidget(self.markdown, 1)

        self.project_list.itemSelectionChanged.connect(self.load_selected_project)
        self.reload_button.clicked.connect(self.load_projects)
        self.new_button.clicked.connect(self.create_project)
        self.save_button.clicked.connect(self.save_project)
        self.filter_edit.textChanged.connect(self.load_projects)

    def _mono_font(self):
        font = QFont("Consolas")
        font.setStyleHint(QFont.Monospace)
        return font

    def load_projects(self):
        self.project_list.clear()
        query = self.filter_edit.text().strip().lower()
        portfolio_root = self.repo_root / "portfolio"
        for child in sorted(portfolio_root.iterdir()):
            if not child.is_dir():
                continue
            readme_path = child / "README.md"
            if not readme_path.exists():
                continue
            if query:
                readme_text = readme_path.read_text(encoding="utf-8").lower()
                if query not in child.name.lower() and query not in readme_text:
                    continue
            self.project_list.addItem(child.name)

    def load_selected_project(self):
        items = self.project_list.selectedItems()
        if not items:
            return
        slug = items[0].text()
        project_dir = self.repo_root / "portfolio" / slug
        readme_path = project_dir / "README.md"
        text = readme_path.read_text(encoding="utf-8")
        media_dir = project_dir / "media"
        media_files = []
        if media_dir.exists():
            media_files = [path.name for path in media_dir.iterdir() if path.is_file()]
        title = text.splitlines()[0].lstrip("# ").strip() if text.strip() else slug

        self.current_project_dir = project_dir
        self.project_path.setText(str(project_dir.relative_to(self.repo_root)))
        self.project_title.setText(title)
        self.media_count.setText(str(len(media_files)))
        self.markdown.set_text(text, is_markdown=True)

    def save_project(self):
        if not self.current_project_dir:
            return
        self.save_callback(self.current_project_dir / "README.md", self.markdown.text())

    def open_project_by_slug(self, slug: str):
        matches = self.project_list.findItems(slug, Qt.MatchExactly)
        if matches:
            self.project_list.setCurrentItem(matches[0])
            return
        self.filter_edit.setText("")
        self.load_projects()
        matches = self.project_list.findItems(slug, Qt.MatchExactly)
        if matches:
            self.project_list.setCurrentItem(matches[0])

    def create_project(self):
        title, ok = QInputDialog.getText(self, "New project", "Project title")
        if not ok or not title.strip():
            return
        default_slug = slugify(title)
        slug, ok = QInputDialog.getText(self, "New project", "Project slug", text=default_slug)
        if not ok or not slug.strip():
            return
        slug = slugify(slug)
        project_dir = self.repo_root / "portfolio" / slug
        if project_dir.exists():
            QMessageBox.warning(self, "Project exists", f"Folder already exists: {project_dir.name}")
            return
        (project_dir / "media").mkdir(parents=True, exist_ok=True)
        template = "\n".join(
            [
                f"# {title.strip()}",
                "",
                "## Overview",
                "",
                "TODO",
                "",
                "## My Role",
                "",
                "TODO",
                "",
                "## What the System Does",
                "",
                "- TODO",
                "",
                "## Tech Stack",
                "",
                "- TODO",
                "",
                "## Result",
                "",
                "TODO",
                "",
            ]
        )
        self.save_callback(project_dir / "README.md", template)
        self.load_projects()
        self.open_project_by_slug(slug)


class RepoFileEditor(QWidget):
    def __init__(self, repo_root: Path, save_callback):
        super().__init__()
        self.repo_root = repo_root
        self.save_callback = save_callback
        self.current_path = None

        layout = QVBoxLayout(self)
        buttons = QHBoxLayout()
        self.reload_button = QPushButton("Reload files")
        self.pick_button = QPushButton("Open other text file")
        self.save_button = QPushButton("Save file")
        buttons.addWidget(self.reload_button)
        buttons.addWidget(self.pick_button)
        buttons.addWidget(self.save_button)
        buttons.addStretch(1)
        layout.addLayout(buttons)

        self.filter_edit = QLineEdit()
        self.filter_edit.setPlaceholderText("Filter files by path")
        layout.addWidget(self.filter_edit)

        splitter = QSplitter(Qt.Horizontal)
        layout.addWidget(splitter, 1)

        self.file_list = QListWidget()
        splitter.addWidget(self.file_list)

        right = QWidget()
        right_layout = QVBoxLayout(right)
        splitter.addWidget(right)
        splitter.setSizes([350, 990])

        meta_box = QGroupBox("File")
        meta_layout = QFormLayout(meta_box)
        self.path_label = QLabel("-")
        self.kind_label = QLabel("-")
        meta_layout.addRow("Path", self.path_label)
        meta_layout.addRow("Type", self.kind_label)
        right_layout.addWidget(meta_box)

        self.viewer = MarkdownEditor()
        right_layout.addWidget(self.viewer, 1)

        self.file_list.itemSelectionChanged.connect(self.load_selected_file)
        self.reload_button.clicked.connect(self.load_files)
        self.pick_button.clicked.connect(self.pick_other_file)
        self.save_button.clicked.connect(self.save_file)
        self.filter_edit.textChanged.connect(self.load_files)

    def _mono_font(self):
        font = QFont("Consolas")
        font.setStyleHint(QFont.Monospace)
        return font

    def load_files(self):
        self.file_list.clear()
        query = self.filter_edit.text().strip().lower()
        for name in sorted(ROOT_TEXT_FILES):
            if not query or query in name.lower():
                self.file_list.addItem(name)
        for folder in ALLOWED_DIRS:
            base = self.repo_root / folder
            for path in sorted(base.rglob("*")):
                if path.is_file() and path.suffix.lower() in TEXT_EXTENSIONS:
                    rel = str(path.relative_to(self.repo_root))
                    if not query or query in rel.lower():
                        self.file_list.addItem(rel)

    def load_selected_file(self):
        items = self.file_list.selectedItems()
        if not items:
            return
        rel_path = items[0].text()
        self.open_file(self.repo_root / rel_path)

    def open_file(self, path: Path):
        self.current_path = path
        self.path_label.setText(str(path.relative_to(self.repo_root)))
        self.kind_label.setText(path.suffix.lower() or "text")
        text = path.read_text(encoding="utf-8")
        self.viewer.set_text(text, is_markdown=path.suffix.lower() == ".md")

    def pick_other_file(self):
        selected, _ = QFileDialog.getOpenFileName(
            self,
            "Open text file",
            str(self.repo_root),
            "Text files (*.md *.txt *.json *.py);;All files (*.*)",
        )
        if not selected:
            return
        path = Path(selected).resolve()
        try:
            path.relative_to(self.repo_root)
        except ValueError:
            QMessageBox.warning(self, "Outside repo", "Please select a file inside this repository.")
            return
        self.open_file(path)

    def save_file(self):
        if not self.current_path:
            return
        self.save_callback(self.current_path, self.viewer.text())

    def open_relative_path(self, rel_path: str):
        self.filter_edit.setText("")
        self.load_files()
        matches = self.file_list.findItems(rel_path, Qt.MatchExactly)
        if matches:
            self.file_list.setCurrentItem(matches[0])
            return
        self.open_file(self.repo_root / rel_path)


class ExperienceEditor(QWidget):
    def __init__(self, get_profile_data, save_profile_callback):
        super().__init__()
        self.get_profile_data = get_profile_data
        self.save_profile_callback = save_profile_callback
        self.current_index = None

        layout = QVBoxLayout(self)
        button_bar = QHBoxLayout()
        self.reload_button = QPushButton("Reload")
        self.new_button = QPushButton("New role")
        self.duplicate_button = QPushButton("Duplicate")
        self.move_up_button = QPushButton("Move up")
        self.move_down_button = QPushButton("Move down")
        self.delete_button = QPushButton("Delete")
        self.save_button = QPushButton("Save experience")
        for button in (
            self.reload_button,
            self.new_button,
            self.duplicate_button,
            self.move_up_button,
            self.move_down_button,
            self.delete_button,
            self.save_button,
        ):
            button_bar.addWidget(button)
        button_bar.addStretch(1)
        layout.addLayout(button_bar)

        splitter = QSplitter(Qt.Horizontal)
        layout.addWidget(splitter, 1)
        splitter.setSizes([760, 760])
        splitter.setStretchFactor(0, 1)
        splitter.setStretchFactor(1, 1)

        self.list_widget = QListWidget()
        splitter.addWidget(self.list_widget)

        right = QWidget()
        right_layout = QVBoxLayout(right)
        splitter.addWidget(right)

        form_group = QGroupBox("Employment entry")
        form_layout = QFormLayout(form_group)
        self.company_edit = QLineEdit()
        self.legal_name_edit = QLineEdit()
        self.location_edit = QLineEdit()
        self.start_edit = QDateEdit()
        self.start_edit.setDisplayFormat("yyyy-MM")
        self.start_edit.setCalendarPopup(True)
        self.end_edit = QDateEdit()
        self.end_edit.setDisplayFormat("yyyy-MM")
        self.end_edit.setCalendarPopup(True)
        self.ongoing_check = QCheckBox("Ongoing")
        self.titles_edit = QTextEdit()
        self.focus_edit = QTextEdit()
        self.results_edit = QTextEdit()
        self.responsibility_edit = QTextEdit()

        form_layout.addRow("Company", self.company_edit)
        form_layout.addRow("Legal name", self.legal_name_edit)
        form_layout.addRow("Location", self.location_edit)
        form_layout.addRow("Start", self.start_edit)
        form_layout.addRow("End", self.end_edit)
        form_layout.addRow("", self.ongoing_check)
        form_layout.addRow("Titles", self.titles_edit)
        form_layout.addRow("Focus", self.focus_edit)
        form_layout.addRow("Results", self.results_edit)
        form_layout.addRow("Responsibility areas", self.responsibility_edit)
        right_layout.addWidget(form_group, 1)

        self.list_widget.itemSelectionChanged.connect(self.load_selected)
        self.reload_button.clicked.connect(self.refresh)
        self.new_button.clicked.connect(self.create_entry)
        self.duplicate_button.clicked.connect(self.duplicate_entry)
        self.move_up_button.clicked.connect(lambda: self.move_entry(-1))
        self.move_down_button.clicked.connect(lambda: self.move_entry(1))
        self.delete_button.clicked.connect(self.delete_entry)
        self.save_button.clicked.connect(self.save_entry)
        self.ongoing_check.toggled.connect(self.end_edit.setDisabled)

    def _entries(self) -> list[dict]:
        return self.get_profile_data().setdefault("employment_history", [])

    def refresh(self):
        self.list_widget.clear()
        for index, item in enumerate(self._entries()):
            start = item.get("start_date") or "?"
            end = "now" if item.get("ongoing") else (item.get("end_date") or "?")
            label = f"{item.get('company', 'Untitled')} | {start} -> {end}"
            self.list_widget.addItem(label)
        if self._entries():
            self.list_widget.setCurrentRow(0)

    def load_selected(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        item = self._entries()[row]
        self.current_index = row
        self.company_edit.setText(item.get("company", ""))
        self.legal_name_edit.setText(item.get("legal_name", ""))
        self.location_edit.setText(item.get("location", ""))
        self.start_edit.setDate(QDate.fromString(f"{item.get('start_date', '2000-01')}-01", "yyyy-MM-dd"))
        end_value = item.get("end_date") or date.today().strftime("%Y-%m")
        self.end_edit.setDate(QDate.fromString(f"{end_value}-01", "yyyy-MM-dd"))
        self.ongoing_check.setChecked(bool(item.get("ongoing")))
        self.end_edit.setDisabled(bool(item.get("ongoing")))
        self.titles_edit.setPlainText(lines_to_text(item.get("titles")))
        self.focus_edit.setPlainText(lines_to_text(item.get("focus")))
        self.results_edit.setPlainText(lines_to_text(item.get("results")))
        self.responsibility_edit.setPlainText(lines_to_text(item.get("responsibility_areas")))

    def create_entry(self):
        template = {
            "company": "New Company",
            "start_date": date.today().strftime("%Y-%m"),
            "end_date": None,
            "ongoing": True,
            "titles": ["Role"],
            "focus": ["TODO"],
            "results": ["TODO"],
        }
        self._entries().append(template)
        self.refresh()
        self.list_widget.setCurrentRow(len(self._entries()) - 1)

    def duplicate_entry(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        source = deepcopy(self._entries()[row])
        source["company"] = f"{source.get('company', 'New Company')} Copy"
        source["start_date"] = date.today().strftime("%Y-%m")
        if not source.get("ongoing"):
            source["end_date"] = date.today().strftime("%Y-%m")
        self._entries().insert(row + 1, source)
        self.refresh()
        self.list_widget.setCurrentRow(row + 1)

    def delete_entry(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        del self._entries()[row]
        self.refresh()

    def move_entry(self, delta: int):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        target = row + delta
        entries = self._entries()
        if target < 0 or target >= len(entries):
            return
        entries[row], entries[target] = entries[target], entries[row]
        self.save_profile_callback(self.get_profile_data())
        self.refresh()
        self.list_widget.setCurrentRow(target)

    def save_entry(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        item = self._entries()[row]
        item["company"] = self.company_edit.text().strip()
        if self.legal_name_edit.text().strip():
            item["legal_name"] = self.legal_name_edit.text().strip()
        else:
            item.pop("legal_name", None)
        if self.location_edit.text().strip():
            item["location"] = self.location_edit.text().strip()
        else:
            item.pop("location", None)
        item["start_date"] = self.start_edit.date().toString("yyyy-MM")
        ongoing = self.ongoing_check.isChecked()
        item["ongoing"] = ongoing
        item["end_date"] = None if ongoing else self.end_edit.date().toString("yyyy-MM")
        item["titles"] = text_to_lines(self.titles_edit.toPlainText())
        focus = text_to_lines(self.focus_edit.toPlainText())
        results = text_to_lines(self.results_edit.toPlainText())
        responsibilities = text_to_lines(self.responsibility_edit.toPlainText())
        if focus:
            item["focus"] = focus
        else:
            item.pop("focus", None)
        item["results"] = results
        if responsibilities:
            item["responsibility_areas"] = responsibilities
        else:
            item.pop("responsibility_areas", None)
        self.save_profile_callback(self.get_profile_data())
        self.refresh()
        self.list_widget.setCurrentRow(row)


class PortfolioSyncEditor(QWidget):
    def __init__(self, repo_root: Path, get_profile_data, save_profile_callback, save_text_callback):
        super().__init__()
        self.repo_root = repo_root
        self.get_profile_data = get_profile_data
        self.save_profile_callback = save_profile_callback
        self.save_text_callback = save_text_callback
        self.current_index = None
        self.current_folder_slug = None

        layout = QVBoxLayout(self)
        button_bar = QHBoxLayout()
        self.reload_button = QPushButton("Reload")
        self.sort_combo = QComboBox()
        self.sort_combo.addItems(
            [
                "Sort: Name A-Z",
                "Sort: Name Z-A",
                "Sort: Start newest",
                "Sort: Start oldest",
                "Sort: End newest",
                "Sort: End oldest",
            ]
        )
        self.new_json_button = QPushButton("New JSON project")
        self.duplicate_button = QPushButton("Duplicate")
        self.save_json_button = QPushButton("Save JSON")
        self.create_folder_button = QPushButton("Create folder")
        self.save_readme_button = QPushButton("Save README")
        button_bar.addWidget(self.reload_button)
        button_bar.addWidget(self.sort_combo)
        for button in (
            self.new_json_button,
            self.duplicate_button,
            self.save_json_button,
            self.create_folder_button,
            self.save_readme_button,
        ):
            button_bar.addWidget(button)
        button_bar.addStretch(1)
        layout.addLayout(button_bar)

        splitter = QSplitter(Qt.Horizontal)
        layout.addWidget(splitter, 1)
        splitter.setSizes([760, 760])
        splitter.setStretchFactor(0, 1)
        splitter.setStretchFactor(1, 1)

        self.list_widget = QListWidget()
        splitter.addWidget(self.list_widget)

        right = QWidget()
        right_layout = QVBoxLayout(right)
        splitter.addWidget(right)

        form_group = QGroupBox("Selected project")
        form_layout = QFormLayout(form_group)
        self.name_edit = QLineEdit()
        self.type_edit = QLineEdit()
        self.folder_combo = QComboBox()
        self.start_edit = QDateEdit()
        self.start_edit.setDisplayFormat("yyyy-MM")
        self.start_edit.setCalendarPopup(True)
        self.end_edit = QDateEdit()
        self.end_edit.setDisplayFormat("yyyy-MM")
        self.end_edit.setCalendarPopup(True)
        self.ongoing_check = QCheckBox("Ongoing")
        self.roles_edit = QTextEdit()
        self.signals_edit = QTextEdit()
        self.results_edit = QTextEdit()
        form_layout.addRow("Name", self.name_edit)
        form_layout.addRow("Type", self.type_edit)
        form_layout.addRow("Folder", self.folder_combo)
        form_layout.addRow("Start", self.start_edit)
        form_layout.addRow("End", self.end_edit)
        form_layout.addRow("", self.ongoing_check)
        form_layout.addRow("Roles", self.roles_edit)
        form_layout.addRow("Signals", self.signals_edit)
        form_layout.addRow("Results", self.results_edit)
        right_layout.addWidget(form_group)

        self.readme_editor = MarkdownEditor()
        right_layout.addWidget(self.readme_editor, 1)

        self.list_widget.itemSelectionChanged.connect(self.load_selected)
        self.reload_button.clicked.connect(self.refresh)
        self.sort_combo.currentIndexChanged.connect(self.refresh)
        self.new_json_button.clicked.connect(self.create_json_project)
        self.duplicate_button.clicked.connect(self.duplicate_project)
        self.save_json_button.clicked.connect(self.save_json_project)
        self.create_folder_button.clicked.connect(self.create_folder_from_project)
        self.save_readme_button.clicked.connect(self.save_readme)
        self.ongoing_check.toggled.connect(self.end_edit.setDisabled)

    def _projects(self) -> list[dict]:
        return self.get_profile_data().setdefault("selected_projects", [])

    def _sorted_projects(self) -> list[tuple[int, dict]]:
        indexed = list(enumerate(self._projects()))
        mode = self.sort_combo.currentText()

        def month_key(value: str | None):
            return value or ""

        if mode == "Sort: Name A-Z":
            return sorted(indexed, key=lambda pair: (pair[1].get("name", "").lower(), pair[0]))
        if mode == "Sort: Name Z-A":
            return sorted(indexed, key=lambda pair: (pair[1].get("name", "").lower(), pair[0]), reverse=True)
        if mode == "Sort: Start newest":
            return sorted(indexed, key=lambda pair: (month_key(pair[1].get("start_date")), pair[1].get("name", "").lower()), reverse=True)
        if mode == "Sort: Start oldest":
            return sorted(indexed, key=lambda pair: (month_key(pair[1].get("start_date")), pair[1].get("name", "").lower()))
        if mode == "Sort: End newest":
            return sorted(indexed, key=lambda pair: (month_key(pair[1].get("end_date")), pair[1].get("name", "").lower()), reverse=True)
        return sorted(indexed, key=lambda pair: (month_key(pair[1].get("end_date")), pair[1].get("name", "").lower()))

    def refresh(self):
        current_name = self.name_edit.text().strip()
        self.folder_combo.clear()
        self.folder_combo.addItem("")
        for slug in portfolio_folder_options(self.repo_root):
            self.folder_combo.addItem(slug)
        self.list_widget.clear()
        for index, project in self._sorted_projects():
            match = best_portfolio_match(project.get("name", ""), self.repo_root)
            status = match or "no-folder"
            item_label = f"{project.get('name', 'Untitled')} | {project.get('start_date') or '?'} -> {(project.get('end_date') or ('now' if project.get('ongoing') else '?'))} | {status}"
            item = QListWidgetItem(item_label)
            item.setData(Qt.UserRole, index)
            self.list_widget.addItem(item)
        if self.list_widget.count():
            if current_name:
                for row in range(self.list_widget.count()):
                    source_index = self.list_widget.item(row).data(Qt.UserRole)
                    project = self._projects()[source_index]
                    if project.get("name", "") == current_name:
                        self.list_widget.setCurrentRow(row)
                        break
                else:
                    self.list_widget.setCurrentRow(0)
            else:
                self.list_widget.setCurrentRow(0)

    def load_selected(self):
        item_widget = self.list_widget.currentItem()
        if item_widget is None:
            return
        row = item_widget.data(Qt.UserRole)
        project = self._projects()[row]
        self.current_index = row
        self.name_edit.setText(project.get("name", ""))
        self.type_edit.setText(project.get("type", ""))
        start_value = project.get("start_date") or date.today().strftime("%Y-%m")
        end_value = project.get("end_date") or date.today().strftime("%Y-%m")
        self.start_edit.setDate(QDate.fromString(f"{start_value}-01", "yyyy-MM-dd"))
        self.end_edit.setDate(QDate.fromString(f"{end_value}-01", "yyyy-MM-dd"))
        self.ongoing_check.setChecked(bool(project.get("ongoing")))
        self.end_edit.setDisabled(bool(project.get("ongoing")))
        self.roles_edit.setPlainText(lines_to_text(project.get("roles")))
        self.signals_edit.setPlainText(lines_to_text(project.get("signals")))
        self.results_edit.setPlainText(lines_to_text(project.get("results")))
        match = best_portfolio_match(project.get("name", ""), self.repo_root)
        self.current_folder_slug = match
        self.folder_combo.setCurrentText(match or "")
        self._load_readme(match)

    def _load_readme(self, slug: str | None):
        if not slug:
            self.readme_editor.set_text("# No linked folder\n", is_markdown=True)
            return
        readme_path = self.repo_root / "portfolio" / slug / "README.md"
        if readme_path.exists():
            self.readme_editor.set_text(readme_path.read_text(encoding="utf-8"), is_markdown=True)
        else:
            self.readme_editor.set_text(f"# {slug}\n\nREADME.md not found.\n", is_markdown=True)

    def create_json_project(self):
        project = {
            "name": "New Project",
            "type": "TODO",
            "start_date": date.today().strftime("%Y-%m"),
            "end_date": None,
            "ongoing": True,
            "roles": ["Builder"],
            "signals": ["TODO"],
            "results": ["TODO"],
        }
        self._projects().append(project)
        self.refresh()
        self.list_widget.setCurrentRow(len(self._projects()) - 1)

    def duplicate_project(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        project = deepcopy(self._projects()[row])
        project["name"] = f"{project.get('name', 'New Project')} Copy"
        project["start_date"] = date.today().strftime("%Y-%m")
        if not project.get("ongoing"):
            project["end_date"] = date.today().strftime("%Y-%m")
        self._projects().insert(row + 1, project)
        self.refresh()

    def save_json_project(self):
        row = self.current_index
        if row is None or row < 0:
            return
        project = self._projects()[row]
        project["name"] = self.name_edit.text().strip()
        project["type"] = self.type_edit.text().strip()
        project["start_date"] = self.start_edit.date().toString("yyyy-MM")
        ongoing = self.ongoing_check.isChecked()
        project["ongoing"] = ongoing
        project["end_date"] = None if ongoing else self.end_edit.date().toString("yyyy-MM")
        project["roles"] = text_to_lines(self.roles_edit.toPlainText())
        signals = text_to_lines(self.signals_edit.toPlainText())
        results = text_to_lines(self.results_edit.toPlainText())
        if signals:
            project["signals"] = signals
        else:
            project.pop("signals", None)
        project["results"] = results
        self.save_profile_callback(self.get_profile_data())
        self.refresh()

    def create_folder_from_project(self):
        row = self.list_widget.currentRow()
        if row < 0:
            return
        name = self.name_edit.text().strip() or "new_project"
        default_slug = slugify(name)
        slug, ok = QInputDialog.getText(self, "Create folder", "Portfolio folder slug", text=default_slug)
        if not ok or not slug.strip():
            return
        slug = slugify(slug)
        folder = self.repo_root / "portfolio" / slug
        if not folder.exists():
            (folder / "media").mkdir(parents=True, exist_ok=True)
        readme_path = folder / "README.md"
        if not readme_path.exists():
            template = "\n".join(
                [
                    f"# {name}",
                    "",
                    "## Overview",
                    "",
                    "TODO",
                    "",
                    "## What the System Does",
                    "",
                    "- TODO",
                    "",
                    "## Tech Stack",
                    "",
                    "- TODO",
                    "",
                    "## Result",
                    "",
                    "TODO",
                    "",
                ]
            )
            self.save_text_callback(readme_path, template)
        self.refresh()
        self.folder_combo.setCurrentText(slug)
        self.current_folder_slug = slug
        self._load_readme(slug)

    def save_readme(self):
        slug = self.folder_combo.currentText().strip()
        if not slug:
            QMessageBox.information(self, "No folder", "Choose or create a linked portfolio folder first.")
            return
        readme_path = self.repo_root / "portfolio" / slug / "README.md"
        self.save_text_callback(readme_path, self.readme_editor.text())
        if self.name_edit.text().strip() and not self.type_edit.text().strip():
            title = parse_markdown_title(self.readme_editor.text())
            if title and self.name_edit.text().strip() == "New Project":
                self.name_edit.setText(title)



class RepoEditorWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CV Repository Editor")
        self.last_event = "Session started"

        self.status = QStatusBar()
        self.setStatusBar(self.status)

        self.tabs = QTabWidget()
        self.setCentralWidget(self.tabs)

        self.experience_tab = ExperienceEditor(self.get_profile_data, self.save_profile)
        self.portfolio_sync_tab = PortfolioSyncEditor(REPO_ROOT, self.get_profile_data, self.save_profile, self.save_text_file)
        self.profile_tab = JsonInspector(self.save_profile)
        self.portfolio_tab = PortfolioEditor(REPO_ROOT, self.save_text_file)
        self.files_tab = RepoFileEditor(REPO_ROOT, self.save_text_file)

        self.tabs.addTab(self.experience_tab, "Experience")
        self.tabs.addTab(self.portfolio_sync_tab, "Portfolio Sync")
        self.tabs.addTab(self.profile_tab, "Profile JSON")
        self.tabs.addTab(self.portfolio_tab, "Portfolio")
        self.tabs.addTab(self.files_tab, "Files")

        self._build_toolbar()
        self.load_all()
        self._apply_style()
        self._apply_initial_window_geometry()

    def _build_toolbar(self):
        toolbar = QToolBar("Main")
        toolbar.setMovable(False)
        self.addToolBar(toolbar)

        reload_action = QAction("Reload all", self)
        reload_action.triggered.connect(self.load_all)
        toolbar.addAction(reload_action)

        save_profile_action = QAction("Save profile", self)
        save_profile_action.triggered.connect(self.profile_tab.save_all)
        toolbar.addAction(save_profile_action)

    def _apply_style(self):
        self.setStyleSheet(
            """
            QMainWindow {
                background: #11161c;
                color: #e7edf5;
            }
            QToolBar {
                background: #151c24;
                border: 1px solid #222c37;
                spacing: 8px;
                padding: 8px;
            }
            QToolButton {
                background: #243241;
                color: #e7edf5;
                border: 1px solid #34485c;
                border-radius: 8px;
                padding: 8px 12px;
                font-weight: 600;
            }
            QToolButton:hover {
                background: #304153;
            }
            QStatusBar {
                background: #151c24;
                color: #cbd6e2;
                border-top: 1px solid #222c37;
            }
            QTabWidget::pane {
                border: 1px solid #222c37;
                background: #11161c;
            }
            QTabBar::tab {
                background: #1a232d;
                color: #a9b8c8;
                padding: 10px 16px;
                margin-right: 4px;
                border: 1px solid #26313d;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }
            QTabBar::tab:selected {
                background: #243241;
                color: #f4f8fc;
                font-weight: 700;
            }
            QPushButton {
                background: #2b6cb0;
                color: #f8fbff;
                border: 1px solid #4285cc;
                border-radius: 8px;
                padding: 8px 12px;
            }
            QPushButton:hover {
                background: #377dca;
            }
            QPushButton:pressed, QToolButton:pressed {
                background: #1f568f;
            }
            QPlainTextEdit, QTextEdit, QTextBrowser, QTreeWidget, QListWidget, QLineEdit, QComboBox, QDateEdit, QTableWidget {
                background: #18212b;
                color: #edf3fa;
                border: 1px solid #314050;
                border-radius: 10px;
                padding: 6px;
                selection-background-color: #2b6cb0;
                selection-color: #ffffff;
            }
            QHeaderView::section {
                background: #202b36;
                color: #dbe5ef;
                border: 1px solid #314050;
                padding: 6px;
                font-weight: 600;
            }
            QTreeWidget, QListWidget, QTableWidget {
                alternate-background-color: #141c25;
                gridline-color: #24313e;
            }
            QTreeWidget::item, QListWidget::item, QTableWidget::item {
                padding: 4px;
            }
            QTreeWidget::item:selected, QListWidget::item:selected, QTableWidget::item:selected {
                background: #2b6cb0;
                color: #ffffff;
            }
            QLineEdit:focus, QPlainTextEdit:focus, QTextEdit:focus, QTextBrowser:focus, QTreeWidget:focus, QListWidget:focus, QTableWidget:focus, QComboBox:focus, QDateEdit:focus {
                border: 1px solid #5aa3ff;
            }
            QComboBox::drop-down {
                border: none;
                width: 24px;
            }
            QComboBox QAbstractItemView {
                background: #18212b;
                color: #edf3fa;
                selection-background-color: #2b6cb0;
                selection-color: #ffffff;
                border: 1px solid #314050;
            }
            QGroupBox {
                font-weight: 700;
                color: #edf3fa;
                border: 1px solid #314050;
                border-radius: 10px;
                margin-top: 12px;
                padding-top: 14px;
                background: #141b23;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 4px;
            }
            QLabel {
                color: #d7e1ec;
                background: transparent;
            }
            QSplitter::handle {
                background: #22303d;
            }
            QScrollArea, QScrollArea > QWidget > QWidget {
                background: #11161c;
            }
            QAbstractScrollArea {
                background: #18212b;
            }
            QScrollBar:vertical, QScrollBar:horizontal {
                background: #11161c;
                border: none;
                margin: 0px;
            }
            QScrollBar::handle:vertical, QScrollBar::handle:horizontal {
                background: #314050;
                border-radius: 6px;
                min-height: 24px;
                min-width: 24px;
            }
            QScrollBar::add-line, QScrollBar::sub-line, QScrollBar::add-page, QScrollBar::sub-page {
                background: none;
                border: none;
            }
            """
        )

    def load_all(self):
        profile_data = json.loads(PROFILE_PATH.read_text(encoding="utf-8"))
        self.profile_tab.set_data(profile_data)
        self.experience_tab.refresh()
        self.portfolio_sync_tab.refresh()
        self.portfolio_tab.load_projects()
        self.files_tab.load_files()
        self._refresh_window_title(profile_data)
        self.status.showMessage("Repository loaded", 3000)

    def save_profile(self, data: Any):
        PROFILE_PATH.write_text(pretty_json(data) + "\n", encoding="utf-8")
        self.last_event = f"Saved {PROFILE_PATH.relative_to(REPO_ROOT)}"
        self.experience_tab.refresh()
        self.portfolio_sync_tab.refresh()
        self._refresh_window_title(data)
        self.status.showMessage(f"Saved {PROFILE_PATH.relative_to(REPO_ROOT)}", 4000)

    def save_text_file(self, path: Path, content: str):
        path.write_text(content, encoding="utf-8")
        self.last_event = f"Saved {path.relative_to(REPO_ROOT)}"
        self.status.showMessage(f"Saved {path.relative_to(REPO_ROOT)}", 4000)

    def _refresh_window_title(self, profile_data: Any):
        version = profile_data.get("profile_version", "no-version") if isinstance(profile_data, dict) else "no-version"
        self.setWindowTitle(f"CV Repository Editor | {REPO_ROOT.name} | {version}")

    def get_profile_data(self) -> dict:
        return self.profile_tab.data if isinstance(self.profile_tab.data, dict) else {}

    def _apply_initial_window_geometry(self):
        screen = QGuiApplication.screenAt(QCursor.pos())
        if screen is None:
            screen = self.screen() or QGuiApplication.primaryScreen()
        if screen is None:
            self.resize(1400, 900)
            return

        available = screen.availableGeometry()
        width = max(1000, int(available.width() * 0.7))
        height = max(700, int(available.height() * 0.7))
        width = min(width, available.width())
        height = min(height, available.height())

        x = available.x() + (available.width() - width) // 2
        y = available.y() + (available.height() - height) // 2
        self.setGeometry(x, y, width, height)

def main():
    app = QApplication(sys.argv)
    app.setStyle("Fusion")
    window = RepoEditorWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
