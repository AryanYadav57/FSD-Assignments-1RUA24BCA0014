export type Program = {
  id: number;
  title: string;
  shortName: string;
  subtitle: string;
  weeks: number;
  minutesAvg: number;
  difficulty: number;
  price: string;
  isFree: boolean;
  isChallenge: boolean;
  equipment: string[];
  trainingTypes: string[];
  image: string;
  href: string;
};

const CDN = "https://cloudfront.fitnessblender.com/assets/img/plan";

export const programs: Program[] = [
  {
    id: 15649,
    title: "Fitness Blender's Free 2 Week Challenge",
    shortName: "Free 2 Week Challenge",
    subtitle: "Strength Training, Cardio, and Mobility Workouts",
    weeks: 2,
    minutesAvg: 31,
    difficulty: 3,
    price: "Free",
    isFree: true,
    isChallenge: true,
    equipment: ["Dumbbells", "Mat", "No Equipment"],
    trainingTypes: ["Strength Training", "Cardiovascular", "Mobility"],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800",
    href: "/plans/fitness-blender-s-free-2-week-challenge",
  },
  {
    id: 15647,
    title: "5 Day Challenge Trainer Series: Essentials with Erica",
    shortName: "Essentials with Erica",
    subtitle: "Beginner-Friendly Total Body Strength Training with Cardio",
    weeks: 1,
    minutesAvg: 35,
    difficulty: 3,
    price: "From $5.99",
    isFree: false,
    isChallenge: true,
    equipment: ["Dumbbells", "Mat"],
    trainingTypes: ["Strength Training", "Cardiovascular", "Mobility"],
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    href: "/plans/trainer-series-essentials-with-erica",
  },
  {
    id: 15454,
    title: "5 Day Challenge Trainer Series: Level Up with Tasha",
    shortName: "Level Up with Tasha",
    subtitle: "Time Under Tension Strength with Cardio for Muscle Growth",
    weeks: 1,
    minutesAvg: 42,
    difficulty: 4,
    price: "From $5.99",
    isFree: false,
    isChallenge: true,
    equipment: ["Dumbbells", "Mat"],
    trainingTypes: ["Strength Training", "HIIT"],
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    href: "/plans/trainer-series-level-up-with-tasha",
  },
  {
    id: 14001,
    title: "FB Fit Round 4",
    shortName: "FB Fit Round 4",
    subtitle: "Strength, HIIT Cardio, and Mobility â€” 4 Week Plan",
    weeks: 4,
    minutesAvg: 48,
    difficulty: 4,
    price: "From $14.39",
    isFree: false,
    isChallenge: false,
    equipment: ["Dumbbells", "Mat"],
    trainingTypes: ["Strength Training", "HIIT", "Mobility"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    href: "/plans/fb-fit-round-4",
  },
  {
    id: 13500,
    title: "FB30 â€” 30 Day Team Program",
    shortName: "FB30",
    subtitle: "A Mix of Strength, Cardio, and Mobility â€” 30-Minute Workouts",
    weeks: 4,
    minutesAvg: 30,
    difficulty: 3,
    price: "From $19.99",
    isFree: false,
    isChallenge: false,
    equipment: ["No Equipment", "Dumbbells"],
    trainingTypes: ["Strength Training", "Cardiovascular", "Mobility"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
    href: "/plans/fb30-30-day-team-program",
  },
  {
    id: 12800,
    title: "Beginner Bootcamp 2.0",
    shortName: "Beginner Bootcamp 2.0",
    subtitle: "Build a Base of Fitness from Scratch â€” 4 Weeks",
    weeks: 4,
    minutesAvg: 28,
    difficulty: 2,
    price: "Free",
    isFree: true,
    isChallenge: false,
    equipment: ["No Equipment"],
    trainingTypes: ["Strength Training", "Low Impact", "Cardiovascular"],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800",
    href: "/plans/beginner-bootcamp-2",
  },
  {
    id: 11200,
    title: "Bored Easily 2.0",
    shortName: "Bored Easily 2.0",
    subtitle: "High Variety Workout Program for Those Who Get Bored",
    weeks: 4,
    minutesAvg: 40,
    difficulty: 3,
    price: "From $9.99",
    isFree: false,
    isChallenge: false,
    equipment: ["Dumbbells", "Mat"],
    trainingTypes: ["Strength Training", "HIIT", "Yoga"],
    image: "https://images.unsplash.com/photo-1522898467493-49726bf28798?auto=format&fit=crop&q=80&w=800",
    href: "/plans/bored-easily-2",
  },
  {
    id: 10500,
    title: "FB Mass â€” Building Lean Muscle Mass",
    shortName: "FB Mass",
    subtitle: "Progressive Overload Strength Program for Muscle Building",
    weeks: 8,
    minutesAvg: 55,
    difficulty: 5,
    price: "From $19.99",
    isFree: false,
    isChallenge: false,
    equipment: ["Dumbbells"],
    trainingTypes: ["Strength Training"],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
    href: "/plans/fb-mass-building-lean-muscle",
  },
];

export const difficultyLabel: Record<number, string> = {
  1: "Beginner",
  2: "Beginner+",
  3: "Intermediate",
  4: "Intermediate+",
  5: "Advanced",
};

export const difficultyColor: Record<number, string> = {
  1: "#7bc67e",
  2: "#a8c97a",
  3: "#f4c842",
  4: "#f4984e",
  5: "#e85d5d",
};
