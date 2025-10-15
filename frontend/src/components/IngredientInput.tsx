import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Plus, X } from 'lucide-react';

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onOpenCamera: () => void;
}

export const IngredientInput = ({ 
  ingredients, 
  onIngredientsChange,
  onOpenCamera 
}: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Type an ingredient (e.g., chicken, tomatoes)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12"
          />
        </div>
        <Button
          onClick={addIngredient}
          className="h-12 px-4"
          disabled={!inputValue.trim()}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add
        </Button>
        <Button
          onClick={onOpenCamera}
          variant="outline"
          className="h-12 px-4"
        >
          <Camera className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Photo</span>
        </Button>
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <Badge
              key={ingredient}
              variant="secondary"
              className="text-sm px-3 py-2 gap-2"
            >
              <span className="capitalize">{ingredient}</span>
              <button
                onClick={() => removeIngredient(ingredient)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {ingredients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No ingredients added yet</p>
          <p className="text-xs mt-1">Add ingredients manually or upload a photo</p>
        </div>
      )}
    </div>
  );
};
