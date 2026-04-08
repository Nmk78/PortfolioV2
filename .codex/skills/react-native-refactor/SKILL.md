---
name: react-native-refactor
description: Refactor Expo React Native (TypeScript) components to be clean, idiomatic, and best-practice. Use when improving component structure, hooks usage, performance, readability, state management (prioritize React Context over Zustand), NativeWind styling, or when modernizing RN component code in this repo.
---

# React Native Refactor

## Overview

Refactor React Native components for clarity, reuse, and best practices in an Expo + TypeScript + NativeWind codebase. Prioritize React Context for shared state; only introduce Zustand when Context causes excessive re-renders or complex cross-cutting state.

## Workflow

1. Identify scope and constraints.
   - Confirm file(s), component purpose, and any related hooks or shared state.
   - Preserve behavior and public props unless explicitly asked to change them.
2. Apply refactor checklist (see below).
3. Make targeted edits with minimal churn.
4. Re-check for TypeScript correctness and RN/Expo conventions.
5. If tradeoffs exist (e.g., Context vs Zustand), explain briefly and ask before switching state libs.

## Refactor Checklist

- Components are small, focused, and readable (extract subcomponents when they simplify logic).
- Hooks are used correctly (no conditional hooks, dependency arrays accurate).
- Props and state are typed explicitly and consistently.
- Derived data is memoized (`useMemo`) only when it is expensive or used as dependency.
- Event handlers are stable only when it avoids re-renders or passes to memoized children.
- Side effects are isolated and cleaned up (`useEffect` with proper cleanup).
- Lists use `keyExtractor` and avoid inline render functions when possible.
- Avoid anonymous inline objects for `style` or props passed to memoized children; use `useMemo` or constants.
- NativeWind classes are consistent and avoid mixing inline `style` unless necessary.
- Accessibility: `accessibilityLabel`, `accessibilityRole`, and `testID` where relevant.

## Decision Rules

- Prefer React Context for shared state; use Zustand only when Context becomes unwieldy or causes performance issues.
- Prefer functional components, hooks, and colocation of component-specific logic.
- Prefer composition over prop drilling when it reduces complexity.
- Avoid premature optimization; only add memoization when it has a clear reason.

## NativeWind Guidance

- Prefer `className` for layout and spacing.
- Use `style` only for dynamic values that do not map cleanly to utility classes.
- Use `clsx`-style conditional composition when available; otherwise build class strings with helper utilities.

## Resources

- For detailed patterns and examples, read `references/refactor-guidelines.md`.
