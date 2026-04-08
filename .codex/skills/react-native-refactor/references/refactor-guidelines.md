# React Native Refactor Guidelines

## Table of Contents

- Scope and goals
- Component structure
- Hooks and effects
- Performance and memoization
- State management (Context first)
- NativeWind styling
- Accessibility and testing
- Common refactors

## Scope and goals

- Preserve behavior unless asked to change it.
- Keep diffs minimal and focused.
- Prefer readability and clear intent over cleverness.

## Component structure

- Extract presentational subcomponents when the main component exceeds ~150 lines or mixes multiple concerns.
- Co-locate related helpers inside the same file if they are not reused elsewhere.
- Avoid deep prop drilling; use Context when it reduces complexity.

## Hooks and effects

- Never call hooks conditionally.
- Always include all referenced values in dependency arrays unless a stable reference is guaranteed.
- Use `useCallback` only when passing handlers to memoized children or avoiding expensive recalculation.
- Use `useMemo` only for expensive derived values or stable object/array props.
- Clean up subscriptions and timers in `useEffect` cleanup functions.

## Performance and memoization

- Prefer measuring or obvious hotspots before adding memoization.
- `React.memo` is useful for pure presentational components with stable props.
- Avoid inline object/array props passed to memoized children unless memoized.
- Prefer `keyExtractor` for lists and avoid inline render functions when possible.

## State management (Context first)

- Use React Context for shared UI state and simple app-level state.
- Use Zustand only when:
  - Context causes frequent unnecessary re-renders across large trees.
  - State is cross-cutting and accessed by many distant components.
  - You need fine-grained selectors and derived state without prop drilling.
- If switching to Zustand, explain why and keep store scope minimal.

## NativeWind styling

- Prefer `className` for layout, spacing, colors, typography, and borders.
- Use `style` only for dynamic values or when a utility class is not available.
- Keep class strings consistent and readable; extract complex conditionals into helpers.

## Accessibility and testing

- Add `accessibilityRole` and `accessibilityLabel` for interactive elements.
- Add `testID` for elements used in tests or E2E flows.

## Common refactors

- Convert inline styles to NativeWind classes.
- Replace magic numbers with named constants.
- Split long render blocks into smaller components.
- Replace duplicated logic with small helpers.
- Normalize prop names and boolean flags (`isLoading`, `hasError`).
