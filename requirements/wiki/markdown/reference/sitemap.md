# Clark Pro Screen Sitemap

**Project:** clark-pro
**Version:** 1.0
**Updated:** 2026-07-13

---

```mermaid
flowchart LR
  subgraph Trust["Trust and setup"]
    Welcome["Screen: Welcome & Trust"] --> Setup["Screen: Workspace Setup"] --> Focus["Screen: Focus"]
    Recovery["Screen: Recovery Summary"] --> Focus
  end
  subgraph Create["Create and decide"]
    Inbox["Screen: Inbox"] --> Focus --> Canvas["Screen: Canvas"] --> Review["Screen: Review"] --> Timeline["Screen: Timeline"]
    Timeline --> Observation["Screen: Observation"] --> Memory["Screen: Memory"]
  end
  subgraph Govern["Govern extensions and access"]
    Connections["Screen: Connections"] --> ToolLibrary["Screen: Tool Pack Library"] --> ToolReview["Screen: Tool Pack Review"]
    Connections --> SkillLibrary["Screen: Skill Library"] --> SkillReview["Screen: Skill Review"]
    Timeline --> Export["Screen: Export Package"]
  end
  Focus --> Connections
  Memory --> Review
```

## Navigation Contract

- Focus is the first operational destination and the return point after setup or recovery.
- Canvas explains structure and impact; Review owns exact-version decisions; Timeline owns external intent state.
- Connections governs capabilities, accounts, clients, Tool Packs, and Skills.
- Observation and Memory close the evidence-to-learning loop without silent promotion.
