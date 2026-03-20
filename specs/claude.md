# Claude prompt guide for maintaining Warehouse IQ specs

This file is your reference for how Claude should manage user stories and functional specifications in the **specs2/** directory for the Warehouse IQ project.

## Overall Structure

All specs live under `specs2/`:

- **ROADMAP.md** – The single source of truth
  - All 90 user stories organized by 12 epics
  - All 87 functional specs integrated with related stories
  - Use this as the primary reference document

- **BACKLOG.md** – Quick index with tags and links
  - Lists all stories and specs with epic/status tags
  - For navigation and filtering by tags in Obsidian

- **Individual FS-*.md files** – Reference implementation details
  - One file per functional spec (87 total)
  - Use for detailed spec review and documentation
  - Keep synchronized with ROADMAP.md

- **claude.md** – This file, guidelines for maintenance

No user story files (US-*.md) exist—all story content is in ROADMAP.md.

## Tag System

Use these tags consistently for filtering in Obsidian:

| Tag | Purpose | Examples |
|-----|---------|----------|
| `#us` | User story type | `[[FS-101]] #us` |
| `#fs` | Functional spec type | `[[FS-101]] #fs` |
| `#epic-yard` | Yard Management epic | All stories/specs in that epic |
| `#epic-labor` | Labor Management epic | All stories/specs in that epic |
| `#epic-plan-vs-exec` | Plan vs Execution epic | All stories/specs in that epic |
| `#epic-nlq` | Natural Language Queries epic | All stories/specs in that epic |
| `#epic-mfa-nav` | MFA Navigation & Core epic | All stories/specs in that epic |
| `#epic-mfa-time` | MFA Time Period epic | All stories/specs in that epic |
| `#epic-mfa-single-product` | Single Product Reslotting epic | All stories/specs in that epic |
| `#epic-mfa-product-pair` | Product Pair Reslotting epic | All stories/specs in that epic |
| `#epic-mfa-product-triplet` | Product Triplet Reslotting epic | All stories/specs in that epic |
| `#epic-mfa-terminology` | Terminology & Consistency epic | All stories/specs in that epic |
| `#epic-mfa-dialog-lms` | Dialog & LMS Integration epic | All stories/specs in that epic |
| `#epic-mfa-process-flow` | Process Flow Visualization epic | All stories/specs in that epic |
| `#epic-mfa-handover` | Handover Report epic | All stories/specs in that epic |
| `#status/todo` | Todo status | Specs not yet started |
| `#status/in-progress` | In Progress status | Partially implemented specs |
| `#status/done` | Done status | Fully implemented specs |

## ROADMAP.md Structure

The ROADMAP.md is organized by epic. Each epic section contains:

```markdown
## Epic Name
**Epic Tag:** #epic-xxx

### story-name-in-kebab-case

**User Story:** As a [role], I want [feature] so that [value].

#### Related Specifications

**[[FS-NNN]]: Spec Title**

Spec content from func_spec.md...
- **Source:** US-N
- **Status:** ✅/⚠️/❌
- **Description:** ...
- **Notes:** ...

---
```

**Guidelines for ROADMAP.md:**
- User story names use kebab-case (lowercase, hyphens)
- Stories are listed in numeric order within each epic
- Each story is followed by its related spec(s)
- Specs include status indicator (✅ Done, ⚠️ In Progress, ❌ Todo)
- Full spec details are included inline for reference

## When to Update Files

### Update ROADMAP.md when:
- Adding a new user story (rare—usually comes from upstream)
- Updating a story's name or description
- Changing a spec's status (✅/⚠️/❌)
- Adding notes about implementation progress

### Update BACKLOG.md when:
- Adding a new story or spec to the project
- Changing epic assignments
- Updating status tags
- Adding links to related items

### Update FS-*.md files when:
- Detailed spec information changes
- Implementation notes need updating
- Status changes significantly

## How Claude Should Behave

When asked about Warehouse IQ specs:

1. **Reference ROADMAP.md** as the primary source
   - This is where stories and specs are integrated
   - Use it for understanding context and relationships

2. **Check individual FS-*.md files** for detailed spec info
   - These contain the full functional spec documentation
   - Reference these when implementing features

3. **Use BACKLOG.md** for quick navigation
   - Find items by epic or status
   - Use tags for filtering

4. **When spec details need updating:**
   - Update the relevant FS-*.md file
   - Then update the corresponding entry in ROADMAP.md
   - Keep both in sync

5. **Maintain naming conventions:**
   - Story names: kebab-case (lowercase, hyphens)
   - Spec names: Use existing FS-NNN format
   - No spaces in filenames

## Key Statistics

- **Total User Stories:** 90
- **Total Functional Specs:** 87
- **Total Epics:** 12
- **Implementation Status:**
  - ✅ Done: 65 specs
  - ⚠️ In Progress: 15 specs
  - ❌ Todo: 8 specs

## File Locations

- **ROADMAP.md** – `/Users/admin/git/burl_demo/specs2/ROADMAP.md` (2,502 lines, 114 KB)
- **BACKLOG.md** – `/Users/admin/git/burl_demo/specs2/BACKLOG.md` (Quick index)
- **Specs** – `/Users/admin/git/burl_demo/specs2/FS-*.md` (87 files)
- **This file** – `/Users/admin/git/burl_demo/specs2/claude.md`

## Obsidian Integration

When using in Obsidian:

1. **Add specs2/ to your vault** by opening the folder
2. **Use tag filtering** to view epics:
   - `#epic-yard` → All yard management stories/specs
   - `#epic-labor` → All labor management stories/specs
   - etc.
3. **Use graph view** to explore relationships:
   - Stories link to their specs
   - Specs link back to stories
4. **Use ROADMAP.md** as your main reference
5. **Use BACKLOG.md** for quick jumping to items

## Maintenance Notes

- This is a single-source-of-truth structure (ROADMAP.md)
- Individual FS-*.md files are for reference/detail
- No US-*.md files exist (stories are only in ROADMAP.md)
- All specs are integrated with their related stories in ROADMAP.md
- Tag consistency is important for filtering to work

---

**Last Updated:** 2026-03-20
**Approach:** Tag-based, integrated, single-source-of-truth
**Reference:** See `/Users/admin/git/burl_demo/docs/` for original user_stories.md and func_spec.md
