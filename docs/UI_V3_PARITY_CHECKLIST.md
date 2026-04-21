# UI V3 Parity Checklist

## Functional parity
- [ ] Home route contains suite progress and tool access.
- [ ] Tools hub lists all engine routes.
- [ ] Each engine route resolves and links to its legacy equivalent.
- [ ] Theme preference persists across refresh.

## Data/persistence parity
- [ ] Existing DataStore keys remain untouched in legacy engine handoff.
- [ ] No mutation of legacy storage schema from V3 shell.

## Export parity
- [ ] Legacy exports remain accessible from linked engine pages.
- [ ] Report content remains unchanged in legacy outputs.

## Accessibility baseline
- [ ] Keyboard navigation works in header nav and route content.
- [ ] Contrast of tokenized surfaces verified in all theme variants.
- [ ] Reduced-motion behavior documented for animation enhancements.

## Performance baseline
- [ ] Initial route payload measured.
- [ ] Route transition remains under target budget on mobile hardware.
