#!/usr/bin/env python3
"""Rewrite local image assets without EXIF/XMP metadata."""

from pathlib import Path
import sys

from PIL import Image, ImageOps


def strip_metadata(path: Path) -> None:
    with Image.open(path) as img:
        clean = ImageOps.exif_transpose(img)
        if clean.mode not in ("RGB", "L"):
            clean = clean.convert("RGB")
        clean.save(path, format="JPEG", quality=90, optimize=True, progressive=True)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: strip_image_metadata.py <jpg> [<jpg> ...]", file=sys.stderr)
        return 2

    for arg in sys.argv[1:]:
        path = Path(arg)
        if path.suffix.lower() not in {".jpg", ".jpeg"}:
            print(f"skipping non-JPEG: {path}")
            continue
        strip_metadata(path)
        print(f"stripped metadata: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
