#!/usr/bin/env python3
"""
Generate CodeStep icon V4 - amber gradient + white code chevrons.
Matches the new UI: Header logo = amber rounded square + `< >`.

Usage:
  python generate_icon_v4.py master   # 生成 1024 主图 app-icon.png（供 tauri icon 使用）
  python generate_icon_v4.py all      # 主图 + 全尺寸 + ico（tauri icon 之后跑，覆盖小尺寸防模糊）
"""

from PIL import Image, ImageDraw
import os
import sys

ICON_DIR = "D:/workspace/whd/code-type/src-tauri/icons"
MASTER = "D:/workspace/whd/code-type/app-icon.png"

AMBER_TOP = (253, 211, 77)    # #fcd34d
AMBER_MID = (245, 158, 11)    # #f59e0b
ORANGE_DEEP = (234, 88, 12)   # #ea580c
WHITE = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_gradient(size):
    """对角渐变：琥珀金 -> 橙 -> 深橙（与 UI 主色一致）"""
    img = Image.new("RGBA", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size - 2) if size > 1 else 0
            if t < 0.5:
                c = lerp(AMBER_TOP, AMBER_MID, t * 2)
            else:
                c = lerp(AMBER_MID, ORANGE_DEEP, (t - 0.5) * 2)
            px[x, y] = (*c, 255)
    return img


def round_corners(img, r):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=255)
    img.putalpha(mask)
    return img


def draw_chevrons(size, bold=False):
    """4x 超采样绘制 `< >` 双箭头（Header logo 同款几何），缩小抗锯齿"""
    ss = 4
    s = size * ss
    img = make_gradient(s)
    stroke = int(s * (0.13 if bold else 0.095))
    scale = (s * 0.96) / 24.0
    ox = oy = (s - 24 * scale) / 2

    left = [(8, 6), (3, 12), (8, 18)]
    right = [(16, 6), (21, 12), (16, 18)]
    d = ImageDraw.Draw(img)
    r = stroke / 2
    for pts in (left, right):
        p = [(x * scale + ox, y * scale + oy) for x, y in pts]
        d.line(p, fill=WHITE, width=stroke, joint="curve")
        for pt in (p[0], p[2]):
            d.ellipse([pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r], fill=WHITE)

    img = round_corners(img, int(s * 0.2))
    return img.resize((size, size), Image.LANCZOS)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    if mode == "master":
        draw_chevrons(1024).save(MASTER)
        print("master ->", MASTER)
        return

    # all：全尺寸原生渲染 + ico 打包（小尺寸 bold 笔画防糊）
    sizes = {
        "32x32.png": 32,
        "64x64.png": 64,
        "128x128.png": 128,
        "128x128@2x.png": 256,
        "icon.png": 512,
    }
    for name, size in sizes.items():
        draw_chevrons(size, bold=size <= 64).save(os.path.join(ICON_DIR, name))
        print("png ->", name, size)

    ico_sizes = [16, 24, 32, 48, 64, 128, 256]
    imgs = [draw_chevrons(s, bold=s <= 48) for s in ico_sizes]
    imgs[0].save(
        os.path.join(ICON_DIR, "icon.ico"),
        format="ICO",
        append_images=imgs[1:],
        sizes=[(s, s) for s in ico_sizes],
    )
    print("ico ->", ico_sizes)

    draw_chevrons(1024).save(MASTER)
    print("master ->", MASTER)


if __name__ == "__main__":
    main()
