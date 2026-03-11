# Claude Code Agents Reference

This document describes the specialized agents available in Claude Code and their use cases within this project context.

---

## Agent Types and Use Cases

### 1. **general-purpose Agent**
**Purpose**: Research complex questions, search code, and execute multi-step tasks autonomously

**When to Use**:
- Investigating complex bugs across multiple files
- Building understanding of unfamiliar code sections
- Multi-step refactoring or feature implementation
- When you need to explore the codebase without knowing the exact files to search

**Example Use Case in This Project**:
```
Agent: "general-purpose"
Task: "Search the codebase to understand how worker experience levels are calculated
and displayed across all components"
```

**Tools Available**: All tools (Bash, Grep, Read, Write, Edit, Glob, etc.)

---

### 2. **Explore Agent**
**Purpose**: Fast exploration of codebases using pattern matching and keyword searches

**When to Use**:
- Finding files by patterns (e.g., "src/components/**/*.tsx")
- Searching code for keywords (e.g., "API endpoints")
- Answering questions about codebase structure
- Quick reconnaissance before deeper work

**Parameters**:
- `thoroughness`: "quick" | "medium" | "very thorough"
  - **quick**: Basic searches, directional only
  - **medium**: Moderate exploration across multiple locations
  - **very thorough**: Comprehensive analysis, naming conventions, edge cases

**Example Use Case in This Project**:
```
Agent: "Explore"
Thoroughness: "quick"
Task: "Find all files related to labor management components"
```

**Tools Available**: All except Agent, Edit, Write, NotebookEdit

---

### 3. **Plan Agent**
**Purpose**: Software architect for designing implementation plans before coding

**When to Use**:
- Before implementing complex features
- When multiple valid approaches exist
- To identify critical files and dependencies
- To consider architectural trade-offs

**Workflow**:
1. Use Plan agent to design approach
2. Agent returns step-by-step implementation plan
3. Review plan and provide feedback
4. Exit plan mode when ready to implement

**Example Use Case in This Project**:
```
Agent: "Plan"
Task: "Design the implementation for adding a new labor analytics chart
to the Workload & Capacity view"
Output: Step-by-step plan identifying affected files, data structures, and components
```

**Tools Available**: All except Agent, Edit, Write, NotebookEdit

---

### 4. **claude-code-guide Agent**
**Purpose**: Answer questions about Claude Code features, API usage, and SDK

**When to Use**:
- Questions about Claude Code CLI features
- Anthropic SDK usage and best practices
- Claude API integration questions
- How to use specific Claude Code features

**Example Queries**:
- "How do I use MCP servers with Claude Code?"
- "What are the available hooks in Claude Code?"
- "How do I use the Anthropic SDK for function calling?"

**Tools Available**: Glob, Grep, Read, WebFetch, WebSearch

---

## Practical Workflow Examples

### Example 1: Adding a New Feature
**Scenario**: Add a new performance metric to the Labor Management dashboard

**Workflow**:
1. **Explore** (quick) → Find components, data structures, mock data
2. **Plan** → Design where metric displays, data flow, affected components
3. **Manual Implementation** → Use Edit/Write to implement changes
4. **General-purpose** → Run tests, verify integration across app

### Example 2: Investigating a Bug
**Scenario**: Worker check-in status not updating in Labor Management

**Workflow**:
1. **Explore** (medium) → Find all worker state management code
2. **Grep** → Search for specific state variables and update functions
3. **Read** → Examine relevant component implementations
4. **General-purpose** → Research the bug, identify root cause, test fixes

### Example 3: Complex Refactoring
**Scenario**: Refactor zone/process naming throughout the codebase

**Workflow**:
1. **Explore** (very thorough) → Find all references to zone naming
2. **Plan** → Design refactoring strategy, identify breaking changes
3. **Manual Implementation** → Update data structures, components, tests
4. **General-purpose** → Verify nothing broke, run full test suite

---

## Agent Best Practices

### When NOT to Use Agents
- **Simple, directed searches**: Use Glob/Grep directly instead
- **Single-file edits**: Use Edit/Read directly
- **Straightforward tasks**: Don't over-engineer with agents
- **Quick lookups**: Use Read tool instead

### When to Use Agents
- **Open-ended exploration**: Multiple queries needed, don't know where to start
- **Complex research**: Understanding large systems before changes
- **Multi-step tasks**: Tasks requiring planning before implementation
- **Verification**: After major changes, verify impact across codebase

### Agent Parameters
- **Run in background**: Use for long-running research so you can work on other tasks
- **Isolation (worktree)**: Use when agent might make exploratory changes you don't want to keep
- **Model override**: Use faster model (haiku) for simple research, opus for complex analysis

---

## Project-Specific Patterns

### Labor Management Component Discovery
**Common Task**: Understanding labor zone/process structure

**Best Approach**:
```
Explore (medium) with search pattern:
- "Zone A", "Zone B", "Zone C", "Zone D", "Crossdock"
- "ZONE_CONFIG", "LABOR_PERIOD_DATA"
- "LaborManagement.jsx", "mockData.js"
```

### Data Flow Tracking
**Common Task**: Understanding how data flows from mockData to components

**Best Approach**:
1. Read mockData.js sections
2. Grep for imports of specific data objects
3. Explore affected components
4. Plan refactoring if needed

### MFA Node Updates
**Common Task**: Keeping MFA process map aligned with Labor Management

**Best Approach**:
1. Explore → Find MFA and Labor components
2. Compare node colors (risk status) with labor zone status
3. Identify alignment issues
4. Plan data structure changes
5. Update mockData and documentation

---

## Memory and Context Preservation

### Documenting for Future Sessions
Use `/memory` commands to save:
- **Pattern discoveries**: How components interact
- **Architecture decisions**: Why certain patterns were chosen
- **Common debugging issues**: What to check first
- **Data structure relationships**: How zones, processes, workers relate

### Retrieving Past Context
Before starting major work:
1. Check `/memory/MEMORY.md` for relevant patterns
2. Consult docs folder for feature overview
3. Review recent commits for context
4. Use Explore agent if context is still unclear

---

## Tools Quick Reference

| Tool | Best For | Avoid |
|------|----------|-------|
| **Explore** | Codebase reconnaissance | Simple file searches |
| **Plan** | Architecture before code | Confirmation requests |
| **Grep** | Content search | Exploring structure |
| **Glob** | File pattern matching | Content searches |
| **Read** | Reading files | Large file reads (use offset/limit) |
| **Edit** | Modifying existing files | Creating new files |
| **Write** | Creating new files | Modifying existing files |
| **Bash** | System commands | File operations (use dedicated tools) |

---

## Version Notes

- **Last Updated**: March 11, 2026
- **Claude Code Version**: Latest
- **Agents Covered**: All general-purpose agent types
