/**
 * WorkInterviews canonical sheet schema / formatter v7.
 *
 * Storage layout:
 *   A:X user-facing vacancy fields
 *   Y   immutable Row ID
 *   Z:AG helper/reserved columns
 *   AH  salary midpoint helper
 *
 * CV contract:
 *   J = CV MD, the only authored CV value in the tracker.
 *   K = CV DOCX and L = CV PDF are sheet-owned array formulas derived from J.
 *   K:L are never direct write targets and never participate in row copy/moves.
 */

const WORKINTERVIEWS_SHEET_SCHEMA = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  FILTER_LAST_COL: 24,
  COL: Object.freeze({
    FIT: 3,
    STAGE: 4,
    APPLY_URL: 9,
    CV_MD: 10,
    CV_DOCX: 11,
    CV_PDF: 12,
    COVER: 13,
    VACANCY_FILE: 14,
    VACANCY_URL: 17,
    POSTED_DATE: 18,
    DATE_FOUND: 19,
    DATE_APPLIED: 20,
    LAST_CONTACT: 21,
    ROW_ID: 25,
    DUPLICATE_HELPER: 27,
    SALARY_MIDPOINT: 34,
  }),
  DATE_COLS: Object.freeze([18, 19, 20, 21]),
  STAGES: Object.freeze([
    'To review', 'Reviewed', 'CV ready', 'Referral', 'Apply', 'Applied',
    'Recruiter screen', 'Assessment', 'Interview', 'Technical interview',
    'Final', 'Offer', 'Rejected', 'Not a fit', 'Withdrawn', 'Ghosted', 'Closed',
  ]),
  COLORS: Object.freeze({
    MUTED_BG: '#EDEDED', MUTED_TEXT: '#666666', ERROR_BG: '#FFBFBF',
    DUPLICATE_BG: '#F4CCCC', DUPLICATE_TEXT: '#FF0000', HISTORY_TEXT: '#137333',
    LOW_BG: '#F4CCCC', LOW_TEXT: '#990000', LOW_MID_BG: '#FCE5CD', LOW_MID_TEXT: '#B45F06',
    MID_BG: '#FFF2CC', MID_TEXT: '#7F6000', HIGH_MID_BG: '#D9EAD3', HIGH_MID_TEXT: '#38761D',
    HIGH_BG: '#B6D7A8', HIGH_TEXT: '#274E13', STAGE_TEXT: '#262626',
    RECRUITER_BG: '#FFF2CC', INTERVIEW_BG: '#EAF4CF', TECH_BG: '#D9EAD3', FINAL_BG: '#D9EAF7',
    YC_BG: '#FFF4CC', LINKEDIN_BG: '#DDEBF7',
  }),
});

function repairWorkInterviewsSchema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  const result = repairWorkInterviewsSchema_(ss);
  const suffix = result.errors.length ? `, ${result.errors.length} repair error(s)` : '';
  ss.toast(`Schema v7 repaired: ${result.sheets} sheet(s), ${result.normalizedValues} typed value(s) normalized${suffix}.`, 'WorkInterviews schema', result.errors.length ? 12 : 8);
  if (result.errors.length) SpreadsheetApp.getUi().alert('WorkInterviews schema repair completed with errors\n\n' + result.errors.slice(0, 20).join('\n'));
}

function repairWorkInterviewsSchema_(ss, sheetNames) {
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  const names = Array.isArray(sheetNames) && sheetNames.length ? sheetNames : WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS;
  let normalizedValues = 0;
  let sheets = 0;
  const errors = [];
  names.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const result = repairWorkInterviewsSheetSchema_(sheet);
    normalizedValues += result.normalizedValues;
    if (result.errors.length) errors.push(...result.errors);
    sheets += 1;
  });
  return { sheets, normalizedValues, errors };
}

function repairWorkInterviewsSheetSchema_(sheet) {
  if (!sheet || !WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.includes(sheet.getName())) return { normalizedValues: 0, errors: [] };
  const errors = [];
  let normalizedValues = 0;
  runWorkInterviewsSchemaRepairStep_(sheet, 'conditional formatting', errors, () => repairWorkInterviewsConditionalFormatting_(sheet));
  runWorkInterviewsSchemaRepairStep_(sheet, 'typed values', errors, () => { normalizedValues = normalizeWorkInterviewsTypedColumns_(sheet); });
  runWorkInterviewsSchemaRepairStep_(sheet, 'number/date formats', errors, () => applyWorkInterviewsNumberFormats_(sheet));
  runWorkInterviewsSchemaRepairStep_(sheet, 'data validation', errors, () => repairWorkInterviewsValidationForSheet_(sheet));
  runWorkInterviewsSchemaRepairStep_(sheet, 'filter', errors, () => repairWorkInterviewsFilter_(sheet));
  return { normalizedValues, errors };
}

function runWorkInterviewsSchemaRepairStep_(sheet, label, errors, fn) {
  try { fn(); } catch (err) {
    const message = `${sheet.getName()}: ${label} repair failed: ${err && err.message ? err.message : err}`;
    errors.push(message);
    console.error(message);
  }
}

function repairWorkInterviewsValidation_(ss) {
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet) repairWorkInterviewsValidationForSheet_(sheet);
  });
}

function normalizeTrackerRowTypesBeforeMove_(sheet, row) {
  if (!sheet || !WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.includes(sheet.getName())) return;
  if (row < 2 || row > sheet.getMaxRows()) throw new Error(`Invalid tracker row: ${row}`);
  const fitCell = sheet.getRange(row, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT);
  const fitRaw = fitCell.getValue();
  if (fitRaw !== '' && fitRaw !== null) {
    const fit = canonicalFitValue_(fitRaw);
    if (fit === null || fit < 0 || fit > 1) throw new Error(`${sheet.getName()}!C${row}: Fit % must resolve to a native 0..1 number before move.`);
    if (fit !== fitRaw) fitCell.setValue(fit);
    fitCell.setNumberFormat('0%');
  }
  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
    const cell = sheet.getRange(row, col);
    const raw = cell.getValue();
    if (raw === '' || raw === null) { cell.setNumberFormat('yyyy-mm-dd'); return; }
    const date = canonicalDateValue_(raw);
    if (!date) throw new Error(`${sheet.getName()}!${columnLetter_(col)}${row}: date must be a native date or ISO YYYY-MM-DD before move.`);
    if (!(raw instanceof Date)) cell.setValue(date);
    cell.setNumberFormat('yyyy-mm-dd');
  });
}

function normalizeWorkInterviewsTypedColumns_(sheet) {
  const lastRow = Math.max(1, sheet.getLastRow());
  if (lastRow < 2) return 0;
  const rowCount = lastRow - 1;
  let changed = 0;
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
      if (date) { sheet.getRange(i + 2, col).setValue(date); changed += 1; }
    });
  });
  return changed;
}

function applyWorkInterviewsNumberFormats_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return;
  sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT, maxRows - 1, 1).setNumberFormat('0%');
  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => sheet.getRange(2, col, maxRows - 1, 1).setNumberFormat('yyyy-mm-dd'));
}

function repairWorkInterviewsValidationForSheet_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return;
  const rows = maxRows - 1;
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COL;
  [c.FIT, c.STAGE, c.APPLY_URL, c.CV_MD, c.CV_DOCX, c.CV_PDF, c.COVER, c.VACANCY_FILE, c.VACANCY_URL, ...WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS]
    .forEach(col => sheet.getRange(2, col, rows, 1).clearDataValidations());

  const fitValidation = SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(C2="",AND(ISNUMBER(C2),C2>=0,C2<=100))').setAllowInvalid(false).setHelpText('Fit % must be numeric. Use 0%..100% (or 0..1).').build();
  sheet.getRange(2, c.FIT, rows, 1).setDataValidation(fitValidation);
  const stageValidation = SpreadsheetApp.newDataValidation().requireValueInList(WORKINTERVIEWS_SHEET_SCHEMA.STAGES, true).setAllowInvalid(false).setHelpText('Choose a canonical lifecycle Stage.').build();
  sheet.getRange(2, c.STAGE, rows, 1).setDataValidation(stageValidation);
  const applyValidation = SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(I2="",REGEXMATCH(I2,"^(https?://|mailto:)"))').setAllowInvalid(false).setHelpText('Apply URL must be HTTP(S) or mailto:.').build();
  sheet.getRange(2, c.APPLY_URL, rows, 1).setDataValidation(applyValidation);
  const cvMdValidation = SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(J2="",REGEXMATCH(J2,"^https?://"))').setAllowInvalid(false).setHelpText('CV MD must be the canonical absolute HTTP(S) Markdown source URL.').build();
  sheet.getRange(2, c.CV_MD, rows, 1).setDataValidation(cvMdValidation);
  const coverValidation = SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(M2="",REGEXMATCH(M2,"^https?://"))').setAllowInvalid(false).setHelpText('Cover must be an absolute HTTP(S) URL.').build();
  sheet.getRange(2, c.COVER, rows, 1).setDataValidation(coverValidation);
  const vacancyFileValidation = SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(N2="",REGEXMATCH(N2,"^https?://"))').setAllowInvalid(false).setHelpText('Vacancy file must be an absolute HTTP(S) URL.').build();
  sheet.getRange(2, c.VACANCY_FILE, rows, 1).setDataValidation(vacancyFileValidation);
  const vacancyValidation = SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=OR(Q2="",REGEXMATCH(Q2,"^https?://"))').setAllowInvalid(false).setHelpText('Vacancy URL must be an absolute HTTP(S) URL.').build();
  sheet.getRange(2, c.VACANCY_URL, rows, 1).setDataValidation(vacancyValidation);
  const dateValidation = SpreadsheetApp.newDataValidation().requireDate().setAllowInvalid(false).setHelpText('Use a real date. Display format is YYYY-MM-DD.').build();
  WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => sheet.getRange(2, col, rows, 1).setDataValidation(dateValidation));
}

function repairWorkInterviewsFilter_(sheet) {
  const maxRows = sheet.getMaxRows();
  const expected = sheet.getRange(1, 1, maxRows, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL);
  const current = sheet.getFilter();
  if (current) {
    const r = current.getRange();
    const matches = r.getRow() === 1 && r.getColumn() === 1 && r.getNumRows() === maxRows && r.getNumColumns() === WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL;
    if (matches) return;
  }
  const criteria = {};
  if (current) {
    const currentWidth = current.getRange().getNumColumns();
    const lastCriteriaCol = Math.min(currentWidth, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL);
    for (let col = 1; col <= lastCriteriaCol; col += 1) {
      const criterion = current.getColumnFilterCriteria(col);
      if (criterion) criteria[col] = criterion.copy().build();
    }
    current.remove();
  }
  expected.createFilter();
  const rebuilt = sheet.getFilter();
  Object.keys(criteria).forEach(key => rebuilt.setColumnFilterCriteria(Number(key), criteria[key]));
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
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,OR($D2="Reviewed",$D2="CV ready"),NOT(ISNUMBER($AH2)))', [colRange_(sheet, 6)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,NOT(ISNUMBER($S2)))', [colRange_(sheet, 19)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,LEN($R2)>0,NOT(ISNUMBER($R2)))', [colRange_(sheet, 18)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,$C2>0.6,NOT(ISNUMBER($AH2)))', [colRange_(sheet, 34)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,$C2>0.6,LEN($J2)=0)', [colRange_(sheet, 10)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,$C2>0.6,LEN($J2)>0,LEN($K2)=0)', [colRange_(sheet, 11)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,$C2>0.6,LEN($J2)>0,LEN($L2)=0)', [colRange_(sheet, 12)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,$C2>0.6,LEN($M2)=0)', [colRange_(sheet, 13)], { background: c.ERROR_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND(LEN($Y2)>0,$C2>0.6,LEN($F2)=0)', [colRange_(sheet, 6)], { background: c.ERROR_BG, bold: true }));

  rules.push(cfRule_(sheet, '=AND($A2<>"",$B2<>"",OR(COUNTIFS(INDIRECT("\'Active\'!$A$2:$A"),$A2,INDIRECT("\'Active\'!$B$2:$B"),$B2)>0,COUNTIFS(INDIRECT("\'Low fit\'!$A$2:$A"),$A2,INDIRECT("\'Low fit\'!$B$2:$B"),$B2)>0,COUNTIFS(INDIRECT("\'Closed\'!$A$2:$A"),$A2,INDIRECT("\'Closed\'!$B$2:$B"),$B2)>0))', [colRange_(sheet, 2)], { fontColor: c.DUPLICATE_TEXT, bold: true }));
  rules.push(cfRule_(sheet, '=$AA2="DUPLICATE"', rowVisible, { background: c.DUPLICATE_BG, bold: true }));
  rules.push(cfRule_(sheet, '=AND($A2<>"",COUNTIFS(INDIRECT("\'Active\'!$A$2:$A"),$A2,INDIRECT("\'Active\'!$T$2:$T"),"<>")+COUNTIFS(INDIRECT("\'Closed\'!$A$2:$A"),$A2,INDIRECT("\'Closed\'!$T$2:$T"),"<>")>0)', [colRange_(sheet, 1)], { fontColor: c.HISTORY_TEXT }));
  rules.push(cfRule_(sheet, '=AND($A2<>"",COUNTIF($A$2:$A,$A2)>1,$D2<>"CV ready",$D2<>"Reviewed")', [colRange_(sheet, 1)], { italic: true }));

  addSalaryHeatmapRules_(rules, sheet);
  addFitHeatmapRules_(rules, sheet);
  rules.push(cfRule_(sheet, '=OR($D2="CV ready",$D2="Reviewed")', rowVisible, { bold: true }));

  const ycCount = '(COUNTIFS(INDIRECT("\'Active\'!$I$2:$I"),"*ycombinator.com/companies/*",INDIRECT("\'Active\'!$T$2:$T"),">="&(TODAY()-7),INDIRECT("\'Active\'!$T$2:$T"),"<"&(TODAY()+1))+COUNTIFS(INDIRECT("\'Closed\'!$I$2:$I"),"*ycombinator.com/companies/*",INDIRECT("\'Closed\'!$T$2:$T"),">="&(TODAY()-7),INDIRECT("\'Closed\'!$T$2:$T"),"<"&(TODAY()+1)))';
  rules.push(cfRule_(sheet, `=AND($AA2<>"DUPLICATE",LEN($Y2)>0,REGEXMATCH(LOWER($I2),"ycombinator\\.com/companies/"),${ycCount}>=5)`, rowShade, { background: c.MUTED_BG, fontColor: c.MUTED_TEXT }));
  rules.push(cfRule_(sheet, `=AND($AA2<>"DUPLICATE",LEN($Y2)>0,REGEXMATCH(LOWER($I2),"ycombinator\\.com/companies/"),${ycCount}<5)`, rowShade, { background: c.YC_BG }));
  rules.push(cfRule_(sheet, '=AND($AA2<>"DUPLICATE",LEN($Y2)>0,REGEXMATCH(LOWER($I2),"linkedin\\.com/jobs/"))', rowShade, { background: c.LINKEDIN_BG }));
  return rules;
}

function buildActiveConditionalFormatRules_(sheet) {
  const c = WORKINTERVIEWS_SHEET_SCHEMA.COLORS;
  const rules = [];
  addSalaryHeatmapRules_(rules, sheet);
  addFitHeatmapRules_(rules, sheet);
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
  return [cfRule_(sheet, '=OR($D2="Rejected",$D2="Withdrawn",$D2="Ghosted",$D2="Closed")', [dataRange_(sheet, 1, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL)], { background: c.MUTED_BG, fontColor: c.MUTED_TEXT })];
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
  const base = 'COUNT($AH$2:$AH)>0';
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AH2),$AH2<=PERCENTILE($AH$2:$AH,0.2))`, r, { background: c.LOW_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AH2),$AH2>PERCENTILE($AH$2:$AH,0.2),$AH2<=PERCENTILE($AH$2:$AH,0.4))`, r, { background: c.LOW_MID_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AH2),$AH2>PERCENTILE($AH$2:$AH,0.4),$AH2<=PERCENTILE($AH$2:$AH,0.6))`, r, { background: c.MID_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AH2),$AH2>PERCENTILE($AH$2:$AH,0.6),$AH2<=PERCENTILE($AH$2:$AH,0.8))`, r, { background: c.HIGH_MID_BG }));
  rules.push(cfRule_(sheet, `=AND(${base},ISNUMBER($AH2),$AH2>PERCENTILE($AH$2:$AH,0.8))`, r, { background: c.HIGH_BG }));
}

function cfRule_(sheet, formula, ranges, style) {
  let builder = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied(formula).setRanges(ranges);
  if (style.background) builder = builder.setBackground(style.background);
  if (style.fontColor) builder = builder.setFontColor(style.fontColor);
  if (style.bold !== undefined) builder = builder.setBold(style.bold);
  if (style.italic !== undefined) builder = builder.setItalic(style.italic);
  return builder.build();
}

function rowRangesExcludingFitAndSalary_(sheet) {
  return [dataRange_(sheet, 1, 2), dataRange_(sheet, 4, 5), dataRange_(sheet, 7, WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL)];
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
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function auditWorkInterviewsSchema_(ss) {
  assertWorkInterviewsSchemaSpreadsheet_(ss);
  const errors = [];
  const warnings = [];
  WORKINTERVIEWS_SHEET_SCHEMA.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) { errors.push(`Schema: missing storage sheet ${name}`); return; }
    const lastRow = Math.max(1, sheet.getLastRow());
    if (lastRow >= 2) {
      const rows = lastRow - 1;
      const fitValues = sheet.getRange(2, WORKINTERVIEWS_SHEET_SCHEMA.COL.FIT, rows, 1).getValues();
      fitValues.forEach((r, i) => {
        const v = r[0];
        if (v !== '' && v !== null && (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1)) errors.push(`Schema: ${name}!C${i + 2} Fit is not native 0..1 number`);
      });
      WORKINTERVIEWS_SHEET_SCHEMA.DATE_COLS.forEach(col => {
        const values = sheet.getRange(2, col, rows, 1).getValues();
        values.forEach((r, i) => {
          const v = r[0];
          if (v !== '' && v !== null && !(v instanceof Date)) errors.push(`Schema: ${name}!${columnLetter_(col)}${i + 2} is not a native Date`);
        });
      });
    }
    if (!/^=VSTACK\("CV DOCX"/i.test(sheet.getRange('K1').getFormula())) errors.push(`Schema: ${name}!K1 CV DOCX array formula missing`);
    if (!/^=VSTACK\("CV PDF"/i.test(sheet.getRange('L1').getFormula())) errors.push(`Schema: ${name}!L1 CV PDF array formula missing`);
    const filter = sheet.getFilter();
    if (!filter) errors.push(`Schema: ${name} filter missing`);
    else {
      const r = filter.getRange();
      if (r.getRow() !== 1 || r.getColumn() !== 1 || r.getNumRows() !== sheet.getMaxRows() || r.getNumColumns() !== WORKINTERVIEWS_SHEET_SCHEMA.FILTER_LAST_COL) errors.push(`Schema: ${name} filter range is ${r.getA1Notation()}, expected A1:X${sheet.getMaxRows()}`);
    }
    const expectedCf = buildCanonicalConditionalFormatRules_(sheet);
    const currentCf = sheet.getConditionalFormatRules();
    if (conditionalRuleSignature_(currentCf) !== conditionalRuleSignature_(expectedCf)) errors.push(`Schema: ${name} conditional formatting drift (${currentCf.length} current vs ${expectedCf.length} canonical rules)`);
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
  if (!ss || ss.getId() !== WORKINTERVIEWS_SHEET_SCHEMA.SPREADSHEET_ID) throw new Error('WorkInterviews schema helper must run only in the canonical WorkInterviews spreadsheet.');
}
