import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabaseUrl, supabaseKey } from '@/lib/supabaseClient';
import { BlogPost } from '@/types/blog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?select=*&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
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
    setPosts(mappedData);
  };

  const fetchCategories = async () => {
    const response = await fetch(`${supabaseUrl}/rest/v1/categories?select=name` , {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
        },
    });
    const data = await response.json();
    
    if (data) {
        const categories = data.map((category: { name: string | null }) => category.name);
        const uniqueCategories = [...new Set(categories)].filter((c): c is string => !!c);
        setCategories(uniqueCategories);
    }
  };

  const handleCreateCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.ok) {
        toast.success(`Category "${newCategory}" created successfully.`);
        setNewCategory('');
        fetchCategories();
      } else {
        const error = await response.json();
        console.error('Failed to create category:', error);
        toast.error(`Failed to create category "${newCategory}".`);
      }
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${category}"? All posts with this category will have it removed.`)) {
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/posts?category=eq.${category}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ category: null }),
      });

      if (updateResponse.ok) {
        const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/categories?name=eq.${category}`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        });

        if (deleteResponse.ok) {
          toast.success(`Category "${category}" deleted successfully.`);
          fetchPosts();
          fetchCategories();
        } else {
          toast.error(`Failed to delete category "${category}".`);
        }
      } else {
        toast.error(`Failed to update posts for category "${category}".`);
      }
    }
  };

  const handleUpdateCategory = async (oldCategory: string) => {
    if (newCategoryName && newCategoryName !== oldCategory) {
      const response = await fetch(`${supabaseUrl}/rest/v1/categories?name=eq.${oldCategory}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const updatePostsResponse = await fetch(`${supabaseUrl}/rest/v1/posts?category=eq.${oldCategory}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ category: newCategoryName }),
        });

        if (updatePostsResponse.ok) {
          toast.success(`Category "${oldCategory}" updated to "${newCategoryName}".`);
          setEditingCategory(null);
          setNewCategoryName('');
          fetchPosts();
          fetchCategories();
        } else {
          toast.error(`Failed to update posts for category "${oldCategory}".`);
        }
      } else {
        toast.error(`Failed to update category "${oldCategory}".`);
      }
    } else {
        setEditingCategory(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${postId}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      toast.success('Post deleted successfully');
      fetchPosts();
    } else {
      toast.error('Failed to delete post');
    }
  };

  const groupedPosts = posts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear();
    const month = new Date(post.createdAt).toLocaleString('default', { month: 'long' });
    if (!acc[year]) {
        acc[year] = {};
    }
    if (!acc[year][month]) {
        acc[year][month] = [];
    }
    acc[year][month].push(post);
    return acc;
  }, {} as Record<number, Record<string, BlogPost[]>>);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => {}} />
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8">Admin Dashboard</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Manage Posts</h2>
            <Accordion type="multiple" className="w-full">
                {Object.keys(groupedPosts).sort((a, b) => Number(b) - Number(a)).map(year => (
                    <AccordionItem value={year} key={year}>
                        <AccordionTrigger>{year}</AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="multiple" className="w-full">
                                {Object.keys(groupedPosts[Number(year)]).map(month => (
                                    <AccordionItem value={`${year}-${month}`} key={`${year}-${month}`}>
                                        <AccordionTrigger>{month}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-4">
                                                {groupedPosts[Number(year)][month].map(post => (
                                                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                        <div>
                                                            <h3 className="font-bold">{post.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{post.category} - {new Date(post.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm" onClick={() => navigate(`/edit/${post.id}`)}>Edit</Button>
                                                            <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>Delete</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Manage Tags</h2>
          <div className="flex items-center gap-2 mb-4">
            <Input 
              placeholder="New tag name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={handleCreateCategory}>Create Tags</Button>
          </div>
          <div className="flex flex-col gap-4">
            {categories.map(category => (
              <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                {editingCategory === category ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button onClick={() => handleUpdateCategory(category)}>Save</Button>
                    <Button variant="ghost" onClick={() => setEditingCategory(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <p>{category}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                            setEditingCategory(category);
                            setNewCategoryName(category);
                        }}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category)}>Delete</Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
