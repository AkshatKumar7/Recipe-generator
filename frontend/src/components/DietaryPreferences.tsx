import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DietaryPreferencesProps {
  selectedPreferences: string[];
  onPreferencesChange: (preferences: string[]) => void;
}

const preferences = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'high-protein', label: 'High-Protein' },
  { id: 'low-carb', label: 'Low-Carb' },
];

export const DietaryPreferences = ({ 
  selectedPreferences, 
  onPreferencesChange 
}: DietaryPreferencesProps) => {
  const togglePreference = (prefId: string) => {
    if (selectedPreferences.includes(prefId)) {
      onPreferencesChange(selectedPreferences.filter(p => p !== prefId));
    } else {
      onPreferencesChange([...selectedPreferences, prefId]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Dietary Preferences</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {preferences.map((pref) => (
          <div key={pref.id} className="flex items-center space-x-2">
            <Checkbox
              id={pref.id}
              checked={selectedPreferences.includes(pref.id)}
              onCheckedChange={() => togglePreference(pref.id)}
            />
            <Label
              htmlFor={pref.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {pref.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
