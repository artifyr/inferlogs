import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { blogPosts } from '@/data/posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SearchModal } from '@/components/SearchModal';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearchClick={() => setSearchOpen(true)} showNewPost={false} />
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    toast.success('Post deleted successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} showNewPost={false} />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-8 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Button>

        <article className="prose prose-invert max-w-none">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline">{post.category}</Badge>
            <time className="text-sm text-muted-foreground">
              Last updated {new Date(post.updatedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <p className="text-muted-foreground">By {post.author}</p>
            
            {isAuthenticated && (
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            )}
          </div>

          <div className="text-foreground/90 leading-relaxed space-y-4 whitespace-pre-line">
            {post.content}
          </div>
        </article>
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        posts={blogPosts}
      />
    </div>
  );
};

export default PostView;
