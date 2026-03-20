# Motion Spec — plat-form (plat-form.framer.ai)

## Design Tokens

### Colors
```css
--color-bg: #080808;
--color-surface: #111111;
--color-surface-2: #1a1a1a;
--color-border: rgba(255,255,255,0.07);
--color-text: #ffffff;
--color-text-muted: #666666;
--color-text-dim: #333333;
--color-accent: #ff4400;
--color-accent-hover: #ff5500;
--color-accent-soft: rgba(255,68,0,0.12);
```

### Typography
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--text-xs: 0.6875rem;    /* 11px */
--text-sm: 0.8125rem;    /* 13px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.375rem;     /* 22px */
--text-2xl: 2rem;        /* 32px */
--text-3xl: 3rem;        /* 48px */
--text-4xl: 4.5rem;      /* 72px */
--text-5xl: 7rem;        /* 112px — hero heading */
--fw-regular: 400;
--fw-medium: 500;
--fw-semibold: 600;
--fw-bold: 700;
```

### Animation Defaults
```css
--dur-fast: 160ms;
--dur-base: 400ms;
--dur-slow: 650ms;
--dur-xl: 900ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Section Animations

### 001 — Hero (page load)
- **Background**: dark canvas with subtle animated particle/star field — tiny white dots, ~80 particles, random drift at ~0.3px/frame, looping
- **"plat-form" logo**: opacity 0 → 1, 300ms ease-out, delay 0ms
- **Headline** (`— The smarter way to build, run, and scale your business.`):
  - Words "build, run, and scale" are orange (#ff4400), rest is white
  - opacity 0 → 1, translateY 40px → 0, 800ms ease-out, delay 100ms
- **Sub-copy** ("See Platform in action" + body): opacity 0 → 1, translateY 24px → 0, 600ms ease-out, delay 300ms
- **CTA "Book a Demo"** (orange pill button): opacity 0 → 1, scale 0.92 → 1, 500ms ease-spring, delay 450ms
- **Stats row** (97.8% Uptime / +31.2% Performance): opacity 0 → 1, translateY 20px → 0, 500ms ease-out, delay 600ms; numbers count up from 0 over 1200ms after reveal
- **Floating card** (Neural Network / Latest Release, top-right): opacity 0 → 1, translateX 20px → 0, 600ms ease-out, delay 200ms; subtle continuous float: translateY -6px → 6px, 4s ease-in-out loop

### 002 — Our Work / Products
- **Section number "002"** + label: opacity 0 → 1 on scroll, 400ms
- **Heading "products."**: massive text, translateY 60px → 0, opacity 0 → 1, 700ms ease-out on scroll
- **"Our Work" sub-heading**: same, delay 120ms
- **Split product card** (left: 3D product image, right: orange info panel):
  - Left image: scale 0.96 → 1, opacity 0 → 1, 600ms ease-out
  - Right orange panel: translateX 40px → 0, opacity 0 → 1, 600ms ease-out, delay 100ms
  - Dot matrix grid (right panel): dots appear staggered, 20ms each from top-left

### 003–006 — Services Cards (Horizontal Scroll Carousel)
- **Layout**: horizontal strip, 4 cards numbered 01–04
- **Active card**: orange background (#ff4400), scale 1.0, full opacity
- **Inactive cards**: dark bg (#111), scale 0.95, opacity 0.5
- **Transition between cards**: 400ms ease-in-out on all properties (scale, opacity, background)
- **Tab navigation** (bottom): "learning / architecture / protection / growth" — active tab text becomes orange, underline slides
- **Card advance**: auto or on click; active indicator slides left/right
- **Card content** (title + description + image): fade in 300ms when card becomes active

### Platform Process (Step 1–3)
- **Section header**: scroll reveal, translateY 30px → 0, opacity 0 → 1
- **Step indicator dots**: 3 dots top-right, active dot = orange filled, inactive = dim outline
- **Arrow buttons** (← →): hover scale 1.0 → 1.08, 200ms ease-spring; click triggers step transition
- **Step transition**: outgoing content translateX 0 → -60px + opacity 0, 300ms ease-in; incoming translateX 60px → 0 + opacity 0 → 1, 350ms ease-out
- **3D illustration** (left side): cross-fade between steps, 400ms
- **"Book a Demo" button**: appears on step 3 with opacity 0 → 1, translateY 16px → 0, 400ms

### Smart Analytics Dashboard
- **Scroll reveal**: entire section fades in, opacity 0 → 1, 600ms ease-out
- **Donut charts**: stroke-dashoffset animates from 0 to final value over 1200ms ease-out after entering view
- **Percentage numbers** (66%, 25%, 9%, 86/100): count up from 0, 1000ms, with easing
- **Bar chart**: bars grow from height 0 → final height, staggered 60ms each, 600ms ease-out
- **Line chart**: SVG path draws in (stroke-dashoffset), 1400ms ease-out
- **Grid cards**: each card fades + slides up, stagger 80ms

### 005 — Pricing
- **Section number + heading**: scroll reveal standard
- **Pricing cards**: 3 columns, fade in staggered 100ms each
- **Monthly/Yearly toggle**: orange dot slides left/right in pill, 250ms ease-spring
- **Price change**: on toggle, old price opacity 0 + translateY -10px (200ms), new price opacity 1 + translateY 0 from 10px (200ms), delay 100ms
- **"Select Plan" button**: hover — background brightens, scale 1.0 → 1.02, 180ms

### FAQ Accordion
- **Questions list**: scroll reveal, staggered 60ms per item
- **Expand**: height 0 → scrollHeight, 320ms ease-out; opacity 0 → 1, 200ms delay 60ms
- **Collapse**: height → 0, 280ms ease-in
- **Icon**: "—" rotates 0 → 45deg (becomes ×) on open, 200ms ease-spring; orange color
- **Side image** (right): parallax scroll effect, moves at 0.6x scroll speed
- **Single-open mode**: collapsing previous before opening next

### 008 — Testimonials
- **Section number + "What Our Clients Say"**: scroll reveal, translateY 50px → 0, 700ms
- **Sub-text**: staggered after heading, delay 150ms

### Blog / Article Cards
- **Cards**: 2-column grid, scroll reveal staggered 100ms
- **Hover**: card translateY -4px, shadow deepens, 200ms ease-out
- **Arrow button** (orange →): hover scale 1.0 → 1.12, rotate 0 → -45deg, 200ms ease-spring

### Marquee Ticker (orange strip)
- **Background**: solid orange (#ff4400)
- **Content**: "plat-form / Your software business, streamlined for growth." repeated 6×
- **Animation**: translateX 0 → -50% continuously, 18s linear loop, infinite
- **Duplicate content** for seamless loop (two identical spans)
- **Double row**: top row scrolls left, bottom row scrolls right (mirror)

### Footer
- **Large "plat-form" text**: enormous, white/orange gradient text — scroll parallax at 0.5x
- **Footer links**: opacity 0 → 1 staggered 40ms on scroll reveal
- **Social icons**: hover scale 1.0 → 1.15, 150ms ease-spring
- **Newsletter input**: focus — border-color transitions to accent, 200ms

---

## Scroll Reveal System
- **IntersectionObserver** threshold: 0.15
- **rootMargin**: "0px 0px -5% 0px"
- **Default reveal**: translateY 28px → 0, opacity 0 → 1, var(--dur-slow) ease-out
- **Stagger groups**: children get `--delay` CSS var set by JS (index × stagger-ms)
- **Once only**: add `.in-view` class, never remove

## Sticky Header
- On scroll > 60px: header gets `background: rgba(8,8,8,0.85)`, `backdrop-filter: blur(16px)`, border-bottom 1px solid var(--color-border)
- Transition: 300ms ease-out on background, backdrop-filter

## Cursor
- Standard cursor throughout — no custom cursor in this site
