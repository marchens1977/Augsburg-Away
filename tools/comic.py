"""Macht aus einem Foto ein Comic-Porträt im Retro-Look für die Startseite.
Aufruf: python3 tools/comic.py EINGANG.jpg AUSGANG.jpg links oben rechts unten
(links/oben/rechts/unten = Ausschnitt in Pixeln, am besten Hochformat 3:4)"""
import sys
from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageChops

def comic(src, dst, box):
    img = Image.open(src).convert('RGB').crop(box).resize((480, 640), Image.LANCZOS)
    smooth = img.filter(ImageFilter.MedianFilter(5))
    color = ImageEnhance.Color(smooth).enhance(1.6)
    color = ImageEnhance.Contrast(color).enhance(1.25)
    color = ImageOps.posterize(color, 4)
    # Konturen (schwarze Comic-Linien)
    edges = img.convert('L').filter(ImageFilter.GaussianBlur(1.2)).filter(ImageFilter.FIND_EDGES)
    edges = ImageOps.invert(ImageEnhance.Contrast(edges).enhance(4)).point(lambda p: 255 if p > 150 else p * 0.4)
    out = ImageChops.multiply(color, edges.convert('RGB'))
    # Abendsonnen-Tönung (pink/orange)
    tint = Image.new('RGB', out.size, (255, 120, 170))
    out = Image.blend(out, ImageChops.multiply(out, tint), 0.25)
    out.save(dst, quality=85)

if __name__ == '__main__':
    comic(sys.argv[1], sys.argv[2], tuple(int(v) for v in sys.argv[3:7]))
