"""One-off: thicken the logo strokes (bold) and trace it into a real SVG.

Pipeline: logo.png (transparent) -> upscale -> dilate alpha (bold effect)
-> binary bitmap -> potrace -> SVG paths filled with the sampled ink color.
"""

import numpy as np
import potrace
from PIL import Image, ImageFilter

SRC = "public/logo.png"
DST = "public/logo.svg"

img = Image.open(SRC).convert("RGBA")

# Sample the ink color from opaque pixels
arr = np.array(img)
opaque = arr[arr[:, :, 3] > 200]
ink = tuple(int(c) for c in opaque[:, :3].mean(axis=0))
ink_hex = "#{:02x}{:02x}{:02x}".format(*ink)

# Upscale x2 for a smoother trace, then dilate the alpha to embolden strokes.
img = img.resize((img.width * 2, img.height * 2), Image.LANCZOS)
alpha = img.getchannel("A")
# Two dilation passes ≈ +4px stroke weight at 2x scale (+2px at original size)
alpha = alpha.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MaxFilter(3))
mask = np.array(alpha) > 96

# potracer treats 0 as foreground here; invert so the ink is traced
bmp = potrace.Bitmap(np.logical_not(mask))
path = bmp.trace(turdsize=8, alphamax=1.0, opticurve=1, opttolerance=0.2)

h, w = mask.shape
parts = []
for curve in path:
    sp = curve.start_point
    parts.append(f"M{sp.x:.1f},{sp.y:.1f}")
    for seg in curve:
        ep = seg.end_point
        if seg.is_corner:
            c = seg.c
            parts.append(f"L{c.x:.1f},{c.y:.1f}L{ep.x:.1f},{ep.y:.1f}")
        else:
            c1, c2 = seg.c1, seg.c2
            parts.append(f"C{c1.x:.1f},{c1.y:.1f} {c2.x:.1f},{c2.y:.1f} {ep.x:.1f},{ep.y:.1f}")
    parts.append("Z")

d = "".join(parts)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
    f'width="{w}" height="{h}">\n'
    f'  <path d="{d}" fill="{ink_hex}" fill-rule="evenodd"/>\n'
    f"</svg>\n"
)

with open(DST, "w", encoding="utf-8") as f:
    f.write(svg)

print(f"ink={ink_hex} viewBox=0 0 {w} {h} bytes={len(svg)}")
