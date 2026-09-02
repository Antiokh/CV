/**
 * WorkInterviews Queue-only CV presentation helper.
 *
 * Agent/API contract:
 *   Queue!J receives only the verified canonical Markdown source URL.
 *   Opaque source URLs (notably Drive /file/d/.../view links) carry a #markdown
 *   type marker after verification; the marker is stripped before export.
 *
 * UI contract:
 *   this helper converts a validated source into two rich-text links: DOCX PDF.
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
  OPAQUE_MARKDOWN_TAG: '#markdown',
});

/** Simple open trigger: render pending validated Queue sources and add a repair menu. */
function onOpen(e) {
  const ss = e && e.source ? e.source : SpreadsheetApp.getActiveSpreadsheet();
  assertCvPresentationSpreadsheet_(ss);
  syncQueueCvPresentation_(ss);
  SpreadsheetApp.getUi()
    .createMenu('WorkInterviews')
    .addItem('Sync Queue CV links', 'syncQueueCvPresentation')
    .addToUi();
}

/**
 * If an API/connector writes a raw source while the sheet is already open,
 * selecting that Queue row is enough to render it before a later Stage move.
 */
function onSelectionChange(e) {
  if (!e || !e.range || !e.source) return;
  assertCvPresentationSpreadsheet_(e.source);
  const sheet = e.range.getSheet();
  if (sheet.getName() !== WORKINTERVIEWS_CV_PRESENTATION.QUEUE_SHEET) return;
  if (e.range.getRow() < 2) return;
  renderQueueCvCell_(sheet, e.range.getRow());
}

/** Manual wrapper for an already-open sheet after API/connector writes. */
function syncQueueCvPresentation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvPresentationSpreadsheet_(ss);
  const changed = syncQueueCvPresentation_(ss);
  ss.toast(`Queue CV links synced: ${changed}.`, 'WorkInterviews', 6);
}

/**
 * Convert only validated raw Queue Markdown sources. Existing DOCX PDF rich text
 * and unverified/legacy links are untouched. Protected lifecycle sheets are ignored.
 */
function syncQueueCvPresentation_(ss) {
  const sheet = ss.getSheetByName(WORKINTERVIEWS_CV_PRESENTATION.QUEUE_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  let changed = 0;
  for (let row = 2; row <= sheet.getLastRow(); row += 1) {
    if (renderQueueCvCell_(sheet, row)) changed += 1;
  }
  return changed;
}

/**
 * Lifecycle hook called immediately before Queue rows are copied out of Queue.
 * Validated raw Markdown sources are rendered synchronously so the destination
 * receives DOCX/PDF links. Legacy/unverified links are preserved unchanged.
 */
function ensureQueueCvPresentationBeforeMove_(sheet, row) {
  if (!sheet || sheet.getName() !== WORKINTERVIEWS_CV_PRESENTATION.QUEUE_SHEET) return false;
  return renderQueueCvCell_(sheet, row);
}

function renderQueueCvCell_(sheet, row) {
  const cell = sheet.getRange(row, WORKINTERVIEWS_CV_PRESENTATION.CV_COL);
  const display = String(cell.getDisplayValue() || '').trim();
  if (!display || display === 'DOCX PDF') return false;

  const rich = cell.getRichTextValue();
  const wholeLink = rich ? rich.getLinkUrl() : '';
  const source = canonicalCvSourceFromCell_(display, wholeLink);
  if (!source) return false;

  const encoded = encodeURIComponent(source);
  const docxUrl = `${WORKINTERVIEWS_CV_PRESENTATION.MARKDOWN_DRIVE}${encoded}&export=docx`;
  const pdfUrl = `${WORKINTERVIEWS_CV_PRESENTATION.MARKDOWN_DRIVE}${encoded}&export=pdf`;
  const text = 'DOCX PDF';

  const rendered = SpreadsheetApp.newRichTextValue()
    .setText(text)
    .setLinkUrl(0, 4, docxUrl)
    .setLinkUrl(5, 8, pdfUrl)
    .build();

  cell.setRichTextValue(rendered);
  cell.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  return true;
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
        const decoded = decodeURIComponent(match[1]);
        const validated = canonicalMarkdownSourceUrl_(decoded);
        if (validated) return validated;
      } catch (err) {
        continue;
      }
    }

    const validated = canonicalMarkdownSourceUrl_(value);
    if (validated) return validated;
  }

  return '';
}

/**
 * Syntactic source validation usable from simple triggers without Drive/HTTP auth.
 *
 * Accepted without a marker:
 *   - URLs whose path itself ends in .md;
 *   - Google Docs text-export URLs used by the historical Markdown workflow.
 *
 * Opaque URLs such as Drive /file/d/.../view must be verified by the writer and
 * tagged with #markdown. The fragment never reaches the source server and is
 * removed before the Markdown Drive export URL is built.
 */
function canonicalMarkdownSourceUrl_(value) {
  const raw = String(value || '').trim();
  if (!/^https?:\/\/[^\s]+$/i.test(raw)) return '';

  const tag = WORKINTERVIEWS_CV_PRESENTATION.OPAQUE_MARKDOWN_TAG;
  if (raw.toLowerCase().endsWith(tag)) {
    const clean = raw.slice(0, -tag.length);
    return /^https?:\/\/[^\s]+$/i.test(clean) ? clean : '';
  }

  if (/^https?:\/\/[^?#]+\.md(?:[?#].*)?$/i.test(raw)) return raw;
  if (/^https:\/\/docs\.google\.com\/document\/d\/[^/?#]+\/export\?[^#]*\bformat=txt(?:&|$)/i.test(raw)) return raw;

  return '';
}

function assertCvPresentationSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_CV_PRESENTATION.SPREADSHEET_ID) {
    throw new Error('CV presentation helper must run only in the canonical WorkInterviews spreadsheet.');
  }
}
