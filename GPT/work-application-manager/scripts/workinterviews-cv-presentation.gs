/**
 * WorkInterviews CV-column migration / maintenance v7.
 *
 * Steady-state contract:
 *   J = CV MD canonical source URL
 *   K = CV DOCX, independent per-row formula derived from J
 *   L = CV PDF, independent per-row formula derived from J
 *
 * Preferred J form for Drive-hosted CVs is a real text/markdown file:
 *   https://drive.google.com/file/d/<ID>/view#markdown
 * K/L normalize Drive file URLs to that form, URL-encode the complete source
 * including #markdown, and expose short HYPERLINK titles (`DOCX` / `PDF`).
 * Native Google Docs `/document/d/...` links are NOT valid markdown-drive
 * source URLs and intentionally produce blank K/L until J is repaired.
 *
 * K/L are formulas in every data row, not manual URLs and not spill/array results.
 *
 * `migrateWorkInterviewsCvColumnsV7()` is a ONE-TIME migration from the legacy
 * J=CV rich-text presentation layout.
 * `repairCvDerivativeFormulas()` is safe to run repeatedly and reconstructs
 * every K/L formula from J.
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
        recovered[name] = recoverLegacyCvSources_(ss.getSheetByName(name));
      });

      WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
        const sheet = ss.getSheetByName(name);
        sheet.insertColumnsAfter(10, 2);
        sheet.getRange('J1').setValue('CV MD');
        sheet.getRange('K1').setValue('CV DOCX');
        sheet.getRange('L1').setValue('CV PDF');
        if (recovered[name].length) {
          sheet.getRange(2, 10, recovered[name].length, 1).setValues(recovered[name].map(v => [v]));
        }
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
  const audit = auditCvColumnMigrationV7_(ss);
  if (audit.errors.length) throw new Error('CV derivative repair failed: ' + audit.errors.join(' | '));
  ss.toast('Per-row CV DOCX/PDF formulas repaired from CV MD.', 'WorkInterviews CV', 7);
}

function repairCvDerivativeFormulas_Internal_(ss) {
  WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    const state = inspectCvV7SheetState_(sheet);
    if (state.state !== 'v7') throw new Error(`${name} is not on the v7 CV schema: ${JSON.stringify(state.headers)}`);

    const dataRows = Math.max(0, sheet.getMaxRows() - 1);
    sheet.getRange('K1').setValue('CV DOCX');
    sheet.getRange('L1').setValue('CV PDF');

    if (dataRows > 0) {
      sheet.getRange(2, 11, dataRows, 2).clearContent().clearNote();
      sheet.getRange('K2').setFormula(cvDerivativeRowFormula_('docx'));
      sheet.getRange('L2').setFormula(cvDerivativeRowFormula_('pdf'));
      if (dataRows > 1) {
        sheet.getRange(2, 11, dataRows, 1).fillDown();
        sheet.getRange(2, 12, dataRows, 1).fillDown();
      }
    }

    sheet.setColumnWidth(11, 80);
    sheet.setColumnWidth(12, 80);
  });
  SpreadsheetApp.flush();
}

function cvDerivativeRowFormula_(exportFormat) {
  const label = String(exportFormat || '').toUpperCase();
  const driveSource = `"https://drive.google.com/file/d/"&REGEXEXTRACT(J2,"(?i)/file/d/([^/?#]+)")&"/view#markdown"`;
  const driveUrl = `"https://markdown-drive.pages.dev/?file="&ENCODEURL(${driveSource})&"&export=${exportFormat}"`;
  const genericUrl = `"https://markdown-drive.pages.dev/?file="&ENCODEURL(J2)&"&export=${exportFormat}"`;
  return `=IF(J2="","",IF(REGEXMATCH(J2,"(?i)^https://drive\\.google\\.com/file/d/[^/?#]+/"),HYPERLINK(${driveUrl},"${label}"),IF(AND(NOT(REGEXMATCH(J2,"(?i)^https://docs\\.google\\.com/")),OR(REGEXMATCH(J2,"(?i)^https?://[^?#]+\\.md(?:[?#].*)?$"),REGEXMATCH(J2,"(?i)#markdown$"))),HYPERLINK(${genericUrl},"${label}"),"")))`;
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
      result.push(normalizeCvMarkdownSource_(String(displays[i][0] || '').trim()));
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
    if (recovered) return normalizeCvMarkdownSource_(recovered);
  }
  if (/^https?:\/\/\S+$/i.test(display)) return normalizeCvMarkdownSource_(display);
  for (const url of urls) if (/^https?:\/\/\S+$/i.test(url)) return normalizeCvMarkdownSource_(url);
  return display;
}

function sourceFromMarkdownDriveUrl_(url) {
  const text = String(url || '').trim();
  if (!text || text.indexOf('markdown-drive.pages.dev') === -1) return '';
  const match = text.match(/[?&]file=([^&]+)/i);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch (err) {
    return '';
  }
}

function normalizeCvMarkdownSource_(source) {
  const text = String(source || '').trim();
  if (!text) return '';
  const drive = text.match(/^https:\/\/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/view#markdown`;
  return text;
}

function auditCvColumnMigrationV7_(ss) {
  const errors = [];
  let sourceRows = 0;
  WORKINTERVIEWS_CV_V7.STORAGE_SHEETS.forEach(name => {
    const sheet = ss.getSheetByName(name);
    const state = inspectCvV7SheetState_(sheet);
    if (state.state !== 'v7') errors.push(`${name}: expected CV MD / CV DOCX / CV PDF schema`);
    if (String(sheet.getRange('K1').getDisplayValue()).trim() !== 'CV DOCX') errors.push(`${name}!K1 header missing`);
    if (String(sheet.getRange('L1').getDisplayValue()).trim() !== 'CV PDF') errors.push(`${name}!L1 header missing`);
    if (sheet.getMaxRows() > 1) {
      const k2 = sheet.getRange('K2').getFormula();
      const l2 = sheet.getRange('L2').getFormula();
      if (!/^=IF\(J2=/i.test(k2) || !/&export=docx/i.test(k2) || !/"DOCX"/i.test(k2) || !/view#markdown/i.test(k2)) errors.push(`${name}!K2 titled canonical Drive formula missing`);
      if (!/^=IF\(J2=/i.test(l2) || !/&export=pdf/i.test(l2) || !/"PDF"/i.test(l2) || !/view#markdown/i.test(l2)) errors.push(`${name}!L2 titled canonical Drive formula missing`);
      sourceRows += sheet.getRange(2, 10, sheet.getMaxRows() - 1, 1).getDisplayValues().reduce((n, r) => n + (String(r[0] || '').trim() ? 1 : 0), 0);
    }
    if (sheet.getMaxRows() > 2) {
      const k3 = sheet.getRange('K3').getFormula();
      const l3 = sheet.getRange('L3').getFormula();
      if (k3 && !/J3/.test(k3)) errors.push(`${name}!K3 relative row formula broken`);
      if (l3 && !/J3/.test(l3)) errors.push(`${name}!L3 relative row formula broken`);
    }
  });
  const jobs = ss.getSheetByName('Jobs');
  if (!jobs || !/Queue!A2:AH/.test(jobs.getRange('A1').getFormula())) errors.push('Jobs!A1 v7 aggregate formula missing');
  return { errors, sourceRows };
}

function assertCvV7Spreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_CV_V7.SPREADSHEET_ID) {
    throw new Error('CV v7 migration must run only in the canonical WorkInterviews spreadsheet.');
  }
}
