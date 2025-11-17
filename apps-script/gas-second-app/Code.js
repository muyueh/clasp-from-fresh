/**
 * Logs metadata about this deployment so you can confirm CI is deploying
 * the secondary project independently from the main app.
 */
function logSecondaryAppStatus() {
  const metadata = buildDeploymentMetadata_();
  Logger.log('gas-second-app status: %s', JSON.stringify(metadata, null, 2));
  return metadata;
}

/**
 * Appends the status metadata to the provided spreadsheet so you can keep
 * a deployment audit log inside Sheets. When the sheet does not exist, it
 * will be created automatically.
 *
 * @param {string} spreadsheetId The ID of the spreadsheet to append to.
 * @param {string} [sheetName='Deployments'] The tab that stores log rows.
 * @return {number} The row number that received the log entry.
 */
function recordSecondaryAppStatus(spreadsheetId, sheetName) {
  if (!spreadsheetId) {
    throw new Error('A spreadsheetId is required to record status.');
  }

  const metadata = buildDeploymentMetadata_();
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = sheetName ? spreadsheet.getSheetByName(sheetName) : null;

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName || 'Deployments');
  }

  sheet.appendRow([metadata.timestamp, metadata.app, metadata.timeZone, metadata.user]);
  return sheet.getLastRow();
}

function buildDeploymentMetadata_() {
  const user = Session.getActiveUser();
  return {
    app: 'gas-second-app',
    timestamp: new Date().toISOString(),
    timeZone: Session.getScriptTimeZone(),
    user: user ? user.getEmail() || 'unknown' : 'unknown'
  };
}
