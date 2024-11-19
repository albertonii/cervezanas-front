export const gameSteps = [
  {
    id: 1,
    title: "Los Orígenes",
    description: "Descubre la historia de la cerveza artesanal en Catalunya",
    location: "Stand Principal BBF",
    isUnlocked: true,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿En qué año se fundó la primera cervecería artesanal en Barcelona?",
        options: ["1989", "1992", "1995", "2000"],
        correctAnswer: 1,
        explanation: "La primera cervecería artesanal de Barcelona abrió sus puertas en 1992, coincidiendo con los Juegos Olímpicos.",
        difficulty: "fácil",
        points: 100
      },
      {
        id: 2,
        text: "¿Cuál fue el primer estilo de cerveza artesanal producido en Barcelona?",
        options: ["Pale Ale", "Pilsner", "Wheat Beer", "Stout"],
        correctAnswer: 0,
        explanation: "La Pale Ale fue el primer estilo producido, inspirado en las cervezas británicas.",
        difficulty: "medio",
        points: 150
      },
      {
        id: 3,
        text: "¿Qué evento impulsó el movimiento cervecero artesanal en Catalunya?",
        options: [
          "Los Juegos Olímpicos 1992",
          "La Feria de la Cerveza 1990",
          "El Barcelona Beer Festival 2012",
          "La Expo Universal 1988"
        ],
        correctAnswer: 2,
        explanation: "El BBF 2012 marcó un antes y después en la cultura cervecera artesanal catalana.",
        difficulty: "difícil",
        points: 200
      }
    ],
    reward: {
      type: "merchandise",
      name: "Pin Conmemorativo BBF",
      description: "Pin exclusivo del 10º aniversario",
      condition: {
        correctAnswers: 3,
        totalQuestions: 3
      },
      claimLocation: "Stand Principal BBF",
      claimed: false
    }
  },
  {
    id: 2,
    title: "El Arte del Malteado",
    description: "Aprende sobre el proceso de malteado y su importancia",
    location: "Zona de Materias Primas",
    isUnlocked: false,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿Cuál es la temperatura óptima para el malteado?",
        options: ["10-15°C", "15-20°C", "20-25°C", "25-30°C"],
        correctAnswer: 1,
        explanation: "El rango de 15-20°C es ideal para la germinación controlada del grano.",
        difficulty: "medio",
        points: 150
      },
      {
        id: 2,
        text: "¿Qué cereal es el más común en el malteado para cerveza?",
        options: ["Trigo", "Cebada", "Avena", "Centeno"],
        correctAnswer: 1,
        explanation: "La cebada es el cereal más utilizado por su alto contenido en enzimas y almidón.",
        difficulty: "fácil",
        points: 100
      },
      {
        id: 3,
        text: "¿Cuánto tiempo dura típicamente el proceso de malteado?",
        options: ["2-3 días", "4-5 días", "6-7 días", "8-9 días"],
        correctAnswer: 2,
        explanation: "El proceso completo requiere 6-7 días para un malteado óptimo.",
        difficulty: "difícil",
        points: 200
      }
    ],
    reward: {
      type: "merchandise",
      name: "Camiseta Cervezanas Edición Especial",
      description: "Camiseta exclusiva del BBF 2025",
      condition: {
        correctAnswers: 3,
        totalQuestions: 3
      },
      claimLocation: "Stand Principal BBF",
      claimed: false
    }
  },
  {
    id: 3,
    title: "Lúpulos del Mundo",
    description: "Explora las variedades de lúpulo y sus características",
    location: "Jardín de Lúpulos",
    isUnlocked: false,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿Qué variedad de lúpulo es conocida por sus notas cítricas?",
        options: ["Saaz", "Cascade", "Hallertau", "Fuggle"],
        correctAnswer: 1,
        explanation: "El lúpulo Cascade es famoso por sus distintivas notas cítricas y florales.",
        difficulty: "medio",
        points: 150
      },
      {
        id: 2,
        text: "¿De qué país es originario el lúpulo Saaz?",
        options: ["Alemania", "Inglaterra", "República Checa", "Estados Unidos"],
        correctAnswer: 2,
        explanation: "El Saaz es un lúpulo noble originario de la República Checa.",
        difficulty: "difícil",
        points: 200
      }
    ],
    reward: {
      type: "experience",
      name: "Cata de Lúpulos",
      description: "Sesión exclusiva de cata de diferentes variedades",
      condition: {
        correctAnswers: 2,
        totalQuestions: 2
      },
      claimLocation: "Jardín de Lúpulos",
      claimed: false
    }
  },
  {
    id: 4,
    title: "Fermentación y Levaduras",
    description: "Descubre los secretos de la fermentación cervecera",
    location: "Laboratorio de Fermentación",
    isUnlocked: false,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿Qué temperatura es ideal para la fermentación de una Ale?",
        options: ["8-13°C", "15-20°C", "25-30°C", "30-35°C"],
        correctAnswer: 1,
        explanation: "Las ales fermentan óptimamente entre 15-20°C.",
        difficulty: "medio",
        points: 150
      }
    ],
    reward: {
      type: "merchandise",
      name: "Kit de Cultivo de Levaduras",
      description: "Kit básico para experimentar con levaduras",
      condition: {
        correctAnswers: 1,
        totalQuestions: 1
      },
      claimLocation: "Laboratorio de Fermentación",
      claimed: false
    }
  },
  {
    id: 5,
    title: "Estilos Cerveceros",
    description: "Conoce los diferentes estilos de cerveza del mundo",
    location: "Zona de Cata Internacional",
    isUnlocked: false,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿Cuál es el estilo de cerveza más antiguo del mundo?",
        options: ["Pilsner", "Porter", "Lambic", "Sahti"],
        correctAnswer: 3,
        explanation: "El Sahti finlandés es considerado uno de los estilos más antiguos aún producidos.",
        difficulty: "difícil",
        points: 200
      }
    ],
    reward: {
      type: "experience",
      name: "Masterclass de Estilos",
      description: "Clase magistral sobre estilos cerveceros",
      condition: {
        correctAnswers: 1,
        totalQuestions: 1
      },
      claimLocation: "Aula de Formación",
      claimed: false
    }
  },
  {
    id: 6,
    title: "Maridaje Cervecero",
    description: "Aprende a maridar cerveza con diferentes platos",
    location: "Zona Gastronómica",
    isUnlocked: false,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿Qué estilo de cerveza marida mejor con quesos azules?",
        options: ["Pilsner", "IPA", "Barleywine", "Wheat Beer"],
        correctAnswer: 2,
        explanation: "El Barleywine complementa perfectamente la intensidad de los quesos azules.",
        difficulty: "difícil",
        points: 200
      }
    ],
    reward: {
      type: "experience",
      name: "Cena Maridaje",
      description: "Experiencia gastronómica con maridaje cervecero",
      condition: {
        correctAnswers: 1,
        totalQuestions: 1
      },
      claimLocation: "Restaurante del Festival",
      claimed: false
    }
  },
  {
    id: 7,
    title: "Cerveza y Sostenibilidad",
    description: "Explora las prácticas sostenibles en la producción",
    location: "Zona Verde",
    isUnlocked: false,
    isCompleted: false,
    isQRScanned: false,
    currentQuestionIndex: 0,
    correctAnswers: 0,
    questions: [
      {
        id: 1,
        text: "¿Qué porcentaje de agua se puede reutilizar en una cervecería moderna?",
        options: ["30%", "50%", "70%", "90%"],
        correctAnswer: 3,
        explanation: "Las cervecerías modernas pueden reutilizar hasta el 90% del agua mediante sistemas cerrados.",
        difficulty: "difícil",
        points: 200
      }
    ],
    reward: {
      type: "merchandise",
      name: "Kit Sostenible",
      description: "Pack de productos sostenibles para cerveceros",
      condition: {
        correctAnswers: 1,
        totalQuestions: 1
      },
      claimLocation: "Zona Verde",
      claimed: false
    }
  }
];