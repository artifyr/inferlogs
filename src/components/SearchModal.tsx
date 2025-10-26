import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BlogPost } from '@/types/blog';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { supabaseUrl, supabaseKey } from '@/lib/supabaseClient';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const SearchModal = ({ open, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length > 0) {
        const fetchSearch = async () => {
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/search_posts`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ search_term: query }),
          });
          const data = await response.json();
          const mappedData = data.map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            excerpt: post.excerpt,
            content: post.content,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
            author: post.author,
          }));
          setResults(mappedData);
        };
        fetchSearch();
      } else {
        setResults([]);
      }
    }, 100); // 100ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0" hideClose>
        <div className="flex items-center p-4 border-b border-border gap-1">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts by title or content..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base flex-grow"
                autoFocus
            />
            <DialogClose>
                <X className="h-5 w-5 text-muted-foreground" />
            </DialogClose>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No posts found matching "{query}"
            </div>
          )}
          
          {query && results.length > 0 && (
            <div className="p-2">
              {results.map(post => (
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
