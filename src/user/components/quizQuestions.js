export const QUIZ_QUESTIONS = [
  {
    id: 'pg1',
    questions: [
      {
        id: 'all_same',
        question: 'Are all the objects in this task the same?',
        multiSelect: false,
        answers: ['Yes', 'No'],
        correctAnswer: ['No'],
      },
      {
        id: 'when_same',
        question: 'When should you respond "Same"?',
        multiSelect: false,
        answers: [
          'If the objects look identical',
          'If the objects are rotated versions of each other',
          'If both items are made out of blocks',
          'If they are symmetric',
        ],
        correctAnswer: ['If the objects are rotated versions of each other'],
      },
    ],
  },
]
