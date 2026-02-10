"""
Generate QR code images for WindChime clips.

Produces QR_001.png through QR_100.png in audio/QR2/.
Each QR code encodes the string "Chime_XXX" which the app uses as the sound ID.

Specs:
  - 300x300 pixels
  - Black on white
  - Error correction: Level M (15%)
"""

import os
import qrcode
from qrcode.constants import ERROR_CORRECT_M

# Paths (absolute)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "audio", "QR2")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# QR code settings
BOX_SIZE = 10       # pixels per QR module
BORDER = 4          # modules of quiet zone (standard)
TARGET_SIZE = 300   # final image size in pixels

count = 0

for i in range(1, 101):
    clip_id = f"Chime_{i:03d}"
    filename = f"QR_{i:03d}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)

    # Create QR code
    qr = qrcode.QRCode(
        version=None,  # auto-size
        error_correction=ERROR_CORRECT_M,
        box_size=BOX_SIZE,
        border=BORDER,
    )
    qr.add_data(clip_id)
    qr.make(fit=True)

    # Generate image and resize to exact 300x300
    img = qr.make_image(fill_color="black", back_color="white")
    img = img.resize((TARGET_SIZE, TARGET_SIZE))
    img.save(filepath)
    count += 1

print(f"Generated {count} QR codes in audio/QR2/")
