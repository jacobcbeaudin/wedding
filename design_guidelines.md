# Design Guidelines: Jake & Caroline's Coastal Luxury Wedding Website

## Design Approach
**Reference-Based**: Inspired by upscale coastal resort brands (Amanresorts, Four Seasons coastal properties, luxury Nantucket/Hamptons aesthetics). Prioritizing sophistication, elegance, and refined simplicity with beach-inspired serenity.

**Key Principles**: Generous whitespace, sophisticated restraint, elevated typography, subtle coastal textures, photography-first storytelling.

## Typography

**Primary Font Family**: Cormorant Garamond (serif) - elegant, refined, traditional
- Hero headlines: 48-72px, light weight (300)
- Section headers: 36-48px, regular weight (400)
- Subheadings: 24-32px, medium weight (500)

**Secondary Font Family**: Montserrat (sans-serif) - clean, modern contrast
- Body text: 16-18px, regular (400)
- Navigation: 14px, medium (500), slight letter-spacing (0.05em)
- Buttons/CTAs: 14-16px, semibold (600), uppercase, letter-spacing (0.1em)

**Special Treatment**: Couple names in elegant script for key moments (Great Vibes or similar)

## Layout System

**Spacing Primitives**: Tailwind units of 4, 8, 12, 16, 20, 24, 32
- Section padding: py-20 to py-32 (desktop), py-12 to py-16 (mobile)
- Component gaps: gap-8 to gap-12
- Container max-width: max-w-6xl with px-8 gutters

**Grid Strategy**:
- Two-column splits for content-heavy sections (story, travel)
- Three-column for event timeline cards
- Single column for narrative sections with max-w-3xl

## Color Palette & Visual Treatment

**Primary Colors**:
- Dusty Blue: #A8BCC9 (accents, borders, subtle backgrounds)
- Beige/Cream: #F5F1EA (primary backgrounds, alternating sections)
- Warm White: #FDFBF7 (default background)

**Supporting Tones**:
- Deep Navy: #2C3E50 (primary text, dark accents)
- Soft Sand: #E8DFD0 (secondary backgrounds, dividers)
- Muted Gold: #C9B896 (subtle highlights, decorative elements)

**Visual Textures**: Subtle linen/canvas textures on backgrounds (5-10% opacity), watercolor wash effects for section dividers, soft gradients for overlays (never harsh).

## Component Library

### Navigation
- Transparent fixed header with backdrop blur on scroll
- Clean horizontal navigation with generous letter-spacing
- Couple initials monogram logo (left) with nav items (right)
- Mobile: refined hamburger menu expanding to full-screen overlay

### Hero Section
- Full-viewport height (90vh) with stunning coastal couple portrait
- Couple names in large elegant serif, centered with refined script treatment
- Wedding date and location in smaller sans-serif below
- Subtle scroll indicator (chevron or text)
- Image: Soft gradient overlay (20-30% opacity) for text legibility

### Section Headers
- Centered, generous top padding
- Elegant serif headline
- Optional decorative divider (subtle line with small ornamental element)
- Brief subtitle in sans-serif when needed

### Event Cards
- Three-column grid (desktop), stacked (mobile)
- Soft shadows (subtle depth, not heavy)
- Rounded corners (subtle, 8-12px)
- Icon or small illustration at top
- Event title, time, location hierarchy
- Cream/beige background with dusty blue accents

### RSVP Form
- Two-column layout (form left, message/details right)
- Refined input styling: subtle borders, focus state with dusty blue
- Generous field spacing, clear labels
- Primary button with beige background, navy text, sophisticated hover
- Success confirmation in elegant modal

### Photo Gallery
- Masonry/Pinterest-style grid layout
- Varied image sizes for visual interest
- Hover: subtle scale and shadow effect
- Lightbox with minimal chrome, elegant transitions
- Navigation arrows in muted gold

### Footer
- Three-column layout: Quick links, Contact info, Special message
- Thin divider lines in dusty blue
- Social icons in refined circular outlines
- Copyright in small, muted text

## Page Structure

**Home Page** (7 sections):
1. Hero with couple portrait
2. Welcome message (centered, max-w-3xl, personal note from couple)
3. Countdown timer (elegant digital display with labels)
4. Event highlights (3-column cards: Ceremony, Reception, Brunch)
5. Quick RSVP prompt (centered CTA to full RSVP page)
6. Instagram hashtag showcase (grid of 6-8 images)
7. Footer

**Our Story Page**:
- Timeline layout with alternating left/right content blocks
- Couple photos integrated with text
- Romantic narrative, generous whitespace

**Events & Schedule**:
- Detailed timeline with elegant cards
- Dress code information in styled callout boxes
- Map integration with custom coastal styling

**Travel & Accommodations**:
- Hero image of venue/location
- Hotel blocks in refined cards (2-column)
- Transportation details, area highlights
- Embedded Google Maps with custom beige/blue theming

**Gallery**:
- Full masonry photo gallery
- Category filters (Engagement, Rehearsal, Travel)
- Load more button vs infinite scroll

**RSVP**:
- Prominent form with elegant fields
- Guest count selector, meal preferences
- Song requests text area
- Dietary restrictions checkbox section

## Images

**Required Photography**:
1. **Hero Image**: Romantic couple portrait at coastal location (beach, cliffs, dunes) during golden hour - soft, airy, elegant composition
2. **Our Story**: 4-6 candid couple photos throughout relationship timeline
3. **Venue**: Exterior and interior shots of ceremony/reception locations
4. **Gallery**: 20-30 engagement and pre-wedding photos
5. **Travel Page Hero**: Destination landscape (ocean view, venue exterior)

**Decorative Elements**:
- Subtle watercolor coastal illustrations (shells, waves, palm fronds) as section dividers
- Monogram/logo design incorporating couple initials
- Minimal line art florals for accent moments

**Treatment**: All images with soft, consistent color grading - bright, airy, slightly desaturated for cohesive luxury aesthetic

## Interactions & Animations

**Minimal, Sophisticated Motion**:
- Gentle fade-in on scroll for section reveals
- Smooth scroll behavior for navigation
- Hover state transitions: 200-300ms ease
- Form field focus: subtle border glow in dusty blue
- Gallery lightbox: elegant fade and scale
- NO excessive animations, parallax, or distracting effects

**Blurred Button Backgrounds**: All buttons over images use backdrop-filter blur for refined glassmorphism effect

## Responsive Behavior

- Desktop (lg): Full multi-column layouts, generous spacing
- Tablet (md): Reduce to 2-column max, adjust spacing to py-16
- Mobile: Single column stacking, py-12 spacing, 80vh hero minimum
- Navigation: Transform to elegant mobile menu
- Typography: Scale down 20-30% on mobile while maintaining hierarchy