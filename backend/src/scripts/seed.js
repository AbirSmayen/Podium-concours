require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Team = require('../models/Team');
const Challenge = require('../models/Challenge');
const Score = require('../models/Score');
const connectDB = require('../config/database');

// Connexion à la base de données
connectDB();

// Données de seed
const seedUsers = [
  {
    name: 'Admin Principal',
    email: 'admin@podium.com',
    password: 'admin123',
    role: 'admin',
    status: 'active'
  },
  {
    name: 'Ahmed Ben Ali',
    email: 'ahmed.leader@podium.com',
    password: 'leader123',
    role: 'leader',
    status: 'active',
    leaderRequestMessage: 'Je souhaite créer une équipe innovante'
  },
  {
    name: 'Sara Trabelsi',
    email: 'sara.member@podium.com',
    password: 'member123',
    role: 'member',
    status: 'active'
  },
  {
    name: 'Mohamed Khaled',
    email: 'mohamed.leader@podium.com',
    password: 'leader123',
    role: 'leader',
    status: 'active',
    leaderRequestMessage: 'Passionné de développement web'
  },
  {
    name: 'Yasmine Jabri',
    email: 'yasmine.member@podium.com',
    password: 'member123',
    role: 'member',
    status: 'active'
  },
  {
    name: 'Karim Ben Salem',
    email: 'karim.member@podium.com',
    password: 'member123',
    role: 'member',
    status: 'active'
  },
  {
    name: 'Amira Bouaziz',
    email: 'amira.leader@podium.com',
    password: 'leader123',
    role: 'leader',
    status: 'pending',
    leaderRequestMessage: 'En attente de validation'
  },
  {
    name: 'Fatma Gharbi',
    email: 'fatma.member@podium.com',
    password: 'member123',
    role: 'member',
    status: 'active'
  },
  {
    name: 'Omar Mezghani',
    email: 'omar.member@podium.com',
    password: 'member123',
    role: 'member',
    status: 'active'
  },
  {
    name: 'Leila Mansouri',
    email: 'leila.member@podium.com',
    password: 'member123',
    role: 'member',
    status: 'active'
  }
];

const seedChallenges = [
  {
    title: 'Application Web Full-Stack',
    description: 'Développer une application web complète avec authentification, base de données et interface moderne. L\'application doit inclure un système de gestion des utilisateurs, des fonctionnalités CRUD et une API REST sécurisée.',
    type: 'principal',
    points: 500,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    resources: [
      'https://react.dev/learn',
      'https://nodejs.org/docs',
      'https://www.mongodb.com/docs/',
      'https://expressjs.com/'
    ],
    isActive: true
  },
  {
    title: 'API REST Sécurisée',
    description: 'Créer une API REST complète avec authentification JWT, validation des données, gestion des erreurs et documentation. L\'API doit supporter les opérations CRUD et inclure des tests unitaires.',
    type: 'principal',
    points: 300,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 jours
    resources: [
      'https://jwt.io/introduction',
      'https://expressjs.com/en/guide/routing.html',
      'https://mongoosejs.com/docs/'
    ],
    isActive: true
  },
  {
    title: 'Quiz Technique Quotidien',
    description: 'Répondre correctement au quiz technique du jour sur les concepts de programmation, algorithmes et bonnes pratiques. Le quiz change chaque jour et couvre différents sujets.',
    type: 'mini',
    points: 50,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    resources: [],
    isActive: true
  },
  {
    title: 'Code Review Challenge',
    description: 'Effectuer une revue de code constructive pour un autre membre de l\'équipe. La revue doit inclure des commentaires détaillés, des suggestions d\'amélioration et des points positifs.',
    type: 'mini',
    points: 30,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
    resources: [
      'https://google.github.io/eng-practices/review/',
      'https://github.com/google/eng-practices'
    ],
    isActive: true
  },
  {
    title: 'Dashboard Analytics',
    description: 'Créer un dashboard interactif avec des graphiques et visualisations de données. Le dashboard doit être responsive, inclure des filtres et permettre l\'exportation des données.',
    type: 'principal',
    points: 400,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 jours
    resources: [
      'https://recharts.org/en-US',
      'https://www.chartjs.org/docs/',
      'https://d3js.org/'
    ],
    isActive: true
  },
  {
    title: 'Défi Mobile Responsive',
    description: 'Adapter une application web existante pour qu\'elle soit entièrement responsive et fonctionne parfaitement sur mobile. Tester sur différents appareils et résolutions.',
    type: 'mini',
    points: 75,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 jours
    resources: [
      'https://tailwindcss.com/docs/responsive-design',
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries'
    ],
    isActive: true
  },
  {
    title: 'Optimisation Performance',
    description: 'Optimiser les performances d\'une application existante en réduisant le temps de chargement, optimisant les requêtes et améliorant le rendu. Atteindre un score Lighthouse > 90.',
    type: 'principal',
    points: 350,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 jours
    resources: [
      'https://web.dev/performance/',
      'https://developers.google.com/web/tools/lighthouse'
    ],
    isActive: true
  }
];

const seedTeams = [
  {
    name: 'Les Innovateurs',
    logo: '💡',
    score: 850
  },
  {
    name: 'Tech Warriors',
    logo: '⚔️',
    score: 720
  },
  {
    name: 'Digital Pioneers',
    logo: '🚀',
    score: 650
  },
  {
    name: 'Code Breakers',
    logo: '💻',
    score: 580
  },
  {
    name: 'Agile Squad',
    logo: '⚡',
    score: 490
  }
];

// Fonction principale de seed
const seedDatabase = async () => {
  try {
    console.log('🌱 Début du seed de la base de données...\n');

    // Nettoyer la base de données
    await Score.deleteMany({});
    await Challenge.deleteMany({});
    await Team.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Base de données nettoyée\n');

    // Créer les utilisateurs (utiliser create pour déclencher le hash du mot de passe)
    console.log('👥 Création des utilisateurs...');
    const createdUsers = [];
    for (const userData of seedUsers) {
      try {
        const user = await User.create(userData);
        createdUsers.push(user);
      } catch (error) {
        console.error(`Erreur création utilisateur ${userData.email}:`, error.message);
        throw error;
      }
    }
    console.log(`✅ ${createdUsers.length} utilisateurs créés\n`);

    // Trouver l'admin pour les défis
    const admin = createdUsers.find(u => u.role === 'admin');
    const leaders = createdUsers.filter(u => u.role === 'leader' && u.status === 'active');
    const members = createdUsers.filter(u => u.role === 'member');

    // Créer les défis avec l'admin comme créateur
    console.log('🎯 Création des défis...');
    const challengesWithCreator = seedChallenges.map(challenge => ({
      ...challenge,
      createdBy: admin._id
    }));
    const createdChallenges = await Challenge.insertMany(challengesWithCreator);
    console.log(`✅ ${createdChallenges.length} défis créés\n`);

    // Créer les équipes avec les leaders
    console.log('👥 Création des équipes...');
    const createdTeams = [];
    
    for (let i = 0; i < seedTeams.length && i < leaders.length; i++) {
      const teamData = {
        ...seedTeams[i],
        leaderId: leaders[i]._id,
        members: [leaders[i]._id] // Le leader est automatiquement membre
      };

      // Ajouter quelques membres à chaque équipe
      const membersPerTeam = Math.floor(members.length / seedTeams.length);
      const startIndex = i * membersPerTeam;
      const endIndex = Math.min(startIndex + membersPerTeam, members.length);
      
      for (let j = startIndex; j < endIndex && j < members.length; j++) {
        teamData.members.push(members[j]._id);
        // Mettre à jour le teamId du membre
        await User.findByIdAndUpdate(members[j]._id, { teamId: null });
      }

      const team = await Team.create(teamData);
      
      // Mettre à jour le teamId du leader et des membres
      await User.findByIdAndUpdate(leaders[i]._id, { teamId: team._id });
      for (const memberId of teamData.members.slice(1)) {
        await User.findByIdAndUpdate(memberId, { teamId: team._id });
      }

      createdTeams.push(team);
    }
    console.log(`✅ ${createdTeams.length} équipes créées\n`);

    // Créer quelques scores pour les équipes
    console.log('📊 Création des scores...');
    const scores = [];
    
    // Score validé pour la première équipe
    if (createdTeams[0] && createdChallenges[0]) {
      const score1 = await Score.create({
        teamId: createdTeams[0]._id,
        challengeId: createdChallenges[0]._id,
        pointsEarned: createdChallenges[0].points,
        submittedBy: leaders[0]._id,
        validatedBy: admin._id,
        status: 'validated',
        submissionNote: 'Application complète avec toutes les fonctionnalités demandées',
        validatedAt: new Date()
      });
      await score1.validateScore(admin._id, 'Excellent travail !');
      scores.push(score1);
    }

    // Score en attente pour la première équipe
    if (createdTeams[0] && createdChallenges[1]) {
      const score2 = await Score.create({
        teamId: createdTeams[0]._id,
        challengeId: createdChallenges[1]._id,
        pointsEarned: createdChallenges[1].points,
        submittedBy: leaders[0]._id,
        status: 'pending',
        submissionNote: 'API REST complète avec JWT et validation'
      });
      scores.push(score2);
    }

    // Score validé pour la deuxième équipe
    if (createdTeams[1] && createdChallenges[2]) {
      const score3 = await Score.create({
        teamId: createdTeams[1]._id,
        challengeId: createdChallenges[2]._id,
        pointsEarned: createdChallenges[2].points,
        submittedBy: leaders[1]._id,
        validatedBy: admin._id,
        status: 'validated',
        submissionNote: 'Quiz complété avec succès',
        validatedAt: new Date()
      });
      await score3.validateScore(admin._id, 'Parfait !');
      scores.push(score3);
    }

    console.log(`✅ ${scores.length} scores créés\n`);

    // Ajouter des badges aux équipes
    if (createdTeams[0]) {
      createdTeams[0].addBadge('first_challenge');
      await createdTeams[0].save();
    }

    console.log('🎉 Seed terminé avec succès !\n');
    console.log('📋 Résumé :');
    console.log(`   - ${createdUsers.length} utilisateurs`);
    console.log(`   - ${createdChallenges.length} défis`);
    console.log(`   - ${createdTeams.length} équipes`);
    console.log(`   - ${scores.length} scores\n`);
    console.log('🔑 Comptes de test :');
    console.log('   Admin: admin@podium.com / admin123');
    console.log('   Leader: ahmed.leader@podium.com / leader123');
    console.log('   Member: sara.member@podium.com / member123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// Exécuter le seed
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
