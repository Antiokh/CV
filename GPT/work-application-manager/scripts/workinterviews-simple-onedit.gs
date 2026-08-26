/**
 * WorkInterviews simple edit entrypoint.
 *
 * This wrapper intentionally avoids a separate installable onEdit trigger.
 * In a bound Google Sheets Apps Script project, the reserved onEdit(e) name
 * runs automatically for direct human edits in the spreadsheet UI.
 *
 * Keep this file together with workinterviews-partitioned-tracker.gs.
 * Run switchPartitionedTrackerToSimpleOnEdit() once after adding it.
 */

function onEdit(e) {
  trackerOnEdit(e);
}

/**
 * Remove legacy installable trackerOnEdit triggers so a single edit cannot be
 * processed twice, then refresh validation/helper sheets.
 */
function switchPartitionedTrackerToSimpleOnEdit() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  assertTargetSpreadsheet_(ss);

  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'trackerOnEdit')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ensureActivityLogSheet_(ss);
  ensureStageValidation_(ss);

  PropertiesService.getDocumentProperties().setProperty(
    'WORKINTERVIEWS_TRACKER_TRIGGER_MODE',
    'simple-onEdit'
  );

  ss.toast(
    'Simple onEdit routing enabled; installable trackerOnEdit triggers removed.',
    'WorkInterviews',
    8
  );
}
