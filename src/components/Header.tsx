import { Search, Plus, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onSearchClick: () => void;
  showNewPost?: boolean;
}

export const Header = ({ onSearchClick, showNewPost = true }: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <button 
          onClick={() => navigate('/')}
          className="text-xl font-semibold text-foreground hover:opacity-80 transition-opacity"
        >
          DeepTech Insights
        </button>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:border-foreground/20 transition-all hover:scale-105 w-32 md:w-64"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Search posts...</span>
            <span className="md:hidden">Search</span>
          </button>
          
          {showNewPost && isAuthenticated && (
            <Button
              onClick={() => navigate('/new')}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Post</span>
            </Button>
          )}

          {isAuthenticated ? (
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
