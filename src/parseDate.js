import Anthropic from '@anthropic-ai/sdk';

const PROMPT = (input) => `
Eres un asistente que interpreta fechas en texto libre.

Dado el siguiente texto: "${input}"

Devuelve ÚNICAMENTE un objeto JSON (sin explicaciones, sin markdown) con esta estructura:
{
  "interpretations": [
    { "label": "<descripción en español, ej: 12 de octubre de 2025>", "date": "<fecha en formato ISO YYYY-MM-DD>" }
  ]
}

Reglas:
- Si la fecha es ambigua (por ejemplo 12/10/2025 puede ser 12 de octubre o 10 de diciembre), incluye TODAS las interpretaciones posibles en el array.
- Si la fecha no es ambigua, incluye solo una interpretación.
- Si el texto no representa ninguna fecha válida, devuelve: { "interpretations": [] }
- Las fechas relativas como "el próximo 3 de marzo" se resuelven respecto al año actual (${new Date().getFullYear()}) o el siguiente si la fecha ya pasó.
- El campo "label" siempre en español con el formato "D de Mes de YYYY".
- El campo "date" siempre en formato ISO YYYY-MM-DD.
`.trim();

async function defaultCallApi(prompt) {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  });
  return message.content[0].text;
}

export async function parseDate(input, callApi = defaultCallApi) {
  const raw = await callApi(PROMPT(input));
  const parsed = JSON.parse(raw);

  if (!parsed.interpretations || parsed.interpretations.length === 0) {
    throw new Error(`No se pudo interpretar la fecha: "${input}"`);
  }

  return parsed.interpretations.map(({ label, date }) => ({
    label,
    date: new Date(date),
  }));
}
