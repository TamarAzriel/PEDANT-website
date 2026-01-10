New-Item -ItemType Directory -Force -Path "css", "js", "images"
Move-Item -Path "styles.css" -Destination "css/"
Move-Item -Path "auth.js", "cart.js", "checkout.js", "products.js", "profile.js" -Destination "js/"
Get-ChildItem -Path "." -Include "*.png", "*.jpg", "*.webp" -Exclude "logo.png", "cart.png", "instagram.png" | Move-Item -Destination "images/"
# Also move the specific icons to images/
Move-Item -Path "logo.png", "cart.png", "instagram.png", "logo biopeptix.jpg", "logo dermalosophy.jpg", "logo renew.jpg", "imagesbox.png" -Destination "images/"
