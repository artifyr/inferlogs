import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BlogPost } from '@/types/blog';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export const SearchModal = ({ open, onClose, posts }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
    post.category.toLowerCase().includes(query.toLowerCase())
  );

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title or content..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query && filteredPosts.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No posts found matching "{query}"
            </div>
          )}
          
          {query && filteredPosts.length > 0 && (
            <div className="p-2">
              {filteredPosts.map(post => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="w-full text-left p-4 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="text-xs mt-1">
                      {post.category}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-1 truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="p-8 text-center text-muted-foreground">
              Start typing to search posts...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
