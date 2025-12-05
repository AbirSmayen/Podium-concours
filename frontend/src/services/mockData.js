// src/services/mockData.js

// Utilisateurs mock
export const mockUsers = {
  leader: {
    _id: 'leader1',
    name: 'Ahmed Ben Ali',
    email: 'ahmed@example.com',
    role: 'leader',
    teamId: 'team1',
    status: 'active'
  },
  member: {
    _id: 'member1',
    name: 'Sara Trabelsi',
    email: 'sara@example.com',
    role: 'member',
    teamId: 'team1',
    status: 'active'
  }
};

// Équipes mock avec emojis au lieu d'images
export const mockTeams = [
  {
    _id: 'team1',
    name: 'Les Innovateurs',
    logo: '💡', // Emoji au lieu d'URL
    leaderId: 'leader1',
    members: [
      { _id: 'member1', name: 'Sara Trabelsi', email: 'sara@example.com' },
      { _id: 'member2', name: 'Mohamed Khaled', email: 'mohamed@example.com' },
      { _id: 'member3', name: 'Yasmine Jabri', email: 'yasmine@example.com' }
    ],
    score: 850,
    badges: ['Premier Sprint', 'Innovation Award', 'Team Player'],
    rank: 1
  },
  {
    _id: 'team2',
    name: 'Tech Warriors',
    logo: '⚔️',
    leaderId: 'leader2',
    members: [
      { _id: 'member4', name: 'Karim Ben Salem', email: 'karim@example.com' },
      { _id: 'member5', name: 'Amira Bouaziz', email: 'amira@example.com' }
    ],
    score: 720,
    badges: ['Quick Starter', 'Code Master'],
    rank: 2
  },
  {
    _id: 'team3',
    name: 'Digital Pioneers',
    logo: '🚀',
    leaderId: 'leader3',
    members: [
      { _id: 'member6', name: 'Fatma Gharbi', email: 'fatma@example.com' }
    ],
    score: 650,
    badges: ['Rising Star'],
    rank: 3
  },
  {
    _id: 'team4',
    name: 'Code Breakers',
    logo: '💻',
    leaderId: 'leader4',
    members: [],
    score: 580,
    badges: [],
    rank: 4
  },
  {
    _id: 'team5',
    name: 'Agile Squad',
    logo: '⚡',
    leaderId: 'leader5',
    members: [],
    score: 490,
    badges: ['Participation Medal'],
    rank: 5
  }
];

// Défis mock
export const mockChallenges = [
  {
    _id: 'challenge1',
    title: 'Application Web Complète',
    description: 'Développer une application web full-stack avec authentification et base de données',
    type: 'principal',
    points: 500,
    deadline: new Date('2025-12-31'),
    resources: [
      'https://react.dev/learn',
      'https://nodejs.org/docs',
      'https://www.mongodb.com/docs/'
    ]
  },
  {
    _id: 'challenge2',
    title: 'API REST Sécurisée',
    description: 'Créer une API REST avec JWT et validation des données',
    type: 'principal',
    points: 300,
    deadline: new Date('2025-12-20'),
    resources: [
      'https://jwt.io/introduction',
      'https://expressjs.com/en/guide/routing.html'
    ]
  },
  {
    _id: 'challenge3',
    title: 'Quiz Quotidien',
    description: 'Répondre correctement au quiz technique du jour',
    type: 'mini',
    points: 50,
    deadline: new Date('2025-12-10'),
    resources: []
  },
  {
    _id: 'challenge4',
    title: 'Code Review Challenge',
    description: 'Faire une revue de code constructive pour un autre membre',
    type: 'mini',
    points: 30,
    deadline: new Date('2025-12-15'),
    resources: ['https://google.github.io/eng-practices/review/']
  },
  {
    _id: 'challenge5',
    title: 'Dashboard Analytics',
    description: 'Créer un dashboard avec des graphiques et visualisations de données',
    type: 'principal',
    points: 400,
    deadline: new Date('2025-12-25'),
    resources: [
      'https://recharts.org/en-US',
      'https://www.chartjs.org/docs/'
    ]
  }
];

// Scores mock
export const mockScores = [
  {
    _id: 'score1',
    teamId: 'team1',
    challengeId: 'challenge1',
    pointsEarned: 500,
    submittedBy: 'leader1',
    validatedBy: 'admin1',
    validated: true,
    comment: 'Excellent travail sur l\'application!',
    createdAt: new Date('2025-12-01')
  },
  {
    _id: 'score2',
    teamId: 'team1',
    challengeId: 'challenge3',
    pointsEarned: 50,
    submittedBy: 'leader1',
    validatedBy: 'admin1',
    validated: true,
    comment: 'Quiz complété avec succès',
    createdAt: new Date('2025-12-03')
  },
  {
    _id: 'score3',
    teamId: 'team1',
    challengeId: 'challenge2',
    pointsEarned: 300,
    submittedBy: 'leader1',
    validatedBy: null,
    validated: false,
    comment: 'API terminée, en attente de validation',
    createdAt: new Date('2025-12-05')
  }
];