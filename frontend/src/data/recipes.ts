export interface Recipe {
  id?: string;
  name: string;
  ingredients: Array<string | { name: string; quantity: string }>;
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time?: number;
  cookingTime?: number;
  servings: number;
  nutrition?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  nutritionalInfo?: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  cuisine: string;
  dietaryTags: string[];
  image?: string;
  averageRating?: number;
  ratings?: any[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Margherita Pizza',
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella cheese', 'fresh basil', 'olive oil', 'salt'],
    instructions: [
      'Preheat oven to 475°F (245°C)',
      'Roll out pizza dough on a floured surface',
      'Spread tomato sauce evenly over the dough',
      'Add mozzarella cheese',
      'Bake for 12-15 minutes until crust is golden',
      'Top with fresh basil and drizzle with olive oil'
    ],
    difficulty: 'Easy',
    time: 30,
    servings: 4,
    nutrition: { calories: 285, protein: 12, fat: 10, carbs: 38 },
    cuisine: 'Italian',
    dietaryTags: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800'
  },
  {
    id: '2',
    name: 'Creamy Pasta Carbonara',
    ingredients: ['spaghetti', 'bacon', 'eggs', 'parmesan cheese', 'black pepper', 'salt'],
    instructions: [
      'Cook spaghetti according to package directions',
      'Fry bacon until crispy, then chop',
      'Beat eggs with grated parmesan',
      'Drain pasta, reserving 1 cup pasta water',
      'Mix hot pasta with egg mixture, adding pasta water to create creamy sauce',
      'Add bacon and black pepper, serve immediately'
    ],
    difficulty: 'Medium',
    time: 25,
    servings: 4,
    nutrition: { calories: 520, protein: 22, fat: 24, carbs: 52 },
    cuisine: 'Italian',
    dietaryTags: [],
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800'
  },
  {
    id: '3',
    name: 'Fresh Garden Salad',
    ingredients: ['lettuce', 'tomatoes', 'cucumber', 'red onion', 'olive oil', 'lemon juice', 'salt', 'pepper'],
    instructions: [
      'Wash and chop lettuce into bite-sized pieces',
      'Dice tomatoes and cucumber',
      'Slice red onion thinly',
      'Combine all vegetables in a large bowl',
      'Drizzle with olive oil and lemon juice',
      'Season with salt and pepper, toss well'
    ],
    difficulty: 'Easy',
    time: 10,
    servings: 4,
    nutrition: { calories: 95, protein: 2, fat: 7, carbs: 8 },
    cuisine: 'Mediterranean',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'
  },
  {
    id: '4',
    name: 'Chicken Stir-Fry',
    ingredients: ['chicken breast', 'soy sauce', 'bell peppers', 'broccoli', 'garlic', 'ginger', 'rice', 'sesame oil'],
    instructions: [
      'Cook rice according to package directions',
      'Cut chicken into bite-sized pieces',
      'Heat sesame oil in wok or large pan',
      'Stir-fry chicken until cooked through',
      'Add vegetables, garlic, and ginger',
      'Add soy sauce and cook for 5 minutes',
      'Serve over rice'
    ],
    difficulty: 'Medium',
    time: 35,
    servings: 4,
    nutrition: { calories: 380, protein: 32, fat: 8, carbs: 45 },
    cuisine: 'Asian',
    dietaryTags: ['dairy-free'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800'
  },
  {
    id: '5',
    name: 'Vegan Buddha Bowl',
    ingredients: ['quinoa', 'chickpeas', 'sweet potato', 'kale', 'avocado', 'tahini', 'lemon juice', 'olive oil'],
    instructions: [
      'Cook quinoa according to package directions',
      'Roast chickpeas and diced sweet potato at 400°F for 25 minutes',
      'Massage kale with olive oil',
      'Prepare tahini dressing with lemon juice',
      'Arrange quinoa, roasted vegetables, kale, and avocado in bowl',
      'Drizzle with tahini dressing'
    ],
    difficulty: 'Easy',
    time: 40,
    servings: 2,
    nutrition: { calories: 485, protein: 15, fat: 20, carbs: 62 },
    cuisine: 'Fusion',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
  },
  {
    id: '6',
    name: 'Beef Tacos',
    ingredients: ['ground beef', 'taco shells', 'lettuce', 'tomatoes', 'cheese', 'sour cream', 'taco seasoning', 'onion'],
    instructions: [
      'Brown ground beef with diced onion',
      'Add taco seasoning and water, simmer',
      'Warm taco shells in oven',
      'Chop lettuce and tomatoes',
      'Fill shells with beef mixture',
      'Top with lettuce, tomatoes, cheese, and sour cream'
    ],
    difficulty: 'Easy',
    time: 20,
    servings: 4,
    nutrition: { calories: 420, protein: 25, fat: 22, carbs: 32 },
    cuisine: 'Mexican',
    dietaryTags: [],
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800'
  },
  {
    id: '7',
    name: 'Salmon with Roasted Vegetables',
    ingredients: ['salmon fillets', 'asparagus', 'cherry tomatoes', 'lemon', 'olive oil', 'garlic', 'herbs', 'salt', 'pepper'],
    instructions: [
      'Preheat oven to 400°F (200°C)',
      'Season salmon with salt, pepper, and herbs',
      'Arrange asparagus and tomatoes on baking sheet',
      'Drizzle vegetables with olive oil and minced garlic',
      'Place salmon on vegetables',
      'Bake for 20 minutes until salmon is cooked through',
      'Serve with lemon wedges'
    ],
    difficulty: 'Medium',
    time: 30,
    servings: 2,
    nutrition: { calories: 425, protein: 38, fat: 26, carbs: 12 },
    cuisine: 'Mediterranean',
    dietaryTags: ['gluten-free', 'dairy-free'],
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800'
  },
  {
    id: '8',
    name: 'Vegetable Curry',
    ingredients: ['coconut milk', 'curry paste', 'potatoes', 'carrots', 'peas', 'cauliflower', 'onion', 'garlic', 'rice'],
    instructions: [
      'Cook rice according to package directions',
      'Sauté onion and garlic in large pot',
      'Add curry paste and cook for 1 minute',
      'Add diced vegetables and coconut milk',
      'Simmer for 20 minutes until vegetables are tender',
      'Serve over rice'
    ],
    difficulty: 'Medium',
    time: 35,
    servings: 6,
    nutrition: { calories: 320, protein: 8, fat: 14, carbs: 44 },
    cuisine: 'Indian',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'
  },
  {
    id: '9',
    name: 'Greek Chicken Souvlaki',
    ingredients: ['chicken breast', 'greek yogurt', 'lemon', 'garlic', 'oregano', 'pita bread', 'cucumber', 'tomatoes', 'red onion'],
    instructions: [
      'Marinate chicken in yogurt, lemon, garlic, and oregano for 2 hours',
      'Cut chicken into cubes and thread onto skewers',
      'Grill for 12-15 minutes, turning occasionally',
      'Warm pita bread on grill',
      'Dice cucumber, tomatoes, and onion',
      'Serve chicken in pita with vegetables and tzatziki'
    ],
    difficulty: 'Medium',
    time: 150,
    servings: 4,
    nutrition: { calories: 395, protein: 35, fat: 10, carbs: 42 },
    cuisine: 'Greek',
    dietaryTags: [],
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800'
  },
  {
    id: '10',
    name: 'Mushroom Risotto',
    ingredients: ['arborio rice', 'mushrooms', 'vegetable broth', 'white wine', 'parmesan cheese', 'butter', 'onion', 'garlic'],
    instructions: [
      'Sauté mushrooms in butter, set aside',
      'Cook onion and garlic until soft',
      'Add rice and toast for 2 minutes',
      'Add wine and cook until absorbed',
      'Gradually add warm broth, stirring constantly',
      'Cook for 20 minutes until creamy',
      'Stir in mushrooms, butter, and parmesan'
    ],
    difficulty: 'Hard',
    time: 45,
    servings: 4,
    nutrition: { calories: 445, protein: 12, fat: 18, carbs: 58 },
    cuisine: 'Italian',
    dietaryTags: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1476124369491-f4c3fa0b4386?w=800'
  },
  {
    id: '11',
    name: 'Pancakes',
    ingredients: ['flour', 'milk', 'eggs', 'butter', 'sugar', 'baking powder', 'salt', 'maple syrup'],
    instructions: [
      'Mix dry ingredients in bowl',
      'Whisk eggs, milk, and melted butter',
      'Combine wet and dry ingredients',
      'Heat griddle or pan over medium heat',
      'Pour batter and cook until bubbles form',
      'Flip and cook until golden',
      'Serve with maple syrup'
    ],
    difficulty: 'Easy',
    time: 20,
    servings: 4,
    nutrition: { calories: 320, protein: 9, fat: 12, carbs: 45 },
    cuisine: 'American',
    dietaryTags: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'
  },
  {
    id: '12',
    name: 'Thai Green Curry',
    ingredients: ['chicken breast', 'green curry paste', 'coconut milk', 'bamboo shoots', 'basil', 'fish sauce', 'sugar', 'rice'],
    instructions: [
      'Cook rice according to package directions',
      'Heat coconut milk and curry paste in pot',
      'Add sliced chicken and cook through',
      'Add bamboo shoots and simmer',
      'Season with fish sauce and sugar',
      'Add fresh basil before serving',
      'Serve over rice'
    ],
    difficulty: 'Medium',
    time: 30,
    servings: 4,
    nutrition: { calories: 465, protein: 28, fat: 22, carbs: 42 },
    cuisine: 'Thai',
    dietaryTags: ['gluten-free', 'dairy-free'],
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800'
  },
  {
    id: '13',
    name: 'Caprese Salad',
    ingredients: ['tomatoes', 'mozzarella cheese', 'fresh basil', 'olive oil', 'balsamic vinegar', 'salt', 'pepper'],
    instructions: [
      'Slice tomatoes and mozzarella into rounds',
      'Arrange alternating slices on plate',
      'Tuck basil leaves between slices',
      'Drizzle with olive oil and balsamic vinegar',
      'Season with salt and pepper',
      'Let sit for 10 minutes before serving'
    ],
    difficulty: 'Easy',
    time: 15,
    servings: 4,
    nutrition: { calories: 240, protein: 14, fat: 18, carbs: 8 },
    cuisine: 'Italian',
    dietaryTags: ['vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1592417817038-d13fd7ab893e?w=800'
  },
  {
    id: '14',
    name: 'Beef and Broccoli',
    ingredients: ['beef sirloin', 'broccoli', 'soy sauce', 'oyster sauce', 'garlic', 'ginger', 'cornstarch', 'rice', 'sesame oil'],
    instructions: [
      'Cook rice according to package directions',
      'Slice beef thinly and marinate in soy sauce and cornstarch',
      'Blanch broccoli florets',
      'Stir-fry beef in hot wok with sesame oil',
      'Add garlic and ginger',
      'Add broccoli and oyster sauce',
      'Serve over rice'
    ],
    difficulty: 'Medium',
    time: 30,
    servings: 4,
    nutrition: { calories: 420, protein: 32, fat: 15, carbs: 42 },
    cuisine: 'Chinese',
    dietaryTags: ['dairy-free'],
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800'
  },
  {
    id: '15',
    name: 'Chocolate Chip Cookies',
    ingredients: ['flour', 'butter', 'brown sugar', 'white sugar', 'eggs', 'vanilla extract', 'baking soda', 'salt', 'chocolate chips'],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Cream butter and sugars together',
      'Beat in eggs and vanilla',
      'Mix in flour, baking soda, and salt',
      'Fold in chocolate chips',
      'Drop spoonfuls onto baking sheet',
      'Bake for 10-12 minutes until golden'
    ],
    difficulty: 'Easy',
    time: 25,
    servings: 24,
    nutrition: { calories: 180, protein: 2, fat: 9, carbs: 24 },
    cuisine: 'American',
    dietaryTags: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800'
  },
  {
    id: '16',
    name: 'Lentil Soup',
    ingredients: ['lentils', 'carrots', 'celery', 'onion', 'garlic', 'vegetable broth', 'tomatoes', 'cumin', 'bay leaf'],
    instructions: [
      'Sauté diced onion, carrots, and celery',
      'Add minced garlic and cumin',
      'Add lentils, broth, tomatoes, and bay leaf',
      'Bring to boil, then simmer for 30 minutes',
      'Season with salt and pepper',
      'Remove bay leaf before serving'
    ],
    difficulty: 'Easy',
    time: 45,
    servings: 6,
    nutrition: { calories: 245, protein: 14, fat: 2, carbs: 42 },
    cuisine: 'Mediterranean',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
  },
  {
    id: '17',
    name: 'Shrimp Scampi',
    ingredients: ['shrimp', 'linguine', 'butter', 'garlic', 'white wine', 'lemon juice', 'parsley', 'red pepper flakes'],
    instructions: [
      'Cook linguine according to package directions',
      'Sauté garlic in butter',
      'Add shrimp and cook until pink',
      'Add white wine and lemon juice',
      'Toss with cooked pasta',
      'Garnish with parsley and red pepper flakes'
    ],
    difficulty: 'Medium',
    time: 25,
    servings: 4,
    nutrition: { calories: 485, protein: 28, fat: 16, carbs: 52 },
    cuisine: 'Italian',
    dietaryTags: [],
    image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=800'
  },
  {
    id: '18',
    name: 'Black Bean Burgers',
    ingredients: ['black beans', 'bread crumbs', 'onion', 'garlic', 'cumin', 'eggs', 'burger buns', 'lettuce', 'tomatoes'],
    instructions: [
      'Mash black beans in bowl',
      'Mix in bread crumbs, minced onion, garlic, cumin, and egg',
      'Form into patties',
      'Cook in skillet for 5 minutes per side',
      'Toast burger buns',
      'Assemble burgers with lettuce and tomatoes'
    ],
    difficulty: 'Easy',
    time: 30,
    servings: 4,
    nutrition: { calories: 340, protein: 16, fat: 8, carbs: 52 },
    cuisine: 'American',
    dietaryTags: ['vegetarian'],
    image: 'https://images.unsplash.com/photo-1585238341710-4a2eedb5703d?w=800'
  },
  {
    id: '19',
    name: 'Pad Thai',
    ingredients: ['rice noodles', 'shrimp', 'eggs', 'bean sprouts', 'peanuts', 'lime', 'fish sauce', 'tamarind paste', 'garlic'],
    instructions: [
      'Soak rice noodles in warm water',
      'Make sauce with fish sauce, tamarind, and sugar',
      'Stir-fry garlic and shrimp',
      'Push to side, scramble eggs',
      'Add drained noodles and sauce',
      'Toss with bean sprouts',
      'Serve with peanuts and lime wedges'
    ],
    difficulty: 'Hard',
    time: 35,
    servings: 4,
    nutrition: { calories: 465, protein: 22, fat: 14, carbs: 62 },
    cuisine: 'Thai',
    dietaryTags: ['dairy-free'],
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800'
  },
  {
    id: '20',
    name: 'Tomato Basil Soup',
    ingredients: ['tomatoes', 'onion', 'garlic', 'vegetable broth', 'heavy cream', 'fresh basil', 'olive oil', 'salt', 'pepper'],
    instructions: [
      'Sauté onion and garlic in olive oil',
      'Add tomatoes and broth',
      'Simmer for 20 minutes',
      'Blend until smooth',
      'Stir in cream and chopped basil',
      'Season with salt and pepper',
      'Serve hot with crusty bread'
    ],
    difficulty: 'Easy',
    time: 35,
    servings: 6,
    nutrition: { calories: 185, protein: 4, fat: 12, carbs: 16 },
    cuisine: 'American',
    dietaryTags: ['vegetarian', 'gluten-free'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800'
  }
];
