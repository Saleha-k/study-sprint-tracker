# Study Sprint Tracker

---

## Features

- Responsive layout for mobile, tablet, and desktop
- Light and Dark theme using CSS design tokens
- Countdown timer
- Three timer modes:
  - Sprint (25 minutes)
  - Deep Work (50 minutes)
  - Short Break (5 minutes)
- Start, Pause, Resume, and Reset functionality
- Progress indicator
- Session log
- Loading state while saving
- Error state simulation
- Hover, Focus, Active, Disabled, and Loading interactions
- Accessible semantic HTML with ARIA attributes
- Built using reusable typed React components

---

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- CSS Variables (Design Tokens)

---

### Component Responsibilities

- **StudySprint** – Main application logic and state management.
- **TimerBoard** – Displays the countdown timer.
- **FlapDigit** – Renders individual timer digits.
- **Button** – Reusable button component supporting multiple variants and states.
- **StatBadge** – Displays study statistics.
- **LogRow** – Displays each study session entry.

---

## Responsive Design

The application adapts to different screen sizes using responsive layouts.

- Mobile
- Tablet
- Desktop

Layouts reflow instead of simply scaling.

---

## Accessibility

Accessibility improvements include:

- Semantic HTML
- ARIA labels
- Keyboard accessible controls
- Proper heading hierarchy
- Focus-visible states
- Accessible timer announcements

Lighthouse Accessibility Report is included with the submission.

---

## Theme System

Dark mode is implemented using CSS custom properties (design tokens) instead of hardcoded colors.

Themes are switched by changing the `data-theme` attribute.

---

## Running the Project Locally

Clone the repository:

```bash
git clone https://github.com/Saleha-k/study-sprint-tracker.git
```

Move into the project:

```bash
cd study-sprint-tracker
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Design Decisions

The provided mockup was recreated as closely as possible.

Where the design was ambiguous:

- Loading and error states were implemented for the save action.
- Timer completion transitions were added using CSS transitions.
- Hover and focus interactions were implemented consistently across all interactive elements.
- Theme switching is persisted using Local Storage.

---

## Deployment

The project is deployed on Vercel.

Live URL:

https://study-sprint-tracker-55u5.vercel.app/

---
