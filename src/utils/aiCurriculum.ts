export interface LessonPlanRequest {
  grade: string;
  subject: string;
  chapter: string;
  topic: string;
  durationMinutes: number;
  learningLevel?: 'All Levels' | 'Foundational' | 'Advanced';
}

export interface LessonPlanResult {
  title: string;
  grade: string;
  subject: string;
  topic: string;
  objectives: string[];
  materialsNeeded: string[];
  timingBreakdown: { phase: string; duration: string; activity: string }[];
  simpleExplanation: string;
  realWorldAnalogy: string;
  differentiatedStrategies: {
    foundational: string;
    intermediate: string;
    advanced: string;
  };
  classroomActivities: string[];
  assessmentQuestions: { question: string; answerKey: string }[];
  homeworkSuggestion: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
}

export interface QuizGenerationResult {
  title: string;
  subject: string;
  grade: string;
  topic: string;
  questions: QuizQuestion[];
}

export interface TutorResponse {
  stepExplanation: string;
  hint: string;
  fullAnswer: string;
  practiceQuestion: string;
  encouragement: string;
  kannadaTranslation?: string;
}

/**
 * Generates an educational lesson plan based on curriculum parameters.
 */
export function generateCurriculumLessonPlan(req: LessonPlanRequest): LessonPlanResult {
  const { grade, subject, topic, chapter, durationMinutes } = req;

  return {
    title: `Daily Lesson Plan: ${topic}`,
    grade,
    subject,
    topic,
    objectives: [
      `Understand foundational principles of ${topic} in context of ${chapter}.`,
      `Apply step-by-step reasoning to solve real-world problems in ${subject}.`,
      `Articulate key terminology and draw conceptual connections across ${grade} standards.`,
    ],
    materialsNeeded: [
      'Interactive Smartboard / Whiteboard',
      `${subject} Course Text & Worksheets (Chapter: ${chapter})`,
      'Demonstration Kit & Student Activity Handouts',
      'Quick Exit Ticket Slips for formative assessment',
    ],
    timingBreakdown: [
      {
        phase: 'Hook & Warm-Up',
        duration: `${Math.round(durationMinutes * 0.15)} mins`,
        activity: `Review prerequisite concepts and present an intriguing real-world challenge related to ${topic}.`,
      },
      {
        phase: 'Direct Instruction',
        duration: `${Math.round(durationMinutes * 0.35)} mins`,
        activity: `Explain ${topic} with visual diagrams, step-by-step derivations, and common misconception alerts.`,
      },
      {
        phase: 'Guided Practice',
        duration: `${Math.round(durationMinutes * 0.25)} mins`,
        activity: `Work through sample problems as a whole group; pair students for collaborative problem solving.`,
      },
      {
        phase: 'Exit Ticket & Wrap-Up',
        duration: `${Math.round(durationMinutes * 0.25)} mins`,
        activity: `Check for understanding with a 3-question formative quiz; assign differentiated review homework.`,
      },
    ],
    simpleExplanation: `In simple terms, ${topic} describes how fundamental rules operate in ${subject}. Think of it as a set of predictable patterns that help us calculate, predict, and understand phenomena around us.`,
    realWorldAnalogy: `Think of ${topic} like assembling a bicycle: every gear and joint has a specific role. Once you know how each piece connects, the entire mechanism runs smoothly without friction.`,
    differentiatedStrategies: {
      foundational: `Provide graphic organizers, labeled formula sheets, and simplified practice sets with worked examples.`,
      intermediate: `Encourage independent problem-solving with peer checking and reflective error logs.`,
      advanced: `Challenge students with open-ended application problems, historical contexts, and algorithmic extensions.`,
    },
    classroomActivities: [
      `Think-Pair-Share: Explain ${topic} to your partner in 60 seconds without using jargon.`,
      `Station Rotation: 3 stations focusing on visual models, practical calculation, and conceptual edge cases.`,
      `Exit Ticket Challenge: Solve one core application question before dismissing to check mastery.`,
    ],
    assessmentQuestions: [
      {
        question: `State the primary principle underlying ${topic} and explain why it matters in ${subject}.`,
        answerKey: `Students should identify key definitions, cite governing laws/formulas, and give one concrete example.`,
      },
      {
        question: `How does changing an initial variable or condition alter the outcome in ${topic}?`,
        answerKey: `Correct response demonstrates proportional reasoning and cause-and-effect understanding.`,
      },
    ],
    homeworkSuggestion: `Complete Chapter Review Questions 1-8. Write a 3-sentence summary in your own words on how ${topic} connects to everyday life.`,
  };
}

/**
 * Generates an interactive multi-choice quiz with hints and explanations.
 */
export function generateCurriculumQuiz(subject: string, topic: string, grade: string): QuizGenerationResult {
  return {
    title: `${topic} — Mastery Quiz`,
    subject,
    grade,
    topic,
    questions: [
      {
        id: 'q1',
        question: `Which of the following best defines the core principle of ${topic}?`,
        options: [
          `A standardized relationship between fundamental variables in ${subject}.`,
          `An unverified assumption without experimental basis.`,
          `A purely historical anecdote with no computational relevance.`,
          `A temporary anomaly observed only in laboratory settings.`,
        ],
        correctAnswerIndex: 0,
        explanation: `${topic} establishes a mathematically consistent relationship across ${subject} phenomena.`,
        hint: `Look for the option that describes reproducible, standardized scientific principles.`,
      },
      {
        id: 'q2',
        question: `When solving problems involving ${topic}, what is always the recommended first step?`,
        options: [
          `Identify knowns, unknowns, and appropriate reference units.`,
          `Guess the final answer and skip the calculation steps.`,
          `Ignore units and write down the largest number.`,
          `Change the problem statement to an easier topic.`,
        ],
        correctAnswerIndex: 0,
        explanation: `Systematic problem-solving requires cataloging given variables, constraints, and standard units.`,
        hint: `Good problem solvers always start by organizing the given information.`,
      },
      {
        id: 'q3',
        question: `In practical applications of ${topic}, how do we verify if an answer is reasonable?`,
        options: [
          `Check dimensional units, order of magnitude, and physical limits.`,
          `Only check if the number is an integer.`,
          `Assume all positive numbers are automatically correct.`,
          `Compare it to an unrelated subject.`,
        ],
        correctAnswerIndex: 0,
        explanation: `Dimensional analysis and magnitude checks ensure results are scientifically sound.`,
        hint: `Think about unit consistency and whether the scale makes physical sense.`,
      },
    ],
  };
}

/**
 * Generates step-by-step Socratic tutor guidance with hints before answers.
 */
export function generateSocraticTutorResponse(
  query: string,
  subject: string,
  grade: string,
  requestHintOnly: boolean = false
): TutorResponse {
  const trimmed = query.trim().toLowerCase();

  let stepExplanation = `Let's break this down into clear, manageable steps for ${subject} (${grade}):\n1. First, identify what concept is being tested.\n2. Recall the governing rule or formula.\n3. Substitute the given values carefully, watching your units.\n4. Simplify and verify that the result makes intuitive sense!`;
  let hint = `Hint: What is the main relationship connecting the values given in your question? Try writing down the formula before plugging in numbers!`;
  let fullAnswer = `Here is the complete solution: By applying the standard ${subject} principle, we resolve the components step by step to arrive at the verified conclusion. Always keep your units attached!`;
  let practiceQuestion = `Try this similar challenge: If you double the primary input variable, how will the final output change? (A) Doubles, (B) Halves, (C) Quadruples, (D) Stays the same.`;
  let encouragement = `Great question! You are thinking like a real scholar. Keep up this curiosity!`;
  let kannadaTranslation = `ಈ ಪರಿಕಲ್ಪನೆಯನ್ನು ಹಂತ ಹಂತವಾಗಿ ಕಲಿಯಿರಿ: ನಿಯಮವನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ, ಸೂತ್ರವನ್ನು ಅನ್ವಯಿಸಿ ಮತ್ತು ಉತ್ತರವನ್ನು ಪರಿಶೀಲಿಸಿ. (Learn this step by step: recall the rule, apply the formula, and verify!)`;

  if (trimmed.includes('quadratic') || trimmed.includes('math') || trimmed.includes('equation')) {
    stepExplanation = `Solving Quadratic Equations step-by-step:\nStep 1: Write in standard form: ax² + bx + c = 0.\nStep 2: Identify coefficients a, b, and c.\nStep 3: Calculate the discriminant D = b² - 4ac.\nStep 4: Use the quadratic formula: x = (-b ± √D) / (2a).`;
    hint = `Hint: Always check the sign of b² - 4ac first! If it is positive, you will have two distinct real roots.`;
    fullAnswer = `For example, with x² - 5x + 6 = 0: Here a=1, b=-5, c=6. Discriminant = (-5)² - 4(1)(6) = 25 - 24 = 1. Therefore, x = (5 ± 1) / 2, giving x = 3 and x = 2.`;
    practiceQuestion = `Solve for x: x² - 7x + 12 = 0. What are the two roots?`;
    encouragement = `Algebra is all about balance and patterns. You have got this!`;
    kannadaTranslation = `ವರ್ಗ ಸಮೀಕರಣಗಳು: ax² + bx + c = 0 ರೂಪದಲ್ಲಿ ಬರೆಯಿರಿ. ಸೂತ್ರ: x = (-b ± √(b² - 4ac)) / (2a). ಧೈರ್ಯವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ!`;
  } else if (trimmed.includes('newton') || trimmed.includes('physics') || trimmed.includes('force')) {
    stepExplanation = `Newton's Laws of Motion in a nutshell:\n1st Law: Objects keep doing what they are doing unless an unbalanced force acts on them (Inertia).\n2nd Law: Net Force equals mass times acceleration (F = m × a).\n3rd Law: For every action, there is an equal and opposite reaction.`;
    hint = `Hint: Think about what happens when a car suddenly stops. What keeps you moving forward? Inertia!`;
    fullAnswer = `When calculating force: F = m × a. If mass is 10 kg and acceleration is 2 m/s², the net force is 10 × 2 = 20 Newtons (N).`;
    practiceQuestion = `If an object with a mass of 5 kg experiences a net force of 15 N, what is its acceleration?`;
    encouragement = `Physics is the language of the universe around you. Fantastic curiosity!`;
    kannadaTranslation = `ನ್ಯೂಟನ್‌ನ ನಿಯಮಗಳು: F = m × a (ಬಲ = ದ್ರವ್ಯರಾಶಿ × ವೇಗೋತ್ಕರ್ಷ). ಪ್ರತಿಯೊಂದು ಕ್ರಿಯೆಗೂ ಸಮಾನ ಮತ್ತು ವಿರುದ್ಧ ಪ್ರತಿಕ್ರಿಯೆ ಇರುತ್ತದೆ.`;
  } else if (trimmed.includes('photosynthesis') || trimmed.includes('biology') || trimmed.includes('plant')) {
    stepExplanation = `Photosynthesis Step-by-Step:\n1. Light Absorption: Chlorophyll in green leaves absorbs sunlight.\n2. Reactants: Plant takes in Carbon Dioxide (from air) and Water (from roots).\n3. Transformation: Light energy converts CO₂ + H₂O into Glucose (chemical energy) and Oxygen (released into air).\nEquation: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂.`;
    hint = `Hint: Remember the word roots: 'Photo' means light, and 'Synthesis' means putting things together!`;
    fullAnswer = `The plant stores the synthesized glucose as starch for growth, while oxygen is released through tiny pores called stomata.`;
    practiceQuestion = `Which organelle inside plant cells contains chlorophyll and carries out photosynthesis?`;
    encouragement = `Biology connects us to every living thing on Earth. Well done exploring this!`;
    kannadaTranslation = `ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ: ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ಗ್ಲೂಕೋಸ್ ಮತ್ತು ಆಮ್ಲಜನಕವನ್ನು ಉತ್ಪಾದಿಸುತ್ತವೆ.`;
  }

  return {
    stepExplanation: requestHintOnly ? `Here is your guided hint first:\n\n${hint}` : stepExplanation,
    hint,
    fullAnswer,
    practiceQuestion,
    encouragement,
    kannadaTranslation,
  };
}
