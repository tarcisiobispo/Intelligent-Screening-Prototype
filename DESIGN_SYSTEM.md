# Design System Guide

## Typography Hierarchy

### Headings
- **H1 (Page Titles)**: `text-2xl font-bold text-[var(--text)] mb-2`
- **H2 (Section Titles)**: `text-xl font-bold text-[var(--text)] mb-2`
- **H3 (Subsection)**: `text-lg font-semibold text-[var(--text)] mb-1`
- **H4 (Card Titles)**: `text-lg font-semibold`

### Body Text
- **Body**: `text-sm text-[var(--text)]`
- **Muted**: `text-sm text-[var(--muted)]`
- **Caption**: `text-xs text-[var(--muted)]`

## Spacing Standards

### Card Padding
- **Standard Cards**: `p-4` (16px all sides)
- **Card Headers**: `p-4 pb-2` (16px sides/top, 8px bottom)
- **Card Content**: `p-4 pt-2` (16px sides/bottom, 8px top)

### Gaps
- **Section Gap**: `space-y-6` (24px between major sections)
- **Item Gap**: `space-y-4` (16px between items)
- **Small Gap**: `space-y-2` (8px between related items)
- **Flex Gap**: `gap-4` (16px in flex layouts)
- **Small Flex Gap**: `gap-2` (8px in compact flex layouts)

## Button Standards

### Sizes
- **Default**: `h-9 px-4 py-2` (36px height)
- **Small**: `h-8 px-3 py-1.5` (32px height)
- **Large**: `h-10 px-6 py-2.5` (40px height)
- **Icon**: `size-9` (36px square)

### Text & Icons
- **Text**: Always uppercase (`uppercase`) with semibold weight
- **Icons**: Always 16px (`w-4 h-4`) regardless of button size
- **Gap**: 8px between icon and text (`gap-2`)

## Icon Standards

### Sizes
- **Small**: `w-4 h-4` (16px) - Used in buttons, filters, badges
- **Default**: `w-5 h-5` (20px) - Used in headers, navigation
- **Large**: `w-6 h-6` (24px) - Used in empty states, large cards

### Usage
- Filter icons: Always 16px with consistent alignment
- Button icons: Always 16px regardless of button size
- Header icons: 20px for section headers

## Card Standards

### Heights
- **KPI Cards**: `h-28` (112px fixed height)
- **Compact Cards**: `min-h-[120px]` (minimum 120px)
- **Standard Cards**: `min-h-[200px]` (minimum 200px)

### Structure
```tsx
<Card>
  <CardHeader className="p-4 pb-2">
    <CardTitle className="text-lg font-semibold">Title</CardTitle>
  </CardHeader>
  <CardContent className="p-4 pt-2">
    Content
  </CardContent>
</Card>
```

## Filter Component Standards

### Widths
- **Narrow**: `w-24` (96px) - For short selects
- **Small**: `w-28` (112px) - For status/priority
- **Medium**: `w-32` (128px) - For type/category
- **Wide**: `w-36` (144px) - For names/text inputs

### Structure
```tsx
<div className="space-y-1 w-32">
  <label className="text-xs font-medium text-[var(--muted)]">Label</label>
  <Select>
    <SelectTrigger size="sm">
      <Icon className="w-4 h-4 mr-2" />
      <SelectValue />
    </SelectTrigger>
  </Select>
</div>
```

## Color Usage

### Status Colors
- **Success**: `var(--success)` - Green for completed states
- **Warning**: `var(--warning)` - Yellow for attention needed
- **Danger**: `var(--danger)` - Red for critical/error states
- **Primary**: `var(--primary)` - Blue for primary actions
- **Muted**: `var(--muted)` - Gray for secondary text

### Badge Colors
Use background with 10% opacity and full color for text:
```tsx
style={{
  backgroundColor: 'rgba(214, 69, 69, 0.1)',
  color: 'var(--danger)'
}}
```

## Layout Standards

### Page Structure
```tsx
<div className="space-y-6 max-w-[1400px]">
  {/* Header */}
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Page Title</h1>
      <p className="text-[var(--muted)]">Description</p>
    </div>
    <div className="flex gap-2">
      {/* Action buttons */}
    </div>
  </div>
  
  {/* Content sections with space-y-6 */}
</div>
```

### Filter Layout
```tsx
<Card>
  <CardContent className="p-4">
    <div className="flex flex-wrap gap-3">
      {/* Filter components with consistent widths */}
    </div>
  </CardContent>
</Card>
```

## Responsive Breakpoints

- **Mobile**: Default styles
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)
- **Large**: `xl:` prefix (1280px+)

## Accessibility

### Focus States
- All interactive elements have visible focus rings
- Focus rings use `focus-visible:ring-ring/50 focus-visible:ring-[3px]`

### Color Contrast
- All text meets WCAG AA standards
- Interactive elements have sufficient contrast ratios

### Keyboard Navigation
- All components are keyboard accessible
- Tab order follows logical flow

## Implementation Checklist

### ✅ Completed
- [x] Standardized button sizes and icon dimensions
- [x] Unified card padding across all pages
- [x] Consistent typography hierarchy
- [x] Standardized filter component widths
- [x] Uniform spacing tokens

### 🎯 Design System Benefits
- **Consistency**: All components follow the same patterns
- **Maintainability**: Changes to tokens update entire system
- **Accessibility**: Built-in focus states and contrast ratios
- **Performance**: Consistent class usage improves CSS optimization
- **Developer Experience**: Clear guidelines reduce decision fatigue