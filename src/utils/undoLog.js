/**
 * Undo Log Utility
 * Handles persistence of medication stock change history in localStorage.
 */

const STORAGE_KEY = 'medinventory_undo_log';

export const undoLog = {
  /**
   * Retrieve the current list of undo logs.
   * @returns {Array} List of change records.
   */
  getLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Failed to parse undo log from localStorage:', e);
      return [];
    }
  },

  /**
   * Append a new change record to the history.
   * @param {Object} record - The change record to log.
   */
  pushLog(record) {
    const logs = this.getLogs();
    const updatedLogs = [record, ...logs];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    return updatedLogs;
  },

  /**
   * Clear all logs from the history.
   */
  clearLogs() {
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  },

  /**
   * Remove a specific log entry and return the updated list.
   * @param {string} id - The ID of the log entry to remove.
   * @param {Object} replacementRecord - An optional record to add (e.g., an undo action log).
   * @returns {Array} The updated logs list.
   */
  removeAndAdd(id, replacementRecord = null) {
    const logs = this.getLogs();
    const filteredLogs = logs.filter(l => l.id !== id);
    const finalLogs = replacementRecord ? [replacementRecord, ...filteredLogs] : filteredLogs;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalLogs));
    return finalLogs;
  }
};
