"""Write a trimmed, bold-filtered vector logo from the PDF source export."""

import re
from pathlib import Path

INK = "#121110"
SOURCE = Path(__file__).resolve().parent / "src" / "assets" / "bookey_logo.source.svg"
OUT = Path(__file__).resolve().parent / "src" / "assets" / "bookey_logo.svg"
DILATE = "1.2"  # thicken strokes while preserving cursive detail
PADDING = 2


def read_source() -> str:
    raw = SOURCE.read_bytes()
    if raw.startswith(b"\xff\xfe") or raw.startswith(b"\xfe\xff"):
        return raw.decode("utf-16")
    if raw.startswith(b"\xef\xbb\xbf"):
        return raw.decode("utf-8-sig")
    return raw.decode("utf-8")


def parse_matrix(transform: str) -> tuple[float, float, float, float]:
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

    def add_point(px: float, py: float) -> None:
        points.append((px, py))

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
            add_point(x, y)
            i += 2
            cmd = "L" if cmd == "M" else "l"
            continue
        if cmd in "Ll":
            x, y = float(number), float(tokens[i + 1][1])
            add_point(x, y)
            i += 2
            continue
        if cmd in "Hh":
            x = float(number)
            add_point(x, y)
            i += 1
            continue
        if cmd in "Vv":
            y = float(number)
            add_point(x, y)
            i += 1
            continue
        if cmd in "Cc":
            # control1, control2, end
            x, y = float(tokens[i + 4][1]), float(tokens[i + 5][1])
            add_point(x, y)
            i += 6
            continue
        if cmd in "Zz":
            i += 1
            continue
        i += 1

    return points


def viewbox_for_path(transform: str, d: str) -> str:
    a, b, c, d_, e, f = parse_matrix(transform)
    xs: list[float] = []
    ys: list[float] = []
    for px, py in path_points(d):
        xs.append(a * px + c * py + e)
        ys.append(b * px + d_ * py + f)
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    return (
        f"{min_x - PADDING:.1f} {min_y - PADDING:.1f} "
        f"{max_x - min_x + 2 * PADDING:.1f} {max_y - min_y + 2 * PADDING:.1f}"
    )


def write_svg(transform: str, d: str, viewbox: str, *, bold: bool) -> str:
    path = f'  <path fill="{INK}" transform="{transform}" d="{d}"/>'
    if bold:
        body = f"""<defs>
  <filter id="bold" color-interpolation-filters="sRGB" x="-25%" y="-25%" width="150%" height="150%">
    <feMorphology in="SourceAlpha" operator="dilate" radius="{DILATE}" result="grown"/>
    <feFlood flood-color="{INK}" result="ink"/>
    <feComposite in="ink" in2="grown" operator="in"/>
  </filter>
</defs>
<g filter="url(#bold)">
{path}
</g>"""
    else:
        body = path

    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">\n{body}\n</svg>\n'


def main() -> None:
    text = read_source()
    paths = re.findall(r'<path transform="([^"]+)" d="([^"]+)"', text, re.S)
    match = next(
        ((t, d) for t, d in paths if len(d) > 500 and "-.012599562" in t),
        None,
    )
    if not match:
        raise ValueError("Could not find logo path in source SVG")

    transform, d = match
    viewbox = viewbox_for_path(transform, d)
    svg = write_svg(transform, d, viewbox, bold=True)
    OUT.write_text(svg, encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
    print(f"viewBox={viewbox}")


if __name__ == "__main__":
    main()
