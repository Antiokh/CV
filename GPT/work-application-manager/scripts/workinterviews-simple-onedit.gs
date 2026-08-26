/**
 * WorkInterviews simple edit entrypoint.
 *
 * Direct human edits are normalized before lifecycle routing:
 * - Fit % -> native 0..1 percentage
 * - Posted/Found/Applied/Last contact -> native dates
 * - URL fields -> trimmed/canonical HTTP(S) links (Apply URL also allows mailto:)
 * - Salary Data -> native monthly numbers, ISO currency, NET/GROSS and positive FX rate
 *
 * Sheets API / agent writes do not fire onEdit. Agent-side enforcement therefore
 * still relies on Agent Instructions + Queue integrity readback.
 */

const WORKINTERVIEWS_UI_NORMALIZER = Object.freeze({
  STORAGE_SHEETS: Object.freeze(['Queue', 'Active', 'Low fit', 'Closed']),
  SALARY_SHEET: 'Salary Data',
  FIT_COL: 3,
  DATE_COLS: Object.freeze([16, 17, 18, 19]),
  URL_COLS: Object.freeze([9, 10, 11, 12, 15]),
  APPLY_URL_COL: 9,
  SALARY: Object.freeze({
    MIN: 2,
    MAX: 3,
    CURRENCY: 4,
    TYPE: 5,
    FX_EUR: 6,
  }),
});

function onEdit(e) {
  if (!e || !e.range || !e.source) return;

  const normalized = normalizeWorkInterviewsEdit_(e);
  if (!normalized) return;

  trackerOnEdit(e);
}

function normalizeWorkInterviewsEdit_(e) {
  const sheet = e.range.getSheet();
  const sheetName = sheet.getName();

  if (WORKINTERVIEWS_UI_NORMALIZER.STORAGE_SHEETS.includes(sheetName)) {
    return normalizeTrackerRange_(e);
  }

  if (sheetName === WORKINTERVIEWS_UI_NORMALIZER.SALARY_SHEET) {
    return normalizeSalaryRange_(e);
  }

  return true;
}

function normalizeTrackerRange_(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const firstCol = range.getColumn();
  const lastCol = range.getLastColumn();

  if (range.getRow() <= 1) return true;

  // Multi-cell pastes: normalize supported columns in place. Lifecycle routing
  // remains disabled by trackerOnEdit for multi-cell edits.
  if (range.getNumRows() > 1 || range.getNumColumns() > 1) {
    const values = range.getValues();
    let changed = false;

    for (let r = 0; r < values.length; r += 1) {
      for (let c = 0; c < values[r].length; c += 1) {
        const col = firstCol + c;
        const normalized = normalizeTrackerScalar_(col, values[r][c]);
        if (normalized.valid && normalized.changed) {
          values[r][c] = normalized.value;
          changed = true;
        }
      }
    }

    if (changed) range.setValues(values);

    WORKINTERVIEWS_UI_NORMALIZER.DATE_COLS.forEach(col => {
      if (col >= firstCol && col <= lastCol) {
        const offset = col - firstCol + 1;
        range.offset(0, offset - 1, range.getNumRows(), 1).setNumberFormat('yyyy-mm-dd');
      }
    });
    return true;
  }

  const col = firstCol;
  const current = range.getValue();
  const normalized = normalizeTrackerScalar_(col, current);
  if (!normalized.valid) {
    restoreEditedCell_(range, e.oldValue);
    e.source.toast(normalized.message, 'Invalid tracker value', 8);
    return false;
  }

  if (normalized.changed) range.setValue(normalized.value);
  if (WORKINTERVIEWS_UI_NORMALIZER.DATE_COLS.includes(col)) {
    range.setNumberFormat('yyyy-mm-dd');
  }
  if (col === WORKINTERVIEWS_UI_NORMALIZER.FIT_COL) {
    range.setNumberFormat('0%');
  }
  return true;
}

function normalizeTrackerScalar_(col, value) {
  if (value === '' || value === null) return { valid: true, changed: false, value };

  if (col === WORKINTERVIEWS_UI_NORMALIZER.FIT_COL) {
    const parsed = parsePercent_(value);
    if (parsed === null || parsed < 0 || parsed > 1) {
      return { valid: false, message: 'Fit % must be a number from 0% to 100%.' };
    }
    return { valid: true, changed: parsed !== value, value: parsed };
  }

  if (WORKINTERVIEWS_UI_NORMALIZER.DATE_COLS.includes(col)) {
    const parsed = parseDate_(value);
    if (!parsed) {
      return { valid: false, message: 'Date must be a real date, preferably YYYY-MM-DD.' };
    }
    return { valid: true, changed: !(value instanceof Date), value: parsed };
  }

  if (WORKINTERVIEWS_UI_NORMALIZER.URL_COLS.includes(col)) {
    const allowMailto = col === WORKINTERVIEWS_UI_NORMALIZER.APPLY_URL_COL;
    const parsed = normalizeUrl_(value, allowMailto);
    if (!parsed) {
      return { valid: false, message: 'Link must be an absolute HTTP(S) URL' + (allowMailto ? ' or mailto: link.' : '.') };
    }
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
    for (let r = 0; r < values.length; r += 1) {
      for (let c = 0; c < values[r].length; c += 1) {
        const col = range.getColumn() + c;
        const normalized = normalizeSalaryScalar_(col, values[r][c]);
        if (normalized.valid && normalized.changed) {
          values[r][c] = normalized.value;
          changed = true;
        }
      }
    }
    if (changed) range.setValues(values);
    return true;
  }

  const col = range.getColumn();
  const normalized = normalizeSalaryScalar_(col, range.getValue());
  if (!normalized.valid) {
    restoreEditedCell_(range, e.oldValue);
    e.source.toast(normalized.message, 'Invalid salary value', 8);
    return false;
  }

  if (normalized.changed) range.setValue(normalized.value);

  if (col === WORKINTERVIEWS_UI_NORMALIZER.SALARY.CURRENCY && normalized.value === 'EUR') {
    range.getSheet()
      .getRange(range.getRow(), WORKINTERVIEWS_UI_NORMALIZER.SALARY.FX_EUR)
      .setValue(1);
  }
  return true;
}

function normalizeSalaryScalar_(col, value) {
  const salary = WORKINTERVIEWS_UI_NORMALIZER.SALARY;
  if (value === '' || value === null) return { valid: true, changed: false, value };

  if (col === salary.MIN || col === salary.MAX || col === salary.FX_EUR) {
    const parsed = parseCompactNumber_(value);
    if (parsed === null || parsed < 0 || (col === salary.FX_EUR && parsed <= 0)) {
      return { valid: false, message: 'Salary range and FX fields must be positive native numbers. k/M shorthand is allowed in the UI.' };
    }
    return { valid: true, changed: parsed !== value, value: parsed };
  }

  if (col === salary.CURRENCY) {
    const currency = String(value).trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) {
      return { valid: false, message: 'Currency must be a 3-letter ISO code, for example EUR, USD or RSD.' };
    }
    return { valid: true, changed: currency !== value, value: currency };
  }

  if (col === salary.TYPE) {
    const type = String(value).trim().toUpperCase();
    if (type !== 'NET' && type !== 'GROSS') {
      return { valid: false, message: 'Salary Type must be NET or GROSS.' };
    }
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
  if (hasPercent || number > 1) return number / 100;
  return number;
}

function parseDate_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value).trim().replace(/^'+/, '');
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function normalizeUrl_(value, allowMailto) {
  let text = String(value).trim();
  if (!text) return '';
  if (allowMailto && /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(text)) return text;
  if (/^www\./i.test(text)) text = 'https://' + text;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text) && /^[^\s]+\.[^\s]+$/.test(text)) {
    text = 'https://' + text;
  }
  return /^https?:\/\/[^\s]+$/i.test(text) ? text : null;
}

function parseCompactNumber_(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const text = String(value)
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '')
    .toUpperCase();
  const match = text.match(/^([0-9]+(?:\.[0-9]+)?)([KM]?)$/);
  if (!match) return null;
  const base = Number(match[1]);
  if (!Number.isFinite(base)) return null;
  if (match[2] === 'K') return base * 1000;
  if (match[2] === 'M') return base * 1000000;
  return base;
}

function restoreEditedCell_(range, oldValue) {
  if (oldValue === undefined) {
    range.clearContent();
  } else {
    range.setValue(oldValue);
  }
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
    'simple-onEdit+normalization'
  );

  ss.toast(
    'Simple onEdit routing + field normalization enabled.',
    'WorkInterviews',
    8
  );
}
