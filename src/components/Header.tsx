import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearchClick: () => void;
  showNewPost?: boolean;
}

export const Header = ({ onSearchClick, showNewPost = true }: HeaderProps) => {
  const navigate = useNavigate();
  const isAdmin = import.meta.env.VITE_ADMIN_EMAILS?.includes('admin@example.com');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <button 
          onClick={() => navigate('/')}
          className="text-xl font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          DeepTech Insights
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:border-foreground/20 transition-colors w-64"
          >
            <Search className="w-4 h-4" />
            <span>Search posts...</span>
          </button>
          
          {showNewPost && isAdmin && (
            <Button
              onClick={() => navigate('/new')}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
