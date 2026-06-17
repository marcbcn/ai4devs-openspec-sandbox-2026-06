export function renderOutput(interpretations, diffs) {
  if (interpretations.length === 1) {
    return diffs[0];
  }

  const blocks = interpretations.map(({ label }, i) =>
    `→ Si es ${label}:\n  ${diffs[i]}`
  );

  return [
    'Fecha ambigua. Mostrando todas las interpretaciones posibles:',
    '',
    ...blocks.flatMap((block, i) => (i < blocks.length - 1 ? [block, ''] : [block])),
  ].join('\n');
}
