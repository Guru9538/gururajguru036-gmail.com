import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeCSVField, exportStudentsToCSV } from './csvExport';
import { Student } from '../types';

test('escapeCSVField handles regular strings and numbers', () => {
  assert.equal(escapeCSVField('Marcus'), 'Marcus');
  assert.equal(escapeCSVField(95.5), '95.5');
  assert.equal(escapeCSVField(''), '');
  assert.equal(escapeCSVField(undefined), '');
  assert.equal(escapeCSVField(null), '');
});

test('escapeCSVField escapes commas, quotes, and newlines', () => {
  assert.equal(escapeCSVField('David & Mei Chen, Jr.'), '"David & Mei Chen, Jr."');
  assert.equal(escapeCSVField('Room "A"'), '"Room ""A"""');
  assert.equal(escapeCSVField('Line 1\nLine 2'), '"Line 1\nLine 2"');
});

test('exportStudentsToCSV produces well-formed CSV with headers and rows', () => {
  const mockStudents: Student[] = [
    {
      id: 'std-1',
      rollNo: '2026-10A-01',
      firstName: 'Marcus',
      lastName: 'Vance',
      grade: 'Grade 10',
      section: 'A',
      gender: 'Male',
      dob: '2010-04-14',
      bloodGroup: 'O+',
      parentName: 'Eleanor Vance',
      parentEmail: 'e.vance@example.com',
      parentPhone: '+1 (555) 234-5678',
      address: '42 Maple Grove Way, Crestview',
      attendanceRate: 96.5,
      status: 'Active',
      avatarSeed: 'Marcus',
      enrolledDate: '2023-08-15',
    },
    {
      id: 'std-2',
      rollNo: '2026-10A-02',
      firstName: 'Sophia',
      lastName: 'Chen',
      grade: 'Grade 10',
      section: 'A',
      gender: 'Female',
      dob: '2010-09-22',
      bloodGroup: 'A+',
      parentName: 'David, Mei Chen',
      parentEmail: 'chen.family@example.com',
      parentPhone: '+1 (555) 345-6789',
      address: '108 Silverbell Lane',
      attendanceRate: 98.2,
      status: 'Active',
      avatarSeed: 'Sophia',
      enrolledDate: '2023-08-15',
    },
  ];

  const csv = exportStudentsToCSV(mockStudents);
  const lines = csv.split('\r\n');

  assert.equal(lines.length, 3);
  assert.ok(lines[0].startsWith('Roll Number,First Name,Last Name'));
  assert.ok(lines[1].includes('2026-10A-01,Marcus,Vance'));
  assert.ok(lines[1].includes('"42 Maple Grove Way, Crestview"'));
  assert.ok(lines[2].includes('"David, Mei Chen"'));
});
