


# Parte A

## Tarea 1
*Micro-tarea:* Parser sencillo de CSV

*Pilar 1 — Herramienta:* Claude Code
No conocia la herramienta ni los modelos de Antrhopic y quiero aprovechar el curso para ello. Creo que es una de las de mayor 'hype' actualmente.

*Pilar 2 — Contexto:* ¿Qué información estás aportando? (lenguaje, framework, restricciones, ejemplos…)
Únicamente he pedido que me haga un CLI y que utilice TDD; al hacer metaprompting (Sonnet4.6) en el promp me ha propuesto Node.js, use la API de Claude (Haiku4.5) y Jest para los tests.

*Pilar 3 — Prompt:* He construido el promp con metapromting, primero explicando el tipo de CLI que queria e iterando 1 vez porque no estaba tratando como yo queria el caso de fechas ambiguas (a pesar de que inicialmente le informé un ejemplo). A la segunda iteración me ha dado un prompt que considero bueno. Es el siguiente:

```
Eres un asistente experto en desarrollo con Node.js y en metodología TDD (Test-Driven Development).

Voy a construir una herramienta CLI en Node.js llamada `desde-cuando`. Su función es recibir una fecha como argumento en texto libre, interpretarla con ayuda de la API de Claude (para resolver ambigüedades de formato), y mostrar cuánto tiempo ha pasado desde esa fecha, o cuánto tiempo falta si la fecha es futura.

## Descripción funcional

- El usuario ejecuta: `node index.js "12/10/2025"` o `node index.js "el próximo 3 de marzo"` o `node index.js "2025-06-01"`
- Las fechas pueden venir en cualquier formato y pueden ser ambiguas (por ejemplo, 12/10/2025 puede ser el 12 de octubre o el 10 de diciembre).
- Cuando la fecha sea ambigua, el CLI NO interrumpe al usuario para pedir confirmación. En su lugar, muestra el resultado para TODAS las interpretaciones posibles, una tras otra, indicando claramente qué interpretación corresponde a cada resultado. Por ejemplo:

    Fecha ambigua. Mostrando todas las interpretaciones posibles:

    → Si es 12 de octubre de 2025 (pasado):
      Hace 8 meses y 5 días

    → Si es 10 de diciembre de 2025 (futuro):
      Faltan 5 meses y 23 días

- Una vez resuelta la fecha (o en cada interpretación si es ambigua), el CLI muestra el tiempo desglosado en las unidades relevantes: años, meses, días, horas y minutos. Se omiten las unidades que sean 0, excepto si el resultado es menor de un minuto (en ese caso se muestra "hace unos instantes" o "en unos instantes").
- El idioma de todos los mensajes de salida es español.

## Stack técnico

- Node.js con ES Modules (`"type": "module"` en package.json)
- API de Claude (modelo `claude-haiku-4-5-20251001`) para interpretar y desambiguar la fecha
- Testing con Jest y `--experimental-vm-modules` para compatibilidad con ES Modules

## Metodología: TDD estricto

Quiero desarrollar esto siguiendo TDD de forma estricta. Eso significa:

1. Antes de escribir cualquier código de producción, escribimos el test que falla (🔴 RED).
2. Luego escribimos el mínimo código necesario para que el test pase (🟢 GREEN).
3. Luego refactorizamos si es necesario manteniendo los tests en verde (🔵 REFACTOR).

Organiza el trabajo en ciclos TDD, uno por cada pieza de funcionalidad. Para cada ciclo indícame explícitamente en qué fase estamos (🔴 RED / 🟢 GREEN / 🔵 REFACTOR).

Muéstrame cada fase y espera mi confirmación antes de pasar a la siguiente.

## Estructura de módulos sugerida

- `index.js` — punto de entrada CLI, parsea argumentos y orquesta el flujo
- `src/parseDate.js` — llama a la API de Claude y devuelve un array de una o varias fechas interpretadas, cada una con su etiqueta descriptiva
- `src/formatDiff.js` — dada una fecha resuelta y la fecha actual, calcula y formatea la diferencia de tiempo
- `src/renderOutput.js` — recibe el array de interpretaciones y sus diffs formateados, y compone el texto final para imprimir por pantalla

## Contrato de datos entre módulos

`parseDate.js` devuelve siempre un array, incluso cuando la fecha no es ambigua:

  [
    { label: "12 de octubre de 2025", date: Date }         // caso no ambiguo → array de 1
  ]

  [
    { label: "12 de octubre de 2025", date: Date },        // caso ambiguo → array de 2+
    { label: "10 de diciembre de 2025", date: Date }
  ]

Esto permite que `renderOutput.js` y `formatDiff.js` funcionen de forma uniforme sin necesidad de tratar el caso ambiguo como especial.

## Restricciones y criterios de calidad

- Cada módulo debe ser testeable de forma aislada (sin efectos secundarios globales).
- La llamada a la API de Claude debe estar abstraída detrás de una función que se pueda mockear en los tests.
- Los tests no deben hacer llamadas reales a la API.
- Cubre al menos estos casos en los tests:
  - Fecha pasada no ambigua → muestra tiempo transcurrido
  - Fecha futura no ambigua → muestra tiempo restante
  - Fecha ambigua → muestra los resultados para cada interpretación, con su etiqueta
  - Fecha inválida → mensaje de error claro
  - Resultado menor de un minuto → mensaje especial ("hace unos instantes" / "en unos instantes")
  - Formato ISO, formato con barras, lenguaje natural en español

## Cómo quiero que procedas

Empieza por el primer ciclo TDD: el módulo `formatDiff.js`, que es puro (sin dependencias externas) y es el mejor punto de partida.

Muéstrame primero el test (🔴 RED), espera mi confirmación antes de pasar a la fase 🟢 GREEN, y así sucesivamente ciclo a ciclo.

```

*Resultado:* ¿Funcionó a la primera o tuviste que iterar?
He tenido que iterar en las fases del TDD. Si lo hiciera de nuevo no le pediria que esperase a mi confirmación para pasar de la fase RED a GREEN en cada nuevo fichero.
 
___


# Parte B

![OpenSpec instalado](/openspec-install.png)



1.- Cada comando de la herramienta se corresponde con una skill de claude
2.- No ha creado el AGENT.MD
3.- Los ficheros de configuración son .yaml