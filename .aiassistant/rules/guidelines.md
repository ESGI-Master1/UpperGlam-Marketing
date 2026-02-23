---
apply: always
---

# 🔒 Upper Glam -- Strict Development Guidelines (IA Ultra Cadrée)

## ⚠️ PROJECT CONTEXT

Upper Glam is a **marketing website only**.

Technology stack: - React - Vite - TypeScript (strict mode) -
TailwindCSS - React Router

This project is: - NOT the mobile app - NOT connected to backend logic -
NOT handling business logic - NOT using state management libraries

Primary goals: - Premium visual identity - Conversion-oriented - Fast
performance - Clean and maintainable architecture - SEO optimized -
Mobile-first

---

# 🏗 ARCHITECTURE RULES

## Folder Structure (Mandatory)

src/ app/ pages/ components/ layout/ sections/ content/ hooks/ utils/
types/ assets/ styles/

❌ No alternative folder structure allowed. ❌ No mixing UI and content
logic.

---

# 📦 DEPENDENCY RULES

Allowed: - react - react-router-dom - tailwindcss

Forbidden: - Redux - Zustand - MobX - MUI - Chakra - Styled-components -
Framer Motion - Any animation library - Any UI framework

---

# 🎨 DESIGN SYSTEM RULES

## Color Palette (Do Not Modify)

- Background: #0B0B0C
- Surface: #111114
- Primary Text: #F5F5F5
- Secondary Text: #B9B9B9
- Accent Champagne: #D6B36A
- Accent Hover: #E2C27D

❌ No additional colors allowed.

## Typography

- Titles: Playfair Display
- Body: Inter

Must be imported via Google Fonts.

---

# 📐 UI STRUCTURE RULES

Every page must follow:

`<Layout>`{=html} `<Hero />`{=html}

```{=html}
<Section />
```

```{=html}
<Section />
```

`<CTA />`{=html} `</Layout>`{=html}

Rules: - Only one H1 per page - Proper semantic tags - Container max
width: 1120px - Mobile-first responsive design

---

# 🧩 COMPONENT RULES

Mandatory reusable components: - Button - Card - Container - Section -
Accordion - Input - Navbar - Footer

Rules: - Max 250 lines per component - Single Responsibility Principle -
No inline styles - Tailwind only - No duplicated code

---

# 📄 ROUTING RULES

Required routes:

/ /how-it-works /client /pro /about /faq /contact /legal /privacy /cgu

---

# 📚 CONTENT RULES

All text must be stored inside:

src/content/

Example files: - copy.ts - faq.ts - services.ts

❌ No hardcoded text in components.

---

# ⚡ PERFORMANCE RULES

- Use lazy loading for images
- Use loading="lazy"
- Avoid heavy animations
- Avoid large bundles
- Lighthouse target:
  - Performance \> 85
  - SEO \> 90

---

# 🔐 SECURITY RULES

- No API keys
- No .env committed
- No backend calls
- Validate contact form inputs

---

# 🧠 IA CODING RULES

When generating code:

- Use strict TypeScript
- No 'any' types
- No unnecessary dependencies
- No business logic
- Modular components only
- Placeholders required for images/videos:

\[PLACEHOLDER_LOGO_SVG\] \[PLACEHOLDER_HERO_VIDEO_MP4\]
\[PLACEHOLDER_MOCKUP_APP\]

---

# 🚫 ABSOLUTE PROHIBITIONS

❌ No backend integration ❌ No global state management ❌ No CSS
outside Tailwind ❌ No inline styling ❌ No random design decisions ❌
No additional libraries

---

# 🎯 FINAL OBJECTIVE

The website must be:

- Elegant
- Minimalist
- Premium
- Fast
- Conversion-focused
- Easy to maintain
