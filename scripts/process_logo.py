"""One-off: make the logo's cream background transparent and trim it.

Reads the raw logo PNG, treats the background color (sampled from the
corners) as transparent with a soft tolerance ramp so the script edges
stay smooth, crops to the ink with a small margin, and writes
public/logo.png.
"""

import sys
from PIL import Image

SRC = sys.argv[1]
DST = sys.argv[2]

img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size

# Sample background color from the four corners
corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
bg = tuple(sum(c[i] for c in corners) // 4 for i in range(3))

NEAR = 28   # fully transparent below this distance
FAR = 90    # fully opaque above this distance

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        dist = max(abs(r - bg[0]), abs(g - bg[1]), abs(b - bg[2]))
        if dist <= NEAR:
            px[x, y] = (r, g, b, 0)
        elif dist < FAR:
            alpha = int(255 * (dist - NEAR) / (FAR - NEAR))
            px[x, y] = (r, g, b, alpha)

# Crop to content with a margin
bbox = img.getbbox()
if bbox:
    margin = 12
    left = max(0, bbox[0] - margin)
    top = max(0, bbox[1] - margin)
    right = min(w, bbox[2] + margin)
    bottom = min(h, bbox[3] + margin)
    img = img.crop((left, top, right, bottom))

img.save(DST, "PNG")
print(f"bg={bg} size={img.size} -> {DST}")
