export type NavColumn = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type FeatureCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
};

export type ProgramCard = {
  topLabel?: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  originalPrice?: string;
  salePrice?: string;
  isFree?: boolean;
  href: string;
  image: string;
  /** 1–5 difficulty scale */
  difficulty?: number;
  category?: string;
};

// ... skipped down to highlightedPrograms ...
export const highlightedPrograms: ProgramCard[] = [
  {
    topLabel: "Join a Free Challenge",
    title: "Fitness Blender's Free 2 Week Challenge",
    subtitle: "Strength Training, Cardio, and Mobility Workouts for a Strong Body and Mind",
    duration: "31 Min/Day • 2 Weeks",
    price: "Available with a Free Membership",
    isFree: true,
    href: "/plans/fitness-blenders-free-2-week-challenge",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800",
    category: "Challenge",
  },
  {
    topLabel: "Start With The Basics",
    title: "5 Day Challenge Trainer Series: Essentials with Erica",
    subtitle: "Beginner-Friendly Total Body Strength Training with Cardio",
    duration: "35 Min/Day • 1 Week",
    price: "Available with FB Plus as low as:",
    salePrice: "$5.99",
    href: "/plans/5-day-challenge-trainer-series-essentials-with-erica",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    category: "Challenge",
  },
  {
    topLabel: "Get Stronger",
    title: "5 Day Challenge Trainer Series: Level Up with Tasha",
    subtitle: "Time Under Tension Strength with Cardio for Muscle Growth",
    duration: "42 Min/Day • 1 Week",
    price: "Available with FB Plus as low as:",
    salePrice: "$5.99",
    href: "/plans/5-day-challenge-trainer-series-level-up-with-tasha",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800",
    category: "Challenge",
  },
  {
    topLabel: "Commit to 4 Weeks",
    title: "FB Fit Round 4: Strength, HIIT Cardio, & Mobility",
    subtitle: "Intense, Lengthy Workouts: Our Most Challenging Program Yet?",
    duration: "48 Min/Day • 4 Weeks",
    price: "Available with FB Plus as low as:",
    originalPrice: "$17.99",
    salePrice: "$14.39",
    href: "/plans/fb-fit-round-4",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    category: "Program",
  },
];

export const topBanner = {
  label: "Week 3 is here!",
  cta: "Jump in anytime - add the program to your calendar and start moving today!",
  href: "/plans/fb30",
};

export const menuColumns: NavColumn[] = [
  {
    title: "Membership",
    links: [{ label: "Membership", href: "/membership" }],
  },
  {
    title: "Workouts",
    links: [
      { label: "Workout Videos", href: "/videos" },
      { label: "Custom Workouts", href: "/page/custom-workouts" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Workout Programs", href: "/plans" },
      { label: "Meal Plans", href: "/meal-plans" },
      { label: "Pilot Programs", href: "/pilot-programs" },
      { label: "Routines", href: "/page/routines" },
    ],
  },
  {
    title: "Healthy Living",
    links: [
      { label: "Healthy Living", href: "/healthy-living" },
      { label: "Articles", href: "/articles" },
      { label: "Healthy Recipes", href: "/healthy-living/healthy-recipes" },
      { label: "Wellness Videos", href: "/wellness-videos" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community", href: "/community" },
      { label: "Blog", href: "/blog" },
      { label: "Referral Program", href: "/referrals-rewards" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About", href: "/page/about-fitness-blender" },
      { label: "Careers", href: "/careers" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Our Team", href: "/team-members" },
    ],
  },
  {
    title: "Store",
    links: [{ label: "Store", href: "/store" }],
  },
];

export const homepageFeatures: FeatureCard[] = [
  {
    title: "Trainer Series",
    description: "Exercise with your favorite trainer in our new Trainer Series programs.",
    cta: "View Series",
    href: "/plans",
    image: "/images/trainer-series.svg",
  },
  {
    title: "Earn a Free Plus Membership",
    description: "Share your referral code and every sign up earns rewards toward membership.",
    cta: "Learn About Rewards",
    href: "/referrals-rewards",
    image: "/images/rewards.svg",
  },
  {
    title: "Small Footprint, Big Gains",
    description: "Equipment picks for every space and every training level.",
    cta: "Shop Equipment",
    href: "/store",
    image: "/images/equipment.svg",
  },
  {
    title: "Specialty Content",
    description: "Pilot programs tailored to smaller audiences, conditions, or life events.",
    cta: "Browse Pilot Programs",
    href: "/pilot-programs",
    image: "/images/pilot-programs.svg",
  },
  {
    title: "Workout Videos",
    description: "Train with certified personal trainers whether you are at home or on the road.",
    cta: "Find a Workout",
    href: "/videos",
    image: "/images/workout-videos.svg",
  },
  {
    title: "Supportive Community",
    description: "Stay motivated and engaged with a supportive community of members.",
    cta: "Visit Community",
    href: "/community",
    image: "/images/community.svg",
  },
];



export const footerColumns: NavColumn[] = [
  {
    title: "Workouts",
    links: [
      { label: "Workouts", href: "/videos/browse" },
      { label: "Workout Videos", href: "/videos" },
      { label: "Custom Workouts", href: "/page/custom-workouts" },
      { label: "Programs", href: "/programs-challenges" },
      { label: "Workout Programs", href: "/plans" },
      { label: "Meal Plans", href: "/meal-plans" },
    ],
  },
  {
    title: "Healthy Living",
    links: [
      { label: "Healthy Living", href: "/healthy-living" },
      { label: "Fitness", href: "/articles?category=fitness" },
      { label: "Health", href: "/articles?category=health" },
      { label: "Nutrition", href: "/articles?category=nutrition" },
      { label: "Healthy Recipes", href: "/healthy-living/healthy-recipes" },
      { label: "Experts", href: "/articles?category=experts" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About", href: "/page/about-fitness-blender" },
      { label: "Careers", href: "/careers" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Our Team", href: "/team-members" },
      { label: "B2B Options", href: "/page/fb-plus-group" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "FB Plus", href: "/fb-plus" },
      { label: "Community", href: "/community" },
      { label: "Referral Program", href: "/referrals-rewards" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/page/contact-us" },
      { label: "FAQ", href: "/page/faq" },
      { label: "Store", href: "/store" },
    ],
  },
];
