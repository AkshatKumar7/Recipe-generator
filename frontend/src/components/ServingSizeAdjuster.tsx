import { Button } from '@/components/ui/button';
import { Minus, Plus, Users } from 'lucide-react';

interface ServingSizeAdjusterProps {
  servings: number;
  onServingsChange: (servings: number) => void;
}

export const ServingSizeAdjuster = ({ 
  servings, 
  onServingsChange 
}: ServingSizeAdjusterProps) => {
  const decrease = () => {
    if (servings > 1) onServingsChange(servings - 1);
  };

  const increase = () => {
    if (servings < 20) onServingsChange(servings + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <Users className="w-5 h-5 text-muted-foreground" />
      <span className="text-sm font-medium">Servings:</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={decrease}
          disabled={servings <= 1}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-semibold">{servings}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={increase}
          disabled={servings >= 20}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
