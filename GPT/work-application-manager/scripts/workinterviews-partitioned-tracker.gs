/**
 * WorkInterviews partitioned tracker automation v5.1.
 *
 * Canonical storage:
 *   Queue   -> To review / Reviewed / CV ready
 *   Active  -> Referral / Applied / Recruiter screen / Assessment / Interview /
 *              Technical interview / Final / Offer
 *   Low fit -> Not a fit
 *   Closed  -> Rejected / Withdrawn / Ghosted / Closed
 *
 * Jobs is a read-only aggregate view.
 * Activity Log is an append-only event timeline keyed by immutable Row ID.
 *
 * Installation in the bound WorkInterviews Apps Script project:
 *   1. Add this file to the bound project.
 *   2. Run installPartitionedTrackerAutomation() once and authorize it.
 *   3. Reload the spreadsheet.
 */

const WORKINTERVIEWS_TRACKER_V5 = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  JOBS_VIEW: 'Jobs',
  ACTIVITY_SHEET: 'Activity Log',
  COL: Object.freeze({
    COMPANY: 1,
    POSITION: 2,
    STAGE: 4,
    APPLY_URL: 9,
    VACANCY_URL: 15,
    DATE_APPLIED: 18,
    ROW_ID: 23,
    REFERRAL_CANDIDATES: 24,
    DUPLICATE_HELPER: 25,
    SALARY_MIDPOINT: 32,
  }),
  LAST_CANONICAL_COL: 23,
  QUEUE_STAGES: Object.freeze(['To review', 'Reviewed', 'CV ready']),
  ACTIVE_STAGES: Object.freeze([
    'Referral',
    'Applied',
    'Recruiter screen',
    'Assessment',
    'Interview',
    'Technical interview',
    'Final',
    'Offer',
  ]),
  CLOSED_STAGES: Object.freeze(['Rejected', 'Withdrawn', 'Ghosted', 'Closed']),
  ALL_STAGE_OPTIONS: Object.freeze([
    'To review',
    'Reviewed',
    'CV ready',
    'Referral',
    'Apply',
    'Applied',
    'Recruiter screen',
    'Assessment',
    'Interview',
    'Technical interview',
    'Final',
    'Offer',
    'Rejected',
    'Not a fit',
    'Withdrawn',
    'Ghosted',
    'Closed',
  ]),
  IDENTITY_COLUMNS: Object.freeze([1, 2, 9, 15, 23]),
  ACTIVITY_HEADERS: Object.freeze([
    'Event ID',
    'Event time',
    'Logged at',
    'Row ID',
    'Company',
    'Position',
    'Event type',
    'Direction',
    'Channel',
    'Our mailbox',
    'From',
    'To',
    'Cc',
    'Subject',
    'Message ID',
    'Thread ID',
    'Source key',
    'Stage before',
    'Stage after',
    'Summary',
    'Match basis',
    'Match confidence',
    'Evidence URL',
    'Raw payload',
    'Created by',
  ]),
});

function installPartitionedTrackerAutomation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertTargetSpreadsheet_(ss);

  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'trackerOnEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('trackerOnEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  ensureActivityLogSheet_(ss);
  ensureStageValidation_(ss);

  PropertiesService.getDocumentProperties().setProperty(
    'WORKINTERVIEWS_TRACKER_STORAGE_VERSION',
    '5.1.0'
  );

  ss.toast('Partitioned tracker automation v5.1 installed.', 'WorkInterviews', 8);
}

function uninstallPartitionedTrackerAutomation() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'trackerOnEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
}

function trackerOnEdit(e) {
  if (!e || !e.range || !e.source) return;
  assertTargetSpreadsheet_(e.source);

  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  if (!WORKINTERVIEWS_TRACKER_V5.STORAGE_SHEETS.includes(sheetName)) return;
  if (range.getRow() <= 1) return;

  if (range.getNumRows() !== 1 || range.getNumColumns() !== 1) {
    if (
      range.getColumn() <= WORKINTERVIEWS_TRACKER_V5.COL.DATE_APPLIED &&
      range.getLastColumn() >= WORKINTERVIEWS_TRACKER_V5.COL.STAGE
    ) {
      e.source.toast(
        'Multi-cell Stage/Date applied edits are not auto-routed. Run auditPartitionedTracker().',
        'Tracker routing',
        10
      );
    }
    return;
  }

  const col = range.getColumn();
  if (col === WORKINTERVIEWS_TRACKER_V5.COL.STAGE) {
    routeStageEdit_(e);
    return;
  }

  if (col === WORKINTERVIEWS_TRACKER_V5.COL.DATE_APPLIED) {
    routeDateAppliedEdit_(e);
    return;
  }

  if (
    sheetName === 'Queue' &&
    WORKINTERVIEWS_TRACKER_V5.IDENTITY_COLUMNS.includes(col)
  ) {
    warnIfQueueDuplicate_(e.source, range.getRow());
  }
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
    if (!rowId) {
      ss.toast('Cannot route a row without immutable Row ID.', 'Tracker routing', 10);
      return;
    }

    const identity = getIdentity_(sourceSheet, row);
    const oldStage = String(e.oldValue || '').trim();
    let stage = String(e.value || e.range.getDisplayValue() || '').trim();
    if (!stage) return;

    if (stage === 'Apply') {
      stage = 'Applied';
      e.range.setValue(stage);
    }

    let dateApplied = sourceSheet
      .getRange(row, WORKINTERVIEWS_TRACKER_V5.COL.DATE_APPLIED)
      .getValue();

    const targetBeforeFloor = bucketForStage_(stage);
    if (
      dateApplied &&
      (targetBeforeFloor === 'Queue' || targetBeforeFloor === 'Low fit')
    ) {
      const restored = restoreSafeStage_(sourceSheetName, oldStage);
      e.range.setValue(restored);
      appendActivityEvent_(ss, {
        rowId,
        company: identity.company,
        position: identity.position,
        eventType: 'Stage change blocked',
        stageBefore: oldStage,
        stageAfter: restored,
        summary: `Blocked attempted Stage change to ${stage} because Date applied already exists.`,
        matchBasis: 'Bound Apps Script lifecycle guard',
        matchConfidence: 'Exact',
        evidenceUrl: sheetRangeUrl_(ss, sourceSheet, row),
      });
      ss.toast(
        `Date applied exists; ${stage} would regress the application lifecycle. Stage restored to ${restored}.`,
        'Tracker routing',
        12
      );
      return;
    }

    let applicationDateCreated = false;
    if (stage === 'Applied' && !dateApplied) {
      const dateCell = sourceSheet.getRange(
        row,
        WORKINTERVIEWS_TRACKER_V5.COL.DATE_APPLIED
      );
      dateCell.setValue(new Date()).setNumberFormat('yyyy-mm-dd');
      dateApplied = dateCell.getValue();
      applicationDateCreated = true;
    }

    const targetSheetName = bucketForStage_(stage);
    if (!targetSheetName) {
      ss.toast(`Unknown Stage: ${stage}. Row was not moved.`, 'Tracker routing', 10);
      return;
    }

    if (targetSheetName !== sourceSheetName) {
      moveRecord_(ss, sourceSheet, row, targetSheetName, rowId);
    }

    appendActivityEvent_(ss, {
      rowId,
      company: identity.company,
      position: identity.position,
      eventType: 'Stage changed',
      stageBefore: oldStage,
      stageAfter: stage,
      summary: targetSheetName !== sourceSheetName
        ? `${oldStage || '(blank)'} -> ${stage}; moved ${sourceSheetName} -> ${targetSheetName}${applicationDateCreated ? '; Date applied set automatically' : ''}.`
        : `${oldStage || '(blank)'} -> ${stage}${applicationDateCreated ? '; Date applied set automatically' : ''}.`,
      matchBasis: 'Direct human edit in tracker UI',
      matchConfidence: 'Exact',
      evidenceUrl: sheetRangeUrl_(ss, ss.getSheetByName(targetSheetName), findRowIdLocations_(ss, rowId)[0].row),
    });

    if (targetSheetName !== sourceSheetName) {
      ss.toast(`${stage}: moved to ${targetSheetName}.`, 'Tracker routing', 6);
    }
  } finally {
    lock.releaseLock();
  }
}

function routeDateAppliedEdit_(e) {
  if (e.value === undefined || e.value === null || String(e.value).trim() === '') {
    return;
  }

  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);

  try {
    const ss = e.source;
    const sourceSheet = e.range.getSheet();
    const sourceSheetName = sourceSheet.getName();
    const row = e.range.getRow();
    const rowId = getRowId_(sourceSheet, row);
    if (!rowId) {
      ss.toast('Cannot route a row without immutable Row ID.', 'Tracker routing', 10);
      return;
    }

    const identity = getIdentity_(sourceSheet, row);
    const stageCell = sourceSheet.getRange(row, WORKINTERVIEWS_TRACKER_V5.COL.STAGE);
    const stage = String(stageCell.getDisplayValue() || '').trim();
    const stageBucket = bucketForStage_(stage);

    if (stageBucket === 'Closed') {
      appendActivityEvent_(ss, {
        rowId,
        company: identity.company,
        position: identity.position,
        eventType: 'Date applied updated',
        stageBefore: stage,
        stageAfter: stage,
        summary: 'Date applied was edited on a terminal record; lifecycle Stage was preserved.',
        matchBasis: 'Direct human edit in tracker UI',
        matchConfidence: 'Exact',
        evidenceUrl: sheetRangeUrl_(ss, sourceSheet, row),
      });
      return;
    }

    if (
      stageBucket === 'Queue' ||
      stage === 'Referral' ||
      stage === 'Not a fit' ||
      !stage
    ) {
      stageCell.setValue('Applied');
      if (sourceSheetName !== 'Active') {
        moveRecord_(ss, sourceSheet, row, 'Active', rowId);
      }
      const location = findRowIdLocations_(ss, rowId)[0];
      appendActivityEvent_(ss, {
        rowId,
        company: identity.company,
        position: identity.position,
        eventType: 'Stage changed',
        stageBefore: stage,
        stageAfter: 'Applied',
        summary: `Date applied entered; Stage normalized ${stage || '(blank)'} -> Applied${sourceSheetName !== 'Active' ? `; moved ${sourceSheetName} -> Active` : ''}.`,
        matchBasis: 'Direct human Date applied edit in tracker UI',
        matchConfidence: 'Exact',
        evidenceUrl: sheetRangeUrl_(ss, ss.getSheetByName(location.sheetName), location.row),
      });
      ss.toast('Date applied recorded: Stage normalized to Applied.', 'Tracker routing', 7);
      return;
    }

    appendActivityEvent_(ss, {
      rowId,
      company: identity.company,
      position: identity.position,
      eventType: 'Date applied updated',
      stageBefore: stage,
      stageAfter: stage,
      summary: 'Date applied was edited; current lifecycle Stage was preserved.',
      matchBasis: 'Direct human edit in tracker UI',
      matchConfidence: 'Exact',
      evidenceUrl: sheetRangeUrl_(ss, sourceSheet, row),
    });
  } finally {
    lock.releaseLock();
  }
}

function moveRecord_(ss, sourceSheet, sourceRow, targetSheetName, rowId) {
  const targetSheet = ss.getSheetByName(targetSheetName);
  if (!targetSheet) throw new Error(`Missing target sheet: ${targetSheetName}`);

  const locations = findRowIdLocations_(ss, rowId);
  const unexpected = locations.filter(
    loc => !(loc.sheetName === sourceSheet.getName() && loc.row === sourceRow)
  );
  if (unexpected.length) {
    throw new Error(
      `Row ID ${rowId} already exists outside source row: ${JSON.stringify(unexpected)}`
    );
  }

  let targetRow = nextAppendRow_(targetSheet);
  if (targetRow > targetSheet.getMaxRows()) {
    targetSheet.insertRowsAfter(targetSheet.getMaxRows(), 20);
    targetRow = nextAppendRow_(targetSheet);
  }

  sourceSheet
    .getRange(sourceRow, 1, 1, WORKINTERVIEWS_TRACKER_V5.LAST_CANONICAL_COL)
    .copyTo(
      targetSheet.getRange(
        targetRow,
        1,
        1,
        WORKINTERVIEWS_TRACKER_V5.LAST_CANONICAL_COL
      ),
      SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
      false
    );

  sourceSheet
    .getRange(sourceRow, WORKINTERVIEWS_TRACKER_V5.COL.SALARY_MIDPOINT)
    .copyTo(
      targetSheet.getRange(targetRow, WORKINTERVIEWS_TRACKER_V5.COL.SALARY_MIDPOINT),
      SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
      false
    );

  if (targetSheetName !== 'Queue') {
    targetSheet.getRange(targetRow, 24, 1, 8).clearContent().clearNote();
  }

  SpreadsheetApp.flush();
  const copiedId = getRowId_(targetSheet, targetRow);
  if (copiedId !== rowId) {
    targetSheet.getRange(targetRow, 1, 1, 23).clearContent();
    targetSheet
      .getRange(targetRow, WORKINTERVIEWS_TRACKER_V5.COL.SALARY_MIDPOINT)
      .clearContent();
    throw new Error(`Destination verification failed for Row ID ${rowId}.`);
  }

  sourceSheet.deleteRow(sourceRow);
  SpreadsheetApp.flush();

  const after = findRowIdLocations_(ss, rowId);
  if (after.length !== 1 || after[0].sheetName !== targetSheetName) {
    throw new Error(
      `Post-move Row ID audit failed for ${rowId}: ${JSON.stringify(after)}`
    );
  }
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
  const values = [[
    Utilities.getUuid(),
    event.eventTime || now,
    now,
    event.rowId || '',
    event.company || '',
    event.position || '',
    event.eventType || 'Tracker event',
    event.direction || 'Internal',
    event.channel || 'Google Sheets',
    event.ourMailbox || '',
    event.from || '',
    event.to || '',
    event.cc || '',
    event.subject || '',
    event.messageId || '',
    event.threadId || '',
    sourceKey,
    event.stageBefore || '',
    event.stageAfter || '',
    event.summary || '',
    event.matchBasis || '',
    event.matchConfidence || '',
    event.evidenceUrl || '',
    event.rawPayload || '',
    event.createdBy || 'Apps Script',
  ]];

  sheet.getRange(row, 1, 1, 25).setValues(values);
  sheet.getRange(row, 2, 1, 2).setNumberFormat('yyyy-mm-dd hh:mm:ss');
}

function ensureActivityLogSheet_(ss) {
  let sheet = ss.getSheetByName(WORKINTERVIEWS_TRACKER_V5.ACTIVITY_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(WORKINTERVIEWS_TRACKER_V5.ACTIVITY_SHEET);
    sheet.setFrozenRows(1);
  }

  const headers = WORKINTERVIEWS_TRACKER_V5.ACTIVITY_HEADERS;
  const current = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  if (current.join('\\u0001') !== headers.join('\\u0001')) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function activitySourceKeyExists_(sheet, sourceKey) {
  if (sheet.getMaxRows() < 2) return false;
  return sheet
    .getRange(2, 17, sheet.getMaxRows() - 1, 1)
    .getDisplayValues()
    .some(row => String(row[0] || '').trim() === sourceKey);
}

function nextActivityRow_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return 2;
  const ids = sheet.getRange(2, 1, maxRows - 1, 1).getDisplayValues();
  for (let i = ids.length - 1; i >= 0; i -= 1) {
    if (String(ids[i][0] || '').trim()) return i + 3;
  }
  return 2;
}

function getIdentity_(sheet, row) {
  return {
    company: String(sheet.getRange(row, WORKINTERVIEWS_TRACKER_V5.COL.COMPANY).getDisplayValue() || '').trim(),
    position: String(sheet.getRange(row, WORKINTERVIEWS_TRACKER_V5.COL.POSITION).getDisplayValue() || '').trim(),
  };
}

function sheetRangeUrl_(ss, sheet, row) {
  if (!sheet) return ss.getUrl();
  return `${ss.getUrl()}#gid=${sheet.getSheetId()}&range=A${row}:AF${row}`;
}

function bucketForStage_(stage) {
  if (WORKINTERVIEWS_TRACKER_V5.QUEUE_STAGES.includes(stage)) return 'Queue';
  if (WORKINTERVIEWS_TRACKER_V5.ACTIVE_STAGES.includes(stage)) return 'Active';
  if (stage === 'Not a fit') return 'Low fit';
  if (WORKINTERVIEWS_TRACKER_V5.CLOSED_STAGES.includes(stage)) return 'Closed';
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
  return String(
    sheet.getRange(row, WORKINTERVIEWS_TRACKER_V5.COL.ROW_ID).getDisplayValue() || ''
  ).trim();
}

function nextAppendRow_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return 2;
  const ids = sheet
    .getRange(2, WORKINTERVIEWS_TRACKER_V5.COL.ROW_ID, maxRows - 1, 1)
    .getDisplayValues();
  for (let i = ids.length - 1; i >= 0; i -= 1) {
    if (String(ids[i][0] || '').trim()) return i + 3;
  }
  return 2;
}

function findRowIdLocations_(ss, rowId) {
  const result = [];
  WORKINTERVIEWS_TRACKER_V5.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;
    const values = sheet
      .getRange(2, WORKINTERVIEWS_TRACKER_V5.COL.ROW_ID, sheet.getMaxRows() - 1, 1)
      .getDisplayValues();
    values.forEach((row, index) => {
      if (String(row[0] || '').trim() === rowId) {
        result.push({ sheetName, row: index + 2 });
      }
    });
  });
  return result;
}

function ensureStageValidation_(ss) {
  const validation = SpreadsheetApp.newDataValidation()
    .requireValueInList(WORKINTERVIEWS_TRACKER_V5.ALL_STAGE_OPTIONS, true)
    .setAllowInvalid(false)
    .build();

  WORKINTERVIEWS_TRACKER_V5.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;
    sheet
      .getRange(2, WORKINTERVIEWS_TRACKER_V5.COL.STAGE, sheet.getMaxRows() - 1, 1)
      .setDataValidation(validation);
  });
}

function warnIfQueueDuplicate_(ss, row) {
  SpreadsheetApp.flush();
  const queue = ss.getSheetByName('Queue');
  if (!queue || row > queue.getMaxRows()) return;
  const flag = String(
    queue
      .getRange(row, WORKINTERVIEWS_TRACKER_V5.COL.DUPLICATE_HELPER)
      .getDisplayValue() || ''
  ).trim();
  if (flag === 'DUPLICATE') {
    ss.toast(
      'Queue row matches a record in Active / Low fit / Closed. Do not create a second vacancy record.',
      'Duplicate vacancy',
      12
    );
  }
}

function auditPartitionedTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertTargetSpreadsheet_(ss);

  const seen = new Map();
  const violations = [];

  WORKINTERVIEWS_TRACKER_V5.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;

    const values = sheet.getRange(2, 1, sheet.getMaxRows() - 1, 23).getDisplayValues();
    values.forEach((row, index) => {
      const rowNumber = index + 2;
      const rowId = String(row[22] || '').trim();
      if (!rowId) return;

      const stage = String(row[3] || '').trim();
      const expected = bucketForStage_(stage);
      if (expected && expected !== sheetName) {
        violations.push(`${sheetName}!${rowNumber}: Stage ${stage} belongs in ${expected}`);
      }
      if (!expected && !(sheetName === 'Queue' && !stage)) {
        violations.push(`${sheetName}!${rowNumber}: unsupported Stage ${stage || '(blank)'}`);
      }

      if (seen.has(rowId)) {
        violations.push(
          `Duplicate Row ID ${rowId}: ${seen.get(rowId)} and ${sheetName}!${rowNumber}`
        );
      } else {
        seen.set(rowId, `${sheetName}!${rowNumber}`);
      }
    });
  });

  const duplicateQueueRows = countQueueDuplicateFlags_(ss);
  if (duplicateQueueRows) {
    violations.push(`Queue duplicate guard flags ${duplicateQueueRows} row(s).`);
  }

  SpreadsheetApp.getUi().alert(
    violations.length
      ? `Partition audit found ${violations.length} issue(s):\
\
${violations.slice(0, 25).join('\
')}`
      : `Partition audit passed. ${seen.size} unique Row IDs; no placement or cross-partition duplicate violations.`
  );
}

function countQueueDuplicateFlags_(ss) {
  const queue = ss.getSheetByName('Queue');
  if (!queue || queue.getMaxRows() < 2) return 0;
  return queue
    .getRange(2, WORKINTERVIEWS_TRACKER_V5.COL.DUPLICATE_HELPER, queue.getMaxRows() - 1, 1)
    .getDisplayValues()
    .reduce((count, row) => count + (row[0] === 'DUPLICATE' ? 1 : 0), 0);
}

function assertTargetSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_TRACKER_V5.SPREADSHEET_ID) {
    throw new Error('This automation is bound to the WorkInterviews spreadsheet only.');
  }
}
