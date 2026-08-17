export type FilmTile = {
  id: string;
  title: string;
  subtitle: string;
  category: 'water' | 'noir' | 'psychological' | 'giallo' | 'sci-fi' | 'reflection';
  imageUrl: string;
  width: number;
  height: number;
  featured?: boolean;
};

export const filmTiles: FilmTile[] = [
  {
    id: 'tile-1',
    title: 'Reflections on the Water',
    subtitle: 'High contrast ripples & dark horizon',
    category: 'water',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80',
    width: 175,
    height: 235,
    featured: true,
  },
  {
    id: 'tile-2',
    title: 'Night Texture',
    subtitle: 'Tokyo alleyways & neon luminescence',
    category: 'noir',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    width: 160,
    height: 105,
  },
  {
    id: 'tile-3',
    title: 'Ripples & Silhouettes',
    subtitle: 'Emerald water light refraction',
    category: 'reflection',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=650&q=80',
    width: 255,
    height: 145,
  },
  {
    id: 'tile-4',
    title: 'Pink Cut',
    subtitle: 'Cinematic warm gradient texture',
    category: 'giallo',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    width: 120,
    height: 75,
  },
  {
    id: 'tile-5',
    title: 'Glass Memory',
    subtitle: 'Submerged reflections & inverted swimmers',
    category: 'psychological',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    width: 225,
    height: 255,
  },
  {
    id: 'tile-6',
    title: 'Soft Magenta Wave',
    subtitle: 'Pastel shoreline evening glow',
    category: 'water',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    width: 245,
    height: 135,
  },
  {
    id: 'tile-7',
    title: 'Topographic Refraction',
    subtitle: 'Aerial coastline mirrored waters',
    category: 'sci-fi',
    imageUrl: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
    width: 195,
    height: 115,
  },
  {
    id: 'tile-8',
    title: 'Glow Mirage',
    subtitle: 'Warm sunset specular highlights',
    category: 'reflection',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80',
    width: 110,
    height: 75,
  },
];
