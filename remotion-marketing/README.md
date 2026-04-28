# Quick Audit — Marketing GIFs (Remotion)

Renders three short loops at **1960×876** (4× of 490×219 — resize anywhere without quality loss).

## Compositions

| ID            | Duration | Shows                                                |
|---------------|----------|------------------------------------------------------|
| `CustomizeView` | 6s       | Edit Summary mode → drag-reorder a field → hide one |
| `HoverIssue`    | 5s       | Hover a flagged field → source-diff tooltip appears |
| `ClickToFlag`   | 6s       | Click a flag → PDF navigates → highlight overlays    |

## Setup

```bash
cd remotion-marketing
npm install
```

## Develop

```bash
npm run dev    # opens Remotion Studio for live preview
```

## Render

```bash
# MP4 (recommended — sharp + small)
npm run build:customize
npm run build:hover
npm run build:click

# GIF (fallback for places that don't autoplay video)
npm run build:gif:customize
npm run build:gif:hover
npm run build:gif:click

# Everything
npm run build:all
```

Outputs land in `out/`. Each MP4 is ~200 KB; each GIF is ~1–3 MB.
