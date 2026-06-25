---
name: ServiceConnect Modern Pro
colors:
  surface: '#0d131f'
  surface-dim: '#0d131f'
  surface-bright: '#333946'
  surface-container-lowest: '#080e1a'
  surface-container-low: '#161c28'
  surface-container: '#1a202c'
  surface-container-high: '#242a37'
  surface-container-highest: '#2f3542'
  on-surface: '#dde2f4'
  on-surface-variant: '#c3c5d8'
  inverse-surface: '#dde2f4'
  inverse-on-surface: '#2a303d'
  outline: '#8d90a1'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#00297a'
  primary-container: '#135bec'
  on-primary-container: '#e2e6ff'
  inverse-primary: '#0052de'
  secondary: '#c5c5d2'
  on-secondary: '#2e303a'
  secondary-container: '#444651'
  on-secondary-container: '#b3b4c1'
  tertiary: '#ffb59b'
  on-tertiary: '#5c1a00'
  tertiary-container: '#b93d00'
  on-tertiary-container: '#ffe1d7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#003daa'
  secondary-fixed: '#e1e1ef'
  secondary-fixed-dim: '#c5c5d2'
  on-secondary-fixed: '#191b24'
  on-secondary-fixed-variant: '#444651'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#0d131f'
  on-background: '#dde2f4'
  surface-variant: '#2f3542'
  surface-light: '#f6f6f8'
  background-dark: '#101622'
  card-bg: '#1d1f28'
  border-subtle: '#434655'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 60px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  title-lg:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  section-gap-lg: 6rem
  section-gap-md: 4rem
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style

ServiceConnect embodies a **Corporate / Modern** aesthetic that prioritizes professional reliability and transactional clarity. The brand personality is efficient, trustworthy, and organized, catering to both high-end service providers and discerning clients.

The design style utilizes a refined dark-mode foundation with high-action primary accents. It avoids unnecessary decorative elements, opting instead for a systematic approach where hierarchy is established through clear typographic scaling and purposeful contrast. The interface should feel "utilitarian yet premium," using spacious layouts and subtle depth to guide the user through complex workflows with ease.

## Colors

The palette is anchored by **Vivid Blue (#135bec)**, used exclusively for primary actions and brand identifiers to maintain a high signal-to-noise ratio. 

The dark theme uses a deep navy-black (`#101622`) for the primary background, layered with lighter charcoal and slate grays for containers and surfaces to create structural depth. Functional colors follow standard conventions: Success is implied by the primary blue in this context, while muted grays (`#8d90a1`) handle non-interactive borders and secondary text. The use of high-contrast white text on dark backgrounds ensures AA/AAA accessibility for all critical information.

## Typography

The system utilizes **Manrope** across all roles to achieve a modern, geometric, yet highly legible feel. 

- **Headlines:** Use heavy weights (700-800) with tight letter-spacing for a "display" impact in hero sections.
- **Body Text:** Set at 16px for standard content with a generous 1.5-1.6 line height to prevent fatigue in dense service descriptions.
- **Hierarchy:** High contrast in weight (from ExtraBold to Regular) is the primary tool for distinguishing information types, rather than relying solely on color.
- **Scale:** On mobile, display sizes must aggressively downscale to maintain readability without excessive horizontal scrolling.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy for desktop, centering content within a 1280px container. 

- **Grid:** A 12-column layout is used for complex pages, while feature sections often utilize a 3-column simple grid.
- **Vertical Rhythm:** Sections are separated by large white space blocks (64px to 128px) to allow the eye to rest and clearly delineate different value propositions.
- **Mobile Adaptivity:** For small screens, the layout collapses to a single column with 16px (1rem) side margins. The sticky header remains fixed to provide constant access to navigation and CTA buttons.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Subtle Shadows**:

- **Level 0 (Background):** Base color `#101622`.
- **Level 1 (Cards/Sections):** Slightly lighter `#1d1f28` with a 1px border of `#434655` to define edges in dark mode.
- **Level 2 (Interactive/Floating):** Use `shadow-lg` (soft, diffused black shadow) for elements like search bars and dropdown menus to suggest they sit above the page content.
- **Overlays:** Hero sections use a 70% opacity dark overlay on background images to ensure text legibility while maintaining environmental context.

## Shapes

The design uses a **Rounded** shape language to soften the corporate professional feel. 

- **Primary Containers:** 0.75rem (`rounded-xl`) to 1rem for main cards and hero containers.
- **Buttons & Inputs:** 0.5rem (`rounded-lg`) for a balanced, modern touch.
- **Small Elements:** 0.25rem (`rounded-md`) for internal search buttons or small tags.
- **Icons:** Housed in circular containers (`rounded-full`) when used as decorative accents in feature lists.

## Components

### Buttons
- **Primary:** Background `#135bec`, text white, bold weight. Hover state: 90% opacity or slightly darker blue.
- **Secondary/Ghost:** Background `#32343e` or transparent with border. Used for "Log In" or secondary actions.
- **Large CTA:** Increased padding (12px 24px) for high-conversion areas.

### Input Fields
- **Search Bar:** Large, white background (in light mode) or dark gray (in dark mode). Includes a leading icon and a trailing primary button for a "single-unit" look.
- **Border:** 1px solid, color `#434655`. Focus state: 2px solid `#135bec`.

### Cards
- **Testimonial Cards:** Background `#1d1f28`, 1px border. Includes a 48px avatar, bold name, and muted secondary label (e.g., job title).
- **Feature Cards:** Centered icon in a tinted circle (`primary/10%`), followed by a bold title and 2-3 lines of body text.

### Navigation
- **Top Nav:** Sticky with a backdrop-blur (80% opacity background). Links use `label-md` with primary color transitions on hover.