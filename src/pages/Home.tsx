import { useState } from 'react';
import { Header } from '@/components/Header';
import { BlogPostCard } from '@/components/BlogPostCard';
import { SearchModal } from '@/components/SearchModal';
import { blogPosts } from '@/data/posts';

const Home = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onSearchClick={() => setSearchOpen(true)} />
      
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Latest Breakthroughs in Deep Technology
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with cutting-edge developments in AI, robotics, neurology, and emerging technologies shaping our future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
