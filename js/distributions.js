export function calculateBinomialProbability(n, p, x) {
  return combination(n, x) * p ** x * (1 - p) ** (n - x);
}

export function calculatePoissonProbability(lambda, x) {
  return (Math.exp(-lambda) * lambda ** x) / factorial(x);
}

export function calculateNormalProbability(mean, sd, x) {
  return (
    (1 / (sd * Math.sqrt(2 * Math.PI))) *
    Math.exp(-((x - mean) ** 2) / (2 * sd ** 2))
  );
}

export function calculateUniformProbability(a, b) {
  return 1 / (b - a);
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

function combination(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}
