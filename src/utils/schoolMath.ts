export interface GradeResult {
  letter: string;
  gpaPoint: number;
  description: string;
}

export function getGradeLetter(percentage: number): GradeResult {
  const rounded = Math.round(percentage * 10) / 10;
  if (rounded >= 93) return { letter: 'A+', gpaPoint: 4.0, description: 'Outstanding' };
  if (rounded >= 90) return { letter: 'A', gpaPoint: 3.8, description: 'Excellent' };
  if (rounded >= 85) return { letter: 'B+', gpaPoint: 3.4, description: 'Very Good' };
  if (rounded >= 80) return { letter: 'B', gpaPoint: 3.0, description: 'Good' };
  if (rounded >= 75) return { letter: 'C+', gpaPoint: 2.5, description: 'Above Average' };
  if (rounded >= 70) return { letter: 'C', gpaPoint: 2.0, description: 'Satisfactory' };
  if (rounded >= 60) return { letter: 'D', gpaPoint: 1.0, description: 'Pass' };
  return { letter: 'F', gpaPoint: 0.0, description: 'Fail' };
}

export function calculateSubjectPercentage(obtainedScore: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  const pct = (obtainedScore / maxScore) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}

export function calculateOverallPerformance(subjects: { obtainedScore: number; maxScore: number }[]): {
  averagePercentage: number;
  totalObtained: number;
  totalMax: number;
  gpa: number;
  letterGrade: string;
  gradeDescription: string;
} {
  if (!subjects || subjects.length === 0) {
    return {
      averagePercentage: 0,
      totalObtained: 0,
      totalMax: 0,
      gpa: 0,
      letterGrade: 'N/A',
      gradeDescription: 'No Data'
    };
  }

  let totalObtained = 0;
  let totalMax = 0;
  let gpaSum = 0;

  for (const sub of subjects) {
    totalObtained += sub.obtainedScore;
    totalMax += sub.maxScore;
    const subPct = calculateSubjectPercentage(sub.obtainedScore, sub.maxScore);
    gpaSum += getGradeLetter(subPct).gpaPoint;
  }

  const averagePercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
  const gpa = Math.round((gpaSum / subjects.length) * 100) / 100;
  const overallGrade = getGradeLetter(averagePercentage);

  return {
    averagePercentage,
    totalObtained,
    totalMax,
    gpa,
    letterGrade: overallGrade.letter,
    gradeDescription: overallGrade.description,
  };
}

export function calculateAttendanceStats(entries: { status: 'present' | 'absent' | 'late' | 'excused' }[]): {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
} {
  const total = entries.length;
  if (total === 0) {
    return { total: 0, present: 0, absent: 0, late: 0, excused: 0, attendanceRate: 100 };
  }

  let present = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;

  for (const entry of entries) {
    if (entry.status === 'present') present++;
    else if (entry.status === 'absent') absent++;
    else if (entry.status === 'late') late++;
    else if (entry.status === 'excused') excused++;
  }

  // Count present as 1.0, late as 0.75, excused as 1.0 (approved leave)
  const attendedUnits = present + (late * 0.75) + excused;
  const attendanceRate = Math.round((attendedUnits / total) * 1000) / 10;

  return {
    total,
    present,
    absent,
    late,
    excused,
    attendanceRate: Math.min(100, Math.max(0, attendanceRate)),
  };
}

export function calculateFeeMetrics(invoices: { amount: number; status: 'Paid' | 'Pending' | 'Overdue' }[]): {
  totalBilled: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  collectionRate: number;
} {
  let totalBilled = 0;
  let totalCollected = 0;
  let totalPending = 0;
  let totalOverdue = 0;

  for (const inv of invoices) {
    totalBilled += inv.amount;
    if (inv.status === 'Paid') {
      totalCollected += inv.amount;
    } else if (inv.status === 'Pending') {
      totalPending += inv.amount;
    } else if (inv.status === 'Overdue') {
      totalOverdue += inv.amount;
    }
  }

  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 1000) / 10 : 0;

  return {
    totalBilled,
    totalCollected,
    totalPending,
    totalOverdue,
    collectionRate,
  };
}
