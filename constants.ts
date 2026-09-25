
import { Article } from './types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of AI: Beyond Large Language Models',
    subtitle: 'Exploring the next frontier of artificial intelligence and how it will reshape our creative processes.',
    content: 'Artificial Intelligence has made incredible strides in the last few years. However, the true potential lies not just in predicting the next word, but in understanding complex human intent and collaborative creativity...',
    author: {
      id: 'a1',
      name: 'Elena Vance',
      avatar: 'https://picsum.photos/seed/elena/100/100',
      bio: 'AI researcher and technology philosopher.'
    },
    publishedAt: 'Oct 24, 2023',
    readTime: '8 min read',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/seed/ai-tech/800/400',
    tags: ['AI', 'Future', 'Tech']
  },
  {
    id: '2',
    title: 'Why Minimalist Design Still Rules in 2024',
    subtitle: 'Less is more has never been more relevant in a world of digital noise.',
    content: 'In an era where every app is fighting for your attention, the quietest interface often speaks the loudest. Minimalist design is not about emptiness; it is about intentionality...',
    author: {
      id: 'a2',
      name: 'Julian Thorne',
      avatar: 'https://picsum.photos/seed/julian/100/100',
      bio: 'Product designer focusing on simplicity.'
    },
    publishedAt: 'Nov 12, 2023',
    readTime: '5 min read',
    category: 'Design',
    imageUrl: 'https://picsum.photos/seed/design/800/400',
    tags: ['Design', 'UX', 'Minimalism']
  },
  {
    id: '3',
    title: 'The Lost Art of Deep Reading',
    subtitle: 'How our digital habits are eroding our ability to focus on long-form content.',
    content: 'We scan. We scroll. We skim. But when was the last time you truly sat with a text for hours, allowing its arguments to unfold slowly in your mind?',
    author: {
      id: 'a3',
      name: 'Sarah Chen',
      avatar: 'https://picsum.photos/seed/sarah/100/100',
      bio: 'Writer and cultural critic.'
    },
    publishedAt: 'Dec 05, 2023',
    readTime: '12 min read',
    category: 'Culture',
    imageUrl: 'https://picsum.photos/seed/reading/800/400',
    tags: ['Reading', 'Focus', 'Mindfulness']
  }
];

export const CATEGORIES = [
  'For you', 'Following', 'Artificial Intelligence', 'Data Science', 'Programming', 'Self Improvement', 'Writing', 'Relationships'
];
