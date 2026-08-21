# uLift

full-stack resistance training tracker app built using React, Typescript, and Supabase. Users can create custom programs, log real-time workout sessions, and track progress over time.

## Features

- **Auth** - email/password-based login/signup using Supabase Auth, with the use of protected routes for authentication-required pages

- **Program Builder** - create multi-day programs with custom exercises, set counts, and rep ranges

- **Active Workout Flow** - start a workout from any program of your choosing. The app will automatically select the next day in rotation, with the option of manually switching to another day, uses a live elapsed timer that persists across app navigation, and logs weight and reps per set

- **Workout History** - browse past sessions with full exercise breakdowns, duration, and date

- **Home Dashboard** - user greeting, weekly stats, and a quick-start card for the user's selected active program

- **Profile** - editable display name, profile picture selector, ability to change password, and delete account

- **Persistent Live Workout Indicator** - a pulsing icon in the navbar lets you jump back into an in-progress workout from anywhere in the app

## Teck Stack

- **Frontend** - React + Typescript, React Router
- **Backend** - Supabase (Postgres, Auth, Row Level Security)
- **Styling** - Tailwind CSS, react-icons

## Architecture Notes

- **Row Level Security** is enforced on every table. Users can only read/write their own programs, days, exercises, and workout sessions. Policies are scoped by foreign key chains (e.g. a `days` insert is validated against the parent `programs.user_id`).
- **Cascade Deletes** are configured at the database level.
- **Live Workout State** is synced through `localStorage` so the app can detect an in-progress session from any page and resume the correct elapsed time upon return.
- **Component Structure** - The workout log part of the app has a lot of repeating pieces of it, so the UI is split into composable pieces (`Workout`, `DayPicker`, `ExerciseCard`, `SetRow`), so state lives in one place while presentation stays decoupled.

## Database Schema

```
profiles          - user display name, profile avatar, active program
programs          - workout programs
days              - days within a program (e.g. "Push", "Pull", "Legs")
exercises         - exercises within a day (name, sets, rep range)
workout_sessions  - an instance of a workout (program, day, create/complete times)
session_sets      - individual logged sets of a session (weight, reps, set number)
```

---

Built by a gym-goer tired of paying for convenience they can create themselves.
