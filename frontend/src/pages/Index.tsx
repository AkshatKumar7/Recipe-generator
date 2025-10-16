import { useState, useMemo, useEffect } from 'react';
import axios from "axios";
import { recipes, Recipe } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { IngredientInput } from '@/components/IngredientInput';
import { ImageUploadModal } from '@/components/ImageUploadModal';
import { DietaryPreferences } from '@/components/DietaryPreferences';
import { ServingSizeAdjuster } from '@/components/ServingSizeAdjuster';
import { RecipeSkeletonLoader } from '@/components/RecipeSkeletonLoader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateRecipes } from '@/lib/api';
import { Sparkles, Star, Heart, Clock, Users, RefreshCw, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/utils';

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Index = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const [currentSection, setCurrentSection] = useState<'home' | 'favorites'>('home');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeServings, setRecipeServings] = useState<number>(4);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [maxTime, setMaxTime] = useState<string>('all');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  const [ratings, setRatings] = useLocalStorage<Record<string, number>>('ratings', {});
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;

    // Show only favorites if on favorites section
    if (currentSection === 'favorites') {
      filtered = filtered.filter(r => favorites.includes(r.id));
    }

    // Filter by ingredients
    if (ingredients.length > 0) {
      filtered = filtered.filter(recipe => 
        ingredients.some(ing => 
          recipe.ingredients.some(recipeIng => {
            if (typeof recipeIng === "string") {
              return recipeIng.toLowerCase().includes(ing.toLowerCase());
            } else if (recipeIng && typeof recipeIng === "object" && "name" in recipeIng) {
              return recipeIng.name.toLowerCase().includes(ing.toLowerCase());
            }
            return false;
          })
        )
      );
    }

    // Filter by dietary preferences
    if (dietaryPreferences.length > 0) {
      filtered = filtered.filter(recipe =>
        dietaryPreferences.some(pref => recipe.dietaryTags.includes(pref))
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(r => r.difficulty === difficultyFilter);
    }

    // Filter by cooking time
    if (maxTime !== 'all') {
      const timeLimit = parseInt(maxTime);
      filtered = filtered.filter(r => r.time <= timeLimit);
    }

    return filtered;
  }, [ingredients, dietaryPreferences, difficultyFilter, maxTime, favorites, currentSection]);

  const handleIngredientsDetected = (detectedIngredients: string[]) => {
    const uniqueIngredients = [...new Set([...ingredients, ...detectedIngredients])];
    setIngredients(uniqueIngredients);
    toast({
      title: "Ingredients added!",
      description: `Added ${detectedIngredients.length} ingredient${detectedIngredients.length !== 1 ? 's' : ''} from image`,
      duration: 3000,
    });
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add at least one ingredient to generate recipes",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await axios.post<{ message: string; data: Recipe | Recipe[] }>(
        `${BACKEND_URI}/api/recipes/generate`,
        {
          ingredients,
          dietaryPreferences,
          difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
          maxTime: maxTime !== 'all' ? parseInt(maxTime) : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data && result.data.data) {
        const recipes = Array.isArray(result.data.data) ? result.data.data : [result.data.data];
        setGeneratedRecipes(recipes);
        setHasGenerated(true);
        toast({
          title: "Recipes generated!",
          description: `Found ${recipes.length} matching recipe${recipes.length !== 1 ? 's' : ''}`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate recipes. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setIngredients([]);
    setDietaryPreferences([]);
    setDifficultyFilter('all');
    setMaxTime('all');
    setHasGenerated(false);
  };

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
    toast({
      title: favorites.includes(recipeId) ? "Removed from favorites" : "Added to favorites",
      duration: 2000,
    });
  };

  const setRating = (recipeId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [recipeId]: rating }));
    toast({
      title: "Rating saved",
      description: `You rated this recipe ${rating} stars`,
      duration: 2000,
    });
  };

  const adjustIngredients = (recipe: Recipe, targetServings: number) => {
    const ratio = targetServings / recipe.servings;
    return recipe.ingredients.map((ing) => {
      if (typeof ing === "string") {
        const match = ing.match(/^([\d.]+)\s*(.+)$/);
        if (match) {
          const amount = parseFloat(match[1]) * ratio;
          const unit = match[2];
          return `${amount.toFixed(1)} ${unit}`;
        }
        return ing;
      } else if (
        ing && typeof ing === "object" && "name" in ing && "quantity" in ing
      ) {
        // If quantity contains non-numeric, just print as is
        const num = parseFloat(ing.quantity);
        if (!isNaN(num)) {
          return `${(num * ratio).toFixed(1)} ${ing.name}`;
        }
        return `${ing.quantity} ${ing.name}`;
      }
      return String(ing);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onNavigate={setCurrentSection}
        currentSection={currentSection}
        favoritesCount={favorites.length}
      />
      <div className="flex justify-end max-w-7xl mx-auto px-4 pt-4">
        <Button onClick={handleLogout} variant="outline" className="gap-2">
          Logout
        </Button>
      </div>

      {currentSection === 'home' ? (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-6xl font-black mb-4 text-[#7c3aed] font-serif italic tracking-tight drop-shadow-lg">
                  Welcome to Vivid Recipes
                </h1>
                <p className="text-xl text-[#2d3748] max-w-2xl mx-auto font-fira font-semibold italic tracking-wide">
                  Generate delicious recipes with AI, tailored to your pantry and preferences.
                </p>
              </div>

              {/* Ingredient Input Section */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-[#7c3aed] font-serif">
                  <UtensilsCrossed className="w-6 h-6 text-primary" />
                  Your Ingredients
                </h2>
                <IngredientInput
                  ingredients={ingredients}
                  onIngredientsChange={setIngredients}
                  onOpenCamera={() => setIsImageModalOpen(true)}
                />
              </div>

              {/* Dietary Preferences Section */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
                <DietaryPreferences
                  selectedPreferences={dietaryPreferences}
                  onPreferencesChange={setDietaryPreferences}
                />
              </div>

              {/* Filters Section */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg mb-6">
                <h3 className="font-bold text-xl mb-4 text-[#2d3748] font-fira italic">Additional Filters</h3>
                <div className="flex flex-wrap gap-3">
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={maxTime} onValueChange={setMaxTime}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Cooking Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="20">Under 20 min</SelectItem>
                      <SelectItem value="30">Under 30 min</SelectItem>
                      <SelectItem value="45">Under 45 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleGenerateRecipes}
                  disabled={isGenerating || ingredients.length === 0}
                  size="lg"
                  className="gap-2 px-8"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Recipes
                    </>
                  )}
                </Button>

                {hasGenerated && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Results Section */}
          {(hasGenerated || ingredients.length > 0) && (
            <section className="py-12 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">
                    {isGenerating ? 'Generating Recipes...' : 'Recipe Suggestions'}
                  </h2>
                  <span className="text-muted-foreground">
                    {hasGenerated ? generatedRecipes.length : filteredRecipes.length} recipe{(hasGenerated ? generatedRecipes.length : filteredRecipes.length) !== 1 ? 's' : ''}
                  </span>
                </div>

                {isGenerating ? (
                  <RecipeSkeletonLoader />
                ) : hasGenerated ? (
                  generatedRecipes.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-xl text-muted-foreground mb-4">No recipes found</p>
                      <p className="text-muted-foreground">Try adjusting your filters or adding more ingredients</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedRecipes.map((recipe, i) => (
                        <RecipeCard
                          key={recipe.id || recipe.name || i}
                          recipe={recipe}
                          rating={ratings[recipe.id]}
                          isFavorite={favorites.includes(recipe.id)}
                          onClick={() => setSelectedRecipe(recipe)}
                        />
                      ))}
                    </div>
                  )
                ) : filteredRecipes.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground mb-4">No recipes found</p>
                    <p className="text-muted-foreground">Try adjusting your filters or adding more ingredients</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe, i) => (
                      <RecipeCard
                        key={recipe.id || recipe.name || i}
                        recipe={recipe}
                        rating={ratings[recipe.id]}
                        isFavorite={favorites.includes(recipe.id)}
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Favorites Section */
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary fill-current" />
                Your Favorites
              </h2>
              <span className="text-muted-foreground">
                {/* Count all favorited recipes from both static and generated */}
                {(() => {
                  const allRecipes = [...recipes, ...generatedRecipes];
                  const favorited = allRecipes.filter(r => favorites.includes(r.id));
                  return favorited.length;
                })()} recipe{(() => {
                  const allRecipes = [...recipes, ...generatedRecipes];
                  const favorited = allRecipes.filter(r => favorites.includes(r.id));
                  return favorited.length !== 1 ? 's' : '';
                })()}
              </span>
            </div>

            {/* Show all favorited recipes from both static and generated */}
            {(() => {
              const allRecipes = [...recipes, ...generatedRecipes];
              const favorited = allRecipes.filter(r => favorites.includes(r.id));
              if (favorited.length === 0) {
                return (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 mx-auto text-muted mb-4" />
                    <p className="text-xl text-muted-foreground mb-4">No favorites yet</p>
                    <p className="text-muted-foreground mb-6">
                      Start adding recipes to your favorites to see them here
                    </p>
                    <Button onClick={() => setCurrentSection('home')} variant="outline">
                      Browse Recipes
                    </Button>
                  </div>
                );
              } else {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorited.map(recipe => (
                      <RecipeCard
                        key={recipe.id || recipe.name}
                        recipe={recipe}
                        rating={ratings[recipe.id]}
                        isFavorite={true}
                        onClick={() => setSelectedRecipe(recipe)}
                      />
                    ))}
                  </div>
                );
              }
            })()}
          </div>
        </section>
      )}

      <Footer />

      {/* Image Upload Modal */}
      <ImageUploadModal
        open={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
        onIngredientsDetected={handleIngredientsDetected}
      />

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl">{selectedRecipe.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Removed image display */}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedRecipe.cuisine}</Badge>
                  <Badge variant="outline">{selectedRecipe.difficulty}</Badge>
                  {selectedRecipe.dietaryTags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{selectedRecipe.time} minutes</span>
                  </div>
                  <ServingSizeAdjuster
                    servings={recipeServings}
                    onServingsChange={setRecipeServings}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => toggleFavorite(selectedRecipe.id)}
                  >
                    <Heart className={cn(
                      "w-4 h-4 mr-2",
                      favorites.includes(selectedRecipe.id) && "fill-current text-primary"
                    )} />
                    {favorites.includes(selectedRecipe.id) ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(selectedRecipe.id, i + 1)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={cn(
                            "w-6 h-6",
                            ratings[selectedRecipe.id] && i < ratings[selectedRecipe.id]
                              ? "fill-primary text-primary"
                              : "text-muted"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Ingredients (for {recipeServings} serving{recipeServings !== 1 ? 's' : ''})
                  </h3>
                  <ul className="space-y-2">
                    {adjustIngredients(selectedRecipe, recipeServings).map((ingredient, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="capitalize">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, i) => (
                      <li key={i} className="flex">
                        <span className="font-semibold text-primary mr-3 min-w-[24px]">
                          {i + 1}.
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedRecipe.nutrition?.calories ?? selectedRecipe.nutritionalInfo?.calories ?? "-"}
                      </div>
                      <div className="text-sm text-muted-foreground">Calories</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedRecipe.nutrition?.protein ?? selectedRecipe.nutritionalInfo?.protein ?? "-"}g
                      </div>
                      <div className="text-sm text-muted-foreground">Protein</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedRecipe.nutrition?.fat ?? selectedRecipe.nutritionalInfo?.fat ?? "-"}g
                      </div>
                      <div className="text-sm text-muted-foreground">Fat</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {selectedRecipe.nutrition?.carbs ?? selectedRecipe.nutritionalInfo?.carbs ?? "-"}g
                      </div>
                      <div className="text-sm text-muted-foreground">Carbs</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
