import { formatDiff } from '../src/formatDiff.js';

// Helper: crea una fecha desplazada N unidades desde "ahora"
function makeDate({ years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0 } = {}) {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  d.setMinutes(d.getMinutes() + minutes);
  d.setSeconds(d.getSeconds() + seconds);
  return d;
}

describe('formatDiff', () => {
  describe('fechas pasadas', () => {
    test('hace exactamente 1 año', () => {
      const date = makeDate({ years: -1 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 año');
    });

    test('hace 2 años, 3 meses y 5 días', () => {
      const date = makeDate({ years: -2, months: -3, days: -5 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 2 años, 3 meses y 5 días');
    });

    test('hace 1 mes y 1 día', () => {
      const date = makeDate({ months: -1, days: -1 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 mes y 1 día');
    });

    test('hace 3 horas y 30 minutos', () => {
      const date = makeDate({ hours: -3, minutes: -30 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 3 horas y 30 minutos');
    });

    test('hace 1 hora', () => {
      const date = makeDate({ hours: -1 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 hora');
    });

    test('hace 45 minutos', () => {
      const date = makeDate({ minutes: -45 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 45 minutos');
    });

    test('hace 1 minuto', () => {
      const date = makeDate({ minutes: -1 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 minuto');
    });

    test('hace unos instantes (menos de 1 minuto)', () => {
      const date = makeDate({ seconds: -30 });
      const result = formatDiff(date);
      expect(result).toBe('Hace unos instantes');
    });
  });

  describe('fechas futuras', () => {
    test('en exactamente 1 año', () => {
      const date = makeDate({ years: 1 });
      const result = formatDiff(date);
      expect(result).toBe('Faltan 1 año');
    });

    test('en 2 años, 3 meses y 5 días', () => {
      const date = makeDate({ years: 2, months: 3, days: 5 });
      const result = formatDiff(date);
      expect(result).toBe('Faltan 2 años, 3 meses y 5 días');
    });

    test('en 6 meses', () => {
      const date = makeDate({ months: 6 });
      const result = formatDiff(date);
      expect(result).toBe('Faltan 6 meses');
    });

    test('en 2 días y 4 horas', () => {
      const date = makeDate({ days: 2, hours: 4 });
      const result = formatDiff(date);
      expect(result).toBe('Faltan 2 días y 4 horas');
    });

    test('en unos instantes (menos de 1 minuto)', () => {
      const date = makeDate({ seconds: 30 });
      const result = formatDiff(date);
      expect(result).toBe('En unos instantes');
    });
  });

  describe('casos con unidades singulares/plurales', () => {
    test('1 día (singular)', () => {
      const date = makeDate({ days: -1 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 día');
    });

    test('2 días (plural)', () => {
      const date = makeDate({ days: -2 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 2 días');
    });

    test('1 minuto (singular)', () => {
      const date = makeDate({ minutes: -1 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 minuto');
    });

    test('2 minutos (plural)', () => {
      const date = makeDate({ minutes: -2 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 2 minutos');
    });
  });

  describe('omisión de unidades en cero', () => {
    test('no muestra horas si son 0', () => {
      const date = makeDate({ days: -1, minutes: -30 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 1 día y 30 minutos');
    });

    test('no muestra minutos si son 0', () => {
      const date = makeDate({ hours: -2 });
      const result = formatDiff(date);
      expect(result).toBe('Hace 2 horas');
    });
  });
});
