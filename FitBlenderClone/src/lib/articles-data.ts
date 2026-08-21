export type Article = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  image: string;
  href: string;
};

const CDN = "https://cloudfront.fitnessblender.com/assets/img/article";

export const articles: Article[] = [
  {
    id: 1,
    title: "Why Strength Training is Essential for Everyone, Not Just Bodybuilders",
    excerpt: "Strength training provides a host of benefits beyond building muscle â€” from boosting metabolism and improving bone density to reducing anxiety and extending your healthspan.",
    category: "Fitness",
    author: "Kelli Segars",
    date: "August 12, 2026",
    readMinutes: 6,
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    href: "/articles/why-strength-training-is-essential",
  },
  {
    id: 2,
    title: "How to Eat Enough Protein Without Going Overboard",
    excerpt: "Protein is crucial for muscle repair and satiety, but more is not always better. Here's a practical guide to hitting your daily targets with whole foods.",
    category: "Nutrition",
    author: "Daniel Segars",
    date: "August 8, 2026",
    readMinutes: 5,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
    href: "/articles/how-to-eat-enough-protein",
  },
  {
    id: 3,
    title: "10 Signs You're Overtraining (and What to Do About It)",
    excerpt: "Pushing hard is good, but there's a line between productive training and overdoing it. Learn the key warning signs and how to recover properly.",
    category: "Health",
    author: "Kelli Segars",
    date: "August 3, 2026",
    readMinutes: 7,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
    href: "/articles/signs-of-overtraining",
  },
  {
    id: 4,
    title: "5 Anti-Inflammatory Recipes That Actually Taste Good",
    excerpt: "Chronic inflammation can hamper recovery and overall health. These five easy recipes use whole ingredients with proven anti-inflammatory properties.",
    category: "Recipes",
    author: "FB Nutrition Team",
    date: "July 28, 2026",
    readMinutes: 4,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    href: "/articles/anti-inflammatory-recipes",
  },
  {
    id: 5,
    title: "The Science Behind Rest Days: Why Recovery is Part of the Program",
    excerpt: "Rest days aren't laziness â€” they're when the real gains happen. Here's what research says about the physiology of recovery and how to do it right.",
    category: "Fitness",
    author: "Daniel Segars",
    date: "July 22, 2026",
    readMinutes: 6,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    href: "/articles/science-of-rest-days",
  },
  {
    id: 6,
    title: "Building a Morning Routine That Actually Sticks",
    excerpt: "Small, sustainable habits compound over time. We share what the research says about effective morning routines and how to build one around your lifestyle.",
    category: "Wellness",
    author: "Kelli Segars",
    date: "July 15, 2026",
    readMinutes: 5,
    image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&q=80&w=800",
    href: "/articles/building-morning-routine",
  },
];

export const articleCategories = ["All", "Fitness", "Nutrition", "Health", "Recipes", "Wellness"];

