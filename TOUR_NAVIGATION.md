# Tour navigation operations

## Scope

The canonical GitHub Pages application is served from the repository root.
The legacy `app-files/` export is retained unchanged for rollback and archive
purposes; it must not be edited in parallel with the root application.

## Safety and rollback

- Baseline branch: `backup/pre-mobile-tour-navigation-20260722`
- Working branch: `agent/mobile-tour-navigation`
- Production branch: `main`
- The production site changes only after the pull request is reviewed and
  merged.
- To roll back after a merge, restore the four root application files and
  `data.js` from the baseline branch. Panorama tiles are not modified.

## Navigation model

- Desktop uses a persistent grouped sidebar.
- Mobile uses a bottom route bar and an expandable bottom sheet.
- Previous and next controls always display both the destination group and
  scene name.
- The complete route is defined in `tour-config.js`.
- Corrected labels are display-only. Original scene IDs stay unchanged so tile
  URLs remain compatible.
- The current scene is stored in the URL as `#scene=<scene-id>` and can be
  shared or restored with browser Back/Forward.

## Editing the route

1. Open `tour-config.js`.
2. Move scene IDs between `groups[].scenes` to change categories or order.
3. Update `names` to change visitor-facing labels.
4. Do not rename scene IDs unless the corresponding directory inside `tiles/`
   is renamed at the same time.
5. Keep every scene ID in exactly one group. Unmapped scenes are placed in an
   automatic `Other areas` group as a safe fallback.

## Spatial doorway hotspots

The interface supports Marzipano `linkHotspots` if doorway coordinates are
added later. They use the same custom accessible styling. Route controls do not
pretend that two physically separate hotel areas are adjacent: they provide a
curated tour sequence instead.

## Validation checklist

- `node --check index.js`
- `node --check tour-config.js`
- `git diff --check`
- Confirm all 51 scenes appear once in `tour-config.js`.
- Confirm desktop at widths 1024, 1280 and 1440 pixels.
- Confirm mobile at widths 320, 375 and 430 pixels.
- Confirm portrait and landscape orientation.
- Confirm Previous and Next show the destination before activation.
- Confirm Explore opens and closes with touch, Escape and the close button.
- Confirm keyboard focus stays inside the open mobile sheet.
- Confirm browser Back and Forward restore the previous scene.
- Confirm automatic rotation is off at startup and remains user-controlled.
- Confirm `prefers-reduced-motion` disables decorative animation.
- Confirm no files under `tiles/` or `app-files/` changed.
