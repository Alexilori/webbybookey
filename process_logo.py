"""Build a trimmed, bold SVG for the By-Bookey signature logo."""

from pathlib import Path

import fitz
import numpy as np
import potrace
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent
PDF_PATH = Path.home() / "Downloads" / "bookey_logo.pdf"
SVG_SOURCE = ROOT / "src" / "assets" / "bookey_logo.source.svg"
OUT_PATH = ROOT / "src" / "assets" / "bookey_logo.svg"

INK = "#121110"
SCALE = 4


def rasterize_source() -> Image.Image:
    source = PDF_PATH if PDF_PATH.exists() else SVG_SOURCE
    if not source.exists():
        raise FileNotFoundError(f"No logo source found ({PDF_PATH} or {SVG_SOURCE})")

    doc = fitz.open(str(source))
    try:
        page = doc[0]
        pix = page.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=True)
    finally:
        doc.close()

    return Image.frombytes("RGBA", (pix.width, pix.height), pix.samples)


def main() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    img = rasterize_source()

    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("Logo source rendered empty")
    img = img.crop(bbox)

    alpha = img.getchannel("A")
    alpha = alpha.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MaxFilter(5))
    mask = np.array(alpha) > 56

    bmp = potrace.Bitmap(np.logical_not(mask))
    path = bmp.trace(turdsize=12, alphamax=1.0, opticurve=1, opttolerance=0.15)

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
                parts.append(
                    f"C{c1.x:.1f},{c1.y:.1f} {c2.x:.1f},{c2.y:.1f} {ep.x:.1f},{ep.y:.1f}"
                )
        parts.append("Z")

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}">\n'
        f'  <path d="{"".join(parts)}" fill="{INK}" fill-rule="evenodd"/>\n'
        f"</svg>\n"
    )
    OUT_PATH.write_text(svg, encoding="utf-8")
    print(f"Wrote {OUT_PATH} viewBox=0 0 {w} {h} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
