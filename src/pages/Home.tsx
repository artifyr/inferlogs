import { useState } from 'react';
import { Header } from '@/components/Header';
import { BlogPostCard } from '@/components/BlogPostCard';
import { SearchModal } from '@/components/SearchModal';
import { blogPosts } from '@/data/posts';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Rows3 } from 'lucide-react';

const Home = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'rows'>('grid');

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

        <div className="flex justify-end mb-4 md:mb-6 gap-2">
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

        <div className={
          layout === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' 
            : 'flex flex-col gap-4 md:gap-6'
        }>
          {blogPosts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        posts={blogPosts}
      />
    </div>
  );
};

export default Home;
