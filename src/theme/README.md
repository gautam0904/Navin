# Theme System

This theme system uses CSS variables to provide a consistent color palette across the application.

## Color Palette

### Brand Colors

- `downriver` (#092743) - Primary brand color (logo color)
- `wild-sand` (#f5f5f5) - Light background color
- `regent-gray` (#7e8e9c) - Medium gray
- `pickled-bluewood` (#384d65) - Dark accent
- `black-russian` (#000112) - Darkest color
- `loblolly` (#bbc5cd) - Light gray
- `midnight` (#011633) - Very dark blue
- `blue-charcoal` (#010920) - Dark charcoal

### Using Colors in Tailwind

You can use the theme colors in your Tailwind classes:

```tsx
// Brand colors
<div className="bg-downriver text-wild-sand">
<div className="bg-regent-gray border-pickled-bluewood">

// Semantic colors
<div className="bg-primary text-text-inverse">
<div className="bg-bg-primary text-text-primary border-border-light">

// Accent colors
<button className="bg-accent hover:bg-accent-dark text-text-inverse">
```

### Using Colors in CSS

You can also use the CSS variables directly:

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: 1px solid var(--color-border-medium);
}
```

### RGB Values

For rgba usage, use the RGB variables:

```css
.element {
  background-color: rgba(var(--color-downriver-rgb), 0.8);
}
```

## Semantic Color Mappings

- **Primary**: Downriver (brand color)
- **Background**: Wild sand for primary, white for secondary
- **Text**: Downriver for primary, regent-gray for secondary
- **Border**: Various shades from light to dark
- **Accent**: Pickled bluewood with light/dark variants
