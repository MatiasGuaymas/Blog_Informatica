# E03 Prerequisites graph

| Status | Priority | Area | Issue |
|---|---|---|---|
| Planned | Medium | prerequisites-graph | [#27](https://github.com/MatiasGuaymas/Blog_Informatica/issues/27) |

## Goal

Make the prerequisites graph useful on every device and for planning: operable by touch, able to show the whole chain behind a subject, shareable as an image and cheap to load.

## Problem

- Highlighting runs only on mouse hover (onNodeMouseEnter and onNodeMouseLeave) and a click navigates at once, so on phones a tap leaves the graph without ever showing the highlight.
- The highlight covers direct neighbors only: for TTPS in APU it shows 6 prerequisites while the full chain has 17.
- There is no way to save or share the graph.
- CorrelativasGraph is imported statically, so a chunk of about 60 KB gzip with @xyflow/react ships with every career page even if the dialog never opens.

## Scope

**In scope**

- Touch interaction model.
- PNG export.
- Full chain highlight.
- Lazy loading of the graph code.

**Out of scope**

- Replacing the custom layout with another library.
- Nodes or edges for elective placeholders.
- Editing prerequisites from the graph.

## Success criteria

- Tap-to-highlight works on current iOS Safari and Android Chrome.
- Hovering or selecting a subject highlights its full chain.
- Any career graph exports to PNG.
- First-load JS of /carreras/[carrera] drops by about the size of the graph chunk.

## Features

| Key | Feature | Size | Priority | Issue |
|---|---|---|---|---|
| E03-F01 | Make the prerequisites graph usable with touch gestures | M | High | [#28](https://github.com/MatiasGuaymas/Blog_Informatica/issues/28) |
| E03-F02 | Export the prerequisites graph as a PNG image | M | Low | [#29](https://github.com/MatiasGuaymas/Blog_Informatica/issues/29) |
| E03-F03 | Highlight the full prerequisite chain of a subject | S | Medium | [#30](https://github.com/MatiasGuaymas/Blog_Informatica/issues/30) |
| E03-F04 | Load the prerequisites graph code only when the dialog opens | S | Medium | [#31](https://github.com/MatiasGuaymas/Blog_Informatica/issues/31) |

## Dependencies

- E01-F03 (graph split) is recommended first.
- E03-F03 defines what E03-F01 highlights.

## Risks

- Touch gestures can conflict with dialog scrolling and with the edge swipe that opens the mobile sidebar.
- The image export library adds weight unless it is loaded on demand.
