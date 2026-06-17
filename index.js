import { parseDate } from './src/parseDate.js';
import { formatDiff } from './src/formatDiff.js';
import { renderOutput } from './src/renderOutput.js';

export async function run(input, parseDateFn = parseDate, now = new Date()) {
  if (!input) {
    return 'Uso: node index.js "<fecha>"\nEjemplo: node index.js "12/10/2025"';
  }

  try {
    const interpretations = await parseDateFn(input);
    const diffs = interpretations.map(({ date }) => formatDiff(date, now));
    return renderOutput(interpretations, diffs);
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

// Punto de entrada CLI — efectos secundarios confinados aquí
if (process.argv[1].endsWith('index.js')) {
  const input = process.argv[2];
  run(input).then(console.log);
}
