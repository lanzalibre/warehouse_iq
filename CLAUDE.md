# SpinnakerSCA Warehouse IQ - Claude Instructions

## Auto-Authorized Actions

The following actions are **autoconfirmed** - proceed without asking for permission:

### Code Changes
- Creating new components
- Modifying existing components
- Updating mock data
- Adding/imports icons
- Styling changes
- Bug fixes
- Refactoring

### Git Operations (on feature branches)
- Adding files
- Committing changes
- Pushing to feature branches
- Creating branches
- Merging feature branches (after PR)

### Build & Test
- Running development server
- Building for production
- Installing dependencies
- Linting

### File Operations
- Creating new files
- Editing existing files
- Deleting files (when appropriate)

### Requests for Permission
Only request permission for:
- Pushing directly to `main` branch (should go through PR)
- Deleting branches (except cleanup after merge)
- Destructive operations (deleting large sections of code)
- External API calls or network operations
- Running external commands outside the project

## Testing

Before submitting a PR:
1. Run dev server: `npm run dev`
2. Test the feature visually
3. Check for console errors
4. Verify responsive design
5. Test navigation flows

## Commit Messages

Use conventional commits format:
- `feat: add new reports dashboard`
- `fix: resolve picker bypass display issue`
- `refactor: simplify worker sorting logic`
- `docs: update README with new features`

## Questions

If uncertain about:
- Architecture decisions - proceed with sensible defaults
- UI/UX - follow existing patterns in the codebase
- Data structures - maintain consistency with existing mock data
- Git operations - use the feature branch workflow

Make reasonable assumptions and document them in commit messages.
