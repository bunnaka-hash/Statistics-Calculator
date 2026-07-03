export function calculateCorrelation(valuesX, valuesY) {
  const meanX = valuesX.reduce((sum, value) => sum + value, 0) / valuesX.length;
  const meanY = valuesY.reduce((sum, value) => sum + value, 0) / valuesY.length;
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;

  for (let index = 0; index < valuesX.length; index += 1) {
    const dx = valuesX[index] - meanX;
    const dy = valuesY[index] - meanY;
    numerator += dx * dy;
    denominatorX += dx * dx;
    denominatorY += dy * dy;
  }

  return numerator / Math.sqrt(denominatorX * denominatorY);
}

export function calculateRegression(valuesX, valuesY) {
  const meanX = valuesX.reduce((sum, value) => sum + value, 0) / valuesX.length;
  const meanY = valuesY.reduce((sum, value) => sum + value, 0) / valuesY.length;
  let numerator = 0;
  let denominator = 0;

  for (let index = 0; index < valuesX.length; index += 1) {
    const dx = valuesX[index] - meanX;
    const dy = valuesY[index] - meanY;
    numerator += dx * dy;
    denominator += dx * dx;
  }

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  return {
    slope,
    intercept,
    equation: `ŷ = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`,
  };
}

export function calculateR2(correlation) {
  return correlation ** 2;
}
