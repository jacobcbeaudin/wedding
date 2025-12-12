/**
 * CSV export utilities.
 */

/**
 * Generate CSV content from headers and rows.
 * Properly escapes cell values with quotes.
 */
export function generateCSV(headers: string[], rows: (string | number)[][]): string {
  const escapeCell = (cell: string | number): string => {
    const value = String(cell);
    // Escape quotes by doubling them, wrap in quotes
    return `"${value.replace(/"/g, '""')}"`;
  };

  const headerRow = headers.map(escapeCell).join(',');
  const dataRows = rows.map((row) => row.map(escapeCell).join(','));

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download CSV content as a file.
 */
export function downloadCSV(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate a dated filename for CSV exports.
 */
export function csvFilename(prefix: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${date}.csv`;
}
