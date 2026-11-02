"""Re-export the website's existing image set at native PDF resolution.
Optional maintenance tool: requires PyMuPDF and Pillow. Never upscales.
"""
from pathlib import Path
import io
import json
import re
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
pdf = fitz.open(ROOT / 'assets/ImpactReport26_Complete.pdf')
used = sorted(set(re.findall(r'p\d{2}-\d{2}', (ROOT / 'app.js').read_text() + (ROOT / 'data.js').read_text())))
prior = {row['file']: row for row in json.loads((ROOT / 'docs/image-audit.json').read_text())} if (ROOT / 'docs/image-audit.json').exists() else {}
rows = []
for name in used:
    page_number, index = map(int, name[1:].split('-'))
    entry = pdf[page_number - 1].get_images(full=True)[index]
    target = ROOT / 'assets/media' / f'{name}.webp'
    before = prior.get(str(target.relative_to(ROOT)), {}).get('previous_pixels') or (list(Image.open(target).size) if target.exists() else None)
    pix = fitz.Pixmap(pdf, entry[0])
    if pix.colorspace and pix.colorspace.n != 3:
        pix = fitz.Pixmap(fitz.csRGB, pix)
    if entry[1]:
        pix = fitz.Pixmap(pix, fitz.Pixmap(pdf, entry[1]))
    image = Image.frombytes('RGBA' if pix.alpha else 'RGB', (pix.width, pix.height), pix.samples)
    image.save(target, 'WEBP', quality=84, method=6)
    rows.append({'file': str(target.relative_to(ROOT)), 'pdf_spread': page_number, 'xref': entry[0], 'previous_pixels': before, 'native_pixels': list(image.size), 'bytes': target.stat().st_size})
(ROOT / 'docs/image-audit.json').write_text(json.dumps(rows, indent=2) + '\n')
print(f'Exported {len(rows)} native-resolution WebP images at quality 84; no upscaling.')
for row in rows:
    if row['previous_pixels'] != row['native_pixels']:
        print(row['file'], row['previous_pixels'], '->', row['native_pixels'])
