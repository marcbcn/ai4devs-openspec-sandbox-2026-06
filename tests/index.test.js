import { run } from '../index.js';

// Fija "ahora" a una fecha conocida para que los diffs sean deterministas
const NOW = new Date('2026-06-17T12:00:00Z');

function mockParseDate(interpretations) {
  return async (_input, _callApi) => interpretations;
}

describe('run', () => {
  describe('fecha pasada no ambigua', () => {
    test('muestra el tiempo transcurrido', async () => {
      const parseDateFn = mockParseDate([
        { label: '1 de enero de 2026', date: new Date('2026-01-01T12:00:00Z') },
      ]);

      const result = await run('2026-01-01', parseDateFn, NOW);

      expect(result).toContain('Hace');
      expect(result).not.toContain('ambigua');
      expect(result).not.toContain('→');
    });
  });

  describe('fecha futura no ambigua', () => {
    test('muestra el tiempo restante', async () => {
      const parseDateFn = mockParseDate([
        { label: '1 de enero de 2027', date: new Date('2027-01-01T12:00:00Z') },
      ]);

      const result = await run('2027-01-01', parseDateFn, NOW);

      expect(result).toContain('Faltan');
      expect(result).not.toContain('ambigua');
    });
  });

  describe('fecha ambigua', () => {
    test('muestra cabecera de ambigüedad y ambas interpretaciones', async () => {
      const parseDateFn = mockParseDate([
        { label: '12 de octubre de 2025', date: new Date('2025-10-12T12:00:00Z') },
        { label: '10 de diciembre de 2025', date: new Date('2025-12-10T12:00:00Z') },
      ]);

      const result = await run('12/10/2025', parseDateFn, NOW);

      expect(result).toContain('Fecha ambigua');
      expect(result).toContain('→ Si es 12 de octubre de 2025');
      expect(result).toContain('→ Si es 10 de diciembre de 2025');
      expect(result).toContain('Hace');
    });
  });

  describe('fecha inválida', () => {
    test('devuelve mensaje de error sin stack trace', async () => {
      const parseDateFn = async () => {
        throw new Error('No se pudo interpretar la fecha: "abc"');
      };

      const result = await run('abc', parseDateFn, NOW);

      expect(result).toContain('Error');
      expect(result).toContain('No se pudo interpretar la fecha');
      expect(result).not.toContain('at ');       // sin stack trace
      expect(result).not.toContain('node_modules');
    });
  });

  describe('resultado menor de un minuto', () => {
    test('fecha pasada hace menos de 1 minuto → "Hace unos instantes"', async () => {
      const thirtySecondsAgo = new Date(NOW.getTime() - 30_000);
      const parseDateFn = mockParseDate([
        { label: 'hace un momento', date: thirtySecondsAgo },
      ]);

      const result = await run('hace un momento', parseDateFn, NOW);

      expect(result).toBe('Hace unos instantes');
    });

    test('fecha futura en menos de 1 minuto → "En unos instantes"', async () => {
      const inThirtySeconds = new Date(NOW.getTime() + 30_000);
      const parseDateFn = mockParseDate([
        { label: 'en un momento', date: inThirtySeconds },
      ]);

      const result = await run('en un momento', parseDateFn, NOW);

      expect(result).toBe('En unos instantes');
    });
  });

  describe('input vacío o ausente', () => {
    test('devuelve mensaje de uso si no se pasa input', async () => {
      const result = await run(undefined, undefined, NOW);

      expect(result).toContain('Uso:');
      expect(result).toContain('node index.js');
    });

    test('devuelve mensaje de uso si el input es cadena vacía', async () => {
      const result = await run('', undefined, NOW);

      expect(result).toContain('Uso:');
    });
  });
});
