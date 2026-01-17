
import React from 'react';
import { Level, ItemState } from './types';

export const PREMIUM_CURRENCY = 999999;
export const MAX_INVENTORY = 2;

export const LEVELS: Level[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Neo-Sector ${i + 1}`,
  difficulty: i < 15 ? 'Easy' : i < 35 ? 'Medium' : 'Hard',
  targetScore: 500 + i * 100,
  duration: 120,
}));

export const DISHES = [
  { name: 'Neon Sushi', ingredients: ['Fish', 'Rice'], baseReward: 100 },
  { name: 'Cyber Burger', ingredients: ['Synth-Patty', 'Bun', 'Glow-Lettuce'], baseReward: 150 },
  { name: 'Quantum Ramen', ingredients: ['Noodles', 'Broth', 'Egg'], baseReward: 200 },
];

export const ICONS = {
  Fish: '🐟',
  Rice: '🍚',
  'Synth-Patty': '🥩',
  Bun: '🍞',
  'Glow-Lettuce': '🥬',
  Noodles: '🍜',
  Broth: '🍲',
  Egg: '🥚',
};

export const CUSTOMER_AVATARS = [
  'https://picsum.photos/id/64/100/100',
  'https://picsum.photos/id/65/100/100',
  'https://picsum.photos/id/91/100/100',
  'https://picsum.photos/id/103/100/100',
];
