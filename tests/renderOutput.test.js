import { renderOutput } from '../src/renderOutput.js';

describe('renderOutput', () => {
  describe('interpretación única (no ambigua)', () => {
    test('muestra directamente el diff sin cabecera de ambigüedad', () => {
      const interpretations = [
        { label: '12 de octubre de 2025', date: new Date('2025-10-12') },
      ];
      const diffs = ['Hace 8 meses y 5 días'];

      const result = renderOutput(interpretations, diffs);

      expect(result).toBe('Hace 8 meses y 5 días');
    });

    test('no contiene la palabra "ambigua" cuando hay una sola interpretación', () => {
      const interpretations = [
        { label: '1 de enero de 2020', date: new Date('2020-01-01') },
      ];
      const diffs = ['Hace 6 años'];

      const result = renderOutput(interpretations, diffs);

      expect(result).not.toContain('ambigua');
      expect(result).not.toContain('→');
    });
  });

  describe('interpretación ambigua (múltiples resultados)', () => {
    test('muestra cabecera de ambigüedad', () => {
      const interpretations = [
        { label: '12 de octubre de 2025', date: new Date('2025-10-12') },
        { label: '10 de diciembre de 2025', date: new Date('2025-12-10') },
      ];
      const diffs = ['Hace 8 meses y 5 días', 'Faltan 5 meses y 23 días'];

      const result = renderOutput(interpretations, diffs);

      expect(result).toContain('Fecha ambigua');
    });

    test('muestra cada interpretación con su flecha y etiqueta', () => {
      const interpretations = [
        { label: '12 de octubre de 2025', date: new Date('2025-10-12') },
        { label: '10 de diciembre de 2025', date: new Date('2025-12-10') },
      ];
      const diffs = ['Hace 8 meses y 5 días', 'Faltan 5 meses y 23 días'];

      const result = renderOutput(interpretations, diffs);

      expect(result).toContain('→ Si es 12 de octubre de 2025');
      expect(result).toContain('→ Si es 10 de diciembre de 2025');
    });

    test('muestra el diff debajo de cada etiqueta', () => {
      const interpretations = [
        { label: '12 de octubre de 2025', date: new Date('2025-10-12') },
        { label: '10 de diciembre de 2025', date: new Date('2025-12-10') },
      ];
      const diffs = ['Hace 8 meses y 5 días', 'Faltan 5 meses y 23 días'];

      const result = renderOutput(interpretations, diffs);

      expect(result).toContain('Hace 8 meses y 5 días');
      expect(result).toContain('Faltan 5 meses y 23 días');
    });

    test('el orden de salida respeta el orden del array de entrada', () => {
      const interpretations = [
        { label: 'Primera interpretación', date: new Date('2025-01-01') },
        { label: 'Segunda interpretación', date: new Date('2025-06-01') },
        { label: 'Tercera interpretación', date: new Date('2025-12-01') },
      ];
      const diffs = ['Diff A', 'Diff B', 'Diff C'];

      const result = renderOutput(interpretations, diffs);

      const posA = result.indexOf('Diff A');
      const posB = result.indexOf('Diff B');
      const posC = result.indexOf('Diff C');
      expect(posA).toBeLessThan(posB);
      expect(posB).toBeLessThan(posC);
    });

    test('formato completo de salida ambigua', () => {
      const interpretations = [
        { label: '12 de octubre de 2025', date: new Date('2025-10-12') },
        { label: '10 de diciembre de 2025', date: new Date('2025-12-10') },
      ];
      const diffs = ['Hace 8 meses y 5 días', 'Faltan 5 meses y 23 días'];

      const result = renderOutput(interpretations, diffs);

      const expected = [
        'Fecha ambigua. Mostrando todas las interpretaciones posibles:',
        '',
        '→ Si es 12 de octubre de 2025:',
        '  Hace 8 meses y 5 días',
        '',
        '→ Si es 10 de diciembre de 2025:',
        '  Faltan 5 meses y 23 días',
      ].join('\n');

      expect(result).toBe(expected);
    });
  });
});
