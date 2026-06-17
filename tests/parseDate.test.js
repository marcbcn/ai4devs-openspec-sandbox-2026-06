import { parseDate } from '../src/parseDate.js';

// Factory: crea un mock de callApi que devuelve el JSON dado
function mockApi(interpretations) {
  return async (_prompt) => JSON.stringify({ interpretations });
}

// Factory: crea un mock que devuelve JSON de fecha inválida
function mockApiInvalid() {
  return async (_prompt) => JSON.stringify({ interpretations: [] });
}

// Factory: crea un mock que devuelve JSON malformado
function mockApiBroken() {
  return async (_prompt) => 'esto no es json';
}

describe('parseDate', () => {
  describe('fecha no ambigua', () => {
    test('formato ISO devuelve array de una interpretación', async () => {
      const callApi = mockApi([
        { label: '1 de junio de 2025', date: '2025-06-01' },
      ]);

      const result = await parseDate('2025-06-01', callApi);

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('1 de junio de 2025');
      expect(result[0].date).toBeInstanceOf(Date);
      expect(result[0].date.getFullYear()).toBe(2025);
      expect(result[0].date.getMonth()).toBe(5); // junio = mes 5 (0-indexed)
      expect(result[0].date.getDate()).toBe(1);
    });

    test('lenguaje natural en español devuelve array de una interpretación', async () => {
      const callApi = mockApi([
        { label: '3 de marzo de 2026', date: '2026-03-03' },
      ]);

      const result = await parseDate('el próximo 3 de marzo', callApi);

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('3 de marzo de 2026');
      expect(result[0].date).toBeInstanceOf(Date);
      expect(result[0].date.getFullYear()).toBe(2026);
    });
  });

  describe('fecha ambigua', () => {
    test('formato con barras devuelve array de dos interpretaciones', async () => {
      const callApi = mockApi([
        { label: '12 de octubre de 2025', date: '2025-10-12' },
        { label: '10 de diciembre de 2025', date: '2025-12-10' },
      ]);

      const result = await parseDate('12/10/2025', callApi);

      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('12 de octubre de 2025');
      expect(result[1].label).toBe('10 de diciembre de 2025');
    });

    test('cada interpretación tiene un objeto Date válido', async () => {
      const callApi = mockApi([
        { label: '12 de octubre de 2025', date: '2025-10-12' },
        { label: '10 de diciembre de 2025', date: '2025-12-10' },
      ]);

      const result = await parseDate('12/10/2025', callApi);

      expect(result[0].date).toBeInstanceOf(Date);
      expect(result[0].date.getMonth()).toBe(9);  // octubre = mes 9
      expect(result[1].date).toBeInstanceOf(Date);
      expect(result[1].date.getMonth()).toBe(11); // diciembre = mes 11
    });
  });

  describe('fecha inválida', () => {
    test('lanza un error cuando la API no devuelve interpretaciones', async () => {
      const callApi = mockApiInvalid();

      await expect(parseDate('esto no es una fecha', callApi))
        .rejects
        .toThrow('No se pudo interpretar la fecha');
    });

    test('el mensaje de error incluye el input original', async () => {
      const callApi = mockApiInvalid();

      await expect(parseDate('xyzzy-123', callApi))
        .rejects
        .toThrow('xyzzy-123');
    });
  });

  describe('respuesta malformada de la API', () => {
    test('lanza un error si la API devuelve JSON inválido', async () => {
      const callApi = mockApiBroken();

      await expect(parseDate('2025-01-01', callApi))
        .rejects
        .toThrow();
    });
  });

  describe('contrato de datos de salida', () => {
    test('siempre devuelve un array, nunca null ni undefined', async () => {
      const callApi = mockApi([
        { label: '1 de enero de 2025', date: '2025-01-01' },
      ]);

      const result = await parseDate('2025-01-01', callApi);

      expect(Array.isArray(result)).toBe(true);
    });

    test('las propiedades de cada elemento son label (string) y date (Date)', async () => {
      const callApi = mockApi([
        { label: '15 de agosto de 2024', date: '2024-08-15' },
      ]);

      const result = await parseDate('15/08/2024', callApi);

      expect(typeof result[0].label).toBe('string');
      expect(result[0].date).toBeInstanceOf(Date);
    });
  });
});
