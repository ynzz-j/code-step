#!/usr/bin/env python3
"""
Generate CodeStep icon V3 - fix small-size blur.
Strategy: render each size NATIVELY (not downsample), then pack into .ico.
16/32/48 px: use bolder simpler design.
"""

from PIL import Image, ImageDraw, ImageFont
import os

ICON_DIR = "D:/workspace/whd/code-type/src-tauri/icons"
BLUE = (59, 130, 246)
CYAN = (6, 182, 212)
WHITE = (255, 255, 255)
OUTLINE = (0, 0, 0, 80)

def make_gradient(w, h):
    img = Image.new("RGBA", (w, h))
    for y in range(h):
        for x in range(w):
            t = (x / w * 0.7 + y / h * 0.7)
            if t > 1.0:
                t = 1.0
            r = int(BLUE[0] + (CYAN[0] - BLUE[0]) * t)
            g = int(BLUE[1] + (CYAN[1] - BLUE[1]) * t)
            b = int(BLUE[2] + (CYAN[2] - BLUE[2]) * t)
            img.putpixel((x, y), (r, g, b, 255))
    return img

def round_corners(img, r):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rectangle([r, 0, w - r, h], fill=255)
    d.rectangle([0, r, w, h - r], fill=255)
    d.ellipse([0, 0, 2*r, 2*r], fill=255)
    d.ellipse([w-2*r, 0, w, 2*r], fill=255)
    d.ellipse([0, h-2*r, 2*r, h], fill=255)
    d.ellipse([w-2*r, h-2*r, w, h], fill=255)
    img.putalpha(mask)
    return img

def render_icon(size):
    """Render icon at native size for crisp edges."""
    radius = int(size * 0.2)
    base = make_gradient(size, size)
    base = round_corners(base, radius)
    draw = ImageDraw.Draw(base)

    # Pick font size proportional to icon size
    # For small sizes, use larger proportion of the icon
    font_size = int(size * 0.45)  # ~45% of icon size

    font_paths = [
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    font = None
    for fp in font_paths:
        try:
            font = ImageFont.truetype(fp, font_size)
            break
        except Exception:
            continue
    if font is None:
        font = ImageFont.load_default()

    text = "CS"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2
    y = (size - th) / 2 - bbox[1]

    # For small sizes, skip outline (too cramped)
    if size >= 48:
        ow = max(2, int(size * 0.01))
        for dx in range(-ow, ow + 1):
            for dy in range(-ow, ow + 1):
                if dx*dx + dy*dy <= ow*ow:
                    draw.text((x + dx, y + dy), text, fill=OUTLINE, font=font)

    draw.text((x, y), text, fill=WHITE, font=font)
    return base

def main():
    # Render each size natively
    sizes = [16, 32, 48, 64, 128, 256]
    imgs = []
    for s in sizes:
        print(f"  Rendering {s}x{s} natively...")
        img = render_icon(s)
        imgs.append(img)

    # Save 1024 version for PNG icons
    print("  Rendering 1024x1024 for PNG icons...")
    icon_1024 = render_icon(1024)
    icon_1024.save(os.path.join(ICON_DIR, "icon.png"), "PNG")
    print("  wrote icon.png")

    # Save multi-size ICO
    ico_path = os.path.join(ICON_DIR, "icon.ico")
    # The first image's save method with ICO format and sizes param
    imgs[0].save(ico_path, format="ICO", sizes=[(s, s) for s in sizes])
    print(f"  wrote icon.ico ({sizes})")

    # Also save individual PNG sizes for non-Windows platforms
    for s in [32, 64, 128]:
        img_s = render_icon(s)
        img_s.save(os.path.join(ICON_DIR, f"{s}x{s}.png"), "PNG")
        print(f"  wrote {s}x{s}.png")

    # 128@2x
    img_256 = render_icon(256)
    img_256.save(os.path.join(ICON_DIR, "128x128@2x.png"), "PNG")
    print("  wrote 128x128@2x.png")

    # Windows Store sizes
    for s in [30, 44, 71, 89, 107, 142, 150, 284, 310]:
        img_s = render_icon(s)
        img_s.save(os.path.join(ICON_DIR, f"Square{s}x{s}Logo.png"), "PNG")
        print(f"  wrote Square{s}x{s}Logo.png")

    # StoreLogo
    img_50 = render_icon(50)
    img_50.save(os.path.join(ICON_DIR, "StoreLogo.png"), "PNG")
    print("  wrote StoreLogo.png")

    # icns (macOS) - use 1024
    try:
        icon_1024.save(os.path.join(ICON_DIR, "icon.icns"), format="ICNS")
        print("  wrote icon.icns")
    except Exception as e:
        print(f"  skip icns: {e}")

    # Android
    android_dir = os.path.join(ICON_DIR, "android")
    if os.path.isdir(android_dir):
        android_specs = [
            ("mipmap-hdpi/ic_launcher.png", 72),
            ("mipmap-mdpi/ic_launcher.png", 48),
            ("mipmap-xhdpi/ic_launcher.png", 96),
            ("mipmap-xxhdpi/ic_launcher.png", 144),
            ("mipmap-xxxhdpi/ic_launcher.png", 192),
            ("playstore-icon.png", 512),
        ]
        for rel, s in android_specs:
            path = os.path.join(android_dir, rel)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            img_s = render_icon(s)
            img_s.save(path, "PNG")
            print(f"  wrote android/{rel}")

    # iOS
    ios_dir = os.path.join(ICON_DIR, "ios")
    if os.path.isdir(ios_dir):
        for s in [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024]:
            path = os.path.join(ios_dir, f"AppIcon-{s}.png")
            img_s = render_icon(s)
            img_s.save(path, "PNG")
            print(f"  wrote ios/AppIcon-{s}.png")

    print("\nDone! All icons rendered natively per size.")

if __name__ == "__main__":
    main()
