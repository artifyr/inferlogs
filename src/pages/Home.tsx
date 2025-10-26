import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BlogPostCard } from '@/components/BlogPostCard';
import { SearchModal } from '@/components/SearchModal';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Rows3, Filter } from 'lucide-react';
import { supabaseUrl, supabaseKey } from '@/lib/supabaseClient';
import { BlogPost } from '@/types/blog';
import {  DropdownMenu,  DropdownMenuContent,  DropdownMenuCheckboxItem,  DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";

const Home = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'rows'>('grid');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
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

    fetchPosts();
  }, []);

  const allCategories = [...new Set(posts.map(post => post.category))];

  const filteredPosts = posts.filter(post =>
    selectedCategories.length === 0 || selectedCategories.includes(post.category)
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} />
      
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Latest Breakthroughs in Deep Technology
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            Stay updated with cutting-edge developments in AI, robotics, neurology, and emerging technologies shaping our future.
          </p>
        </div>

        <div className="flex justify-between mb-4 md:mb-6 gap-2">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter by tags</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {allCategories.map(category => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('grid')}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={layout === 'rows' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLayout('rows')}
              className="gap-2"
            >
              <Rows3 className="w-4 h-4" />
              <span className="hidden sm:inline">Rows</span>
            </Button>
          </div>
        </div>

        <div className={
          layout === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' 
            : 'flex flex-col gap-4 md:gap-6'
        }>
          {filteredPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};

export default Home;
