import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateCurriculumLessonPlan,
  generateCurriculumQuiz,
  generateSocraticTutorResponse,
} from './aiCurriculum';

test('generateCurriculumLessonPlan generates comprehensive lesson breakdown', () => {
  const plan = generateCurriculumLessonPlan({
    grade: 'Grade 10',
    subject: 'Physics',
    chapter: 'Forces and Laws of Motion',
    topic: 'Newton Second Law',
    durationMinutes: 45,
  });

  assert.equal(plan.grade, 'Grade 10');
  assert.equal(plan.subject, 'Physics');
  assert.equal(plan.topic, 'Newton Second Law');
  assert.ok(plan.objectives.length >= 3);
  assert.ok(plan.timingBreakdown.length === 4);
  assert.ok(plan.differentiatedStrategies.foundational.length > 0);
  assert.ok(plan.differentiatedStrategies.advanced.length > 0);
  assert.ok(plan.assessmentQuestions.length >= 2);
});

test('generateCurriculumQuiz produces quiz questions with hints and explanations', () => {
  const quiz = generateCurriculumQuiz('Mathematics', 'Quadratic Equations', 'Grade 10');
  assert.equal(quiz.subject, 'Mathematics');
  assert.equal(quiz.questions.length, 3);
  assert.equal(typeof quiz.questions[0].correctAnswerIndex, 'number');
  assert.ok(quiz.questions[0].options.length === 4);
  assert.ok(quiz.questions[0].hint.length > 0);
  assert.ok(quiz.questions[0].explanation.length > 0);
});

test('generateSocraticTutorResponse provides hints, step explanations, and Kannada support', () => {
  const response = generateSocraticTutorResponse('How do I solve quadratic equations?', 'Mathematics', 'Grade 10');
  assert.ok(response.stepExplanation.includes('Step 1'));
  assert.ok(response.hint.length > 0);
  assert.ok(response.practiceQuestion.length > 0);
  assert.ok(response.kannadaTranslation && response.kannadaTranslation.length > 0);

  const hintOnly = generateSocraticTutorResponse('Explain photosynthesis', 'Biology', 'Grade 10', true);
  assert.ok(hintOnly.stepExplanation.includes('guided hint'));
});
