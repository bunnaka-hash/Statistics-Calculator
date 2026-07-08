import { getStorage, setStorage, showToast } from "./helper.js";
import {
  initLoader,
  initMobileMenu,
  initScrollTop,
  initSearch,
  initTheme,
} from "./ui.js";
import {
  buildDescriptiveSteps,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateRange,
  calculateVariance,
  calculateStdDev,
  calculateFiveNumberSummary,
  calculatePercentile,
} from "./statistics.js";
import {
  calculateBasicProbability,
  calculateAdditionRule,
  calculateMultiplicationRule,
  calculateConditionalProbability,
  calculateBayesTheorem,
  calculateExpectedValue,
} from "./probability.js";
import {
  calculateBinomialProbability,
  calculatePoissonProbability,
  calculateNormalProbability,
  calculateUniformProbability,
} from "./distributions.js";
import {
  calculateCorrelation,
  calculateRegression,
  calculateR2,
} from "./regression.js";
import { validateNumericInput } from "./validation.js";

const mathRenderPattern = /[=+\-*/^_{}Σσμπ√∞±∪∩≤≥\\]/;

function shouldRenderMath(text) {
  return typeof text === "string" && mathRenderPattern.test(text);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrapMath(text) {
  if (!shouldRenderMath(text)) return escapeHtml(text);
  return `\\(${text}\\)`;
}

async function loadHeaderComponent() {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;

  try {
    const response = await fetch("components/header.html");
    if (!response.ok) throw new Error("Header component not found");
    placeholder.innerHTML = await response.text();
  } catch (error) {
    console.warn("Failed to load header component:", error);
  }
}

function renderMath(root = document.body) {
  if (typeof renderMathInElement !== "function") return;
  renderMathInElement(root, {
    delimiters: [
      { left: "\\(", right: "\\)", display: false },
      { left: "$$", right: "$$", display: true },
    ],
    throwOnError: false,
    errorColor: "#cc0000",
  });
}

const calculators = [
  {
    id: "mean",
    title: "Mean",
    category: "Descriptive",
    description: "Find the average of a data set.",
    formula: "x̄ = Σx / n",
    intro: "The mean is the average value of a dataset.",
    explanation: "Add every value and divide by the number of values.",
    whenToUse: "Use the mean when you want the average of a set of numbers.",
    commonMistakes:
      "Do not forget to divide by the total number of observations.",
    practice: "For 12, 15, 18, 20, the mean is 16.25.",
  },
  {
    id: "median",
    title: "Median",
    category: "Descriptive", 
    description: "Find the middle value of ordered data.",
    formula: "\\text{Median} = \\text{middle value of ordered data}",
    intro: "The median is the middle observation in an ordered list.",
    explanation:
      "Sort the values and choose the middle term or average of the two middle terms.",
    whenToUse: "Use the median when data contains outliers.",
    commonMistakes:
      "Remember to sort the data before finding the middle value.",
    practice: "For 4, 8, 10, 15, 20, the median is 10.",
  },
  {
    id: "mode",
    title: "Mode",
    category: "Descriptive",
    description: "Identify the most frequent value.",
    formula: "\\text{Mode} = \\text{most frequent value}",
    intro: "The mode is the value that occurs most often.",
    explanation: "Count how many times each value appears.",
    whenToUse: "Use the mode for categorical or discrete data.",
    commonMistakes: "A dataset can have no mode or several modes.",
    practice: "In 2, 3, 3, 7, 7, 7, the mode is 7.",
  },
  {
    id: "range",
    title: "Range",
    category: "Descriptive",
    description: "Measure the total spread of data.",
    formula: "\\text{Range} = \\text{Max} - \\text{Min}",
    intro:
      "The range shows the distance from the smallest to the largest value.",
    explanation: "Subtract the minimum value from the maximum value.",
    whenToUse: "Use the range for a quick look at spread.",
    commonMistakes: "The range ignores the middle values in the data.",
    practice: "For 3, 7, 9, 12, the range is 9.",
  },
  {
    id: "midrange",
    title: "Midrange",
    category: "Descriptive",
    description: "Locate the center of the data range.",
    formula: "\\text{Midrange} = (\\text{Max} + \\text{Min}) / 2",
    intro: "The midrange is the average of the largest and smallest values.",
    explanation: "Add the maximum and minimum then divide by 2.",
    whenToUse: "Use the midrange as a quick estimate of center.",
    commonMistakes: "It is sensitive to extreme values.",
    practice: "For 4, 8, 10, 16, the midrange is 10.",
  },
  {
    id: "variance-pop",
    title: "Variance (Population)",
    category: "Descriptive",
    description: "Measure spread from the mean.",
    formula: "σ² = Σ(x - μ)² / N",
    intro: "Variance measures how spread out values are around the mean.",
    explanation: "Square the differences from the mean and average them.",
    whenToUse: "Use variance when you need a measure of dispersion.",
    commonMistakes: "Do not mix up population and sample variance.",
    practice: "For 2, 4, 6, 8, the population variance is 5.",
  },
  {
    id: "variance-sample",
    title: "Variance (Sample)",
    category: "Descriptive",
    description: "Measure variability using sample data.",
    formula: "s² = Σ(x - x̄)² / (n - 1)",
    intro: "Sample variance uses a denominator of n - 1.",
    explanation:
      "Compute the squared deviations and divide by the sample size minus one.",
    whenToUse: "Use sample variance when analyzing sample data.",
    commonMistakes: "Do not divide by N when you are working with a sample.",
    practice: "For 2, 4, 6, the sample variance is 4.",
  },
  {
    id: "stddev-pop",
    title: "Standard Deviation (Population)",
    category: "Descriptive",
    description: "Measure dispersion in the original units.",
    formula: "σ = √(σ²)",
    intro: "Standard deviation is the square root of variance.",
    explanation: "Take the square root of the variance.",
    whenToUse: "Use it when you want the typical distance from the mean.",
    commonMistakes: "Do not forget to take the square root.",
    practice: "For 2, 4, 6, the population standard deviation is 1.63299.",
  },
  {
    id: "stddev-sample",
    title: "Standard Deviation (Sample)",
    category: "Descriptive",
    description: "Measure dispersion in sample data.",
    formula: "s = √s²",
    intro: "The sample standard deviation uses the sample variance.",
    explanation: "Take the square root of the sample variance.",
    whenToUse: "Use sample standard deviation for sample datasets.",
    commonMistakes: "Be consistent with sample-versus-population formulas.",
    practice: "For 2, 4, 6, the sample standard deviation is 2.",
  },
  {
    id: "quartiles",
    title: "Quartiles",
    category: "Descriptive",
    description: "Divide data into four equal parts.",
    formula: "Q1, Q2, Q3",
    intro: "Quartiles split sorted data into four groups.",
    explanation:
      "Find the 25th, 50th, and 75th percentiles of the ordered data.",
    whenToUse: "Use quartiles to describe the spread of a dataset.",
    commonMistakes: "Always sort the data first.",
    practice: "For 1, 2, 3, 4, 5, Q1 is 2 and Q3 is 4.",
  },
  {
    id: "percentiles",
    title: "Percentiles",
    category: "Descriptive",
    description: "Locate a value below which a percentage of data falls.",
    formula: "P_k = \\text{value at the } k\\text{-th percentile}",
    intro: "Percentiles help compare a value to the rest of the data.",
    explanation: "Use the percentile rank of the value in the ordered data.",
    whenToUse: "Use percentiles for standardized comparisons.",
    commonMistakes:
      "Different software uses slightly different interpolation methods.",
    practice: "The 75th percentile of 1, 2, 3, 4, 5 is 4.",
  },
  {
    id: "iqr",
    title: "Interquartile Range",
    category: "Descriptive",
    description: "Measure spread of the middle 50% of data.",
    formula: "IQR = Q3 - Q1",
    intro: "The interquartile range highlights the middle of the distribution.",
    explanation: "Subtract the first quartile from the third quartile.",
    whenToUse: "Use the IQR when outliers may distort the range.",
    commonMistakes: "Do not confuse IQR with the full range.",
    practice: "For 1, 2, 3, 4, 5, the IQR is 2.",
  },
  {
    id: "zscore",
    title: "Z-Score",
    category: "Descriptive",
    description: "Measure how far a value is from the mean.",
    formula: "z = (x - μ) / σ",
    intro:
      "A z-score tells you how many standard deviations a value is from the mean.",
    explanation: "Subtract the mean and divide by the standard deviation.",
    whenToUse: "Use a z-score to compare values from different distributions.",
    commonMistakes:
      "Use the correct mean and standard deviation for the distribution.",
    practice: "If x = 10, μ = 8, and σ = 2, the z-score is 1.",
  },
  {
    id: "factorial",
    title: "Factorial",
    category: "Counting",
    description:
      "Multiply a positive integer by every smaller positive integer.",
    formula: "n! = n × (n - 1) × ... × 1",
    intro: "Factorials are used in permutations and combinations.",
    explanation: "Multiply the integer by each positive integer below it.",
    whenToUse: "Use factorials for counting arrangements.",
    commonMistakes: "Factorial is only defined for non-negative integers.",
    practice: "5! = 120.",
  },
  {
    id: "permutation",
    title: "Permutation",
    category: "Counting",
    description: "Count ordered arrangements.",
    formula: "P(n, r) = n! / (n-r)!",
    intro: "Permutations count arrangements where order matters.",
    explanation: "Use the factorial formula to count ordered outcomes.",
    whenToUse: "Use permutations when order matters.",
    commonMistakes: "Do not use the combination formula when order matters.",
    practice: "P(5, 2) = 20.",
  },
  {
    id: "combination",
    title: "Combination",
    category: "Counting",
    description: "Count unordered selections.",
    formula: "C(n, r) = n! / (r!(n-r)!)",
    intro: "Combinations count selections where order does not matter.",
    explanation: "Divide by the factorial of the number of selected items.",
    whenToUse: "Use combinations when order does not matter.",
    commonMistakes: "Do not treat combinations like permutations.",
    practice: "C(5, 2) = 10.",
  },
  {
    id: "probability",
    title: "Basic Probability",
    category: "Probability",
    description: "Find the probability of an event.",
    formula: "P(A) = favorable / total",
    intro: "Probability measures how likely an event is.",
    explanation:
      "Divide the number of favorable outcomes by the total number of outcomes.",
    whenToUse: "Use basic probability for simple chance experiments.",
    commonMistakes: "Make sure the denominator is the total possible outcomes.",
    practice: "If 3 of 10 outcomes are favorable, the probability is 0.3.",
  },
  {
    id: "addition-rule",
    title: "Addition Rule",
    category: "Probability",
    description: "Find the probability of A or B.",
    formula: "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
    intro: "The addition rule combines overlapping events.",
    explanation: "Add the two probabilities and subtract the overlap.",
    whenToUse: "Use it for union of events.",
    commonMistakes: "Do not double-count the overlap.",
    practice: "If P(A)=0.4, P(B)=0.5, and P(A∩B)=0.2, the result is 0.7.",
  },
  {
    id: "multiplication-rule",
    title: "Multiplication Rule",
    category: "Probability",
    description: "Find the probability of A and B.",
    formula: "P(A ∩ B) = P(A)P(B)",
    intro: "The multiplication rule works for independent events.",
    explanation: "Multiply the probabilities of the two events.",
    whenToUse: "Use it for independent events.",
    commonMistakes: "Do not use it when events are dependent.",
    practice: "0.4 × 0.5 = 0.2.",
  },
  {
    id: "conditional-probability",
    title: "Conditional Probability",
    category: "Probability",
    description: "Find the probability of A given B.",
    formula: "P(A|B) = P(A ∩ B) / P(B)",
    intro:
      "Conditional probability updates a probability based on new information.",
    explanation:
      "Divide the probability of both events by the probability of the given event.",
    whenToUse: "Use it when one event depends on another.",
    commonMistakes: "Do not forget that the denominator is P(B).",
    practice: "If P(A∩B)=0.2 and P(B)=0.5, then P(A|B)=0.4.",
  },
  {
    id: "bayes",
    title: "Bayes' Theorem",
    category: "Probability",
    description: "Update probabilities with new evidence.",
    formula: "P(A|B) = P(A)P(B|A) / P(B)",
    intro: "Bayes' theorem updates a prior probability with new evidence.",
    explanation: "Use the prior, likelihood, and total probability.",
    whenToUse: "Use it for probability updates and diagnosis problems.",
    commonMistakes: "Make sure the denominator is the total probability of B.",
    practice:
      "A simple Bayes calculation uses the prior and likelihood values.",
  },
  {
    id: "expected-value",
    title: "Expected Value",
    category: "Probability",
    description: "Find the long-run average outcome.",
    formula: "E(X) = ΣxP(x)",
    intro: "The expected value is the average outcome over many trials.",
    explanation:
      "Multiply each possible value by its probability and sum the results.",
    whenToUse: "Use it for decision-making and gambling-style problems.",
    commonMistakes: "Do not forget to include every outcome.",
    practice: "If x = 1, 2, 3 with probabilities 0.2, 0.5, 0.3, then E(X)=2.1.",
  },
  {
    id: "binomial",
    title: "Binomial Distribution",
    category: "Distribution",
    description: "Calculate binomial probabilities.",
    formula: "P(X = x) = C(n, x) p^x (1-p)^(n-x)",
    intro:
      "The binomial distribution models the number of successes in repeated trials.",
    explanation: "Use the binomial formula when each trial has two outcomes.",
    whenToUse: "Use it for repeated independent trials with fixed probability.",
    commonMistakes:
      "Check that p is between 0 and 1 and n is a positive integer.",
    practice:
      "A fair coin flipped 5 times has a probability of exactly 3 heads.",
  },
  {
    id: "poisson",
    title: "Poisson Distribution",
    category: "Distribution",
    description: "Model the number of events in a fixed interval.",
    formula: "P(X = x) = e^{-λ}λ^x / x!",
    intro: "The Poisson distribution is common for counting rare events.",
    explanation: "Use the mean rate λ and the count x.",
    whenToUse: "Use it for counts of rare events over time or space.",
    commonMistakes: "The parameter λ must be positive.",
    practice: "Use λ = 2 and x = 3 for a simple example.",
  },
  {
    id: "normal",
    title: "Normal Distribution",
    category: "Distribution",
    description: "Model continuous data that clusters around a mean.",
    formula: "f(x) = 1 / (σ√(2π)) e^{-(x-μ)^2/(2σ^2)}",
    intro: "The normal curve is symmetric and bell-shaped.",
    explanation: "Plug in the mean, standard deviation, and value x.",
    whenToUse: "Use it for many natural and social science measurements.",
    commonMistakes:
      "A normal distribution requires a standard deviation greater than zero.",
    practice: "The density at the mean is highest for a normal curve.",
  },
  {
    id: "uniform",
    title: "Uniform Distribution",
    category: "Distribution",
    description: "Model equal chance over an interval.",
    formula: "f(x) = 1 / (b - a)",
    intro: "The uniform distribution assigns equal probability across a range.",
    explanation: "Divide 1 by the interval width.",
    whenToUse: "Use it when all outcomes in an interval are equally likely.",
    commonMistakes: "The interval must satisfy b > a.",
    practice: "For a = 2 and b = 8, the density is 0.1667.",
  },
  {
    id: "correlation",
    title: "Pearson Correlation",
    category: "Regression",
    description: "Measure the strength of a linear relationship.",
    formula: "r = Σ[(x - x̄)(y - ȳ)] / √Σ(x - x̄)²Σ(y - ȳ)²",
    intro:
      "The correlation coefficient shows how strongly two variables are linearly related.",
    explanation: "Standardize the x and y values and compare their movements.",
    whenToUse: "Use correlation when comparing two quantitative variables.",
    commonMistakes: "Correlation does not imply causation.",
    practice:
      "A high positive correlation indicates a strong increasing trend.",
  },
  {
    id: "regression",
    title: "Linear Regression",
    category: "Regression",
    description: "Fit a straight-line model to paired data.",
    formula: "ŷ = b₀ + b₁x",
    intro: "Regression estimates the best linear relationship between x and y.",
    explanation: "Estimate the slope and intercept from the paired data.",
    whenToUse: "Use regression to predict one variable from another.",
    commonMistakes:
      "A regression line is not guaranteed to fit every point perfectly.",
    practice: "Use paired x and y values to estimate the line.",
  },
  {
    id: "r2",
    title: "Coefficient of Determination (R²)",
    category: "Regression",
    description: "Measure how much variation is explained by the model.",
    formula: "R² = r²",
    intro: "R² shows how much of the variation in y is explained by x.",
    explanation: "Square the correlation coefficient.",
    whenToUse: "Use R² to judge the fit of a linear model.",
    commonMistakes: "A high R² does not guarantee a good causal model.",
    practice: "If r = 0.8, then R² = 0.64.",
  },
  {
    id: "sample-size",
    title: "Sample Size",
    category: "Sampling",
    description: "Estimate how many observations are needed.",
    formula: "n = (z² × p(1-p)) / E²",
    intro: "Sample size planning helps you collect enough data.",
    explanation:
      "Use the confidence level, expected proportion, and margin of error.",
    whenToUse: "Use it before gathering survey or experiment data.",
    commonMistakes:
      "Use a realistic estimate for p and a small enough margin of error.",
    practice: "A common example uses z = 1.96, p = 0.5, E = 0.05.",
  },
  {
    id: "margin-error",
    title: "Margin of Error",
    category: "Sampling",
    description: "Estimate the uncertainty in a sample statistic.",
    formula: "E = z√(p(1-p)/n)",
    intro:
      "The margin of error quantifies the uncertainty around a sample estimate.",
    explanation: "Use the confidence level, proportion, and sample size.",
    whenToUse: "Use it to report survey precision.",
    commonMistakes:
      "The margin of error grows when the sample size is smaller.",
    practice: "A typical survey uses a 95% confidence level.",
  },
  {
    id: "confidence-interval",
    title: "Confidence Interval",
    category: "Sampling",
    description: "Estimate a range for a population parameter.",
    formula: "CI = x̄ ± z(σ/√n)",
    intro: "A confidence interval gives a plausible range for the parameter.",
    explanation: "Add and subtract the margin of error around the sample mean.",
    whenToUse: "Use it when estimating a population mean from a sample.",
    commonMistakes:
      "Do not confuse the interval with the probability the parameter lies in it.",
    practice:
      "A 95% CI is often calculated from a sample mean and standard error.",
  },
];

const formulas = [
  {
    title: "Mean",
    category: "Descriptive",
    formula: "x̄ = Σx / n",
    explanation: "Average of all values.",
    variables: "x̄, Σx, n",
    example: "For 2, 4, 6, mean = 4.",
    application: "Summarizing average values.",
  },
  {
    title: "Median",
    category: "Descriptive",
    formula: "\{Median} = \text{middle value}",
    explanation: "Middle value in ordered data.",
    variables: "ordered values",
    example: "For 1, 2, 8, median = 2.",
    application: "Handling skewed data.",
  },
  {
    title: "Variance",
    category: "Descriptive",
    formula: "σ² = Σ(x - μ)² / N",
    explanation: "Average squared deviation from the mean.",
    variables: "x, μ, N",
    example: "Useful for measuring spread.",
    application: "Comparing variability between datasets.",
  },
  {
    title: "Basic Probability",
    category: "Probability",
    formula: "P(A) = \frac{\text{favorable}}{\text{total}}",
    explanation: "Relative likelihood of an event.",
    variables: "P(A), favorable, total",
    example: "3 favorable of 10 outcomes gives 0.3.",
    application: "Chance of events.",
  },
  {
    title: "Binomial Distribution",
    category: "Distribution",
    formula: "P(X = x) = C(n, x) p^x (1 - p)^{n - x}",
    explanation: "Probability of x successes in n trials.",
    variables: "n, x, p",
    example: "Flipping a fair coin 5 times.",
    application: "Success/failure experiments.",
  },
  {
    title: "Pearson Correlation",
    category: "Regression",
    formula: "r = Σ[(x - x̄)(y - ȳ)] / √Σ(x - x̄)²Σ(y - ȳ)²",
    explanation: "Measures linear association.",
    variables: "x, y, x̄, ȳ",
    example: "Used to examine trends.",
    application: "Understanding relationships.",
  },
];

const practiceProblems = [
  {
    title: "Mean practice",
    prompt: "Find the mean of 10, 12, 14, 16, 18.",
    answer: "14",
  },
  {
    title: "Probability practice",
    prompt:
      "A bag has 4 red and 6 blue marbles. What is the probability of drawing red?",
    answer: "0.4",
  },
  {
    title: "Variance practice",
    prompt: "Find the population variance for 2, 4, 6.",
    answer: "4",
  },
];

function renderCalculatorList() {
  const list = document.getElementById("calculator-list");
  if (!list) return;
  list.innerHTML = calculators
    .map(
      (calculator) => `
    <button class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition hover:border-brand-500 hover:bg-white dark:border-slate-700 dark:bg-slate-950" data-calculator-id="${calculator.id}">
      <div class="font-semibold">${calculator.title}</div>
      <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">${calculator.category}</div>
    </button>
  `,
    )
    .join("");
}

function renderCalculator(calculatorId) {
  const app = document.getElementById("calculator-app");
  if (!app) return;
  const calculator =
    calculators.find((item) => item.id === calculatorId) || calculators[0];
  const favorites = getStorage("favorites", []);
  const isFavorite = favorites.includes(calculator.id);
  app.innerHTML = `
    <div class="space-y-6">
      <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">${calculator.category}</p>
       <h2 class="mt-2 text-2xl font-semibold">
            <span>${calculator.title}</span>
            <span class="text-sm font-normal text-slate-600 dark:text-slate-300">
                ${calculator.intro}
            </span>
        </h2>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-6">
          <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
            <h3 class="text-lg font-semibold">Formula</h3>
            <div class="formula-card mt-3 rounded-2xl p-4 text-lg font-semibold">${wrapMath(calculator.formula)}</div>
            <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${calculator.explanation}</p>
          </section>
          <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
            <h3 class="text-lg font-semibold">Input</h3>
            <textarea id="calculator-input" rows="4" class="mt-3 w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 outline-none focus:border-brand-500 dark:border-slate-700 dark:bg-slate-950" placeholder="12, 18, 22, 25, 31"></textarea>
            <div class="mt-4 flex flex-wrap gap-3">
              <button id="calculate-btn" class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Calculate</button>
              <button id="clear-btn" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">Clear</button>
              <button id="example-btn" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">Load Example</button>
              <button id="copy-btn" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">Copy Result</button>
              <button id="print-btn" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">Print / Save PDF</button>
              <button id="favorite-btn" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold">${isFavorite ? "★ Favorite" : "☆ Favorite"}</button>
            </div>
          </section>
        </div>
        <div class="space-y-6">
          <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
            <h3 class="text-lg font-semibold">Result</h3>
            <div id="result-box" class="result-box mt-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-950"></div>
          </section>
          <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
            <h3 class="text-lg font-semibold">Step-by-step solution</h3>
            <ol id="steps" class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300"></ol>
          </section>
        </div>
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
          <h3 class="text-lg font-semibold">Interpretation</h3>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${calculator.intro}</p>
        </section>
        <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
          <h3 class="text-lg font-semibold">When to use</h3>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${calculator.whenToUse}</p>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300"><strong>Common mistakes:</strong> ${calculator.commonMistakes}</p>
        </section>
      </div>
      <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
        <h3 class="text-lg font-semibold">Practice example</h3>
        <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${calculator.practice}</p>
      </section>
      <section class="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
        <h3 class="text-lg font-semibold">Recent calculations</h3>
        <div id="recent-calculations" class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300"></div>
      </section>
    </div>
  `;

  const input = document.getElementById("calculator-input");
  const resultBox = document.getElementById("result-box");
  const steps = document.getElementById("steps");
  const calculate = document.getElementById("calculate-btn");
  const clear = document.getElementById("clear-btn");
  const example = document.getElementById("example-btn");
  const copy = document.getElementById("copy-btn");
  const printButton = document.getElementById("print-btn");
  const favoriteButton = document.getElementById("favorite-btn");
  const recentBox = document.getElementById("recent-calculations");

  const renderRecent = () => {
    const items = getStorage("recent", []);
    recentBox.innerHTML = items.length
      ? items
          .map(
            (item) =>
              `<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">${item.label}: <span class="font-semibold">${item.result}</span></div>`,
          )
          .join("")
      : "No recent calculations yet.";
  };

  const persistRecent = (label, result) => {
    const items = getStorage("recent", []);
    items.unshift({ label, result });
    const trimmed = items.slice(0, 5);
    setStorage("recent", trimmed);
    renderRecent();
  };

  const handle = () => {
    const validation = validateNumericInput(input.value, { minLength: 1 });
    if (!validation.valid) {
      resultBox.innerHTML = `<div class="text-red-500">${validation.message}</div>`;
      steps.innerHTML = "";
      showToast(validation.message);
      return;
    }

    const values = validation.values;
    let result = 0;
    let detail = "";
    let stepsList = [];

    if (calculator.id === "mean") {
      result = calculateMean(values);
      detail = `Mean = ${values.reduce((total, value) => total + value, 0)} / ${values.length}`;
      stepsList = buildDescriptiveSteps(values, calculator.id);
    } else if (calculator.id === "median") {
      result = calculateMedian(values);
      detail = `Median of ordered values ${[...values].sort((a, b) => a - b).join(", ")}`;
      stepsList = buildDescriptiveSteps(values, calculator.id);
    } else if (calculator.id === "mode") {
      result = calculateMode(values);
      detail = "Mode is the most frequent value";
      stepsList = buildDescriptiveSteps(values, calculator.id);
    } else if (calculator.id === "range") {
      result = calculateRange(values);
      detail = `Range = ${Math.max(...values)} - ${Math.min(...values)}`;
      stepsList = [
        `Maximum value = ${Math.max(...values)}`,
        `Minimum value = ${Math.min(...values)}`,
        `Range = ${Math.max(...values)} - ${Math.min(...values)} = ${result}`,
      ];
    } else if (calculator.id === "midrange") {
      result = (Math.max(...values) + Math.min(...values)) / 2;
      detail = `Midrange = (${Math.max(...values)} + ${Math.min(...values)}) / 2`;
      stepsList = [
        `Maximum value = ${Math.max(...values)}`,
        `Minimum value = ${Math.min(...values)}`,
        `Midrange = (${Math.max(...values)} + ${Math.min(...values)}) / 2 = ${result}`,
      ];
    } else if (calculator.id === "variance-pop") {
      result = calculateVariance(values, false);
      detail = `Population variance = Σ(x - μ)² / N`;
      stepsList = [`Mean = ${calculateMean(values)}`, `Variance = ${result}`];
    } else if (calculator.id === "variance-sample") {
      result = calculateVariance(values, true);
      detail = `Sample variance = Σ(x - x̄)² / (n - 1)`;
      stepsList = [`Mean = ${calculateMean(values)}`, `Variance = ${result}`];
    } else if (calculator.id === "stddev-pop") {
      result = calculateStdDev(values, false);
      detail = `Population standard deviation = √variance`;
      stepsList = [
        `Variance = ${calculateVariance(values, false)}`,
        `Standard deviation = √${calculateVariance(values, false)} = ${result}`,
      ];
    } else if (calculator.id === "stddev-sample") {
      result = calculateStdDev(values, true);
      detail = `Sample standard deviation = √variance`;
      stepsList = [
        `Variance = ${calculateVariance(values, true)}`,
        `Standard deviation = √${calculateVariance(values, true)} = ${result}`,
      ];
    } else if (calculator.id === "quartiles") {
      const summary = calculateFiveNumberSummary(values);
      result = [summary.q1, summary.median, summary.q3];
      detail = `Q1 = ${summary.q1}, Q2 = ${summary.median}, Q3 = ${summary.q3}`;
      stepsList = [
        `Sorted values = ${[...values].sort((a, b) => a - b).join(", ")}`,
        `Q1 = ${summary.q1}`,
        `Q2 = ${summary.median}`,
        `Q3 = ${summary.q3}`,
      ];
    } else if (calculator.id === "percentiles") {
      const percentileTarget = values[0];
      const subset = values.slice(1);
      result = calculatePercentile(subset, percentileTarget);
      detail = `${percentileTarget}th percentile of the data`;
      stepsList = [
        `Target percentile = ${percentileTarget}`,
        `Ordered values = ${[...subset].sort((a, b) => a - b).join(", ")}`,
        `Percentile estimate = ${result}`,
      ];
    } else if (calculator.id === "iqr") {
      const summary = calculateFiveNumberSummary(values);
      result = summary.q3 - summary.q1;
      detail = `IQR = Q3 - Q1`;
      stepsList = [
        `Q1 = ${summary.q1}`,
        `Q3 = ${summary.q3}`,
        `IQR = ${summary.q3} - ${summary.q1} = ${result}`,
      ];
    } else if (calculator.id === "zscore") {
      const [x, meanValue, sdValue] = values;
      result = (x - meanValue) / sdValue;
      detail = `z = (${x} - ${meanValue}) / ${sdValue}`;
      stepsList = [
        `x = ${x}`,
        `μ = ${meanValue}`,
        `σ = ${sdValue}`,
        `z = (${x} - ${meanValue}) / ${sdValue} = ${result}`,
      ];
    } else if (calculator.id === "factorial") {
      result = factorial(values[0]);
      detail = `${values[0]}!`;
      stepsList = [`${values[0]}! = ${result}`];
    } else if (calculator.id === "permutation") {
      result = factorial(values[0]) / factorial(values[0] - values[1]);
      detail = `P(${values[0]}, ${values[1]})`;
      stepsList = [
        `n = ${values[0]}`,
        `r = ${values[1]}`,
        `P(n,r) = ${result}`,
      ];
    } else if (calculator.id === "combination") {
      result =
        factorial(values[0]) /
        (factorial(values[1]) * factorial(values[0] - values[1]));
      detail = `C(${values[0]}, ${values[1]})`;
      stepsList = [
        `n = ${values[0]}`,
        `r = ${values[1]}`,
        `C(n,r) = ${result}`,
      ];
    } else if (calculator.id === "probability") {
      result = calculateBasicProbability(values[0], values[1]);
      detail = `Probability = ${values[0]} / ${values[1]}`;
      stepsList = [
        `Favorable outcomes = ${values[0]}`,
        `Total outcomes = ${values[1]}`,
        `Probability = ${values[0]} / ${values[1]} = ${result}`,
      ];
    } else if (calculator.id === "addition-rule") {
      result = calculateAdditionRule(values[0], values[1], values[2]);
      detail = `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`;
      stepsList = [
        `P(A) = ${values[0]}`,
        `P(B) = ${values[1]}`,
        `P(A∩B) = ${values[2]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "multiplication-rule") {
      result = calculateMultiplicationRule(values[0], values[1]);
      detail = `P(A ∩ B) = P(A)P(B)`;
      stepsList = [
        `P(A) = ${values[0]}`,
        `P(B) = ${values[1]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "conditional-probability") {
      result = calculateConditionalProbability(values[0], values[1]);
      detail = `P(A|B) = P(A∩B) / P(B)`;
      stepsList = [
        `P(A∩B) = ${values[0]}`,
        `P(B) = ${values[1]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "bayes") {
      result = calculateBayesTheorem(values[0], values[1], values[2]);
      detail = `P(A|B) = P(A)P(B|A) / P(B)`;
      stepsList = [
        `P(A) = ${values[0]}`,
        `P(B|A) = ${values[1]}`,
        `P(B) = ${values[2]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "expected-value") {
      result = calculateExpectedValue(
        values.filter((_, index) => index % 2 === 0),
        values.filter((_, index) => index % 2 === 1),
      );
      detail = `E(X) = ΣxP(x)`;
      stepsList = [
        `Values = ${values.filter((_, index) => index % 2 === 0).join(", ")}`,
        `Probabilities = ${values.filter((_, index) => index % 2 === 1).join(", ")}`,
        `Expected value = ${result}`,
      ];
    } else if (calculator.id === "binomial") {
      result = calculateBinomialProbability(values[0], values[1], values[2]);
      detail = `P(X = ${values[2]}) with n=${values[0]}, p=${values[1]}`;
      stepsList = [
        `n = ${values[0]}`,
        `p = ${values[1]}`,
        `x = ${values[2]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "poisson") {
      result = calculatePoissonProbability(values[0], values[1]);
      detail = `P(X = ${values[1]}) with λ=${values[0]}`;
      stepsList = [
        `λ = ${values[0]}`,
        `x = ${values[1]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "normal") {
      result = calculateNormalProbability(values[0], values[1], values[2]);
      detail = `f(x) for μ=${values[0]}, σ=${values[1]}, x=${values[2]}`;
      stepsList = [
        `μ = ${values[0]}`,
        `σ = ${values[1]}`,
        `x = ${values[2]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "uniform") {
      result = calculateUniformProbability(values[0], values[1]);
      detail = `f(x) = 1 / (b - a)`;
      stepsList = [
        `a = ${values[0]}`,
        `b = ${values[1]}`,
        `Result = ${result}`,
      ];
    } else if (calculator.id === "correlation") {
      const middle = Math.floor(values.length / 2);
      result = calculateCorrelation(
        values.slice(0, middle),
        values.slice(middle),
      );
      detail = "Correlation between paired variables";
      stepsList = [
        `x-values = ${values.slice(0, middle).join(", ")}`,
        `y-values = ${values.slice(middle).join(", ")}`,
        `Correlation = ${result}`,
      ];
    } else if (calculator.id === "regression") {
      const middle = Math.floor(values.length / 2);
      const regression = calculateRegression(
        values.slice(0, middle),
        values.slice(middle),
      );
      result = regression.equation;
      detail = regression.equation;
      stepsList = [
        `x-values = ${values.slice(0, middle).join(", ")}`,
        `y-values = ${values.slice(middle).join(", ")}`,
        `Regression line = ${regression.equation}`,
      ];
    } else if (calculator.id === "r2") {
      const middle = Math.floor(values.length / 2);
      result = calculateR2(
        calculateCorrelation(values.slice(0, middle), values.slice(middle)),
      );
      detail = `R² = r²`;
      stepsList = [
        `Correlation = ${calculateCorrelation(values.slice(0, middle), values.slice(middle))}`,
        `R² = ${result}`,
      ];
    } else if (calculator.id === "sample-size") {
      const [z, p, error] = values;
      result = (z ** 2 * p * (1 - p)) / error ** 2;
      detail = `n = (z² × p(1-p)) / E²`;
      stepsList = [
        `z = ${z}`,
        `p = ${p}`,
        `E = ${error}`,
        `Sample size = ${result}`,
      ];
    } else if (calculator.id === "margin-error") {
      const [z, p, n] = values;
      result = z * Math.sqrt((p * (1 - p)) / n);
      detail = `E = z√(p(1-p)/n)`;
      stepsList = [
        `z = ${z}`,
        `p = ${p}`,
        `n = ${n}`,
        `Margin of error = ${result}`,
      ];
    } else if (calculator.id === "confidence-interval") {
      const [meanValue, sdValue, nValue, zValue] = values;
      const error = zValue * (sdValue / Math.sqrt(nValue));
      result = `${(meanValue - error).toFixed(4)} to ${(meanValue + error).toFixed(4)}`;
      detail = `CI = x̄ ± z(σ/√n)`;
      stepsList = [
        `x̄ = ${meanValue}`,
        `σ = ${sdValue}`,
        `n = ${nValue}`,
        `z = ${zValue}`,
        `Margin of error = ${error}`,
        `Confidence interval = ${result}`,
      ];
    }

    const displayValue = Array.isArray(result)
      ? result.map((item) => wrapMath(item)).join(", ")
      : typeof result === "number"
        ? result.toFixed(4)
        : wrapMath(result);
    resultBox.innerHTML = `<div class="text-2xl font-semibold">${displayValue}</div><div class="mt-2 text-sm text-slate-500 dark:text-slate-400">${wrapMath(detail)}</div>`;
    steps.innerHTML = stepsList
      .map((step) => `<li>${wrapMath(step)}</li>`)
      .join("");
    renderMath(app);
    persistRecentCalculation(calculator.title, displayValue);
    showToast("Calculation complete");
  };

  calculate?.addEventListener("click", handle);
  clear?.addEventListener("click", () => {
    input.value = "";
    resultBox.innerHTML = "";
    steps.innerHTML = "";
  });
  example?.addEventListener("click", () => {
    input.value = getInputExample(calculator.id);
  });
  copy?.addEventListener("click", async () => {
    const text = resultBox.textContent;
    if (!text) {
      showToast("No result to copy");
      return;
    }
    await navigator.clipboard.writeText(text);
    showToast("Result copied");
  });
  printButton?.addEventListener("click", () => {
    window.print();
    showToast("Opening print dialog");
  });
  favoriteButton?.addEventListener("click", () => {
    const favorites = getStorage("favorites", []);
    if (favorites.includes(calculator.id)) {
      const next = favorites.filter((item) => item !== calculator.id);
      setStorage("favorites", next);
      showToast("Removed from favorites");
    } else {
      favorites.push(calculator.id);
      setStorage("favorites", favorites);
      showToast("Added to favorites");
    }
    renderCalculator(calculator.id);
  });
  renderRecent();
  renderMath(app);
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let index = 2; index <= n; index += 1) {
    result *= index;
  }
  return result;
}

function getInputExample(calculatorId) {
  switch (calculatorId) {
    case "correlation":
    case "regression":
    case "r2":
      return "1, 2, 3, 4, 2, 3, 4, 5";
    case "probability":
      return "3, 10";
    case "addition-rule":
      return "0.4, 0.5, 0.2";
    case "permutation":
      return "5, 2";
    case "combination":
      return "5, 2";
    case "binomial":
      return "5, 0.5, 3";
    case "poisson":
      return "2, 3";
    case "normal":
      return "0, 1, 1.2";
    case "uniform":
      return "2, 8";
    case "sample-size":
      return "1.96, 0.5, 0.05";
    case "margin-error":
      return "1.96, 0.5, 100";
    case "confidence-interval":
      return "50, 10, 100, 1.96";
    case "zscore":
      return "10, 8, 2";
    case "expected-value":
      return "1, 0.2, 2, 0.5, 3, 0.3";
    default:
      return "12, 15, 18, 20";
  }
}

function persistRecentCalculation(label, result) {
  const items = getStorage("recent", []);
  items.unshift({ label, result });
  setStorage("recent", items.slice(0, 5));
}

function renderFormulaLibrary() {
  const container = document.getElementById("formula-library");
  if (!container) return;
  container.innerHTML = formulas
    .map(
      (formula) => `
    <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-xl font-semibold">${formula.title}</h2>
        <span class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-600">${formula.category}</span>
      </div>
      <div class="formula-card mt-4 rounded-2xl p-4 text-lg font-semibold">${wrapMath(formula.formula)}</div>
      <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${formula.explanation}</p>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300"><strong>Variables:</strong> ${formula.variables}</p>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300"><strong>Example:</strong> ${formula.example}</p>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300"><strong>Application:</strong> ${formula.application}</p>
    </article>
  `,
    )
    .join("");
  renderMath(container);
}

function renderPractice() {
  const container = document.getElementById("practice-list");
  if (!container) return;
  container.innerHTML = practiceProblems
    .map(
      (problem) => `
    <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-xl font-semibold">${problem.title}</h2>
      <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${problem.prompt}</p>
      <div class="mt-4 flex items-center gap-3">
        <button class="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white" data-answer="${problem.answer}">Show Answer</button>
      </div>
    </article>
  `,
    )
    .join("");

  container.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      showToast(`Answer: ${button.dataset.answer}`);
    });
  });
}

function initCalculatorInteraction() {
  renderCalculatorList();
  renderCalculator(calculators[0].id);
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-calculator-id]");
    if (button) {
      renderCalculator(button.dataset.calculatorId);
    }
  });
}

function initHomePage() {
  const search = document.getElementById("calculator-search");
  if (search) {
    initSearch("#calculator-search", calculators, (filtered) => {
      const list = document.getElementById("calculator-list");
      if (!list) return;
      list.innerHTML = filtered
        .map(
          (calculator) => `
        <button class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm transition hover:border-brand-500 hover:bg-white dark:border-slate-700 dark:bg-slate-950" data-calculator-id="${calculator.id}">
          <div class="font-semibold">${calculator.title}</div>
          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">${calculator.category}</div>
        </button>
      `,
        )
        .join("");
    });
  }
}

function initFormulaPage() {
  const search = document.getElementById("formula-search");
  if (search) {
    initSearch("#formula-search", formulas, (filtered) => {
      const container = document.getElementById("formula-library");
      if (!container) return;
      container.innerHTML = filtered
        .map(
          (formula) => `
        <article class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-xl font-semibold">${formula.title}</h2>
            <span class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-600">${formula.category}</span>
          </div>
          <div class="formula-card mt-4 rounded-2xl p-4 text-lg font-semibold">${wrapMath(formula.formula)}</div>
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">${formula.explanation}</p>
        </article>
      `,
        )
        .join("");
      renderMath(container);
    });
  }
}

function initFavorites() {
  const bar = document.getElementById("favorites-bar");
  if (!bar) return;
  const favorites = getStorage("favorites", []);
  bar.innerHTML = favorites.length
    ? `Favorites: ${favorites.join(", ")}`
    : "No favorites saved yet.";
}

loadHeaderComponent().finally(() => {
  initTheme();
  initMobileMenu();
  initScrollTop();
  initLoader();

  if (document.getElementById("calculator-list")) {
    initCalculatorInteraction();
    initHomePage();
    initFavorites();
  }

  if (document.getElementById("formula-library")) {
    renderFormulaLibrary();
    initFormulaPage();
  }

  if (document.getElementById("practice-list")) {
    renderPractice();
  }
});
  initCalculatorInteraction();
  initHomePage();
  initFavorites();


if (document.getElementById("formula-library")) {
  renderFormulaLibrary();
  initFormulaPage();
}

if (document.getElementById("practice-list")) {
  renderPractice();
}
