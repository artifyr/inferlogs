import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SearchModal } from '@/components/SearchModal';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseUrl, supabaseKey } from '@/lib/supabaseClient';
import { BlogPost } from '@/types/blog';

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${id}&select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        const postData = data[0];
        setPost({
          id: postData.id,
          title: postData.title,
          category: postData.category,
          excerpt: postData.excerpt,
          content: postData.content,
          createdAt: postData.created_at,
          updatedAt: postData.updated_at,
          author: postData.author,
        });
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearchClick={() => setSearchOpen(true)} showNewPost={false} />
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

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

  const handleDelete = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      toast.success('Post deleted successfully');
      navigate('/');
    } else {
      toast.error('Failed to delete post');
      console.error(await response.text());
    }
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

          <div className="text-foreground/90 leading-relaxed space-y-4">
            {post.content.split('\n').map((line, index) => {
              if (line.trim() === '') return <br key={index} />;

              const formattedLine = line
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/__(.*?)__/g, '<u>$1</u>');

              return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
            })}
          </div>
        </article>
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

export default PostView;
