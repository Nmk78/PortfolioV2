---
name: employer-intake-form-implementation
description: Implement employer intake form UI with database storage and read-only employer view for ChatBase integration workflow
---

# Employer Intake Form Implementation

> **Important**: If specific instructions are provided that contradict or differ from this skill file, always prioritize and follow the specific instructions provided. The skill file serves as a general guide, but direct instructions take precedence.

## Overview

This skill guides the implementation of an employer intake form system as the first step in integrating ChatBase with the employer landing page. The form will collect employer requirements, store them in the database, and display them as read-only in the employer dashboard.

## Context

This is part of a larger ChatBase integration workflow where:
- **ChatBase** handles the conversational layer (initial intake, updates, scheduling, payment nudges)
- **Dashboard** handles data and logic (employer records, candidate packets, decision logging, contracts)
- **Webhooks** bridge ChatBase and Dashboard for bidirectional communication

The employer intake form is the entry point where employers submit their hiring requirements, which will later be processed by the operations team and matched with candidates.

## Current State

The codebase already has:
- ✅ **Database Schema**: `employerRecords` table defined in `convex/schema.ts` (lines 117-169)
- ✅ **Validation Schema**: `employerIntakeSchema` in `validations/employerIntake.ts`

**Note**: Backend functions for employer operations need to be created in `convex/employer.ts`. The frontend implementation should prepare for these functions:
- `createEmployerRecord` - Create new employer record
- `getEmployerRecord` - Get single record (read-only for employers)
- `getMyEmployerRecords` - Get all records for current user

**Important**: 
- The `components` folder is deprecated and will be removed. All UI components must be used from `new-components/ui` folder only. If a component doesn't exist in `new-components`, it needs to be created there.
- **Folder Naming Convention**: All folder names must use kebab-case (e.g., `new-components`, `employer-intake`, `sponsorship`). Component files use PascalCase, but folders always use kebab-case.

## Implementation Tasks

### 1. Create Employer Intake Form Component

**Location**: Create `app/sponsorship/intake/page.tsx`

**Note**: All folder names must use kebab-case naming (e.g., `employer-intake`, `new-components`, `sponsorship`). Component files use PascalCase (e.g., `EmployerIntakeForm.tsx`), but folders use kebab-case.

**Requirements**:
- Build a multi-section form using the existing UI component patterns
- Use `react-hook-form` with `zodResolver` and `employerIntakeSchema` for validation
- Follow the form structure from `app/sponsorship/profile/page.tsx` as a reference
- Include all fields from `employerIntakeSchema`:
  - **Company Information**: `companyName`
  - **Contact Information**: `contactName`, `contactEmail`, `contactPhone` (optional)
  - **Role Information**: `roleTitle`, `roleDescription`, `requiredSkills` (array)
  - **Budget and Timeline**: `budget` (optional), `budgetCurrency` (optional), `timeline`
  - **Additional Preferences**: `timezoneOverlap` (optional), `urgency` (default: "medium")
  - **Notes**: `notes` (optional)

**UI Components to Use** (from `new-components/ui` only):
- `Button` from `@/new-components/ui/button` ✅ (exists)
- `Card` from `@/new-components/ui/card` ✅ (exists)
- `Badge` from `@/new-components/ui/badge` ✅ (exists)
- `Input` - **NEEDS TO BE CREATED** in `new-components/ui/input.tsx`
- `Label` - **NEEDS TO BE CREATED** in `new-components/ui/label.tsx`
- `Textarea` - **NEEDS TO BE CREATED** in `new-components/ui/textarea.tsx`
- `Select` - **NEEDS TO BE CREATED** in `new-components/ui/select.tsx` (for dropdowns like `timeline`, `urgency`, `budgetCurrency`)
- `MultiSelect` - **NEEDS TO BE CREATED** in `new-components/ui/multi-select.tsx` (for `requiredSkills`)

**Component Creation Priority**:
1. Create `Input`, `Label`, and `Textarea` first (essential for form)
2. Create `Select` for dropdown fields
3. Create `MultiSelect` for skills selection (can reference existing `components/ui/multi-select.tsx` for implementation pattern, but create new version in `new-components`)

**Form Behavior**:
- Show loading state during submission
- Display validation errors inline
- Show success toast on successful submission
- Redirect to employer record view or show confirmation message
- Handle errors gracefully with user-friendly messages

**Skills Selection**:
- Use the existing skills system (check `hooks/useSkills.ts` or `stores/skillStore.ts`)
- Allow multiple skill selection using `MultiSelect` component from `new-components/ui/multi-select.tsx`
- Ensure selected skills match the format expected by the schema
- Note: You may reference `components/ui/multi-select.tsx` for implementation patterns, but create a new version in `new-components/ui/` following the new component patterns

### 2. Connect Form to Database

**Note**: Backend functions need to be created in `convex/employer.ts` first. The form should be prepared to use:

**Mutation Hook** (to be implemented in backend):
- `useMutation(api.employer.createEmployerRecord)` from Convex
- Map form data to the mutation arguments
- Handle the `userId` automatically (will be `undefined` if not logged in, which is fine for ChatBase flow)

**Form Submission Flow** (prepare frontend for this structure):
```typescript
// This assumes backend function exists: api.employer.createEmployerRecord
const createEmployerRecord = useMutation(api.employer.createEmployerRecord);

const onSubmit = async (data: EmployerIntakeFormData) => {
  try {
    const recordId = await createEmployerRecord({
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      roleTitle: data.roleTitle,
      roleDescription: data.roleDescription,
      requiredSkills: data.requiredSkills,
      budget: data.budget ?? undefined,
      budgetCurrency: data.budgetCurrency ?? undefined,
      timeline: data.timeline,
      timezoneOverlap: data.timezoneOverlap ?? undefined,
      urgency: data.urgency,
      notes: data.notes ?? undefined,
      // chatbaseConversationId can be added later when webhook integration is ready
    });
    
    // Handle success (redirect, show message, etc.)
  } catch (error) {
    // Handle error
  }
};
```

**Backend Implementation Required**:
- Create `convex/employer.ts` with `createEmployerRecord` mutation
- The mutation should insert into `employerRecords` table
- Set default status to `"new"`
- Set `submittedAt` and `updatedAt` timestamps

### 3. Create Read-Only Employer View

**Location**: Create `app/sponsorship/intake/[id]/page.tsx` for viewing a single employer record

**Requirements**:
- Display all employer record fields in a read-only format
- Use the same UI styling as the profile page (`app/sponsorship/profile/page.tsx`)
- Fetch data using `useConvexQuery` from `@/hooks/useConvexQuery`:
  ```typescript
  const { data: record, isPending: isLoading } = useConvexQuery(
    api.employer.getEmployerRecord,
    recordId ? { employerRecordId: recordId } : "skip"
  );
  ```
- Show loading state using `isPending` from the hook
- Handle case where record doesn't exist or user doesn't have access
- Display fields in a clean, organized layout:
  - Company & Contact Information section
  - Role Details section
  - Budget & Timeline section
  - Additional Preferences section
  - Status badge (if applicable)
  - Submission timestamp

**Backend Implementation Required**:
- Create `getEmployerRecord` query in `convex/employer.ts`
- Query should fetch record by ID
- Include authorization check (user can only view their own records)

**UI Considerations**:
- Use `Card` component from `@/new-components/ui/card` for sections
- Use `Badge` component from `@/new-components/ui/badge` for status, urgency, timeline
- Format dates using existing utilities (check `lib/timeUtils.ts`)
- Make it visually clear this is read-only (display as text, not form inputs)
- Use `Empty` component from `@/new-components/ui/empty` for empty states if needed

### 4. Create Employer Records List View

**Location**: Create `app/sponsorship/intake/page.tsx` (if form is in a component) or `app/sponsorship/employer-records/page.tsx`

**Note**: Use kebab-case for folder names (`employer-records` not `employerRecords`).

**Requirements**:
- List all employer records for the current user using `useConvexQuery` from `@/hooks/useConvexQuery`:
  ```typescript
  const { data: records = [], isPending: isLoading } = useConvexQuery(
    api.employer.getMyEmployerRecords,
    {}
  );
  ```
- Display records in a table or card grid
- Show key information: company name, role title, status, submission date
- Link to individual record view
- Show empty state when no records exist
- Include status badges with appropriate colors

**Backend Implementation Required**:
- Create `getMyEmployerRecords` query in `convex/employer.ts`
- Query should filter records by `userId`
- Return records sorted by `submittedAt` (newest first)

### 5. Form Field Details

**Required Fields** (must be filled):
- `companyName`: Text input, 2-100 characters
- `contactName`: Text input, 2-100 characters
- `contactEmail`: Email input, must be valid email
- `roleTitle`: Text input, 3-100 characters
- `roleDescription`: Textarea, 50-2000 characters
- `requiredSkills`: Multi-select, at least 1 skill required
- `timeline`: Select dropdown with options: "ASAP", "1 week", "2 weeks", "1 month", "2-3 months", "3+ months", "Flexible"
- `urgency`: Select dropdown with options: "low", "medium", "high" (default: "medium")

**Optional Fields**:
- `contactPhone`: Text input, validated phone format if provided
- `budget`: Number input, must be positive if provided
- `budgetCurrency`: Select dropdown: "USD", "EUR", "GBP", "MMK", "SGD", "THB", "INR", "Other"
- `timezoneOverlap`: Text input, format: "X hours" or "Flexible"
- `notes`: Textarea, max 1000 characters

### 6. Integration Points for Future ChatBase Workflow

**Webhook Preparation**:
- The form should be accessible via a public route (for ChatBase to link to)
- Consider adding a `chatbaseConversationId` field that can be populated when form is submitted via ChatBase link
- Form submission should trigger a webhook (to be implemented later) that notifies the operations team

**Status Management**:
- New records start with status: `"new"`
- Status progression: `new` → `qualifying` → `candidates_sent` → `interview_scheduled` → etc.
- Status updates will be handled externally, but employer view should display current status

## File Structure

```
app/sponsorship/
  intake/                 # kebab-case folder name
    page.tsx              # Form page (or list view if form is component)
    [id]/                 # Dynamic route folder
      page.tsx            # Read-only employer record view
  employer-records/       # Alternative: kebab-case folder name
    page.tsx              # List view (if separate from intake)

new-components/ui/        # kebab-case folder name
  input.tsx               # NEEDS TO BE CREATED
  label.tsx               # NEEDS TO BE CREATED
  textarea.tsx            # NEEDS TO BE CREATED
  select.tsx              # NEEDS TO BE CREATED
  multi-select.tsx        # NEEDS TO BE CREATED (kebab-case filename)

convex/                   # Already exists
  employer.ts             # NEEDS TO BE CREATED - employer operations
  schema.ts               # Already exists - employerRecords table

validations/              # Already exists
  employerIntake.ts       # Already exists - validation schema
```

**Folder Naming Convention**: All folders use kebab-case (e.g., `employer-records`, `new-components`, `sponsorship`). Component files use PascalCase, but folder names always use kebab-case.

## Design Patterns to Follow

1. **Form Pattern**: Follow `app/sponsorship/profile/page.tsx`:
   - Use `react-hook-form` with `zodResolver`
   - Show loading overlay during submission
   - Inline error messages
   - Success/error toasts using `sonner`

2. **UI Styling**: Follow new-components design system:
   - Use Card component from `@/new-components/ui/card`
   - Use theme variables from `new-components/theme.css`
   - Button: Use `variant="default"` or `variant="inverse"` from Button component
   - Inputs: Follow new-components patterns (check existing components for styling)
   - Maintain consistent spacing and typography

3. **Data Fetching**: Use Convex hooks (backend functions need to be created first):
   - `useConvexQuery` from `@/hooks/useConvexQuery` for reading data (requires backend query functions)
     - Returns `{ data, isPending }` - use `isPending` for loading states
     - Example: `const { data, isPending } = useConvexQuery(api.employer.getEmployerRecord, { employerRecordId: id })`
   - `useMutation` from `convex/react` for writing data (requires backend mutation functions)
   - Handle loading and error states
   - Note: Backend functions in `convex/employer.ts` must be implemented before these hooks will work

4. **Validation**: Use existing `employerIntakeSchema`:
   - Import from `@/validations/employerIntake`
   - Type: `EmployerIntakeFormData` from the schema

## Testing Checklist

- [ ] All required UI components created in `new-components/ui/`
- [ ] Components follow new-components design patterns
- [ ] Form validates all required fields
- [ ] Form validates field formats (email, phone, etc.)
- [ ] Form submits successfully and creates record in database (requires backend implementation)
- [ ] Success message/redirect works after submission
- [ ] Error handling works for network/database errors
- [ ] Read-only view displays all fields correctly
- [ ] Read-only view handles missing records gracefully
- [ ] List view shows user's records
- [ ] List view handles empty state
- [ ] Employers can only read their own records
- [ ] Form is accessible and works on mobile devices

## Backend Implementation Required

Before the frontend can be fully functional, the following backend functions need to be created in `convex/employer.ts`:

1. **`createEmployerRecord` mutation**:
   - Accept all fields from `employerIntakeSchema`
   - Insert into `employerRecords` table
   - Set `status` to `"new"`
   - Set `submittedAt` and `updatedAt` timestamps
   - Return the created record ID

2. **`getEmployerRecord` query**:
   - Accept `employerRecordId` as parameter
   - Fetch record from database
   - Check authorization (user can only view their own records)
   - Return record or null if not found/unauthorized

3. **`getMyEmployerRecords` query**:
   - Get current user ID from auth
   - Query `employerRecords` table filtered by `userId`
   - Sort by `submittedAt` (newest first)
   - Return array of records

## Next Steps (Future Tasks)

After frontend and backend implementation:
1. Add webhook integration for form submission notifications
2. Add ChatBase conversation ID linking
3. Add status update workflows
4. Integrate with candidate matching system

## References

- Existing form example: `app/sponsorship/profile/page.tsx` (for form patterns, but use new-components)
- Validation schema: `validations/employerIntake.ts`
- Database schema: `convex/schema.ts` (employerRecords table)
- Backend functions: `convex/employer.ts` (NEEDS TO BE CREATED)
- UI components: `new-components/ui/*` (ONLY - components folder is deprecated)
- Component reference (for patterns only): `components/ui/multi-select.tsx` (to understand MultiSelect implementation, but create new version)

