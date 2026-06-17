const UNITS = [
  { key: 'years',   singular: 'año',    plural: 'años'    },
  { key: 'months',  singular: 'mes',    plural: 'meses'   },
  { key: 'days',    singular: 'día',    plural: 'días'    },
  { key: 'hours',   singular: 'hora',   plural: 'horas'   },
  { key: 'minutes', singular: 'minuto', plural: 'minutos' },
];

function calcComponents(from, to) {
  let years   = to.getFullYear() - from.getFullYear();
  let months  = to.getMonth()    - from.getMonth();
  let days    = to.getDate()     - from.getDate();
  let hours   = to.getHours()    - from.getHours();
  let minutes = to.getMinutes()  - from.getMinutes();

  if (minutes < 0) { minutes += 60; hours   -= 1; }
  if (hours   < 0) { hours   += 24; days    -= 1; }
  if (days    < 0) {
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days   += prevMonth.getDate();
    months -= 1;
  }
  if (months  < 0) { months  += 12; years   -= 1; }

  return { years, months, days, hours, minutes };
}

function label(value, unit) {
  return `${value} ${value === 1 ? unit.singular : unit.plural}`;
}

function joinParts(parts) {
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
}

export function formatDiff(date, now = new Date()) {
  const isPast = date < now;
  const [from, to] = isPast ? [date, now] : [now, date];

  const totalMs = to - from;
  if (totalMs < 60_000) {
    return isPast ? 'Hace unos instantes' : 'En unos instantes';
  }

  const components = calcComponents(from, to);

  const parts = UNITS
    .filter(u => components[u.key] > 0)
    .map(u => label(components[u.key], u));

  const summary = joinParts(parts);
  return isPast ? `Hace ${summary}` : `Faltan ${summary}`;
}
