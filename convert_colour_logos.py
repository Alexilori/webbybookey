"""Export colour Bookey logo PDFs from Downloads to trimmed src/assets SVGs."""

import re
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent
DOWNLOADS = Path.home() / "Downloads"
PADDING = 4

SOURCES = {
    "bookey_logo_dark.svg": sorted(
        DOWNLOADS.glob("bookey_full_logo_bold*.pdf"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    ),
    "bookey_logo_light.svg": sorted(
        DOWNLOADS.glob("bookey_full_logo_transparent*.pdf"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    ),
}


def parse_matrix(transform: str) -> tuple[float, float, float, float, float, float]:
    nums = [float(n) for n in re.findall(r"[-+]?(?:\d*\.\d+|\d+)", transform)]
    if len(nums) != 6:
        raise ValueError(f"Unexpected transform: {transform}")
    return nums[0], nums[1], nums[2], nums[3], nums[4], nums[5]


def path_points(d: str) -> list[tuple[float, float]]:
    tokens = re.findall(
        r"([MmLlHhVvCcSsQqTtAaZz])|([-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)",
        d,
    )
    points: list[tuple[float, float]] = []
    x = y = 0.0
    i = 0
    cmd = "M"

    while i < len(tokens):
        letter, number = tokens[i]
        if letter:
            cmd = letter
            i += 1
            continue
        if number is None:
            i += 1
            continue

        if cmd in "Mm":
            x, y = float(number), float(tokens[i + 1][1])
            points.append((x, y))
            i += 2
            cmd = "L" if cmd == "M" else "l"
            continue
        if cmd in "Ll":
            x, y = float(number), float(tokens[i + 1][1])
            points.append((x, y))
            i += 2
            continue
        if cmd in "Hh":
            x = float(number)
            points.append((x, y))
            i += 1
            continue
        if cmd in "Vv":
            y = float(number)
            points.append((x, y))
            i += 1
            continue
        if cmd in "Cc":
            x, y = float(tokens[i + 4][1]), float(tokens[i + 5][1])
            points.append((x, y))
            i += 6
            continue
        if cmd in "Zz":
            i += 1
            continue
        i += 1

    return points


def trim_svg(svg: str) -> str:
    paths = re.findall(
        r'<path[^>]*transform="([^"]+)"[^>]*d="([^"]+)"',
        svg,
        re.S,
    )
    if not paths:
        raise ValueError("No paths found in exported SVG")

    xs: list[float] = []
    ys: list[float] = []
    for transform, d in paths:
        a, b, c, d_, e, f = parse_matrix(transform)
        for px, py in path_points(d):
            xs.append(a * px + c * py + e)
            ys.append(b * px + d_ * py + f)

    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    viewbox = (
        f"{min_x - PADDING:.1f} {min_y - PADDING:.1f} "
        f"{max_x - min_x + 2 * PADDING:.1f} {max_y - min_y + 2 * PADDING:.1f}"
    )

    trimmed = re.sub(
        r'<svg([^>]*)\s+width="[^"]*"\s+height="[^"]*"\s+viewBox="[^"]*"',
        rf'<svg\1 viewBox="{viewbox}"',
        svg,
        count=1,
    )
    trimmed = re.sub(r"<defs>.*?</defs>\s*", "", trimmed, count=1, flags=re.S)
    trimmed = re.sub(r' clip-path="url\(#clip_1\)"', "", trimmed)
    return trimmed


def main() -> None:
    out_dir = ROOT / "src" / "assets"
    out_dir.mkdir(parents=True, exist_ok=True)

    for out_name, matches in SOURCES.items():
        if not matches:
            raise FileNotFoundError(f"No PDF found for {out_name}")
        pdf_path = matches[0]
        doc = fitz.open(pdf_path)
        try:
            if doc.page_count < 1:
                raise ValueError(f"PDF has no pages: {pdf_path}")
            svg = trim_svg(doc[0].get_svg_image())
        finally:
            doc.close()

        out_path = out_dir / out_name
        out_path.write_text(svg, encoding="utf-8")
        print(f"Wrote {out_path.name} from {pdf_path.name} ({out_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
