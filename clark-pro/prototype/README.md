# Clark Studio Prototype

This is the Ground-stratum clickable prototype for the six-view Mac product model:

- Focus
- Canvas
- Timeline
- Review
- Library
- Memory

`index.html` is a standalone artifact generated from the thread visualization source. Open it in a browser to exercise the 50-object Full-Week fixture, angle decisions, downstream-impact preview, version approval, timeline, artifact library, and governed memory proposals.

The prototype validates information architecture and interaction contracts. It is not an alternate implementation path; production work follows the Electron, event, harness, memory, policy, and capability contracts in the authoritative architecture documents.

## Preview

### Focus

![Focus view](preview.png)

### Canvas

![Canvas view](canvas-preview.png)

### Review

![Review view](review-preview.png)

### Memory

![Memory view](memory-preview.png)

## Regenerate

```bash
node render.mjs /absolute/path/to/clark-studio.html index.html
```

## Review checklist

Use [prototype-evaluation.md](prototype-evaluation.md) during walkthroughs. Record evidence rather than treating the existence of the prototype as proof that the canvas gate passed.

Automated interaction, responsive-layout, and visual checks are recorded in [verification.md](verification.md).
