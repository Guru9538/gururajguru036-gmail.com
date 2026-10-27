import { Student } from '../types';

/**
 * Escapes a field for CSV format by wrapping in quotes if it contains commas, quotes, or newlines.
 */
export function escapeCSVField(field: string | number | undefined | null): string {
  if (field === undefined || field === null) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts a list of Student records into standard CSV format.
 */
export function exportStudentsToCSV(students: Student[]): string {
  const headers = [
    'Roll Number',
    'First Name',
    'Last Name',
    'Grade',
    'Section',
    'Gender',
    'Date of Birth',
    'Blood Group',
    'Parent Name',
    'Parent Email',
    'Parent Phone',
    'Residential Address',
    'Attendance Rate (%)',
    'Enrollment Date',
    'Status',
  ];

  const rows = students.map((s) => [
    escapeCSVField(s.rollNo),
    escapeCSVField(s.firstName),
    escapeCSVField(s.lastName),
    escapeCSVField(s.grade),
    escapeCSVField(s.section),
    escapeCSVField(s.gender),
    escapeCSVField(s.dob),
    escapeCSVField(s.bloodGroup),
    escapeCSVField(s.parentName),
    escapeCSVField(s.parentEmail),
    escapeCSVField(s.parentPhone),
    escapeCSVField(s.address),
    escapeCSVField(s.attendanceRate),
    escapeCSVField(s.enrolledDate),
    escapeCSVField(s.status),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
}

/**
 * Triggers a browser file download of the CSV content.
 */
export function downloadCSVFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
