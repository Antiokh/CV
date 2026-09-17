/**
 * WorkInterviews CV-column migration / maintenance v7.
 *
 * IMPORTANT: this file no longer renders Queue J through onOpen/onSelectionChange.
 * The steady-state contract is formula-only:
 *   J = CV MD canonical source URL
 *   K = CV DOCX derived from J
 *   L = CV PDF derived from J
 *
 * `migrateWorkInterviewsCvColumnsV7()` is a ONE-TIME migration from the legacy
 * J=CV rich-text presentation layout. It recovers the Markdown source from old
 * `DOCX PDF` rich text where possible, inserts K:L, installs formulas, repairs
 * Jobs, then hands schema formatting/validation to workinterviews-sheet-schema.gs.
 */

const WORKINTERVIEWS_CV_V7 = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  WRAPPER: 'https://markdown-drive.pages.dev/',
  LEGACY_HEADERS: Object.freeze({ J: 'CV', K: 'Cover', L: 'Vacancy file', W: 'Row ID', AF: 'Salary midpoint EUR/month' }),
  V7_HEADERS: Object.freeze({ J: 'CV MD', K: 'CV DOCX', L: 'CV PDF', M: 'Cover', N: 'Vacancy file', Y: 'Row ID', AH: 'Salary midpoint EUR/month' }),
});

function migrateWorkInterviewsCvColumnsV7() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvV7Spreadsheet_(ss);
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    const states = WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.map(name => inspectCvV7SheetState_(ss.getSheetByName(name)));
    const allV7 = states.every(s => s.state === 'v7');
    const allLegacy = states.every(s => s.state === 'legacy');
    if (!allV7 && !allLegacy) {
      throw new Error('Mixed/unknown storage-sheet schema. Migration aborted before structural writes: ' + JSON.stringify(states));
    }

    if (allLegacy) {
      const recovered = {};
      WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
        const sheet = ss.getSheetByName(name);
        recovered[name] = recoverLegacyCvSources_(sheet);
      });

      WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
        const sheet = ss.getSheetByName(name);
        sheet.insertColumnsAfter(10, 2);
        sheet.getRange('J1').setValue('CV MD');
        sheet.getRange('K1').setValue('CV DOCX');
        sheet.getRange('L1').setValue('CV PDF');
        if (recovered[name].length) sheet.getRange(2, 10, recovered[name].length, 1).setValues(recovered[name].map(v => [v]));
        sheet.setColumnWidth(10, 280);
        sheet.setColumnWidth(11, 80);
        sheet.setColumnWidth(12, 80);
      });

      const jobs = ss.getSheetByName('Jobs');
      if (!jobs) throw new Error('Jobs sheet missing.');
      jobs.getRange('A1').clearContent();
      SpreadsheetApp.flush();
      if (jobs.getMaxColumns() === 32) jobs.insertColumnsAfter(10, 2);
      else if (jobs.getMaxColumns() < 34) jobs.insertColumnsAfter(jobs.getMaxColumns(), 34 - jobs.getMaxColumns());
    }

    repairCvDerivativeFormulas_Internal_(ss);
    repairJobsAggregateV7_(ss);
    if (typeof repairWorkInterviewsSchema_ === 'function') repairWorkInterviewsSchema_(ss);
    PropertiesService.getDocumentProperties().setProperty('WORKINTERVIEWS_CV_COLUMNS_VERSION', '7.0.0');
    PropertiesService.getDocumentProperties().deleteProperty('WORKINTERVIEWS_CV_PRESENTATION_VERSION');
    SpreadsheetApp.flush();

    const audit = auditCvColumnMigrationV7_(ss);
    if (audit.errors.length) {
      SpreadsheetApp.getUi().alert('CV v7 migration finished with errors\n\n' + audit.errors.join('\n'));
      return;
    }
    ss.toast(`CV columns v7 ready. Recovered legacy source rows: ${audit.sourceRows}.`, 'WorkInterviews CV', 10);
  } finally {
    lock.releaseLock();
  }
}

function repairCvDerivativeFormulas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertCvV7Spreadsheet_(ss);
  repairCvDerivativeFormulas_Internal_(ss);
  repairJobsAggregateV7_(ss);
  if (typeof repairWorkInterviewsSchema_ === 'function') repairWorkInterviewsSchema_(ss);
  ss.toast('CV DOCX/PDF formulas repaired from CV MD.', 'WorkInterviews CV', 7);
}

function repairCvDerivativeFormulas_Internal_(ss) {
  WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    const state = inspectCvV7SheetState_(sheet);
    if (state.state !== 'v7') throw new Error(`${name} is not on the v7 CV schema: ${JSON.stringify(state.headers)}`);
    if (sheet.getMaxRows() > 1) sheet.getRange(2, 11, sheet.getMaxRows() - 1, 2).clearContent().clearNote();
    sheet.getRange('K1').setFormula(cvDerivativeFormula_('DOCX', 'docx'));
    sheet.getRange('L1').setFormula(cvDerivativeFormula_('PDF', 'pdf'));
  });
  SpreadsheetApp.flush();
}

function cvDerivativeFormula_(label, exportFormat) {
  return `=VSTACK("CV ${label}",MAP(J2:J,LAMBDA(src,IF(src="","",LET(clean,REGEXREPLACE(src,"(?i)#markdown$",""),valid,OR(REGEXMATCH(src,"(?i)#markdown$"),REGEXMATCH(src,"(?i)^https?://[^?#]+\\.md(?:[?#].*)?$"),REGEXMATCH(src,"(?i)^https://docs\\.google\\.com/document/d/[^/?#]+/export\\?[^#]*format=txt")),IF(valid,HYPERLINK("https://markdown-drive.pages.dev/?file="&ENCODEURL(clean)&"&export=${exportFormat}","${label}"),""))))))`;
}

function repairJobsAggregateV7_(ss) {
  const jobs = ss.getSheetByName('Jobs');
  if (!jobs) throw new Error('Jobs sheet missing.');
  if (jobs.getMaxColumns() < 34) jobs.insertColumnsAfter(jobs.getMaxColumns(), 34 - jobs.getMaxColumns());
  jobs.getRange('A1').clearContent();
  SpreadsheetApp.flush();
  jobs.getRange('A1').setFormula('=LET(data,VSTACK(Queue!A2:AH,Active!A2:AH,\'Low fit\'!A2:AH,Closed!A2:AH),VSTACK(Queue!A1:AH1,FILTER(data,CHOOSECOLS(data,25)<>"")))');
}

function inspectCvV7SheetState_(sheet) {
  if (!sheet) return { name: '(missing)', state: 'missing', headers: [] };
  const max = sheet.getMaxColumns();
  const headers = sheet.getRange(1, 1, 1, max).getDisplayValues()[0];
  const h = i => String(headers[i - 1] || '').trim();
  const legacy = h(10) === 'CV' && h(11) === 'Cover' && h(12) === 'Vacancy file' && h(23) === 'Row ID';
  const v7 = h(10) === 'CV MD' && h(11) === 'CV DOCX' && h(12) === 'CV PDF' && h(13) === 'Cover' && h(14) === 'Vacancy file' && h(25) === 'Row ID';
  return { name: sheet.getName(), state: v7 ? 'v7' : legacy ? 'legacy' : 'unknown', headers: [h(10), h(11), h(12), h(13), h(14), h(23), h(25)] };
}

function recoverLegacyCvSources_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return [];
  const range = sheet.getRange(2, 10, maxRows - 1, 1);
  const displays = range.getDisplayValues();
  const rich = range.getRichTextValues();
  const formulas = range.getFormulas();
  const result = [];
  for (let i = 0; i < displays.length; i += 1) {
    if (formulas[i][0]) {
      result.push(String(displays[i][0] || '').trim());
      continue;
    }
    result.push(recoverLegacyCvSourceCell_(String(displays[i][0] || '').trim(), rich[i][0]));
  }
  return result;
}

function recoverLegacyCvSourceCell_(display, richText) {
  if (!display && !richText) return '';
  const urls = [];
  if (richText) {
    const whole = richText.getLinkUrl();
    if (whole) urls.push(whole);
    const runs = richText.getRuns ? richText.getRuns() : [];
    runs.forEach(run => {
      const url = run.getLinkUrl();
      if (url && !urls.includes(url)) urls.push(url);
    });
  }
  for (const url of urls) {
    const recovered = sourceFromMarkdownDriveUrl_(url);
    if (recovered) return markOpaqueMarkdownSource_(recovered);
  }
  if (/^https?:\/\/\S+$/i.test(display)) return display;
  for (const url of urls) if (/^https?:\/\/\S+$/i.test(url)) return url;
  return display;
}

function sourceFromMarkdownDriveUrl_(url) {
  const text = String(url || '').trim();
  if (!text || text.indexOf('markdown-drive.pages.dev') === -1) return '';
  const match = text.match(/[?&]file=([^&]+)/i);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]).replace(/#markdown$/i, '');
  } catch (err) {
    return '';
  }
}

function markOpaqueMarkdownSource_(source) {
  const text = String(source || '').trim().replace(/#markdown$/i, '');
  if (!text) return '';
  if (/^https?:\/\/[^?#]+\.md(?:[?#].*)?$/i.test(text)) return text;
  if (/^https:\/\/docs\.google\.com\/document\/d\/[^/?#]+\/export\?[^#]*format=txt/i.test(text)) return text;
  return text + '#markdown';
}

function auditCvColumnMigrationV7_(ss) {
  const errors = [];
  let sourceRows = 0;
  WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    const state = inspectCvV7SheetState_(sheet);
    if (state.state !== 'v7') errors.push(`${name}: expected CV MD / CV DOCX / CV PDF schema`);
    if (!/^=VSTACK\("CV DOCX"/i.test(sheet.getRange('K1').getFormula())) errors.push(`${name}!K1 formula missing`);
    if (!/^=VSTACK\("CV PDF"/i.test(sheet.getRange('L1').getFormula())) errors.push(`${name}!L1 formula missing`);
    if (sheet.getMaxRows() > 1) sourceRows += sheet.getRange(2, 10, sheet.getMaxRows() - 1, 1).getDisplayValues().reduce((n, r) => n + (String(r[0] || '').trim() ? 1 : 0), 0);
  });
  const jobs = ss.getSheetByName('Jobs');
  if (!jobs || !/Queue!A2:AH/.test(jobs.getRange('A1').getFormula())) errors.push('Jobs!A1 v7 aggregate formula missing');
  return { errors, sourceRows };
}

function assertCvV7Spreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_CV_V7.SPREADSHEET_ID) throw new Error('CV v7 migration must run only in the canonical WorkInterviews spreadsheet.');
}
