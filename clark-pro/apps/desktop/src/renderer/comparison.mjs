const MAX_LCS_CELLS = 250_000;

export function changedLineIndexes(targetLines, comparisonLines) {
  const target = targetLines.map(String);
  const comparison = comparisonLines.map(String);
  if (target.length * comparison.length > MAX_LCS_CELLS) {
    return new Set(target.flatMap((line, index) => line === comparison[index] ? [] : [index]));
  }

  const lengths = Array.from({ length: target.length + 1 }, () => new Uint32Array(comparison.length + 1));
  for (let targetIndex = target.length - 1; targetIndex >= 0; targetIndex -= 1) {
    for (let comparisonIndex = comparison.length - 1; comparisonIndex >= 0; comparisonIndex -= 1) {
      lengths[targetIndex][comparisonIndex] = target[targetIndex] === comparison[comparisonIndex]
        ? lengths[targetIndex + 1][comparisonIndex + 1] + 1
        : Math.max(lengths[targetIndex + 1][comparisonIndex], lengths[targetIndex][comparisonIndex + 1]);
    }
  }

  const matched = new Set();
  let targetIndex = 0;
  let comparisonIndex = 0;
  while (targetIndex < target.length && comparisonIndex < comparison.length) {
    if (target[targetIndex] === comparison[comparisonIndex]) {
      matched.add(targetIndex);
      targetIndex += 1;
      comparisonIndex += 1;
    } else if (lengths[targetIndex + 1][comparisonIndex] >= lengths[targetIndex][comparisonIndex + 1]) {
      targetIndex += 1;
    } else {
      comparisonIndex += 1;
    }
  }

  return new Set(target.flatMap((_line, index) => matched.has(index) ? [] : [index]));
}
