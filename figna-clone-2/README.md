# Jadoo — Travel Booking Landing Page

A beautiful, responsive travel booking landing page built with **Expo + React Native Web + TypeScript**.
The same codebase runs in-browser **and** on iOS/Android.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run (web)

```bash
npx expo start --web
```

Open **http://localhost:8081** in your browser.

### Run (mobile)

```bash
# iOS (macOS only)
npx expo start --ios

# Android
npx expo start --android
```

---

## 🌐 Build for Web

```bash
npx expo export --platform web
```

Output will be in the `dist/` directory — ready to deploy to any static host (Vercel, Netlify, etc.).

---

## 🏗️ Project Structure

```
├── app/
│   ├── _layout.tsx       # Root layout (fonts, SafeAreaProvider)
│   └── index.tsx         # Main landing page
├── components/
│   ├── Navbar.tsx        # Sticky nav + mobile drawer
│   ├── Hero.tsx          # Hero section + search widget
│   ├── Services.tsx      # 4-card services grid
│   ├── Destinations.tsx  # Top destinations + heart toggle
│   ├── BookingSteps.tsx  # 3-step booking + floating cards
│   ├── Testimonials.tsx  # Carousel with arrow/dot controls
│   ├── Partners.tsx      # Partner logos strip
│   ├── Newsletter.tsx    # Email subscribe with validation
│   └── Footer.tsx        # Footer with app store links
├── constants/
│   ├── theme.ts          # Design tokens (colors, spacing, fonts…)
│   └── data.ts           # All page content as typed arrays
├── hooks/
│   └── useBreakpoint.ts  # Responsive breakpoint hook
└── assets/               # Icons, fonts, images
```

---

## 🎨 Design System

All tokens live in `constants/theme.ts` — no hardcoded values in components.

| Token | Value |
|---|---|
| Navy | `#14183E` |
| Coral | `#DF6951` |
| Yellow | `#F1A501` |
| Cream | `#FFF1DA` |
| Lavender | `#DFD7F9` |

Fonts: **Volkhov** (headings) + **Poppins** (body/UI) via `@expo-google-fonts`.

---

## ✨ Features

- ✅ Pixel-faithful Figma recreation
- ✅ Responsive: mobile / tablet / desktop via `useBreakpoint`
- ✅ Sticky navbar with mobile hamburger drawer
- ✅ Animated hero with floating paper-plane SVGs
- ✅ Travel search widget (destination, dates, travelers)
- ✅ Trust stats strip
- ✅ Service cards with highlighted card
- ✅ Destination cards with heart/save toggle
- ✅ Booking steps with floating trip UI cards + progress bar
- ✅ Working testimonials carousel (dots + arrows)
- ✅ Partner logos row (grayscale)
- ✅ Newsletter with email validation + success message
- ✅ Footer with App Store / Google Play badges + social icons
- ✅ Smooth scroll-to-section on nav links
- ✅ Hover & press state animations throughout
- ✅ Lazy-loaded images via expo-image
