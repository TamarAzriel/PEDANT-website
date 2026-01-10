@echo off
mkdir css
mkdir js
mkdir images

move styles.css css\
move auth.js js\
move cart.js js\
move checkout.js js\
move products.js js\
move profile.js js\

move *.png images\
move *.jpg images\
move *.webp images\
move *.jpg.webp images\
move *.png.webp images\
move *.jpg.png images\

echo Done.
