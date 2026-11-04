// All page content — components read from here, never hardcode in JSX

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
  highlighted?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  price: string;
  days: number;
  rating: number;
  reviewCount: string;
  imageUri: string;
  favorited?: boolean;
}

export interface BookingStep {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatarUri: string;
}

export interface Partner {
  id: string;
  name: string;
}

export interface TrustStat {
  value: string;
  label: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Hotels', href: '#services' },
  { label: 'Flights', href: '#flights' },
  { label: 'Bookings', href: '#bookings' },
];

// ─── Trust Stats ──────────────────────────────────────────────────────────────
export const TRUST_STATS: TrustStat[] = [
  { value: '50,000+', label: 'Happy Travelers' },
  { value: '120+', label: 'Global Destinations' },
  { value: '4.9 / 5', label: 'Trustpilot Rating' },
  { value: '24/7', label: 'VIP Concierge Care' },
];

// ─── Services ─────────────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    id: 'weather',
    title: 'Calculated Weather',
    description:
      'Real-time meteorological insights to guarantee sunshine on your planned excursions and beach outings.',
    iconName: 'sunny-outline',
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
  },
  {
    id: 'flights',
    title: 'Best Flights',
    description:
      'Handpicked business and economy routes with zero layover stress, seat upgrades, and price-drop guarantees.',
    iconName: 'send-outline',
    iconColor: '#DF6951',
    iconBg: '#FEE9E5',
    highlighted: true,
  },
  {
    id: 'events',
    title: 'Local Events',
    description:
      'Exclusive backstage passes to regional food walks, live festivals, and authentic hometown celebrations.',
    iconName: 'location-outline',
    iconColor: '#F43F5E',
    iconBg: '#FFE4E6',
  },
  {
    id: 'custom',
    title: 'Customization',
    description:
      'Tailor-made itineraries built with bespoke stays and private local guides at your unique pace.',
    iconName: 'settings-outline',
    iconColor: '#6366F1',
    iconBg: '#EEF2FF',
  },
];

// ─── Destinations ─────────────────────────────────────────────────────────────
export const DESTINATIONS: Destination[] = [
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    price: '$5.42k',
    days: 10,
    rating: 4.9,
    reviewCount: '1.2k',
    imageUri:
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
    favorited: true,
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    price: '$4.2k',
    days: 12,
    rating: 4.8,
    reviewCount: '980',
    imageUri:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  },
  {
    id: 'europe',
    name: 'Full Europe',
    country: '',
    price: '$15.0k',
    days: 28,
    rating: 5.0,
    reviewCount: '2.4k',
    imageUri:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
  },
];

// ─── Booking Steps ────────────────────────────────────────────────────────────
export const BOOKING_STEPS: BookingStep[] = [
  {
    id: 'destination',
    title: 'Choose Destination',
    description:
      'Pick from over 120+ hand-curated cities, coastal gems, and mountain escapes across the globe.',
    iconName: 'location',
    color: '#F1A501',
  },
  {
    id: 'payment',
    title: 'Make Payment',
    description:
      'Instant secure checkout with encrypted zero-fee payment methods and flexible split-deposit options.',
    iconName: 'card',
    color: '#DF6951',
  },
  {
    id: 'airport',
    title: 'Reach Airport on Selected Date',
    description:
      'Receive live boarding gates, electronic boarding passes, and lounge access directly in your pocket.',
    iconName: 'send',
    color: '#006380',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'mike',
    quote:
      '"Jadoo found us an unforgettable Amalfi coast cliffside villa within minutes. The whole booking experience was pure bliss — truly world-class!"',
    name: 'Mike Taylor',
    location: 'Lahore, Pakistan',
    avatarUri:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: 'chris',
    quote:
      '"Jadoo made planning our family trip completely effortless. Great rates and exceptional local guidance all in one place!"',
    name: 'Chris Thomas',
    location: 'CEO of Redux',
    avatarUri:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    id: 'sara',
    quote:
      '"From booking to boarding, every step was seamless. I discovered hidden gems I would never have found on my own. 10/10 recommend!"',
    name: 'Sara Johnson',
    location: 'New York, USA',
    avatarUri:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
  },
];

// ─── Partners ─────────────────────────────────────────────────────────────────
export const PARTNERS: Partner[] = [
  { id: 'axon', name: 'AXON' },
  { id: 'jetstar', name: 'Jetstar★' },
  { id: 'expedia', name: 'Expedia' },
  { id: 'qantas', name: 'QANTAS' },
  { id: 'alitalia', name: 'Alitalia' },
];

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_LINKS = {
  Company: ['About', 'Careers', 'Mobile App', 'How it Works'],
  Contact: ['Help / FAQ', 'Press Room', 'Affiliates', 'Hotel Partners'],
  More: ['Airline Fees', 'Airlines', 'Low Fare Tips', 'Privacy Policy'],
};
