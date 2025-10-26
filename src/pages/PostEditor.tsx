import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye, Bold, Italic, Underline, List, ListOrdered, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { SearchModal } from '@/components/SearchModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseUrl, supabaseKey } from '@/lib/supabaseClient';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const isEdit = Boolean(id);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    author: 'DeepTech Research'
  });
  const [categories, setCategories] = useState<string[]>([]);


  useEffect(() => {
    if (isEdit) {
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
          setFormData({
            title: postData.title,
            category: postData.category,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author,
          });
        }
      };
      fetchPost();
    }
  }, [isEdit, id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=name`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      const data = await response.json();
      if (data) {
        setCategories(data.map((category: any) => category.name));
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Admin access required');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const postData = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    let url = `${supabaseUrl}/rest/v1/posts`;
    let method = 'POST';

    if (isEdit) {
      url = `${supabaseUrl}/rest/v1/posts?id=eq.${id}`;
      method = 'PATCH';
    }

    const response = await fetch(url, {
      method,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      toast.success(isEdit ? 'Post updated successfully' : 'Post created successfully');
      navigate('/');
    } else {
      toast.error('Failed to save post');
      console.error(await response.text());
    }
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
    }
    
    const newContent = formData.content.substring(0, start) + formattedText + formData.content.substring(end);
    setFormData({ ...formData, content: newContent });
    
    textarea.focus();
    setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
    }, 0);
  };

  if (!isAuthenticated) {
    return null;
  }

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
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update your deeptech breakthrough post' : 'Share the latest deeptech breakthrough'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter post title..."
                className="bg-card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Tag *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as any })}
              >
                <SelectTrigger id="category" className="bg-card">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the breakthrough..."
              className="bg-card resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            {!isPreview && (
            <>
              <div className="flex items-center space-x-2 py-2 border-b">
                <Button variant="ghost" size="sm" onClick={() => formatText('bold')}><Bold className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('italic')}><Italic className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => formatText('underline')}><Underline className="h-4 w-4" /></Button>
                <div className="h-4 w-px bg-border mx-2" />
                <Button variant="ghost" size="sm"><List className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><ListOrdered className="h-4 w-4" /></Button>
                <div className="h-4 w-px bg-border mx-2" />
                <Button variant="ghost" size="sm"><Link2 className="h-4 w-4" /></Button>
              </div>

              <div>
                <Textarea
                  ref={textareaRef}
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post content here... Use markdown for formatting."
                  className="mt-1 min-h-[400px]"
                />
              </div>
            </>
          )}
          {isPreview && (
            <div className="min-h-[400px] p-4 border border-border rounded-lg bg-muted/20">
              <h2 className="text-xl font-bold mb-4">{formData.title || "Untitled"}</h2>
              <div className="prose prose-sm max-w-none">
                {formData.content.split('\n').map((line: string, index: number) => {
                  if (line.trim() === '') return <br key={index} />;

                  const formattedParagraph = line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/__(.*?)__/g, '<u>$1</u>');

                  return <p key={index} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />;
                })}
              </div>
            </div>
          )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Author name..."
              className="bg-card"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isEdit ? 'Update Post' : 'Create Post'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsPreview(!isPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
          </div>
        </form>
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        // posts={[]}
      />
    </div>
  );
};

export default PostEditor;
