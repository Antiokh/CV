/**
 * WorkInterviews CV artifact registry + derived CV presentation.
 *
 * This module deliberately has NO onEdit handler. Lifecycle routing remains owned by
 * workinterviews-partitioned-tracker.gs and its single simple onEdit(e).
 *
 * Canonical storage:
 *   hidden Artifacts!A:D keyed by immutable vacancy Row ID.
 *
 * Presentation:
 *   physical vacancy column J is derived from Artifacts and is never canonical.
 *   New Markdown sources render as one `CV` link to Markdown Drive Preview.
 *   A single link avoids Google Sheets' multi-link chooser for `DOCX PDF` cells.
 */

const WORKINTERVIEWS_CV_ARTIFACTS = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  SHEET: 'Artifacts',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  ROW_ID_COL: 23,
  CV_COL: 10,
  HEADERS: Object.freeze(['Row ID', 'CV Source URL', 'Source kind', 'Updated at']),
  MARKDOWN_DRIVE: 'https://markdown-drive.pages.dev/?file=',
});

/**
 * Safe simple open trigger. It only refreshes derived artifact presentation.
 * It never routes lifecycle state.
 */
function onOpen(e) {
  const ss = e && e.source ? e.source : SpreadsheetApp.getActiveSpreadsheet();
  assertCvArtifactSpreadsheet_(ss);
  ensureCvArtifactsSheet_(ss);
  syncCvPresentation_(ss);
  SpreadsheetApp.getUi()
    .createMenu('WorkInterviews')
    .addItem('Sync CV links', 'syncCvPresentation')
    .addItem('Migrate CV sources to Artifacts', 'migrateCvArtifacts')
    .addToUi();
}

/**
 * One-time installation / repair.
 * Removes every installable ON_EDIT trigger; the tracker must rely only on its
 * simple onEdit(e) for human lifecycle edits.
 */
function installCvArtifactRegistry() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvArtifactSpreadsheet_(ss);

  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getEventType() === ScriptApp.EventType.ON_EDIT)
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ensureCvArtifactsSheet_(ss);
  migrateCvArtifacts_(ss);
  syncCvPresentation_(ss);

  PropertiesService.getDocumentProperties()
    .setProperty('WORKINTERVIEWS_CV_ARTIFACTS_VERSION', '1.0.0');

  ss.toast('Artifacts registry installed; legacy CV sources migrated; CV links synced.', 'WorkInterviews', 10);
}

/** Manual menu/action wrapper. */
function migrateCvArtifacts() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvArtifactSpreadsheet_(ss);
  ensureCvArtifactsSheet_(ss);
  const result = migrateCvArtifacts_(ss);
  ss.toast(`Artifacts migration: ${result.created} created, ${result.preserved} preserved.`, 'WorkInterviews', 8);
}

/** Manual menu/action wrapper. */
function syncCvPresentation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvArtifactSpreadsheet_(ss);
  ensureCvArtifactsSheet_(ss);
  const count = syncCvPresentation_(ss);
  ss.toast(`Synced ${count} CV presentation cells.`, 'WorkInterviews', 6);
}

function ensureCvArtifactsSheet_(ss) {
  let sheet = ss.getSheetByName(WORKINTERVIEWS_CV_ARTIFACTS.SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(WORKINTERVIEWS_CV_ARTIFACTS.SHEET);
  }
  if (sheet.getMaxColumns() < 4) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), 4 - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, 1, 4).setValues([WORKINTERVIEWS_CV_ARTIFACTS.HEADERS]);
  sheet.setFrozenRows(1);
  sheet.hideSheet();
  return sheet;
}

function migrateCvArtifacts_(ss) {
  const artifactSheet = ensureCvArtifactsSheet_(ss);
  const existing = readCvArtifactMap_(artifactSheet);
  const additions = [];
  let preserved = 0;

  WORKINTERVIEWS_CV_ARTIFACTS.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return;

    const lastRow = sheet.getLastRow();
    const rowIds = sheet.getRange(2, WORKINTERVIEWS_CV_ARTIFACTS.ROW_ID_COL, lastRow - 1, 1).getDisplayValues();
    const cvRange = sheet.getRange(2, WORKINTERVIEWS_CV_ARTIFACTS.CV_COL, lastRow - 1, 1);
    const cvDisplays = cvRange.getDisplayValues();
    const cvRich = cvRange.getRichTextValues();

    for (let i = 0; i < rowIds.length; i += 1) {
      const rowId = String(rowIds[i][0] || '').trim();
      if (!rowId) continue;
      if (existing.has(rowId) && existing.get(rowId).source) {
        preserved += 1;
        continue;
      }

      const display = String(cvDisplays[i][0] || '').trim();
      if (!display) continue;

      const extracted = extractCvArtifactSource_(display, cvRich[i][0]);
      if (!extracted || !extracted.source) continue;

      additions.push([rowId, extracted.source, extracted.kind, new Date()]);
      existing.set(rowId, { source: extracted.source, kind: extracted.kind });
    }
  });

  if (additions.length) {
    let targetRow = artifactSheet.getLastRow() + 1;
    if (targetRow + additions.length - 1 > artifactSheet.getMaxRows()) {
      artifactSheet.insertRowsAfter(
        artifactSheet.getMaxRows(),
        targetRow + additions.length - 1 - artifactSheet.getMaxRows()
      );
    }
    artifactSheet.getRange(targetRow, 1, additions.length, 4).setValues(additions);
    artifactSheet.getRange(targetRow, 4, additions.length, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
  }

  artifactSheet.hideSheet();
  return { created: additions.length, preserved };
}

function extractCvArtifactSource_(display, richText) {
  const links = [];
  if (richText) {
    richText.getRuns().forEach(run => {
      const url = run.getLinkUrl();
      if (url && !links.includes(url)) links.push(url);
    });
    const whole = richText.getLinkUrl();
    if (whole && !links.includes(whole)) links.push(whole);
  }

  for (const url of links) {
    const source = extractMarkdownDriveSource_(url);
    if (source) return { source, kind: classifyCvSourceKind_(source) };
  }

  const raw = links[0] || (/^https?:\/\//i.test(display) ? display : '');
  if (raw) return { source: raw, kind: 'legacy' };
  return null;
}

function extractMarkdownDriveSource_(url) {
  if (!url || !/^https:\/\/markdown-drive\.pages\.dev\//i.test(url)) return '';
  const match = String(url).match(/[?&]file=([^&]+)/i);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch (err) {
    return '';
  }
}

function classifyCvSourceKind_(source) {
  const value = String(source || '').toLowerCase();
  if (!value) return 'legacy';
  if (value.includes('docs.google.com/document/') || value.includes('export?format=txt')) return 'legacy';
  return 'markdown';
}

function readCvArtifactMap_(sheet) {
  const map = new Map();
  if (!sheet || sheet.getLastRow() < 2) return map;
  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  values.forEach(row => {
    const rowId = String(row[0] || '').trim();
    if (!rowId || map.has(rowId)) return;
    map.set(rowId, {
      source: String(row[1] || '').trim(),
      kind: String(row[2] || '').trim() || 'legacy',
    });
  });
  return map;
}

function syncCvPresentation_(ss) {
  const artifactSheet = ensureCvArtifactsSheet_(ss);
  const artifacts = readCvArtifactMap_(artifactSheet);
  let changed = 0;

  WORKINTERVIEWS_CV_ARTIFACTS.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() < 2) return;

    const lastRow = sheet.getLastRow();
    const rowIds = sheet.getRange(2, WORKINTERVIEWS_CV_ARTIFACTS.ROW_ID_COL, lastRow - 1, 1).getDisplayValues();

    for (let i = 0; i < rowIds.length; i += 1) {
      const rowId = String(rowIds[i][0] || '').trim();
      if (!rowId || !artifacts.has(rowId)) continue;

      const artifact = artifacts.get(rowId);
      if (!artifact.source) continue;

      const isMarkdown = artifact.kind === 'markdown';
      const label = isMarkdown ? 'CV' : 'Legacy CV';
      const url = isMarkdown
        ? WORKINTERVIEWS_CV_ARTIFACTS.MARKDOWN_DRIVE + encodeURIComponent(artifact.source)
        : artifact.source;

      const cell = sheet.getRange(i + 2, WORKINTERVIEWS_CV_ARTIFACTS.CV_COL);
      const current = cell.getRichTextValue();
      if (current && current.getText() === label && current.getLinkUrl() === url) continue;

      const rich = SpreadsheetApp.newRichTextValue()
        .setText(label)
        .setLinkUrl(0, label.length, url)
        .build();
      cell.setRichTextValue(rich);
      cell.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
      changed += 1;
    }
  });

  return changed;
}

function assertCvArtifactSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_CV_ARTIFACTS.SPREADSHEET_ID) {
    throw new Error('CV artifact helper must run only in the canonical WorkInterviews spreadsheet.');
  }
}
