import { ChefHat, Heart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onNavigate: (section: 'home' | 'favorites') => void;
  currentSection: 'home' | 'favorites';
  favoritesCount: number;
}

export const Navbar = ({ onNavigate, currentSection, favoritesCount }: NavbarProps) => {
  return (
      <nav className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 sticky top-0 z-50 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-3xl font-extrabold text-[#5f6fff] tracking-wide font-montserrat">
                Vivid Recipes
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={currentSection === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className="gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <Button
              variant={currentSection === 'favorites' ? 'default' : 'ghost'}
              onClick={() => onNavigate('favorites')}
              className="gap-2 relative"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
