---
name: Kinetic Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d1c2f'
  on-tertiary-container: '#76859b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '600'
    lineHeight: 76px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  spec-numeral:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  spec-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  telemetry-unit:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1.25rem
  margin-desktop: 4rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-performance industrial engineering, architectural clarity, and hyper-premium hardware craftsmanship. Built for an elite FPV racing quadcopter showcase, it fuses the obsessive material purity of Apple hardware presentations with the ruthless precision of Formula 1 telemetry systems.

The emotional baseline is calculated authority, quiet confidence, and tactile mechanical luxury. The interface operates as an immaculate aerospace cleanroom: neutral, mathematically spaced surfaces host razor-sharp carbon-fiber componentry, highlighted only by structural lines and luminous emerald indicator states.

The visual direction marries **High-Precision Industrial Minimalism** with **Aero-Spec Glassmorphism**. UI elements mimic precision-milled physical artifacts through hairline borders, controlled backdrop diffusion, optical corner smoothing, and strictly governed mechanical micro-interactions.

## Colors

The palette is engineered around high luminance contrast and surgical accent usage. The visual field stays predominantly pristine, allowing carbon-weave geometries and aerospace components to anchor the eye.

- **Surface Neutral (`#F8FAFC`, `#FFFFFF`):** The gallery foundation. Simulates a daylight industrial design studio. Secondary surface fills (`#F1F5F9`) define technical wells and inset panels.
- **Stealth Slate / Carbon Primary (`#0F172A`, `#1E293B`):** Pure structural definition. Used for high-impact typography, carbon-fiber callout backplates, and authoritative hardware summaries.
- **Engineering Border Neutral (`#E2E8F0`, `#CBD5E1`):** Precision 1px grid networks and mechanical bounding boxes. Maintains structural segmentation without visual mass.
- **Anodized Emerald Accent (`#10B981`):** Represents high-voltage readiness, signal lock, carbon weave seams, and telemetry live values. Paired with an emerald ambient glow (`rgba(16, 185, 129, 0.25)`) reserved strictly for active states, ESC arming signals, and real-time flight mode changes.

## Typography

Typography establishes an absolute separation between editorial product storytelling and rigorous engineering data.

- **Primary Matrix (Inter):** Headlines and contextual narratives utilize tight tracking, medium-to-semibold weights, and optical metrics. Text blocks mimic luxury product briefs—compact, balanced, and confident.
- **Telemetry & Specification Layer (JetBrains Mono):** Hardware metrics, power draws, carbon grade indicators, motor kV ratings, and scrubber indices are strictly typeset in uppercase monospaced characters. Numerical data aligns tabbed digits to eliminate layout jitter during live state scrubs.

## Layout & Spacing

The layout is built on a 12-column dynamic fluid grid governed by strict 8pt rhythm units. It mimics mechanical engineering schematics where every component aligns to laser-scribed guidelines.

- **Desktop (>= 1280px):** 12 columns, 32px gutters, and dynamic horizontal edge offsets clamped to a maximum canvas width of 1440px. Interactive scrubbers, frame exploded-views, and technical spec matrices lock into strict 4-column and 8-column splits.
- **Tablet (768px - 1279px):** 8 columns, 24px gutters, 32px margins. Exploded component models step down to 5-column stages with 3-column telemetry readouts.
- **Mobile (< 768px):** 4 columns, 16px gutters, 20px outer margin. Layout stacks vertically; telemetry overlays snap into horizontal floating drawers docked to the screen baseline.

## Elevation & Depth

Depth is treated as physical layers of aerospace materials—clear sapphire lenses, CNC milled chassis plates, and optical coatings. Traditional fuzzy drop shadows are rejected in favor of razor-thin multi-stop hairline strokes and frosted liquid glass.

- **Hairline Micro-Borders:** The primary delineator. Surfaces stack using 1px interior borders (`rgba(226, 232, 240, 0.8)` on light surfaces; `rgba(255, 255, 255, 0.12)` on carbon surfaces).
- **Aero Glass (Backdrop Diffusion):** Overlays, telemetry floating bars, and stage pickers use `backdrop-filter: blur(20px) saturate(180%)` paired with an ultra-sheer fill (`rgba(255, 255, 255, 0.72)` or dark-tier `rgba(15, 23, 42, 0.85)`).
- **Luminous Anodized Glow:** Dynamic elevation is communicated through emerald illumination rather than darkness. Focus rings, active scrubber nodes, and live ESC status rings radiate a dual-layered glow: `0 0 0 1px #10B981, 0 4px 20px rgba(16, 185, 129, 0.25)`.
- **Chassis Inset:** Data readout docks utilize negative physical relief via an inset ambient shadow: `inset 0 1px 2px rgba(15, 23, 42, 0.04)`.

## Shapes

The geometry reflects industrial CNC chamfering and diamond-milled edges. Corner radii are tightly controlled to maintain an instrument-grade aesthetic rather than consumer software softness.

- **Standard Cards, Modals, Callout Panels:** 8px radius (`0.5rem`). Crisp, geometric, structural.
- **Interactive Controls, Inputs, Badges:** 4px radius (`0.25rem`). Mirrors physical micro-switches and electronic speed controllers.
- **Stage Pills & Scrubber Indicators:** Circular / Full Pill (`9999px`) reserved strictly for sequence capsules, scrubber handles, and radio toggles to communicate continuous motion.

## Components

### Buttons
- **Primary Hardware Action:** Slate base (`#0F172A`), white text, 4px radius, 1px inner border (`rgba(255, 255, 255, 0.16)`). Hover introduces an emerald hairline accent: border transitions to `#10B981` with a subtle `0 0 16px rgba(16, 185, 129, 0.2)` bloom.
- **Technical Secondary:** Pure white background, 1px border (`#E2E8F0`), slate text. Hover triggers `#F8FAFC` fill with `#CBD5E1` border.
- **Telemetry Action:** Emerald-tinted ghost button with monospaced label, zero border, and an active blinking indicator dot.

### Sequence Scrubber & Stage Pills
- **Step-Through Scrubber:** A continuous horizontal rail (`#E2E8F0`, 2px thickness) segmented with monospaced stage stamps (e.g., `[01 // FRAME]`, `[02 // PROPULSION]`). The active stage node is an anodized emerald ring containing an inner white optic core, dragging an emerald progress fill line across the track.
- **Stage Pills:** Floating glass capsules (`backdrop-filter: blur(16px)`). Inactive pills display light-gray text with zero border; active pills switch to dark slate fill (`#0F172A`) with emerald monospaced status badges.

### Technical Callout Cards
- Rendered on pure white surfaces with 1px hairline borders (`#E2E8F0`). Cards feature monospaced coordinate badges at top right (e.g., `LOC: AXIS-Z // 04`).
- Interactive states trigger micro-border glow transitions and pin-point connecting lines to the 3D quadcopter view.

### Telemetry Gauges & Readouts
- Inset structural panels (`#F1F5F9`) housing vertical bar arrays and numerical values. Numbers are typeset in `spec-numeral` (JetBrains Mono).
- Critical thresholds (e.g., 98A max draw, 140km/h velocity) illuminate using the `#10B981` green status indicator.

### Input Fields & Selectors
- Flat surfaces with inset background (`#F8FAFC`), 1px structural borders (`#E2E8F0`), and monospaced helper tags anchored inside the input top-right. Active focus shifts the border immediately to `#10B981` with zero fuzzy focus rings.