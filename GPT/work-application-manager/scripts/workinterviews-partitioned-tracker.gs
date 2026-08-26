/**
 * WorkInterviews partitioned tracker automation v4.
 *
 * Canonical storage:
 *   Queue   -> To review / Reviewed / CV ready
 *   Active  -> Referral / Applied / Recruiter screen / Interview /
 *              Technical interview / Final / Offer
 *   Low fit -> Not a fit
 *   Closed  -> Rejected / Withdrawn / Ghosted / Closed
 *
 * Jobs is a read-only aggregate view and must never be written by this script.
 *
 * Installation in the bound WorkInterviews Apps Script project:
 *   1. Add this file to the bound project.
 *   2. Run installPartitionedTrackerAutomation() once and authorize it.
 *   3. Reload the spreadsheet.
 *
 * The installable edit trigger deliberately uses trackerOnEdit rather than the
 * simple onEdit name so it can coexist with legacy project files during rollout.
 */

const WORKINTERVIEWS_TRACKER_V4 = Object.freeze({
  SPREADSHEET_ID: '1k-Zbz7LMZJJcWfMp41yC-7mUaL_UI9__Bwy1SpPLbao',
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  JOBS_VIEW: 'Jobs',
  COL: Object.freeze({
    COMPANY: 1,
    POSITION: 2,
    STAGE: 4,
    APPLY_URL: 9,
    VACANCY_URL: 15,
    DATE_APPLIED: 18,
    ROW_ID: 23,
    DUPLICATE_HELPER: 24,
    SALARY_MIDPOINT: 32,
  }),
  LAST_CANONICAL_COL: 23, // A:W. X:AE are presentation/helper columns.
  LAST_PHYSICAL_COL: 32,  // AF is the salary midpoint helper.
  QUEUE_STAGES: Object.freeze(['To review', 'Reviewed', 'CV ready']),
  ACTIVE_STAGES: Object.freeze([
    'Referral',
    'Applied',
    'Recruiter screen',
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
    'Apply',          // UI command; normalized immediately to durable Applied.
    'Applied',
    'Recruiter screen',
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
});

/** Install the v4 edit trigger and normalize Stage dropdowns. */
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

  ensureStageValidation_(ss);
  PropertiesService.getDocumentProperties().setProperty(
    'WORKINTERVIEWS_TRACKER_STORAGE_VERSION',
    '4.0.0'
  );

  ss.toast(
    'Partitioned tracker automation v4 installed.',
    'WorkInterviews',
    8
  );
}

/** Remove only the trigger owned by this v4 script. */
function uninstallPartitionedTrackerAutomation() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'trackerOnEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
}

/**
 * Installable edit-trigger entry point.
 * API writes do not fire this trigger; API/agent writers must perform the same
 * routing explicitly according to tracker-storage-v4.md and Agent Instructions.
 */
function trackerOnEdit(e) {
  if (!e || !e.range || !e.source) return;
  assertTargetSpreadsheet_(e.source);

  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  if (!WORKINTERVIEWS_TRACKER_V4.STORAGE_SHEETS.includes(sheetName)) return;
  if (range.getRow() <= 1) return;

  // Moving rows while handling a multi-row paste is ambiguous. Leave the data
  // untouched and force a visible audit rather than guessing.
  if (range.getNumRows() !== 1 || range.getNumColumns() !== 1) {
    if (
      range.getColumn() <= WORKINTERVIEWS_TRACKER_V4.COL.DATE_APPLIED &&
      range.getLastColumn() >= WORKINTERVIEWS_TRACKER_V4.COL.STAGE
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
  if (col === WORKINTERVIEWS_TRACKER_V4.COL.STAGE) {
    routeStageEdit_(e);
    return;
  }

  if (col === WORKINTERVIEWS_TRACKER_V4.COL.DATE_APPLIED) {
    routeDateAppliedEdit_(e);
    return;
  }

  if (
    sheetName === 'Queue' &&
    WORKINTERVIEWS_TRACKER_V4.IDENTITY_COLUMNS.includes(col)
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
    const row = e.range.getRow();
    const rowId = getRowId_(sourceSheet, row);
    if (!rowId) {
      ss.toast('Cannot route a row without immutable Row ID.', 'Tracker routing', 10);
      return;
    }

    let stage = String(e.value || e.range.getDisplayValue() || '').trim();
    if (!stage) return;

    // Apply is a UI action, not a persistent lifecycle state.
    if (stage === 'Apply') {
      stage = 'Applied';
      e.range.setValue(stage);
    }

    let dateApplied = sourceSheet
      .getRange(row, WORKINTERVIEWS_TRACKER_V4.COL.DATE_APPLIED)
      .getValue();

    // A real application date is a hard floor. Do not allow a UI edit to send
    // an already submitted application back to Queue or Low fit.
    const targetBeforeFloor = bucketForStage_(stage);
    if (
      dateApplied &&
      (targetBeforeFloor === 'Queue' || targetBeforeFloor === 'Low fit')
    ) {
      const restored = restoreSafeStage_(sourceSheet.getName(), e.oldValue);
      e.range.setValue(restored);
      ss.toast(
        `Date applied exists; ${stage} would regress the application lifecycle. Stage restored to ${restored}.`,
        'Tracker routing',
        12
      );
      return;
    }

    if (stage === 'Applied' && !dateApplied) {
      const dateCell = sourceSheet.getRange(
        row,
        WORKINTERVIEWS_TRACKER_V4.COL.DATE_APPLIED
      );
      dateCell.setValue(new Date()).setNumberFormat('yyyy-mm-dd');
      dateApplied = dateCell.getValue();
    }

    const targetSheetName = bucketForStage_(stage);
    if (!targetSheetName) {
      ss.toast(`Unknown Stage: ${stage}. Row was not moved.`, 'Tracker routing', 10);
      return;
    }

    if (targetSheetName !== sourceSheet.getName()) {
      moveRecord_(ss, sourceSheet, row, targetSheetName, rowId);
      ss.toast(
        `${stage}: moved to ${targetSheetName}.`,
        'Tracker routing',
        6
      );
    }
  } finally {
    lock.releaseLock();
  }
}

function routeDateAppliedEdit_(e) {
  // Clearing a date does not imply any Stage regression. A nonblank value is
  // explicit submission evidence and can normalize a pre-application row.
  if (e.value === undefined || e.value === null || String(e.value).trim() === '') {
    return;
  }

  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);

  try {
    const ss = e.source;
    const sourceSheet = e.range.getSheet();
    const row = e.range.getRow();
    const rowId = getRowId_(sourceSheet, row);
    if (!rowId) {
      ss.toast('Cannot route a row without immutable Row ID.', 'Tracker routing', 10);
      return;
    }

    const stageCell = sourceSheet.getRange(row, WORKINTERVIEWS_TRACKER_V4.COL.STAGE);
    const stage = String(stageCell.getDisplayValue() || '').trim();
    const stageBucket = bucketForStage_(stage);

    // Terminal rows may legitimately retain Date applied as history.
    if (stageBucket === 'Closed') return;

    if (
      stageBucket === 'Queue' ||
      stage === 'Referral' ||
      stage === 'Not a fit' ||
      !stage
    ) {
      stageCell.setValue('Applied');
      if (sourceSheet.getName() !== 'Active') {
        moveRecord_(ss, sourceSheet, row, 'Active', rowId);
      }
      ss.toast('Date applied recorded: Stage normalized to Applied.', 'Tracker routing', 7);
    }
  } finally {
    lock.releaseLock();
  }
}

/**
 * Move one complete canonical record while preserving the same Row ID.
 * Destination is written and verified before source deletion.
 */
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

  const targetRow = nextAppendRow_(targetSheet);
  if (targetRow > targetSheet.getMaxRows()) {
    targetSheet.insertRowsAfter(targetSheet.getMaxRows(), 20);
  }

  // Copy canonical A:W with metadata/notes/validation, plus AF salary midpoint.
  sourceSheet
    .getRange(sourceRow, 1, 1, WORKINTERVIEWS_TRACKER_V4.LAST_CANONICAL_COL)
    .copyTo(
      targetSheet.getRange(
        targetRow,
        1,
        1,
        WORKINTERVIEWS_TRACKER_V4.LAST_CANONICAL_COL
      ),
      SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
      false
    );

  sourceSheet
    .getRange(sourceRow, WORKINTERVIEWS_TRACKER_V4.COL.SALARY_MIDPOINT)
    .copyTo(
      targetSheet.getRange(targetRow, WORKINTERVIEWS_TRACKER_V4.COL.SALARY_MIDPOINT),
      SpreadsheetApp.CopyPasteType.PASTE_NORMAL,
      false
    );

  // X:AE are per-sheet presentation/helper space and never move with the record.
  if (targetSheetName !== 'Queue') {
    targetSheet.getRange(targetRow, 24, 1, 8).clearContent().clearNote();
  }

  SpreadsheetApp.flush();
  const copiedId = getRowId_(targetSheet, targetRow);
  if (copiedId !== rowId) {
    targetSheet.getRange(targetRow, 1, 1, 23).clearContent();
    targetSheet
      .getRange(targetRow, WORKINTERVIEWS_TRACKER_V4.COL.SALARY_MIDPOINT)
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

function bucketForStage_(stage) {
  if (WORKINTERVIEWS_TRACKER_V4.QUEUE_STAGES.includes(stage)) return 'Queue';
  if (WORKINTERVIEWS_TRACKER_V4.ACTIVE_STAGES.includes(stage)) return 'Active';
  if (stage === 'Not a fit') return 'Low fit';
  if (WORKINTERVIEWS_TRACKER_V4.CLOSED_STAGES.includes(stage)) return 'Closed';
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
    sheet.getRange(row, WORKINTERVIEWS_TRACKER_V4.COL.ROW_ID).getDisplayValue() || ''
  ).trim();
}

function nextAppendRow_(sheet) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < 2) return 2;

  const ids = sheet
    .getRange(2, WORKINTERVIEWS_TRACKER_V4.COL.ROW_ID, maxRows - 1, 1)
    .getDisplayValues();

  for (let i = ids.length - 1; i >= 0; i -= 1) {
    if (String(ids[i][0] || '').trim()) return i + 3;
  }
  return 2;
}

function findRowIdLocations_(ss, rowId) {
  const result = [];
  WORKINTERVIEWS_TRACKER_V4.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;

    const values = sheet
      .getRange(2, WORKINTERVIEWS_TRACKER_V4.COL.ROW_ID, sheet.getMaxRows() - 1, 1)
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
    .requireValueInList(WORKINTERVIEWS_TRACKER_V4.ALL_STAGE_OPTIONS, true)
    .setAllowInvalid(false)
    .build();

  WORKINTERVIEWS_TRACKER_V4.STORAGE_SHEETS.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getMaxRows() < 2) return;
    sheet
      .getRange(2, WORKINTERVIEWS_TRACKER_V4.COL.STAGE, sheet.getMaxRows() - 1, 1)
      .setDataValidation(validation);
  });
}

function warnIfQueueDuplicate_(ss, row) {
  SpreadsheetApp.flush();
  const queue = ss.getSheetByName('Queue');
  if (!queue || row > queue.getMaxRows()) return;

  const flag = String(
    queue
      .getRange(row, WORKINTERVIEWS_TRACKER_V4.COL.DUPLICATE_HELPER)
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

/** Manual integrity audit. Safe: read-only. */
function auditPartitionedTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertTargetSpreadsheet_(ss);

  const seen = new Map();
  const violations = [];

  WORKINTERVIEWS_TRACKER_V4.STORAGE_SHEETS.forEach(sheetName => {
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
      ? `Partition audit found ${violations.length} issue(s):\n\n${violations.slice(0, 25).join('\n')}`
      : `Partition audit passed. ${seen.size} unique Row IDs; no placement or cross-partition duplicate violations.`
  );
}

function countQueueDuplicateFlags_(ss) {
  const queue = ss.getSheetByName('Queue');
  if (!queue || queue.getMaxRows() < 2) return 0;
  return queue
    .getRange(2, WORKINTERVIEWS_TRACKER_V4.COL.DUPLICATE_HELPER, queue.getMaxRows() - 1, 1)
    .getDisplayValues()
    .reduce((count, row) => count + (row[0] === 'DUPLICATE' ? 1 : 0), 0);
}

function assertTargetSpreadsheet_(ss) {
  if (!ss || ss.getId() !== WORKINTERVIEWS_TRACKER_V4.SPREADSHEET_ID) {
    throw new Error('This automation is bound to the WorkInterviews spreadsheet only.');
  }
}
