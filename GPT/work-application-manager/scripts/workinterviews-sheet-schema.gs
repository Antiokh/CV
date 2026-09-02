/**
 * WorkInterviews canonical sheet schema / formatter.
 *
 * PURPOSE
 * -------
 * Google Sheets mutates range-bound metadata when rows are inserted/deleted.
 * Over time this can fragment conditional-format ranges and data-validation
 * ranges into dozens/hundreds of pieces. This file treats sheet presentation
 * and cell types as declarative schema: structural tracker operations can call
 * repairWorkInterviewsSheetSchema_() and get the same canonical result every time.
 *
 * OWNERSHIP
 * ---------
 * This file owns ONLY sheet-level schema/presentation for the tracker:
 *   - native value types that matter to UI behavior (Fit %, dates);
 *   - number/date formats;
 *   - data validation (including date picker/calendar behavior);
 *   - canonical filter range;
 *   - conditional formatting.
 *
 * It does NOT own vacancy lifecycle routing, row identity, Activity Log,
 * formulas, CV rendering, or agent write policy. Those remain in core.gs and
 * presentation.gs.
 *
 * TYPE CONTRACT
 * -------------
 * Storage sheets: Queue / Active / Low fit / Closed.
 *   C  Fit %          -> native Number, canonical storage 0..1, display 0%.
 *                        Manual UI may temporarily accept 0..100; core onEdit
 *                        normalizes e.g. 85 -> 0.85.
 *   D  Stage          -> one value from the canonical lifecycle list.
 *   I  Apply URL      -> absolute HTTP(S) or mailto:.
 *   J  CV             -> NO URL validation. It may contain a raw Markdown URL
 *                        or presentation.gs rich text "DOCX PDF".
 *   K,L               -> absolute HTTP(S) URLs when non-empty.
 *   O  Vacancy URL    -> absolute HTTP(S) URL when non-empty.
 *   P:S               -> native Date objects, display yyyy-mm-dd, requireDate()
 *                        validation so the Sheets calendar/date picker remains.
 *
 * API / connector writes do not fire onEdit. Therefore repair normalizes
 * parseable ISO YYYY-MM-DD strings and percentage strings/numbers before
 * reapplying validation. normalizeTrackerRowTypesBeforeMove_() is called by
 * core immediately before a row is copied out of its source sheet, preventing
 * text dates from propagating into another lifecycle partition.
 *
 * FILTER CONTRACT
 * ---------------
 * Every storage sheet has exactly one basic filter over A1:V<maxRows>.
 * Row ID (W) and helper/formula columns to the right are intentionally outside
 * the user-facing filter. Existing column filter criteria are preserved when a
 * malformed/outdated filter range must be rebuilt. Rebuilding does not attempt
 * to recreate UI sort metadata; current physical row order remains unchanged.
 *
 * CONDITIONAL FORMATTING CONTRACT
 * -------------------------------
 * Rules are rebuilt from scratch with setConditionalFormatRules(). This is
 * intentional: it collapses fragmented ranges created by repeated row deletes.
 *
 * Queue:
 *   - validation/completeness warnings (soft red fill) for required data;
 *   - duplicate guards (red duplicate position text + duplicate row fill);
 *   - company-history hints (green/italic company text);
 *   - Fit % five-band heatmap;
 *   - salary-midpoint five-band heatmap on F using AF as the numeric helper;
 *   - lifecycle emphasis for Reviewed/CV ready;
 *   - source hints for YC and LinkedIn, including YC saturation warning.
 *
 * Active:
 *   - NO red warning/duplicate formatting. Active is an execution surface, not
 *     a Queue QA surface. This deliberately prevents the old red-font leakage;
 *   - Fit % and salary heatmaps remain;
 *   - row stage shading for Recruiter screen / Interview / Technical / Final.
 *
 * Low fit / Closed:
 *   - terminal rows are muted grey only.
 *
 * ConditionalFormatRuleBuilder does not expose Sheets' stopIfTrue flag, so the
 * canonical rules are designed to avoid destructive overlap: row background
 * ranges exclude C (Fit) and F (salary), source rules exclude DUPLICATE rows,
 * and numeric heatmap bands are mutually exclusive.
 */

const WORKINTERVIEWS_SHEET_SCHEMA = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  FILTER_LAST_COL: 22, // V. W is immutable Row ID and is not user-filtered.
  COL: Object.freeze({
    FIT: 3,
    STAGE: 4,
    APPLY_URL: 9,
    CV: 10,
    URL_K: 11,
    URL_L: 12,
    VACANCY_URL: 15,
    POSTED_DATE: 16,
    DATE_FOUND: 17,
    DATE_APPLIED: 18,
    LAST_CONTACT: 19,
    ROW_ID: 23,
    DUPLICATE_HELPER: 25,
    SALARY_MIDPOINT: 32,
  }),
  DATE_COLS: Object.freeze([16, 17, 18, 19]),
  STAGES: Object.freeze([
    'To review', 'Reviewed', 'CV ready', 'Referral', 'Apply', 'Applied',
    'Recruiter screen', 'Assessment', 'Interview', 'Technical interview',
    'Final', 'Offer', 'Rejected', 'Not a fit', 'Withdrawn', 'Ghosted', 'Closed',
  ]),
  COLORS: Object.freeze({
    MUTED_BG: '#EDEDED',
    MUTED_TEXT: '#666666',
    ERROR_BG: '#FFBFBF',
    DUPLICATE_BG: '#F4CCCC',
    DUPLICATE_TEXT: '#FF0000',
    HISTORY_TEXT: '#137333',
    LOW_BG: '#F4CCCC',
    LOW_TEXT: '#990000',
    LOW_MID_BG: '#FCE5CD',
    LOW_MID_TEXT: '#B45F06',
    MID_BG: '#FFF2CC',
    MID_TEXT: '#7F6000',
    HIGH_MID_BG: '#D9EAD3',
    HIGH_MID_TEXT: '#38761D',
    HIGH_BG: '#B6D7A8',
    HIGH_TEXT: '#274E13',
    STAGE_TEXT: '#262626',
    RECRUITER_BG: '#FFF2CC',
    INTERVIEW_BG: '#EAF4CF',
    TECH_BG: '#D9EAD3',
    FINAL_BG: '#D9EAF7',
    YC_BG: '#FFF4CC',
    LINKEDIN_BG: '#DDEBF7',
  }),
});

/** Manual repair entrypoint. Safe to run repeatedly. */
function repairWorkInterviewsSchema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  const result = repairWorkInterviewsSchema_(ss);
  ss.toast(
    `Schema repaired: ${result.sheets} sheet(s), ${result.normalizedValues} typed value(s) normalized.`,
    'WorkInterviews schema',
    8,
  );
}

/** Repair all or selected storage sheets. */
function repairWorkInterviewsSchema_(ss, sheetNames) {
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  const names = Array.isArray(sheetNames) && sheetNames.length
    ? sheetNames
    : WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS;

  let normalizedValues = 0;
  let sheets = 0;
  names.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const result = repairWorkInterviewsSheetSchema_(sheet);
    normalizedValues += result.normalizedValues;
    sheets += 1;
  });
  return { sheets, normalizedValues };
}

/** Repair one storage sheet after insert/delete/move. */
function repairWorkInterviewsSheetSchema_(sheet) {
  if (!sheet || !WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.includes(sheet.getName())) {
    return { normalizedValues: 0 };
  }

  const normalizedValues = normalizeWorkInterviewsTypedColumns_(sheet);
  applyWorkInterviewsNumberFormats_(sheet);
  repairWorkInterviewsValidationForSheet_(sheet);
  repairWorkInterviewsFilter_(sheet);
  repairWorkInterviewsConditionalFormatting_(sheet);
  return { normalizedValues };
}

/** Compatibility helper used by core install logic. */
function repairWorkInterviewsValidation_(ss) {
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) repairWorkInterviewsValidationForSheet_(sheet);
  });
}

/**
 * Strong pre-move guard. Converts parseable values in-place and throws on a
 * non-empty value that cannot satisfy the canonical type contract.
 */
function normalizeTrackerRowTypesBeforeMove_(sheet, row) {
  if (!sheet || !WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.includes(sheet.getName())) return;
  if (row < 2 || row > sheet.getMaxRows()) throw new Error(`Invalid tracker row: ${row}`);

  const fitCell = sheet.getRange(row, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT);
  const fitRaw = fitCell.getValue();
  if (fitRaw !== '' && fitRaw !== null) {
    const fit = canonicalFitValue_(fitRaw);
    if (fit === null || fit < 0 || fit > 1) {
      throw new Error(`${sheet.getName()}!C${row}: Fit % must resolve to a native 0..1 number before move.`);
    }
    if (fit !== fitRaw) fitCell.setValue(fit);
    fitCell.setNumberFormat('0%');
  }

  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
    const cell = sheet.getRange(row, col);
    const raw = cell.getValue();
    if (raw === '' || raw === null) {
      cell.setNumberFormat('yyyy-mm-dd');
      return;
    }
    const date = canonicalDateValue_(raw);
    if (!date) {
      throw new Error(`${sheet.getName()}!${columnLetter_(col)}${row}: date must be a native date or ISO YYYY-MM-DD before move.`);
    }
    if (!(raw instanceof Date)) cell.setValue(date);
    cell.setNumberFormat('yyyy-mm-dd');
  });
}

/** Normalize parseable API/connector values across the populated region. */
function normalizeWorkInterviewsTypedColumns_(sheet) {
  const lastRow = Math.max(1, sheet.getLastRow());
  if (lastRow < 2) return 0;
  const rowCount = lastRow - 1;
  let changed = 0;

  // Use per-cell writes only for cells that need conversion. A bulk setValues()
  // would replace formulas in otherwise-unchanged cells with their displayed values.
  const fitRange = sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT, rowCount, 1);
  const fitValues = fitRange.getValues();
  const fitFormulas = fitRange.getFormulas();
  fitValues.forEach((row, i) => {
    if (fitFormulas[i][0]) return;
    const raw = row[0];
    if (raw === '' || raw === null) return;
    const fit = canonicalFitValue_(raw);
    if (fit !== null && fit >= 0 && fit <= 1 && fit !== raw) {
      sheet.getRange(i + 2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT).setValue(fit);
      changed += 1;
    }
  });

  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
    const range = sheet.getRange(2, col, rowCount, 1);
    const values = range.getValues();
    const formulas = range.getFormulas();
    values.forEach((row, i) => {
      if (formulas[i][0]) return;
      const raw = row[0];
      if (raw === '' || raw === null || raw instanceof Date) return;
      const date = canonicalDateValue_(raw);
      if (date) {
        sheet.getRange(i + 2, col).setValue(date);
        changed += 1;
      }
    });
  });

  return changed;
}

function applyWorkInterviewsNumberFormats_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return;
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT, maxRows - 1, 1).setNumberFormat('0%');
  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
    sheet.getRange(2, col, maxRows - 1, 1).setNumberFormat('yyyy-mm-dd');
  });
}

/**
 * Reapply validation to whole canonical columns. J (CV) is explicitly cleared:
 * it is presentation-rich text after rendering and must never be URL-validated.
 */
function repairWorkInterviewsValidationForSheet_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return;
  const rows = maxRows - 1;

  // Clear only schema-owned validation columns; do not touch unrelated columns.
  [
    WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT,
    WORKINTERVIEWS_SHEET_SCHEMA.COL.STAGE,
    WORKINTERVIEWS_SHEET_SCHEMA.COL.APPLY_URL,
    WORKINTERVIEWS_SHEET_SCHEMA.COL.CV,
    WORKINTERVIEWS_SHEET_SCHEMA.COL.URL_K,
    WORKINTERVIEWS_SHEET_SCHEMA.COL.URL_L,
    WORKINTERVIEWS_SHEET_SCHEMA.COL.VACANCY_URL,
    ...WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS,
  ].forEach(col => sheet.getRange(2, col, rows, 1).clearDataValidations());

  const fitValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=OR(C2="",AND(ISNUMBER(C2),C2>=0,C2<=1))')
    .setAllowInvalid(false)
    .setHelpText('Fit % must be numeric. Use 0%..100% (or 0..1).')
    .build();
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT, rows, 1).setDataValidation(fitValidation);

  const stageValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(WORKINTERVIEWS_SHEET_SCHEMA.STAGES, true)
    .setAllowInvalid(false)
    .setHelpText('Choose a canonical lifecycle Stage.')
    .build();
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.STAGE, rows, 1).setDataValidation(stageValidation);

  const applyValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=OR(I2="",REGEXMATCH(I2,"^(https?://|mailto:)"))')
    .setAllowInvalid(false)
    .setHelpText('Apply URL must be HTTP(S) or mailto:.')
    .build();
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.APPLY_URL, rows, 1).setDataValidation(applyValidation);

  const kValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=OR(K2="",REGEXMATCH(K2,"^https?://"))')
    .setAllowInvalid(false)
    .setHelpText('Link must be an absolute HTTP(S) URL.')
    .build();
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.URL_K, rows, 1).setDataValidation(kValidation);

  const lValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=OR(L2="",REGEXMATCH(L2,"^https?://"))')
    .setAllowInvalid(false)
    .setHelpText('Link must be an absolute HTTP(S) URL.')
    .build();
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.URL_L, rows, 1).setDataValidation(lValidation);

  const vacancyValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=OR(O2="",REGEXMATCH(O2,"^https?://"))')
    .setAllowInvalid(false)
    .setHelpText('Vacancy URL must be an absolute HTTP(S) URL.')
    .build();
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.VACANCY_URL, rows, 1).setDataValidation(vacancyValidation);

  const dateValidation = SpreadsheetApp.newDataValidation()
    .requireDate()
    .setAllowInvalid(false)
    .setHelpText('Use a real date. Display format is YYYY-MM-DD.')
    .build();
  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
    sheet.getRange(2, col, rows, 1).setDataValidation(dateValidation);
  });
}

/** Keep one user-facing filter over visible tracker columns A:V. */
function repairWorkInterviewsFilter_(sheet) {
  const maxRows = sheet.getMaxRows();
  const expected = sheet.getRange(1, 1, maxRows, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL);
  const current = sheet.getFilter();

  if (current) {
    const r = current.getRange();
    const matches = r.getRow() === 1 && r.getColumn() === 1 &&
      r.getNumRows() === maxRows &&
      r.getNumColumns() === WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL;
    if (matches) return;
  }

  const criteria = {};
  if (current) {
    const currentWidth = current.getRange().getNumColumns();
    const lastCriteriaCol = Math.min(currentWidth, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL);
    for (let col = 1; col <= lastCriteriaCol; col += 1) {
      const c = current.getColumnFilterCriteria(col);
      if (c) criteria[col] = c.copy().build();
    }
    current.remove();
  }

  expected.createFilter();
  const rebuilt = sheet.getFilter();
  Object.keys(criteria).forEach(key => {
    rebuilt.setColumnFilterCriteria(Number(key), criteria[key]);
  });
}

function repairWorkInterviewsConditionalFormatting_(sheet) {
  sheet.setConditionalFormatRules(buildCanonicalConditionalFormatRules_(sheet));
}

function buildCanonicalConditionalFormatRules_(sheet) {
  const name = sheet.getName();
  if (!WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.includes(name) || sheet.getMaxRows() < 2) return [];
  if (name === 'Queue') return buildQueueConditionalFormatRules_(sheet);
  if (name === 'Active') return buildActiveConditionalFormatRules_(sheet);
  if (name === 'Low fit') return buildLowFitConditionalFormatRules_(sheet);
  return buildClosedConditionalFormatRules_(sheet);
}

function buildQueueConditionalFormatRules_(sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  const rules = [];
  const rowShade = rowRangesExcludingFitAndSalary_(sheet);
  const rowVisible = [dataRange_(sheet, 1, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL)];

  // Queue QA warnings: red fill + bold, never used in Active.
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,OR($D2="Reviewed",$D2="CV ready"),NOT(ISNUMBER($AF2)))', [colRange_(sheet, 6)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,NOT(ISNUMBER($Q2)))', [colRange_(sheet, 17)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,LEN($P2)>0,NOT(ISNUMBER($P2)))', [colRange_(sheet, 16)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,$C2>0.6,NOT(ISNUMBER($AF2)))', [colRange_(sheet, 32)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,$C2>0.6,LEN($J2)=0)', [colRange_(sheet, 10)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,$C2>0.6,LEN($K2)=0)', [colRange_(sheet, 11)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($W2)>0,$C2>0.6,LEN($F2)=0)', [colRange_(sheet, 6)], { background: c.ERROR_BG, bold: true }));

  // Duplicate against lifecycle partitions: position red; whole visible row muted red.
  rules.push(cfRule_(sheet,
    '=AND($A2<>"",$B2<>"",OR(COUNTIFS(INDIRECT("\'Active\'!$A$2:$A"),$A2,INDIRECT("\'Active\'!$B$2:$B"),$B2)>0,COUNTIFS(INDIRECT("\'Low fit\'!$A$2:$A"),$A2,INDIRECT("\'Low fit\'!$B$2:$B"),$B2)>0,COUNTIFS(INDIRECT("\'Closed\'!$A$2:$A"),$A2,INDIRECT("\'Closed\'!$B$2:$B"),$B2)>0))',
    [colRange_(sheet, 2)],
    { fontColor: c.DUPLICATE_TEXT, bold: true },
  ));
  rules.push(cfRule_(sheet, '=$Y2="DUPLICATE"', rowVisible, { background: c.DUPLICATE_BG, bold: true }));

  // Company history hints.
  rules.push(cfRule_(sheet,
    '=AND($A2<>"",COUNTIFS(INDIRECT("\'Active\'!$A$2:$A"),$A2,INDIRECT("\'Active\'!$R$2:$R"),"<>")+COUNTIFS(INDIRECT("\'Closed\'!$A$2:$A"),$A2,INDIRECT("\'Closed\'!$R$2:$R"),"<>")>0)',
    [colRange_(sheet, 1)],
    { fontColor: c.HISTORY_TEXT },
  ));
  rules.push(cfRule_(sheet,
    '=AND($A2<>"",COUNTIF($A$2:$A,$A2)>1,$D2<>"CV ready",$D2<>"Reviewed")',
    [colRange_(sheet, 1)],
    { italic: true },
  ));

  addSalaryHeatmapRules_(rules, sheet);
  addFitHeatmapRules_(rules, sheet);

  // Reviewed/CV ready is a Queue state emphasis, no background so source/heatmap remains legible.
  rules.push(cfRule_(sheet, '=OR($D2="CV ready",$D2="Reviewed")', rowVisible, { bold: true }));

  // Source row backgrounds. Exclude duplicates because duplicate row fill has semantic priority.
  const ycCount = '(COUNTIFS(INDIRECT("\'Active\'!$I$2:$I"),"*ycombinator.com/companies/*",INDIRECT("\'Active\'!$R$2:$R"),">="&(TODAY()-7),INDIRECT("\'Active\'!$R$2:$R"),"<"&(TODAY()+1))+COUNTIFS(INDIRECT("\'Closed\'!$I$2:$I"),"*ycombinator.com/companies/*",INDIRECT("\'Closed\'!$R$2:$R"),">="&(TODAY()-7),INDIRECT("\'Closed\'!$R$2:$R"),"<"&(TODAY()+1)))';
  rules.push(cfRule_(sheet,
    `=AND($Y2<>"DUPLICATE",LEN($W2)>0,REGEXMATCH(LOWER($I2),"ycombinator\\.com/companies/"),${ycCount}>=5)`,
    rowShade,
    { background: c.MUTED_BG, fontColor: c.MUTED_TEXT },
  ));
  rules.push(cfRule_(sheet,
    `=AND($Y2<>"DUPLICATE",LEN($W2)>0,REGEXMATCH(LOWER($I2),"ycombinator\\.com/companies/"),${ycCount}<5)`,
    rowShade,
    { background: c.YC_BG },
  ));
  rules.push(cfRule_(sheet,
    '=AND($Y2<>"DUPLICATE",LEN($W2)>0,REGEXMATCH(LOWER($I2),"linkedin\\.com/jobs/"))',
    rowShade,
    { background: c.LINKEDIN_BG },
  ));

  return rules;
}

function buildActiveConditionalFormatRules_(sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  const rules = [];
  addSalaryHeatmapRules_(rules, sheet);
  addFitHeatmapRules_(rules, sheet);

  // Deliberately no Queue QA red/duplicate rules in Active.
  const stageRanges = rowRangesExcludingFitAndSalary_(sheet);
  rules.push(cfRule_(sheet, '=$D2="Recruiter screen"', stageRanges, { background: c.RECRUITER_BG, fontColor: c.STAGE_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=$D2="Interview"', stageRanges, { background: c.INTERVIEW_BG, fontColor: c.STAGE_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=$D2="Technical interview"', stageRanges, { background: c.TECH_BG, fontColor: c.STAGE_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=$D2="Final"', stageRanges, { background: c.FINAL_BG, fontColor: c.STAGE_TEXT, bold: true }));
  return rules;
}

function buildLowFitConditionalFormatRules_(sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  return [cfRule_(sheet, '=$D2="Not a fit"', [dataRange_(sheet, 1, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL)], { background: c.MUTED_BG, fontColor: c.MUTED_TEXT })];
}

function buildClosedConditionalFormatRules_(sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  return [cfRule_(sheet,
    '=OR($D2="Rejected",$D2="Withdrawn",$D2="Ghosted",$D2="Closed")',
    [dataRange_(sheet, 1, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL)],
    { background: c.MUTED_BG, fontColor: c.MUTED_TEXT },
  )];
}

function addFitHeatmapRules_(rules, sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  const r = [colRange_(sheet, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT)];
  rules.push(cfRule_(sheet, '=AND(ISNUMBER($C2),$C2<0.5)', r, { background: c.LOW_BG, fontColor: c.LOW_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=AND(ISNUMBER($C2),$C2>=0.5,$C2<0.65)', r, { background: c.LOW_MID_BG, fontColor: c.LOW_MID_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=AND(ISNUMBER($C2),$C2>=0.65,$C2<0.75)', r, { background: c.MID_BG, fontColor: c.MID_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=AND(ISNUMBER($C2),$C2>=0.75,$C2<0.85)', r, { background: c.HIGH_MID_BG, fontColor: c.HIGH_MID_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=AND(ISNUMBER($C2),$C2>=0.85)', r, { background: c.HIGH_BG, fontColor: c.HIGH_TEXT, bold: true }));
}

function addSalaryHeatmapRules_(rules, sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  const r = [colRange_(sheet, 6)];
  const base = 'COUNT($AF$2:$AF)>0';
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AF2),$AF2<=PERCENTILE($AF$2:$AF,0.2))`, r, { background: c.LOW_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AF2),$AF2>PERCENTILE($AF$2:$AF,0.2),$AF2<=PERCENTILE($AF$2:$AF,0.4))`, r, { background: c.LOW_MID_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AF2),$AF2>PERCENTILE($AF$2:$AF,0.4),$AF2<=PERCENTILE($AF$2:$AF,0.6))`, r, { background: c.MID_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AF2),$AF2>PERCENTILE($AF$2:$AF,0.6),$AF2<=PERCENTILE($AF$2:$AF,0.8))`, r, { background: c.HIGH_MID_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AF2),$AF2>PERCENTILE($AF$2:$AF,0.8))`, r, { background: c.HIGH_BG }));
}

function cfRule_(sheet, formula, ranges, style) {
  let builder = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(formula)
    .setRanges(ranges);
  if (style.background) builder = builder.setBackground(style.background);
  if (style.fontColor) builder = builder.setFontColor(style.fontColor);
  if (style.bold !== undefined) builder = builder.setBold(style.bold);
  if (style.italic !== undefined) builder = builder.setItalic(style.italic);
  return builder.build();
}

function rowRangesExcludingFitAndSalary_(sheet) {
  // C=Fit and F=salary retain their own heatmaps under row stage/source shading.
  return [
    dataRange_(sheet, 1, 2),  // A:B
    dataRange_(sheet, 4, 5),  // D:E
    dataRange_(sheet, 7, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL), // G:V
  ];
}

function dataRange_(sheet, startCol, endCol) {
  return sheet.getRange(2, startCol, sheet.getMaxRows() - 1, endCol - startCol + 1);
}

function colRange_(sheet, col) {
  return sheet.getRange(2, col, sheet.getMaxRows() - 1, 1);
}

function canonicalFitValue_(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value >= 0 && value <= 1) return value;
    if (value > 1 && value <= 100) return value / 100;
    return null;
  }
  const text = String(value || '').trim().replace(',', '.');
  if (!text) return null;
  const percent = text.endsWith('%');
  const n = Number(text.replace('%', '').trim());
  if (!Number.isFinite(n)) return null;
  const result = (percent || n > 1) ? n / 100 : n;
  return result >= 0 && result <= 1 ? result : null;
}

function canonicalDateValue_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const text = String(value || '').trim().replace(/^'+/, '');
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

/** Read-only schema audit used by core auditPartitionedTracker(). */
function auditWorkInterviewsSchema_(ss) {
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  const errors = [];
  const warnings = [];

  WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) {
      errors.push(`Schema: missing storage sheet ${name}`);
      return;
    }
    const lastRow = Math.max(1, sheet.getLastRow());
    if (lastRow >= 2) {
      const rows = lastRow - 1;
      const fitValues = sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT, rows, 1).getValues();
      fitValues.forEach((r, i) => {
        const v = r[0];
        if (v !== '' && v !== null && (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1)) {
          errors.push(`Schema: ${name}!C${i + 2} Fit is not native 0..1 number`);
        }
      });

      WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
        const values = sheet.getRange(2, col, rows, 1).getValues();
        values.forEach((r, i) => {
          const v = r[0];
          if (v !== '' && v !== null && !(v instanceof Date)) {
            errors.push(`Schema: ${name}!${columnLetter_(col)}${i + 2} is not a native Date`);
          }
        });
      });
    }

    // CV must not have URL validation; presentation.gs owns its rich-text state.
    if (sheet.getMaxRows() >= 2) {
      const cvValidations = sheet
        .getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.CV, sheet.getMaxRows() - 1, 1)
        .getDataValidations();
      if (cvValidations.some(row => row[0] !== null)) {
        errors.push(`Schema: ${name}!J2:J has validation; CV column must have none`);
      }
    }

    const filter = sheet.getFilter();
    if (!filter) {
      errors.push(`Schema: ${name} filter missing`);
    } else {
      const r = filter.getRange();
      if (r.getRow() !== 1 || r.getColumn() !== 1 || r.getNumRows() !== sheet.getMaxRows() || r.getNumColumns() !== WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL) {
        errors.push(`Schema: ${name} filter range is ${r.getA1Notation()}, expected A1:V${sheet.getMaxRows()}`);
      }
    }

    const expectedCf = buildCanonicalConditionalFormatRules_(sheet);
    const currentCf = sheet.getConditionalFormatRules();
    if (conditionalRuleSignature_(currentCf) !== conditionalRuleSignature_(expectedCf)) {
      errors.push(`Schema: ${name} conditional formatting drift (${currentCf.length} current vs ${expectedCf.length} canonical rules)`);
    }
  });

  return { errors, warnings };
}

function conditionalRuleSignature_(rules) {
  return rules.map(rule => {
    const ranges = rule.getRanges().map(r => r.getA1Notation()).join('|');
    const condition = rule.getBooleanCondition();
    if (!condition) return `gradient:${ranges}`;
    const type = String(condition.getCriteriaType());
    const values = condition.getCriteriaValues().map(v => String(v)).join('|');
    return `${type}:${values}:${ranges}`;
  }).join('\n');
}

function columnLetter_(column) {
  let n = column;
  let out = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

function assertWorkInterviewsSchemaSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_SHEET_SCHEMA.SPREADSHEET_ID) {
    throw new Error('WorkInterviews schema helper must run only in the canonical WorkInterviews spreadsheet.');
  }
}
