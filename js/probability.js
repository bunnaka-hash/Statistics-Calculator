export function calculateBasicProbability(successes, total) {
  return successes / total;
}

export function calculateAdditionRule(pA, pB, pBoth) {
  return pA + pB - pBoth;
}

export function calculateMultiplicationRule(pA, pB) {
  return pA * pB;
}

export function calculateConditionalProbability(pAandB, pB) {
  return pAandB / pB;
}

export function calculateBayesTheorem(pA, pBgivenA, pB) {
  return (pA * pBgivenA) / pB;
}

export function calculateExpectedValue(values, probabilities) {
  return values.reduce(
    (total, value, index) => total + value * probabilities[index],
    0,
  );
}
