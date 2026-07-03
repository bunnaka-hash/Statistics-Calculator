export function validateNumericInput(input, opts = {}) {
  const values = input
    .split(/[,\s\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!values.length) {
    return { valid: false, message: "Please enter at least one number." };
  }

  for (const value of values) {
    if (!/^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(value)) {
      return { valid: false, message: "Please enter only numeric values." };
    }
  }

  const numbers = values.map(Number);
  if (opts.minLength && numbers.length < opts.minLength) {
    return {
      valid: false,
      message: `Please provide at least ${opts.minLength} values.`,
    };
  }
  if (opts.nonNegative && numbers.some((number) => number < 0)) {
    return { valid: false, message: "Values must be non-negative." };
  }
  if (opts.probability && numbers.some((number) => number < 0 || number > 1)) {
    return { valid: false, message: "Probabilities must be between 0 and 1." };
  }
  if (opts.divisorZero && numbers.includes(0)) {
    return {
      valid: false,
      message: "Values cannot include zero for this calculation.",
    };
  }
  return { valid: true, values: numbers };
}
