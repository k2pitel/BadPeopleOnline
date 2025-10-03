require('dotenv').config();
const mongoose = require('mongoose');
const QuestionPack = require('../models/QuestionPack');

const defaultQuestions = [
  "Who is most likely to become famous?",
  "Who is most likely to survive a zombie apocalypse?",
  "Who would be the worst person to be stuck on a desert island with?",
  "Who is most likely to win the lottery and lose it all?",
  "Who tells the best stories?",
  "Who is most likely to get away with murder?",
  "Who would you want on your team in a bar fight?",
  "Who is most likely to accidentally start a cult?",
  "Who would survive the longest in a horror movie?",
  "Who is most likely to become a villain?",
  "Who gives the best advice?",
  "Who is most likely to pull off a heist?",
  "Who would you trust with your deepest secret?",
  "Who is most likely to fake their own death?",
  "Who would make the best evil genius?"
];

const spicyQuestions = [
  "Who is most likely to get arrested at a party?",
  "Who would you least want to date?",
  "Who is most likely to cheat in a relationship?",
  "Who has the most questionable taste in partners?",
  "Who is most likely to hook up with an ex?",
  "Who is most likely to ghost someone?",
  "Who would be the worst roommate?",
  "Who is most likely to lie about their age?",
  "Who is most likely to stalk their ex on social media?",
  "Who would you never lend money to?"
];

const familyFriendlyQuestions = [
  "Who is the best cook?",
  "Who is most likely to win a game show?",
  "Who tells the funniest jokes?",
  "Who is most organized?",
  "Who is the best dancer?",
  "Who is most likely to become a teacher?",
  "Who is the most adventurous?",
  "Who is the best at keeping secrets?",
  "Who would make the best superhero?",
  "Who is most likely to help a stranger?"
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/badpeopleonline');
    
    console.log('Connected to database');

    // Clear existing question packs
    await QuestionPack.deleteMany({});

    // Create default pack
    await QuestionPack.create({
      name: 'Default Pack',
      description: 'Classic questions to get you started',
      category: 'default',
      isPremium: false,
      price: 0,
      questions: defaultQuestions.map(text => ({ text, category: 'default' })),
      isActive: true
    });

    // Create spicy pack
    await QuestionPack.create({
      name: 'Spicy Pack',
      description: 'For players who can handle the heat',
      category: 'spicy',
      isPremium: true,
      price: 1.99,
      questions: spicyQuestions.map(text => ({ text, category: 'spicy' })),
      isActive: true
    });

    // Create family-friendly pack
    await QuestionPack.create({
      name: 'Family Friendly Pack',
      description: 'Safe for all ages',
      category: 'family-friendly',
      isPremium: false,
      price: 0,
      questions: familyFriendlyQuestions.map(text => ({ text, category: 'family-friendly' })),
      isActive: true
    });

    console.log('Question packs seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedQuestions();
