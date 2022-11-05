export enum Objection {
  /**
  * By default, enum are integers 0, 1, 2, ...
  * However, we can also give them string values
  */
  ARGUMENTATIVE = 'argumentative',
  COMPOUND = 'compound',
  HEARSAY = 'hearsay',
  LEADING = 'leading',
  NON_RESPONSIVE = 'non-responsive',
  RELEVANCE = 'relevance',
  SPECULATION = 'speculation',
}

export enum ExaminationType {
  /**
    * It is also possible to specify a "start" number.
    *
    * Below would assign CROSS = 1, DIRECT = 2, the next
    * would be 3, etc.
    */
  CROSS = 1,
  DIRECT,
}

// Helper function - feel free to remove / modify.
function isArgumentative(question: string) {
  return !question.endsWith('?');
}

/**
 * Feel free to modify the function below as you see fit,
 * so long as you satisfy the specification.
 */
export function getObjections(
  question: string,
  testimony: string,
  examinationType: ExaminationType
): Set<Objection> {
  if (question === '') throw new Error('question is an empty string');
  if (testimony === '') throw new Error('question is an empty string');

  // Convert given question and testimony to lowercase
  question = question.toLowerCase();
  testimony = testimony.toLowerCase();

  const objections = new Set<Objection>();

  if (examinationType === ExaminationType.CROSS) {
    if (isArgumentative(question)) {
      objections.add(Objection.ARGUMENTATIVE);
    }

    if (question.includes('think')) {
      objections.add(Objection.SPECULATION);
    }
  } else {
    // Type is ExaminationType.DIRECT
    if (
      question.startsWith('why did you') ||
      question.startsWith('do you agree') ||
      question.endsWith('right?') ||
      question.endsWith('correct?')
    ) {
      objections.add(Objection.LEADING);
    }

    if (testimony.includes('think')) {
      objections.add(Objection.SPECULATION);
    }
  }

  // cases that don't depend on ExaminationType
  if ((question.match(/\?/g) || []).length > 1) {
    objections.add(Objection.COMPOUND);
  }

  if (testimony.includes('heard from') || testimony.includes('told me')) {
    objections.add(Objection.HEARSAY);
  }

  const testimonyCpy = testimony.replace(/[^A-Za-z0-9 ]/g, '');
  const questionCpy = question.replace(/[^A-Za-z0-9 ]/g, '');
  const questionArr = questionCpy.split(' ');
  let wordFound = false;
  for (const word of questionArr) {
    if (new RegExp('\\b' + word + '\\b').test(testimonyCpy)) {
      wordFound = true;
      break;
    }
  }
  if (wordFound === false) objections.add(Objection.NON_RESPONSIVE);

  if (testimony.length > 2 * question.length) {
    objections.add(Objection.RELEVANCE);
  }

  return objections;
}
