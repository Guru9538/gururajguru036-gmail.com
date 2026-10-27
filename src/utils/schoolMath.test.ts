import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGradeLetter,
  calculateSubjectPercentage,
  calculateOverallPerformance,
  calculateAttendanceStats,
  calculateFeeMetrics,
} from './schoolMath';

test('getGradeLetter maps percentages correctly', () => {
  assert.equal(getGradeLetter(98).letter, 'A+');
  assert.equal(getGradeLetter(91).letter, 'A');
  assert.equal(getGradeLetter(86).letter, 'B+');
  assert.equal(getGradeLetter(81).letter, 'B');
  assert.equal(getGradeLetter(76).letter, 'C+');
  assert.equal(getGradeLetter(71).letter, 'C');
  assert.equal(getGradeLetter(62).letter, 'D');
  assert.equal(getGradeLetter(45).letter, 'F');
});

test('calculateSubjectPercentage handles normal and edge cases', () => {
  assert.equal(calculateSubjectPercentage(85, 100), 85);
  assert.equal(calculateSubjectPercentage(45, 50), 90);
  assert.equal(calculateSubjectPercentage(0, 100), 0);
  assert.equal(calculateSubjectPercentage(10, 0), 0);
});

test('calculateOverallPerformance computes GPA and totals', () => {
  const subjects = [
    { obtainedScore: 95, maxScore: 100 }, // A+ -> 4.0
    { obtainedScore: 85, maxScore: 100 }, // B+ -> 3.4
    { obtainedScore: 90, maxScore: 100 }, // A -> 3.8
  ];
  const perf = calculateOverallPerformance(subjects);
  assert.equal(perf.totalObtained, 270);
  assert.equal(perf.totalMax, 300);
  assert.equal(perf.averagePercentage, 90);
  assert.equal(perf.letterGrade, 'A');
  assert.ok(perf.gpa > 3.7 && perf.gpa < 3.8);
});

test('calculateAttendanceStats calculates correct rate with late and excused', () => {
  const entries: { status: 'present' | 'absent' | 'late' | 'excused' }[] = [
    { status: 'present' },
    { status: 'present' },
    { status: 'absent' },
    { status: 'late' }, // 0.75
  ];
  const stats = calculateAttendanceStats(entries);
  assert.equal(stats.total, 4);
  assert.equal(stats.present, 2);
  assert.equal(stats.absent, 1);
  assert.equal(stats.late, 1);
  // attended = 2 + 0.75 = 2.75 / 4 = 68.75% -> 68.8%
  assert.equal(stats.attendanceRate, 68.8);
});

test('calculateFeeMetrics summarizes invoices correctly', () => {
  const invoices: { amount: number; status: 'Paid' | 'Pending' | 'Overdue' }[] = [
    { amount: 1200, status: 'Paid' },
    { amount: 800, status: 'Paid' },
    { amount: 500, status: 'Pending' },
    { amount: 300, status: 'Overdue' },
  ];
  const metrics = calculateFeeMetrics(invoices);
  assert.equal(metrics.totalBilled, 2800);
  assert.equal(metrics.totalCollected, 2000);
  assert.equal(metrics.totalPending, 500);
  assert.equal(metrics.totalOverdue, 300);
  // 2000 / 2800 = 71.4%
  assert.equal(metrics.collectionRate, 71.4);
});
