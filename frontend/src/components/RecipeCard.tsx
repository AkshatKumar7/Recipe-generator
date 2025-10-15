import { Recipe } from '@/data/recipes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  rating?: number;
  isFavorite?: boolean;
  onClick: () => void;
}

export const RecipeCard = ({ recipe, rating, isFavorite, onClick }: RecipeCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        {isFavorite && (
          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground rounded-full p-2">
            <Star className="w-4 h-4 fill-current" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.name}</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {recipe.cuisine}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn(
              recipe.difficulty === 'Easy' && 'border-secondary text-secondary',
              recipe.difficulty === 'Medium' && 'border-accent text-accent',
              recipe.difficulty === 'Hard' && 'border-destructive text-destructive'
            )}
          >
            {recipe.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.time}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {recipe.dietaryTags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        {rating && (
          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < rating ? "fill-primary text-primary" : "text-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
