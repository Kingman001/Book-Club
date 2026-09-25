
export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers?: number;
  following?: number;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  author: Author;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

export interface Notification {
  id: string;
  type: 'clap' | 'comment' | 'follow';
  from: string;
  fromAvatar: string;
  articleTitle?: string;
  read: boolean;
  createdAt: string;
}

export type ViewState = 'home' | 'article' | 'write' | 'search' | 'profile' | 'notifications';

export interface Draft {
  title: string;
  content: string;
}
