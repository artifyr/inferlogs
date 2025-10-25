import { BlogPost } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/post/${post.id}`)}
      className="group cursor-pointer p-6 border border-border rounded-lg hover:border-foreground/20 transition-all bg-card"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <Badge variant="outline" className="text-xs">
          {post.category}
        </Badge>
        <time className="text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </time>
      </div>
      
      <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-foreground/80 transition-colors">
        {post.title}
      </h2>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{post.author}</span>
      </div>
    </article>
  );
};
