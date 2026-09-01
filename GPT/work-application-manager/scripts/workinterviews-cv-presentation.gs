/**
 * WorkInterviews Queue-only CV presentation helper.
 *
 * Agent/API contract:
 *   Queue!J receives only the verified canonical Markdown source URL.
 *
 * UI contract:
 *   this helper converts that source into two rich-text links: DOCX PDF.
 *   Active / Low fit / Closed are never re-rendered: lifecycle copyTo(PASTE_NORMAL)
 *   carries the already-formed Queue rich text with the row.
 *
 * IMPORTANT: this file intentionally defines no onEdit(e). The tracker keeps its
 * single lifecycle onEdit entrypoint in workinterviews-partitioned-tracker.gs.
 */

const WORKINTERVIEWS_CV_PRESENTATION = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  QUEUE_SHEET: 'Queue',
  CV_COL: 10,
  MARKDOWN_DRIVE: 'https://markdown-drive.pages.dev/?file=',
});

/** Simple open trigger: render pending Queue source URLs and add a repair menu. */
function onOpen(e) {
  const ss = e && e.source ? e.source : SpreadsheetApp.getActiveSpreadsheet();
  assertCvPresentationSpreadsheet_(ss);
  syncQueueCvPresentation_(ss);
  SpreadsheetApp.getUi()
    .createMenu('WorkInterviews')
    .addItem('Sync Queue CV links', 'syncQueueCvPresentation')
    .addToUi();
}

/** Manual wrapper for an already-open sheet after API/connector writes. */
function syncQueueCvPresentation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvPresentationSpreadsheet_(ss);
  const changed = syncQueueCvPresentation_(ss);
  ss.toast(`Queue CV links synced: ${changed}.`, 'WorkInterviews', 6);
}

/**
 * Convert only raw Queue CV source URLs. Existing DOCX PDF rich text is untouched.
 * Protected lifecycle sheets are intentionally ignored.
 */
function syncQueueCvPresentation_(ss) {
  const sheet = ss.getSheetByName(WORKINTERVIEWS_CV_PRESENTATION.QUEUE_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const rows = sheet.getLastRow() - 1;
  const range = sheet.getRange(2, WORKINTERVIEWS_CV_PRESENTATION.CV_COL, rows, 1);
  const displays = range.getDisplayValues();
  const richValues = range.getRichTextValues();
  let changed = 0;

  for (let i = 0; i < rows; i += 1) {
    const display = String(displays[i][0] || '').trim();
    if (!display || display === 'DOCX PDF') continue;

    const rich = richValues[i][0];
    const wholeLink = rich ? rich.getLinkUrl() : '';
    const source = canonicalCvSourceFromCell_(display, wholeLink);
    if (!source) continue;

    const encoded = encodeURIComponent(source);
    const docxUrl = `${WORKINTERVIEWS_CV_PRESENTATION.MARKDOWN_DRIVE}${encoded}&export=docx`;
    const pdfUrl = `${WORKINTERVIEWS_CV_PRESENTATION.MARKDOWN_DRIVE}${encoded}&export=pdf`;
    const text = 'DOCX PDF';

    const rendered = SpreadsheetApp.newRichTextValue()
      .setText(text)
      .setLinkUrl(0, 4, docxUrl)
      .setLinkUrl(5, 8, pdfUrl)
      .build();

    const cell = sheet.getRange(i + 2, WORKINTERVIEWS_CV_PRESENTATION.CV_COL);
    cell.setRichTextValue(rendered);
    cell.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    changed += 1;
  }

  return changed;
}

function canonicalCvSourceFromCell_(display, wholeLink) {
  const candidates = [wholeLink, display]
    .map(value => String(value || '').trim())
    .filter(Boolean);

  for (const value of candidates) {
    if (/^https:\/\/markdown-drive\.pages\.dev\//i.test(value)) {
      const match = value.match(/[?&]file=([^&]+)/i);
      if (!match) continue;
      try {
        return decodeURIComponent(match[1]);
      } catch (err) {
        continue;
      }
    }

    if (/^https?:\/\//i.test(value)) return value;
  }

  return '';
}

function assertCvPresentationSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_CV_PRESENTATION.SPREADSHEET_ID) {
    throw new Error('CV presentation helper must run only in the canonical WorkInterviews spreadsheet.');
  }
}
