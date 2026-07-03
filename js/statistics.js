import { formatNumber } from "./helper.js";

export function calculateMean(values) {
  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}

export function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

export function calculateMode(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  const maxCount = Math.max(...counts.values());
  const modes = [...counts.entries()]
    .filter(([, count]) => count === maxCount)
    .map(([value]) => value);
  return modes.length === values.length ? "No unique mode" : modes;
}

export function calculateRange(values) {
  return Math.max(...values) - Math.min(...values);
}

export function calculateVariance(values, sample = false) {
  const mean = calculateMean(values);
  const squaredDifferences = values.map((value) => (value - mean) ** 2);
  const sum = squaredDifferences.reduce((total, value) => total + value, 0);
  const denominator = sample ? values.length - 1 : values.length;
  return sum / denominator;
}

export function calculateStdDev(values, sample = false) {
  return Math.sqrt(calculateVariance(values, sample));
}

export function calculateFiveNumberSummary(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = calculatePercentile(sorted, 25);
  const median = calculateMedian(sorted);
  const q3 = calculatePercentile(sorted, 75);
  return { min: sorted[0], q1, median, q3, max: sorted[sorted.length - 1] };
}

export function calculatePercentile(values, percentile) {
  const sorted = [...values].sort((a, b) => a - b);
  const position = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}

export function buildDescriptiveSteps(values, type) {
  const steps = [];
  const mean = calculateMean(values);
  switch (type) {
    case "mean":
      steps.push(
        `Sum of values: ${values.join(" + ")} = ${values.reduce((total, value) => total + value, 0)}`,
      );
      steps.push(`Count: n = ${values.length}`);
      steps.push(
        `Mean = ${values.reduce((total, value) => total + value, 0)} / ${values.length} = ${formatNumber(mean)}`,
      );
      break;
    case "median":
      steps.push(
        `Sorted values: ${[...values].sort((a, b) => a - b).join(", ")}`,
      );
      steps.push(`Median = ${formatNumber(calculateMedian(values))}`);
      break;
    default:
      steps.push(`Computed using the ${type} formula.`);
  }
  return steps;
}
