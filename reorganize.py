import os
import shutil

# Directories to create
dirs = ['css', 'js', 'images']
for d in dirs:
    if not os.path.exists(d):
        os.makedirs(d)

# Move CSS
if os.path.exists('styles.css'):
    shutil.move('styles.css', 'css/styles.css')

# Move JS
js_files = ['auth.js', 'cart.js', 'checkout.js', 'products.js', 'profile.js']
for f in js_files:
    if os.path.exists(f):
        shutil.move(f, f'js/{f}')

# Move images
image_extensions = ('.png', '.jpg', '.webp', '.png.webp', '.jpg.webp', '.jpg.png')
for f in os.listdir('.'):
    if f.lower().endswith(image_extensions):
        shutil.move(f, f'images/{f}')

print("Reorganization complete!")
