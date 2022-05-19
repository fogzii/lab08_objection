import { getObjections, Objection, ExaminationType } from './src/objection';

describe('Error cases', () => {
  test.each([
    {
      question: '',
      testimony: 'valid',
    },
    {
      question: 'valid',
      testimony: '',
    },
  ])('question="$question", testimony="$testimony"', ({ question, testimony }) => {
    expect(() => getObjections(question, testimony, ExaminationType.CROSS)).toThrow(Error);
  });
});

describe('argumentative cases', () => {
  test.each([
    {
      question: 'You are totally lying!',
      testimony: 'No you!',
      examinationType: ExaminationType.CROSS,
      objections: new Set([Objection.ARGUMENTATIVE]),
    },
    {
      question: 'This is direct, yes!',
      testimony: 'Yes, so not argumentative!',
      examinationType: ExaminationType.DIRECT,
      objections: new Set([]),
    },
  ])('$objections', ({ question, testimony, examinationType, objections }) => {
    expect(getObjections(question, testimony, examinationType)).toEqual(objections);
  });
});

describe('Hearsay cases', () => {
  test.each([
    {
      question: 'How did you know about it?',
      testimony: 'Johnny told me about it',
    },
    {
      question: 'Again, how did you know about it?',
      testimony: 'I know what I heard from Johnny!',
    },
  ])('testimony: $testimony', ({ question, testimony }) => {
    expect(getObjections(question, testimony, ExaminationType.DIRECT)).toEqual(new Set([Objection.HEARSAY]));
  });
});

describe('Leading cases', () => {
  test.each([
    {
      question: 'Why did you text John Cena?',
      testimony: 'I thought the text was going to John Wick',
    },
    {
      question: 'Do you agree that 1 + 1 = 2?',
      testimony: 'I agree',
    },
    {
      question: 'You were there, correct?',
      testimony: 'Correct',
    },
    {
      question: 'You were there, right?',
      testimony: 'Right',
    },
  ])('$objections', ({ question, testimony }) => {
    expect(getObjections(question, testimony, ExaminationType.DIRECT)).toEqual(new Set([Objection.LEADING]));
  });

  test('Not leading in CROSS', () => {
    expect(getObjections('Why did you?', 'why what?', ExaminationType.CROSS)).toEqual(new Set([]));
  });
});

describe('Leading cases', () => {
  test.each([
    {
      question: 'I think you are guily, no?',
      testimony: 'No you!',
      examinationType: ExaminationType.CROSS,
      objections: new Set([Objection.SPECULATION]),
    },
    {
      question: 'I think you are guily, no?',
      testimony: 'No you!',
      examinationType: ExaminationType.DIRECT,
      objections: new Set([]),
    },
    {
      question: 'Did you see who it was?',
      testimony: 'No, but I think it was John Cena.',
      examinationType: ExaminationType.DIRECT,
      objections: new Set([Objection.SPECULATION]),
    },
    {
      question: 'Did you see who it was?',
      testimony: 'No, but I think it was John Cena.',
      examinationType: ExaminationType.CROSS,
      objections: new Set([]),
    },
  ])('$objections', ({ question, testimony, examinationType, objections }) => {
    expect(getObjections(question, testimony, examinationType)).toEqual(objections);
  });
});

describe('Compound, Non-responsive and Relevance cases', () => {
  test.each([
    {
      question: 'Was it worth it? Would you do it again?',
      testimony: 'Worth it, ya',
      examinationType: ExaminationType.CROSS,
      objections: new Set([Objection.COMPOUND]),
    },
    {
      question: 'Why text John Cena?',
      testimony: "Because he can't see me!",
      examinationType: ExaminationType.DIRECT,
      objections: new Set([Objection.NON_RESPONSIVE]),
    },
    {
      question: 'How old do you think you are?',
      testimony: 'Age is not a true measurement of knowledge and wisdom, you know?',
      examinationType: ExaminationType.DIRECT,
      objections: new Set([Objection.RELEVANCE]),
    },
  ])('$objections', ({ question, testimony, examinationType, objections }) => {
    expect(getObjections(question, testimony, examinationType)).toEqual(objections);
  });
});

describe('multiple objections', () => {
  test.each([
    {
      question: 'Why did you open the door? Who came in?',
      testimony: "Because someone knocked. I don't remember who",
      examinationType: ExaminationType.DIRECT,
      objections: new Set([Objection.LEADING, Objection.COMPOUND]),
    },
    {
      question: 'What time did they have dinner?',
      testimony: 'If I were to guess, I think it would be ice cream and potatoes on a stick',
      examinationType: ExaminationType.DIRECT,
      objections: new Set([Objection.RELEVANCE, Objection.NON_RESPONSIVE, Objection.SPECULATION]),
    },
  ])('$objections', ({ question, testimony, examinationType, objections }) => {
    expect(getObjections(question, testimony, examinationType)).toEqual(objections);
  });
});
