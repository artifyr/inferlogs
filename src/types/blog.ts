export interface BlogPost {
  id: string;
  title: string;
  category: 'AI' | 'Robotics' | 'Neurology' | 'Quantum Computing' | 'Biotechnology';
  content: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  author: string;
}
