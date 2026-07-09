"""Convert bookey_logo.pdf from Downloads to src/assets/bookey_logo.svg."""

from pathlib import Path

import fitz

PDF_PATH = Path.home() / "Downloads" / "bookey_logo.pdf"
OUT_PATH = Path(__file__).resolve().parent / "src" / "assets" / "bookey_logo.svg"


def main() -> None:
    if not PDF_PATH.exists():
        raise FileNotFoundError(f"PDF not found: {PDF_PATH}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(PDF_PATH)
    try:
        if doc.page_count < 1:
            raise ValueError(f"PDF has no pages: {PDF_PATH}")

        page = doc[0]
        svg = page.get_svg_image()
        OUT_PATH.write_text(svg, encoding="utf-8")
    finally:
        doc.close()

    print(f"Wrote {OUT_PATH} ({OUT_PATH.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
