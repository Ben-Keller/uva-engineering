# Folio launch checks

Checked November 2, 2026.

- Selected Folio as the only shipped design. Removed the rail, alternate navigation/booklet studies, page scans, unused media and historical screenshots.
- Static validation checks JavaScript syntax, all 13 chapter targets, used image references, the PDF, the preview entrance and indexing metadata.
- The build copies only deployable files to `dist/`; relative links support a GitHub Pages project path.
- Browser smoke checks cover incorrect/correct passwords, deferred report loading, tab-session persistence, locking, direct chapter links, hover/tap/keyboard navigation, search, student teams, ventures, research gallery, revenue selection, leadership profiles, all rendered images, and PDF availability.
- Responsive checks cover widths from 320 to 1440 pixels. Reduced-motion navigation is exercised.
- Photos are exported from the original PDF as WebP at quality 84 and native pixel dimensions. No upscaling is used. See `docs/image-audit.json`.

The client-preview password is a browser-side courtesy gate, not access control. The complete PDF remains a direct download. This work includes functional and visual checks, not a complete assistive-technology audit or university editorial sign-off.
