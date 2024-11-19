export const powerUps = [
  {
    id: 'time-freeze',
    name: 'Congelación Temporal',
    description: 'Detiene el tiempo durante 30 segundos',
    type: 'timeBonus',
    duration: 30,
    used: false
  },
  {
    id: 'double-points',
    name: 'Puntos Dobles',
    description: 'Duplica los puntos obtenidos en la siguiente pregunta',
    type: 'pointsMultiplier',
    multiplier: 2,
    used: false
  },
  {
    id: 'hint-master',
    name: 'Maestro de Pistas',
    description: 'Revela una pista para la pregunta actual',
    type: 'hintReveal',
    used: false
  },
  {
    id: 'skip-question',
    name: 'Salto Cervecero',
    description: 'Salta una pregunta sin penalización',
    type: 'skipQuestion',
    used: false
  }
];