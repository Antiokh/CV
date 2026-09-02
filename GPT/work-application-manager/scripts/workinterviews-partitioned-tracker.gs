/**
 * WorkInterviews tracker automation v6.
 *
 * ONE UI ENTRYPOINT ONLY: simple onEdit(e).
 * Do not create an installable trackerOnEdit trigger. Legacy installable triggers
 * are ignored by trackerOnEdit(e) and removed by installPartitionedTrackerAutomation().
 *
 * Canonical storage:
 *   Queue   -> To review / Reviewed / CV ready
 *   Active  -> Referral / Applied / Recruiter screen / Assessment / Interview /
 *              Technical interview / Final / Offer
 *   Low fit -> Not a fit
 *   Closed  -> Rejected / Withdrawn / Ghosted / Closed
 *
 * Jobs is a read-only aggregate. Activity Log is append-only and keyed by Row ID.
 * Salary Data is the structured salary store keyed by Row ID; F and AF in vacancy
 * sheets are formula-derived and must not be replaced with literals.
 */

const WORKINTERVIEWS_TRACKER_V6 = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  JOBS_VIEW: 'Jobs',
  ACTIVITY_SHEET: 'Activity Log',
  SALARY_SHEET: 'Salary Data',
  COL: Object.freeze({
    COMPANY: 1,
    POSITION: 2,
    FIT: 3,
    STAGE: 4,
    APPLY_URL: 9,
    VACANCY_URL: 15,
    POSTED_DATE: 16,
    DATE_FOUND: 17,
    DATE_APPLIED: 18,
    LAST_CONTACT: 19,
    ROW_ID: 23,
    REFERRAL_CANDIDATES: 24,
    DUPLICATE_HELPER: 25,
    QUEUE_INTEGRITY: 26,
    SALARY_MIDPOINT: 32,
  }),
  LAST_CANONICAL_COL: 23,
  DATE_COLS: Object.freeze([16, 17, 18, 19]),
  URL_COLS: Object.freeze([9, 10, 11, 12, 15]),
  QUEUE_STAGES: Object.freeze(['To review', 'Reviewed', 'CV ready']),
  ACTIVE_STAGES: Object.freeze([
    'Referral', 'Applied', 'Recruiter screen', 'Assessment', 'Interview',
    'Technical interview', 'Final', 'Offer',
  ]),
  CLOSED_STAGES: Object.freeze(['Rejected', 'Withdrawn', 'Ghosted', 'Closed']),
  ALL_STAGE_OPTIONS: Object.freeze([
    'To review', 'Reviewed', 'CV ready', 'Referral', 'Apply', 'Applied',
    'Recruiter screen', 'Assessment', 'Interview', 'Technical interview',
    'Final', 'Offer', 'Rejected', 'Not a fit', 'Withdrawn', 'Ghosted', 'Closed',
  ]),
  IDENTITY_COLUMNS: Object.freeze([1, 2, 9, 15, 23]),
  ACTIVITY_HEADERS: Object.freeze([
    'Event ID', 'Event time', 'Logged at', 'Row ID', 'Company', 'Position',
    'Event type', 'Direction', 'Channel', 'Our mailbox', 'From', 'To', 'Cc',
    'Subject', 'Message ID', 'Thread ID', 'Source key', 'Stage before',
    'Stage after', 'Summary', 'Match basis', 'Match confidence', 'Evidence URL',
    'Raw payload', 'Created by',
  ]),
  SALARY: Object.freeze({ MIN: 2, MAX: 3, CURRENCY: 4, TYPE: 5, FX_EUR: 6 }),
});

/** Direct human-edit entrypoint. This is intentionally a SIMPLE trigger. */
function onEdit(e) {
  if (!e || !e.range || !e.source) return;
  assertTargetSpreadsheet_(e.source);
  if (!normalizeWorkInterviewsEdit_(e)) return;
  routeNormalizedTrackerEdit_(e);
}

/**
 * Compatibility entrypoint for legacy installable triggers.
 * Installable invocations are deliberately ignored to prevent double routing.
 */
function trackerOnEdit(e) {
  if (!e || !e.range || !e.source) return;
  if (e.triggerUid) return;
  assertTargetSpreadsheet_(e.source);
  routeNormalizedTrackerEdit_(e);
}

/**
 * One-time setup/repair. Despite the legacy function name this DOES NOT create
 * an installable trigger. It removes old trackerOnEdit triggers instead.
 */
function installPartitionedTrackerAutomation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertTargetSpreadsheet_(ss);
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'trackerOnEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ensureActivityLogSheet_(ss);
  ensureStageValidation_(ss);
  PropertiesService.getDocumentProperties().setProperty('WORKINTERVIEWS_TRACKER_STORAGE_VERSION', '6.0.0');
  PropertiesService.getDocumentProperties().setProperty('WORKINTERVIEWS_TRACKER_TRIGGER_MODE', 'simple-onEdit');
  ss.toast('Tracker v6 ready: simple onEdit only; legacy trackerOnEdit triggers removed.', 'WorkInterviews', 10);
}

function switchPartitionedTrackerToSimpleOnEdit() {
  installPartitionedTrackerAutomation();
}

function uninstallPartitionedTrackerAutomation() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'trackerOnEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
}

function routeNormalizedTrackerEdit_(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  if (!WORKINTERVIEWS_TRACKER_V6.STORAGE_SHEETS.includes(sheetName)) return;
  if (range.getRow() <= 1) return;
  if (range.getNumRows() !== 1 || range.getNumColumns() !== 1) {
    if (range.getColumn() <= WORKINTERVIEWS_TRACKER_V6.COL.DATE_APPLIED && range.getLastColumn() >= WORKINTERVIEWS_TRACKER_V6.COL.STAGE) {
      e.source.toast('Multi-cell Stage/Date applied edits are not auto-routed. Run auditPartitionedTracker().', 'Tracker routing', 10);
    }
    return;
  }
  const col = range.getColumn();
  if (col === WORKINTERVIEWS_TRACKER_V6.COL.STAGE) return routeStageEdit_(e);
  if (col === WORKINTERVIEWS_TRACKER_V6.COL.DATE_APPLIED) return routeDateAppliedEdit_(e);
  if (sheetName === 'Queue' && WORKINTERVIEWS_TRACKER_V6.IDENTITY_COLUMNS.includes(col)) warnIfQueueDuplicate_(e.source, range.getRow());
}

function routeStageEdit_(e) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    const ss = e.source;
    const sourceSheet = e.range.getSheet();
    const sourceSheetName = sourceSheet.getName();
    const row = e.range.getRow();
    const rowId = getRowId_(sourceSheet, row);
    if (!rowId) return ss.toast('Cannot route a row without immutable Row ID.', 'Tracker routing', 10);
    const identity = getIdentity_(sourceSheet, row);
    const oldStage = String(e.oldValue || '').trim();
    let stage = String(e.value || e.range.getDisplayValue() || '').trim();
    if (!stage) return;
    if (stage === 'Apply') {
      stage = 'Applied';
      e.range.setValue(stage);
    }
    let dateApplied = sourceSheet.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.DATE_APPLIED).getValue();
    const targetBeforeFloor = bucketForStage_(stage);
    if (dateApplied && (targetBeforeFloor === 'Queue' || targetBeforeFloor === 'Low fit')) {
      const restored = restoreSafeStage_(sourceSheetName, oldStage);
      e.range.setValue(restored);
      appendActivityEvent_(ss, {
        rowId, company: identity.company, position: identity.position,
        eventType: 'Stage change blocked', stageBefore: oldStage, stageAfter: restored,
        summary: `Blocked attempted Stage change to ${stage} because Date applied already exists.`,
        matchBasis: 'Bound Apps Script lifecycle guard', matchConfidence: 'Exact',
        evidenceUrl: sheetRangeUrl_(ss, sourceSheet, row),
      });
      ss.toast(`Date applied exists; ${stage} would regress lifecycle. Stage restored to ${restored}.`, 'Tracker routing', 12);
      return;
    }
    let applicationDateCreated = false;
    if (stage === 'Applied' && !dateApplied) {
      const dateCell = sourceSheet.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.DATE_APPLIED);
      dateCell.setValue(new Date()).setNumberFormat('yyyy-mm-dd');
      dateApplied = dateCell.getValue();
      applicationDateCreated = true;
    }
    const targetSheetName = bucketForStage_(stage);
    if (!targetSheetName) return ss.toast(`Unknown Stage: ${stage}. Row was not moved.`, 'Tracker routing', 10);
    if (targetSheetName !== sourceSheetName) moveRecord_(ss, sourceSheet, row, targetSheetName, rowId);
    const loc = findRowIdLocations_(ss, rowId)[0];
    appendActivityEvent_(ss, {
      rowId, company: identity.company, position: identity.position,
      eventType: 'Stage changed', stageBefore: oldStage, stageAfter: stage,
      summary: targetSheetName !== sourceSheetName
        ? `${oldStage || '(blank)'} -> ${stage}; moved ${sourceSheetName} -> ${targetSheetName}${applicationDateCreated ? '; Date applied set automatically' : ''}.`
        : `${oldStage || '(blank)'} -> ${stage}${applicationDateCreated ? '; Date applied set automatically' : ''}.`,
      matchBasis: 'Direct human edit in tracker UI', matchConfidence: 'Exact',
      evidenceUrl: loc ? sheetRangeUrl_(ss, ss.getSheetByName(loc.sheetName), loc.row) : ss.getUrl(),
    });
    if (targetSheetName !== sourceSheetName) ss.toast(`${stage}: moved to ${targetSheetName}.`, 'Tracker routing', 6);
  } finally {
    lock.releaseLock();
  }
}

function routeDateAppliedEdit_(e) {
  if (e.value === undefined || e.value === null || String(e.value).trim() === '') return;
  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);
  try {
    const ss = e.source;
    const sourceSheet = e.range.getSheet();
    const sourceSheetName = sourceSheet.getName();
    const row = e.range.getRow();
    const rowId = getRowId_(sourceSheet, row);
    if (!rowId) return ss.toast('Cannot route a row without immutable Row ID.', 'Tracker routing', 10);
    const identity = getIdentity_(sourceSheet, row);
    const stageCell = sourceSheet.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.STAGE);
    const stage = String(stageCell.getDisplayValue() || '').trim();
    const stageBucket = bucketForStage_(stage);
    if (stageBucket === 'Closed') {
      appendActivityEvent_(ss, {
        rowId, company: identity.company, position: identity.position,
        eventType: 'Date applied updated', stageBefore: stage, stageAfter: stage,
        summary: 'Date applied was edited on a terminal record; lifecycle Stage was preserved.',
        matchBasis: 'Direct human edit in tracker UI', matchConfidence: 'Exact',
        evidenceUrl: sheetRangeUrl_(ss, sourceSheet, row),
      });
      return;
    }
    if (stageBucket === 'Queue' || stage === 'Referral' || stage === 'Not a fit' || !stage) {
      stageCell.setValue('Applied');
      if (sourceSheetName !== 'Active') moveRecord_(ss, sourceSheet, row, 'Active', rowId);
      const loc = findRowIdLocations_(ss, rowId)[0];
      appendActivityEvent_(ss, {
        rowId, company: identity.company, position: identity.position,
        eventType: 'Stage changed', stageBefore: stage, stageAfter: 'Applied',
        summary: `Date applied entered; Stage normalized ${stage || '(blank)'} -> Applied${sourceSheetName !== 'Active' ? `; moved ${sourceSheetName} -> Active` : ''}.`,
        matchBasis: 'Direct human Date applied edit in tracker UI', matchConfidence: 'Exact',
        evidenceUrl: loc ? sheetRangeUrl_(ss, ss.getSheetByName(loc.sheetName), loc.row) : ss.getUrl(),
      });
      ss.toast('Date applied recorded: Stage normalized to Applied.', 'Tracker routing', 7);
      return;
    }
    appendActivityEvent_(ss, {
      rowId, company: identity.company, position: identity.position,
      eventType: 'Date applied updated', stageBefore: stage, stageAfter: stage,
      summary: 'Date applied was edited; current lifecycle Stage was preserved.',
      matchBasis: 'Direct human edit in tracker UI', matchConfidence: 'Exact',
      evidenceUrl: sheetRangeUrl_(ss, sourceSheet, row),
    });
  } finally {
    lock.releaseLock();
  }
}

function moveRecord_(ss, sourceSheet, sourceRow, targetSheetName, rowId) {
  const targetSheet = ss.getSheetByName(targetSheetName);
  if (!targetSheet) throw new Error(`Missing target sheet: ${targetSheetName}`);
  const unexpected = findRowIdLocations_(ss, rowId).filter(loc => !(loc.sheetName === sourceSheet.getName() && loc.row === sourceRow));
  if (unexpected.length) throw new Error(`Row ID ${rowId} already exists outside source row: ${JSON.stringify(unexpected)}`);
  if (sourceSheet.getName() === 'Queue' && typeof ensureQueueCvPresentationBeforeMove_ === 'function') {
    ensureQueueCvPresentationBeforeMove_(sourceSheet, sourceRow);
  }
  let targetRow = nextAppendRow_(targetSheet);
  if (targetRow > targetSheet.getMaxRows()) {
    targetSheet.insertRowsAfter(targetSheet.getMaxRows(), 20);
    targetRow = nextAppendRow_(targetSheet);
  }
  sourceSheet.getRange(sourceRow, 1, 1, WORKINTERVIEWS_TRACKER_V6.LAST_CANONICAL_COL)
    .copyTo(targetSheet.getRange(targetRow, 1, 1, WORKINTERVIEWS_TRACKER_V6.LAST_CANONICAL_COL), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  sourceSheet.getRange(sourceRow, WORKINTERVIEWS_TRACKER_V6.COL.SALARY_MIDPOINT)
    .copyTo(targetSheet.getRange(targetRow, WORKINTERVIEWS_TRACKER_V6.COL.SALARY_MIDPOINT), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  if (targetSheetName !== 'Queue') targetSheet.getRange(targetRow, 24, 1, 8).clearContent().clearNote();
  SpreadsheetApp.flush();
  if (getRowId_(targetSheet, targetRow) !== rowId) {
    targetSheet.getRange(targetRow, 1, 1, 23).clearContent();
    targetSheet.getRange(targetRow, WORKINTERVIEWS_TRACKER_V6.COL.SALARY_MIDPOINT).clearContent();
    throw new Error(`Destination verification failed for Row ID ${rowId}.`);
  }
  sourceSheet.deleteRow(sourceRow);
  SpreadsheetApp.flush();
  const after = findRowIdLocations_(ss, rowId);
  if (after.length !== 1 || after[0].sheetName !== targetSheetName) throw new Error(`Post-move Row ID audit failed for ${rowId}: ${JSON.stringify(after)}`);
}

function appendActivityEvent_(ss, event) {
  const sheet = ensureActivityLogSheet_(ss);
  const sourceKey = String(event.sourceKey || '').trim();
  if (sourceKey && activitySourceKeyExists_(sheet, sourceKey)) return;
  let row = nextActivityRow_(sheet);
  if (row > sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), 200);
    row = nextActivityRow_(sheet);
  }
  const now = new Date();
  sheet.getRange(row, 1, 1, 25).setValues([[
    Utilities.getUuid(), event.eventTime || now, now, event.rowId || '',
    event.company || '', event.position || '', event.eventType || 'Tracker event',
    event.direction || 'Internal', event.channel || 'Google Sheets', event.ourMailbox || '',
    event.from || '', event.to || '', event.cc || '', event.subject || '',
    event.messageId || '', event.threadId || '', sourceKey, event.stageBefore || '',
    event.stageAfter || '', event.summary || '', event.matchBasis || '',
    event.matchConfidence || '', event.evidenceUrl || '', event.rawPayload || '',
    event.createdBy || 'Apps Script',
  ]]);
  sheet.getRange(row, 2, 1, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function ensureActivityLogSheet_(ss) {
  let sheet = ss.getSheetByName(WORKINTERVIEWS_TRACKER_V6.ACTIVITY_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(WORKINTERVIEWS_TRACKER_V6.ACTIVITY_SHEET);
    sheet.setFrozenRows(1);
  }
  const headers = WORKINTERVIEWS_TRACKER_V6.ACTIVITY_HEADERS;
  const current = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  if (current.join('\u0001') !== headers.join('\u0001')) sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  return sheet;
}

function activitySourceKeyExists_(sheet, sourceKey) {
  if (sheet.getMaxRows() < 2) return false;
  return sheet.getRange(2, 17, sheet.getMaxRows() - 1, 1).getDisplayValues().some(row => String(row[0] || '').trim() === sourceKey);
}

function nextActivityRow_(sheet) {
  if (sheet.getMaxRows() < 2) return 2;
  const ids = sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).getDisplayValues();
  for (let i = ids.length - 1; i >= 0; i -= 1) if (String(ids[i][0] || '').trim()) return i + 3;
  return 2;
}

function getIdentity_(sheet, row) {
  return {
    company: String(sheet.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.COMPANY).getDisplayValue() || '').trim(),
    position: String(sheet.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.POSITION).getDisplayValue() || '').trim(),
  };
}

function sheetRangeUrl_(ss, sheet, row) {
  return sheet ? `${ss.getUrl()}#gid=${sheet.getSheetId()}&range=A${row}:AF${row}` : ss.getUrl();
}

function bucketForStage_(stage) {
  if (WORKINTERVIEWS_TRACKER_V6.QUEUE_STAGES.includes(stage)) return 'Queue';
  if (WORKINTERVIEWS_TRACKER_V6.ACTIVE_STAGES.includes(stage)) return 'Active';
  if (stage === 'Not a fit') return 'Low fit';
  if (WORKINTERVIEWS_TRACKER_V6.CLOSED_STAGES.includes(stage)) return 'Closed';
  return null;
}

function restoreSafeStage_(sheetName, oldValue) {
  const oldStage = String(oldValue || '').trim();
  if (oldStage && oldStage !== 'Apply') return oldStage;
  if (sheetName === 'Active') return 'Applied';
  if (sheetName === 'Low fit') return 'Not a fit';
  if (sheetName === 'Closed') return 'Closed';
  return 'Reviewed';
}

function getRowId_(sheet, row) {
  return String(sheet.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.ROW_ID).getDisplayValue() || '').trim();
}

function nextAppendRow_(sheet) {
  if (sheet.getMaxRows() < 2) return 2;
  const ids = sheet.getRange(2, WORKINTERVIEWS_TRACKER_V6.COL.ROW_ID, sheet.getMaxRows() - 1, 1).getDisplayValues();
  for (let i = ids.length - 1; i >= 0; i -= 1) if (String(ids[i][0] || '').trim()) return i + 3;
  return 2;
}

function findRowIdLocations_(ss, rowId) {
  const result = [];
  WORKINTERVIEWS_TRACKER_V6.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;
    sheet.getRange(2, WORKINTERVIEWS_TRACKER_V6.COL.ROW_ID, sheet.getMaxRows() - 1, 1).getDisplayValues().forEach((r, i) => {
      if (String(r[0] || '').trim() === rowId) result.push({ sheetName, row: i + 2 });
    });
  });
  return result;
}

function ensureStageValidation_(ss) {
  const validation = SpreadsheetApp.newDataValidation().requireValueInList(WORKINTERVIEWS_TRACKER_V6.ALL_STAGE_OPTIONS, true).setAllowInvalid(false).build();
  WORKINTERVIEWS_TRACKER_V6.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet && sheet.getMaxRows() >= 2) sheet.getRange(2, WORKINTERVIEWS_TRACKER_V6.COL.STAGE, sheet.getMaxRows() - 1, 1).setDataValidation(validation);
  });
}

function warnIfQueueDuplicate_(ss, row) {
  SpreadsheetApp.flush();
  const queue = ss.getSheetByName('Queue');
  if (!queue || row > queue.getMaxRows()) return;
  const flag = String(queue.getRange(row, WORKINTERVIEWS_TRACKER_V6.COL.DUPLICATE_HELPER).getDisplayValue() || '').trim();
  if (flag === 'DUPLICATE') ss.toast('Queue row matches a record in Active / Low fit / Closed. Do not create a second vacancy record.', 'Duplicate vacancy', 12);
}

function normalizeWorkInterviewsEdit_(e) {
  const sheetName = e.range.getSheet().getName();
  if (WORKINTERVIEWS_TRACKER_V6.STORAGE_SHEETS.includes(sheetName)) return normalizeTrackerRange_(e);
  if (sheetName === WORKINTERVIEWS_TRACKER_V6.SALARY_SHEET) return normalizeSalaryRange_(e);
  return true;
}

function normalizeTrackerRange_(e) {
  const range = e.range;
  if (range.getRow() <= 1) return true;
  const firstCol = range.getColumn();
  const lastCol = range.getLastColumn();
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
    const values = range.getValues();
    let changed = false;
    const invalid = [];
    for (let r = 0; r < values.length; r += 1) {
      for (let c = 0; c < values[r].length; c += 1) {
        const col = firstCol + c;
        const n = normalizeTrackerScalar_(col, values[r][c]);
        if (!n.valid) invalid.push(`${range.getSheet().getRange(range.getRow() + r, col).getA1Notation()}: ${n.message}`);
        else if (n.changed) { values[r][c] = n.value; changed = true; }
      }
    }
    if (changed) range.setValues(values);
    WORKINTERVIEWS_TRACKER_V6.DATE_COLS.forEach(col => {
      if (col >= firstCol && col <= lastCol) range.offset(0, col - firstCol, range.getNumRows(), 1).setNumberFormat('yyyy-mm-dd');
    });
    if (invalid.length) e.source.toast(`Bulk edit contains invalid values; review manually: ${invalid.slice(0, 3).join(' | ')}`, 'Invalid tracker values', 12);
    return true;
  }
  const col = firstCol;
  const n = normalizeTrackerScalar_(col, range.getValue());
  if (!n.valid) {
    restoreEditedCell_(range, e.oldValue);
    e.source.toast(n.message, 'Invalid tracker value', 8);
    return false;
  }
  if (n.changed) range.setValue(n.value);
  if (WORKINTERVIEWS_TRACKER_V6.DATE_COLS.includes(col)) range.setNumberFormat('yyyy-mm-dd');
  if (col === WORKINTERVIEWS_TRACKER_V6.COL.FIT) range.setNumberFormat('0%');
  return true;
}

function normalizeTrackerScalar_(col, value) {
  if (value === '' || value === null) return { valid: true, changed: false, value };
  if (col === WORKINTERVIEWS_TRACKER_V6.COL.FIT) {
    const parsed = parsePercent_(value);
    if (parsed === null || parsed < 0 || parsed > 1) return { valid: false, message: 'Fit % must be 0%..100%.' };
    return { valid: true, changed: parsed !== value, value: parsed };
  }
  if (WORKINTERVIEWS_TRACKER_V6.DATE_COLS.includes(col)) {
    const parsed = parseDate_(value);
    if (!parsed) return { valid: false, message: 'Date must be a real date, preferably YYYY-MM-DD.' };
    return { valid: true, changed: !(value instanceof Date), value: parsed };
  }
  if (WORKINTERVIEWS_TRACKER_V6.URL_COLS.includes(col)) {
    const parsed = normalizeUrl_(value, col === WORKINTERVIEWS_TRACKER_V6.COL.APPLY_URL);
    if (!parsed) return { valid: false, message: 'Link must be absolute HTTP(S)' + (col === WORKINTERVIEWS_TRACKER_V6.COL.APPLY_URL ? ' or mailto:.' : '.') };
    return { valid: true, changed: parsed !== value, value: parsed };
  }
  return { valid: true, changed: false, value };
}

function normalizeSalaryRange_(e) {
  const range = e.range;
  if (range.getRow() <= 1) return true;
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
    const values = range.getValues();
    let changed = false;
    const invalid = [];
    for (let r = 0; r < values.length; r += 1) {
      for (let c = 0; c < values[r].length; c += 1) {
        const col = range.getColumn() + c;
        const n = normalizeSalaryScalar_(col, values[r][c]);
        if (!n.valid) invalid.push(`${range.getSheet().getRange(range.getRow() + r, col).getA1Notation()}: ${n.message}`);
        else if (n.changed) { values[r][c] = n.value; changed = true; }
      }
    }
    if (changed) range.setValues(values);
    if (invalid.length) e.source.toast(`Bulk salary edit contains invalid values: ${invalid.slice(0, 3).join(' | ')}`, 'Invalid salary values', 12);
    return true;
  }
  const col = range.getColumn();
  const n = normalizeSalaryScalar_(col, range.getValue());
  if (!n.valid) {
    restoreEditedCell_(range, e.oldValue);
    e.source.toast(n.message, 'Invalid salary value', 8);
    return false;
  }
  if (n.changed) range.setValue(n.value);
  if (col === WORKINTERVIEWS_TRACKER_V6.SALARY.CURRENCY && n.value === 'EUR') range.getSheet().getRange(range.getRow(), WORKINTERVIEWS_TRACKER_V6.SALARY.FX_EUR).setValue(1);
  return true;
}

function normalizeSalaryScalar_(col, value) {
  const s = WORKINTERVIEWS_TRACKER_V6.SALARY;
  if (value === '' || value === null) return { valid: true, changed: false, value };
  if (col === s.MIN || col === s.MAX || col === s.FX_EUR) {
    const parsed = parseCompactNumber_(value);
    if (parsed === null || parsed < 0 || (col === s.FX_EUR && parsed <= 0)) return { valid: false, message: 'Salary/FX must be positive numeric values; k/M shorthand is allowed.' };
    return { valid: true, changed: parsed !== value, value: parsed };
  }
  if (col === s.CURRENCY) {
    const currency = String(value).trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) return { valid: false, message: 'Currency must be a 3-letter ISO code.' };
    return { valid: true, changed: currency !== value, value: currency };
  }
  if (col === s.TYPE) {
    const type = String(value).trim().toUpperCase();
    if (type !== 'NET' && type !== 'GROSS') return { valid: false, message: 'Salary Type must be NET or GROSS.' };
    return { valid: true, changed: type !== value, value: type };
  }
  return { valid: true, changed: false, value };
}

function parsePercent_(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value >= 0 && value <= 1) return value;
    if (value > 1 && value <= 100) return value / 100;
    return null;
  }
  const text = String(value).trim().replace(',', '.');
  if (!text) return null;
  const hasPercent = text.endsWith('%');
  const number = Number(text.replace('%', '').trim());
  if (!Number.isFinite(number)) return null;
  return (hasPercent || number > 1) ? number / 100 : number;
}

function parseDate_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value).trim().replace(/^'+/, '');
  const m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

function normalizeUrl_(value, allowMailto) {
  let text = String(value).trim();
  if (!text) return '';
  if (allowMailto && /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(text)) return text;
  if (/^www\./i.test(text)) text = 'https://' + text;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text) && /^[^\s]+\.[^\s]+$/.test(text)) text = 'https://' + text;
  return /^https?:\/\/[^\s]+$/i.test(text) ? text : null;
}

function parseCompactNumber_(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value).trim().replace(/\s+/g, '').replace(/,/g, '').toUpperCase();
  const m = text.match(/^([0-9]+(?:\.[0-9]+)?)([KM]?)$/);
  if (!m) return null;
  const base = Number(m[1]);
  if (!Number.isFinite(base)) return null;
  return m[2] === 'K' ? base * 1000 : m[2] === 'M' ? base * 1000000 : base;
}

function restoreEditedCell_(range, oldValue) {
  if (oldValue === undefined) range.clearContent(); else range.setValue(oldValue);
}

/** Full integrity audit. Errors are structural; warnings may be legitimate incomplete workflow state. */
function auditPartitionedTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertTargetSpreadsheet_(ss);
  const errors = [];
  const warnings = [];
  const seen = new Map();
  WORKINTERVIEWS_TRACKER_V6.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;
    const n = sheet.getMaxRows() - 1;
    const values = sheet.getRange(2, 1, n, 26).getDisplayValues();
    const formulasF = sheet.getRange(2, 6, n, 1).getFormulas();
    const formulasAF = sheet.getRange(2, 32, n, 1).getFormulas();
    values.forEach((r, i) => {
      const row = i + 2;
      const rowId = String(r[22] || '').trim();
      if (!rowId) return;
      const stage = String(r[3] || '').trim();
      const expected = bucketForStage_(stage);
      if (!expected || expected !== sheetName) errors.push(`${sheetName}!${row}: Stage ${stage || '(blank)'} belongs in ${expected || 'no valid bucket'}`);
      if (seen.has(rowId)) errors.push(`Duplicate Row ID ${rowId}: ${seen.get(rowId)} and ${sheetName}!${row}`);
      else seen.set(rowId, `${sheetName}!${row}`);
      if (!formulasF[i][0]) errors.push(`${sheetName}!F${row}: computed salary formula missing`);
      if (!formulasAF[i][0]) errors.push(`${sheetName}!AF${row}: salary midpoint formula missing`);
      if (sheetName === 'Queue') {
        const integrity = String(r[25] || '').trim();
        if (!integrity) errors.push(`Queue!Z${row}: integrity formula/result missing`);
        else if (integrity !== 'OK') warnings.push(`Queue!${row}: ${integrity}`);
      }
    });
  });
  const jobs = ss.getSheetByName(WORKINTERVIEWS_TRACKER_V6.JOBS_VIEW);
  if (!jobs || jobs.getRange('A1').getDisplayValue() !== 'Company') errors.push('Jobs aggregate is missing or spill is broken at A1.');
  const salary = ss.getSheetByName(WORKINTERVIEWS_TRACKER_V6.SALARY_SHEET);
  if (!salary) errors.push('Salary Data sheet missing.');
  else if (salary.getLastRow() >= 2) {
    const data = salary.getRange(2, 1, salary.getLastRow() - 1, 10).getDisplayValues();
    const ids = new Map();
    data.forEach((r, i) => {
      const id = String(r[0] || '').trim();
      if (!id) return;
      if (ids.has(id)) errors.push(`Salary Data duplicate Row ID ${id}: rows ${ids.get(id)} and ${i + 2}`);
      else ids.set(id, i + 2);
      const status = String(r[9] || '').trim();
      if (status && status !== 'OK' && status !== 'NO ESTIMATE') warnings.push(`Salary Data!${i + 2}: ${id} -> ${status}`);
    });
  }
  const activity = ss.getSheetByName(WORKINTERVIEWS_TRACKER_V6.ACTIVITY_SHEET);
  if (!activity) errors.push('Activity Log sheet missing.');
  else if (activity.getLastRow() >= 2) {
    const data = activity.getRange(2, 1, activity.getLastRow() - 1, 17).getDisplayValues();
    const sourceKeys = new Map();
    data.forEach((r, i) => {
      const row = i + 2;
      const rowId = String(r[3] || '').trim();
      const sourceKey = String(r[16] || '').trim();
      if (rowId && !seen.has(rowId)) warnings.push(`Activity Log!${row}: orphan Row ID ${rowId}`);
      if (sourceKey) {
        if (sourceKeys.has(sourceKey)) errors.push(`Activity Log duplicate Source key ${sourceKey}: rows ${sourceKeys.get(sourceKey)} and ${row}`);
        else sourceKeys.set(sourceKey, row);
      }
    });
  }
  const dupQueue = countQueueDuplicateFlags_(ss);
  if (dupQueue) errors.push(`Queue duplicate guard flags ${dupQueue} row(s).`);
  const message = [
    `Errors: ${errors.length}`,
    `Warnings: ${warnings.length}`,
    `Unique vacancy Row IDs: ${seen.size}`,
    errors.length ? `\nERRORS\n${errors.slice(0, 20).join('\n')}` : '',
    warnings.length ? `\nWARNINGS\n${warnings.slice(0, 20).join('\n')}` : '',
  ].filter(Boolean).join('\n');
  SpreadsheetApp.getUi().alert(message);
}

function countQueueDuplicateFlags_(ss) {
  const queue = ss.getSheetByName('Queue');
  if (!queue || queue.getMaxRows() < 2) return 0;
  return queue.getRange(2, WORKINTERVIEWS_TRACKER_V6.COL.DUPLICATE_HELPER, queue.getMaxRows() - 1, 1).getDisplayValues().reduce((n, r) => n + (r[0] === 'DUPLICATE' ? 1 : 0), 0);
}

function assertTargetSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_TRACKER_V6.SPREADSHEET_ID) throw new Error('This automation is bound to the WorkInterviews spreadsheet only.');
}
