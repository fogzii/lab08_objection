import { getObjections, Objection, ExaminationType } from './objection';

describe('getObections()', () => {
  describe('error', () => {
    test('question is an empty string', () => {
      expect(() => getObjections('', 'testimony!', ExaminationType.CROSS)).toThrow(Error);
    });

    test('testimony is an empty string', () => {
      expect(() => getObjections('question?', '', ExaminationType.DIRECT)).toThrow(Error);
    });
  });

  describe('success', () => {
    describe('argumentative cases', () => {
      test.each([
        {
          question: 'You are totally lying!',
          testimony: 'No you!',
          type: ExaminationType.CROSS,
          objections: new Set([Objection.ARGUMENTATIVE]),
        },
        {
          question: 'This is direct, yes!',
          testimony: 'Yes, so not argumentative!',
          type: ExaminationType.DIRECT,
          objections: new Set([]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });

    describe('compound cases', () => {
      test.each([
        {
          question: 'compound? yes?',
          testimony: 'yes you!',
          type: ExaminationType.CROSS,
          objections: new Set([Objection.COMPOUND]),
        },
        {
          question: 'compound? yes question is long apple pear banana?',
          testimony: 'Yes, so not argumentative!',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.COMPOUND]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });

    describe('hearsay cases', () => {
      test.each([
        {
          question: 'question me question is long apple pear banana?',
          testimony: 'Your mum heard from me.',
          type: ExaminationType.CROSS,
          objections: new Set([Objection.HEARSAY]),
        },
        {
          question: 'question me question is long apple pear banana?',
          testimony: 'Your mum told me.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.HEARSAY]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });

    describe('leading cases', () => {
      test.each([
        {
          question: 'why did you eat that lemon?',
          testimony: 'lemon yum.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.LEADING]),
        },
        {
          question: 'do you agree?',
          testimony: 'agree no.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.LEADING]),
        },
        {
          question: 'you like lemons, right?',
          testimony: 'lemons yes.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.LEADING]),
        },
        {
          question: 'you like lemons, correct?',
          testimony: 'lemons no.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.LEADING]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });

    describe('non responsive cases', () => {
      test.each([
        {
          question: 'question is long apple pear banana?',
          testimony: 'lemon.',
          type: ExaminationType.CROSS,
          objections: new Set([Objection.NON_RESPONSIVE]),
        },
        {
          question: 'question is long apple pear banana?',
          testimony: 'lemon quest.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.NON_RESPONSIVE]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });

    describe('relevance cases', () => {
      test.each([
        {
          question: 'question?',
          testimony: 'lemon. This is longer than the question.',
          type: ExaminationType.CROSS,
          objections: new Set([Objection.RELEVANCE]),
        },
        {
          question: 'question?',
          testimony: 'lemon quest. This is longer than the question.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.RELEVANCE]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });

    describe('speculation cases', () => {
      test.each([
        {
          question: 'think question with speculation?',
          testimony: 'yes question.',
          type: ExaminationType.CROSS,
          objections: new Set([Objection.SPECULATION]),
        },
        {
          question: 'question with speculation?',
          testimony: 'yes think question.',
          type: ExaminationType.DIRECT,
          objections: new Set([Objection.SPECULATION]),
        },
      ])('$objections', ({ question, testimony, type, objections }) => {
        expect(getObjections(question, testimony, type)).toEqual(objections);
      });
    });
  });
});
