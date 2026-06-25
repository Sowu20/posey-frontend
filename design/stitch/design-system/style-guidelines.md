## Brand & Style

ServiceConnect embodies a **Corporate / Modern** aesthetic that prioritizes professional reliability and transactional clarity. The brand personality is efficient, trustworthy, and organized, catering to both high-end service providers and discerning clients.

The design style utilizes a refined dark-mode foundation with high-action primary accents. It avoids unnecessary decorative elements, opting instead for a systematic approach where hierarchy is established through clear typographic scaling and purposeful contrast. The interface should feel "utilitarian yet premium," using spacious layouts and subtle depth to guide the user through complex workflows with ease.

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