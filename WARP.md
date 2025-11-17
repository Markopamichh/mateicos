# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Mateicos is an e-commerce website for selling artisanal mate products (traditional South American tea vessels and accessories). The site is built with vanilla HTML, CSS, and JavaScript, featuring a shopping cart with WhatsApp checkout integration.

## Development Commands

### Version Control
```bash
# Check repository status
git status

# Pull latest changes
git pull origin main

# Stage and commit changes
git add .
git commit -m "Your commit message"

# Push changes to GitHub
git push origin main

# View recent commits
git --no-pager log --oneline -10
```

### Local Development
```bash
# Open the website in default browser (Windows PowerShell)
Start-Process index.html

# Or use Python's simple HTTP server for better development experience
python -m http.server 8000
# Then navigate to http://localhost:8000

# For Node.js users with http-server installed
npx http-server -p 8000
```

### File Management
```bash
# List all HTML files
Get-ChildItem -Path . -Filter "*.html" -Recurse | Select-Object FullName

# List all JavaScript files
Get-ChildItem -Path . -Filter "*.js" -Recurse | Select-Object FullName

# Search for specific text in files (Windows PowerShell)
Select-String -Path "*.html","*.js","*.css" -Pattern "your-search-term" -Recurse
```

### Image Optimization
```bash
# List all images in assets folder
Get-ChildItem -Path ./assets/images -Include *.jpg,*.jpeg,*.png,*.webp -Recurse

# Check image file sizes
Get-ChildItem -Path ./assets/images -Include *.jpg,*.jpeg,*.png,*.webp -Recurse | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

## Architecture and Code Structure

### Project Layout
- **Static Site Architecture**: Pure HTML/CSS/JavaScript without build tools or frameworks
- **Multi-page Application**: Separate HTML files for different product categories
- **Client-side Cart Management**: Shopping cart state managed in localStorage
- **WhatsApp Integration**: Checkout process redirects to WhatsApp with formatted order message

### Directory Structure
```
/
├── index.html                 # Main landing page with hero, products overview, services, reviews
├── pages/                     # Product category pages
│   ├── mates.html            # Mate vessels catalog (Imperial, Torpedo, Camionero styles)
│   ├── bombillas.html        # Metal straws catalog
│   ├── Accesosrios.html      # Accessories catalog (note: filename has typo)
│   └── yerberos.html         # Yerba containers catalog
├── css/                      # Stylesheets
│   ├── styles.css           # Main styles, CSS variables, general layout
│   ├── nav.css              # Navigation and header styles
│   ├── cart.css             # Shopping cart modal styles
│   └── subcategorias.css   # Product category page styles
├── js/
│   └── main.js              # Core functionality: cart management, UI interactions
└── assets/
    └── images/              # Product images, logos, hero images

```

### Key Technical Components

#### Shopping Cart System (`js/main.js`)
- **State Management**: Cart data persisted in localStorage as JSON
- **Product Structure**: Each product has `id`, `name`, `price`, `image`, `quantity`
- **Cart Operations**: 
  - `addToCart()`: Adds products, handles quantity updates for existing items
  - `removeFromCart()`: Removes products completely
  - `updateQuantity()`: Modifies item quantities
  - `clearCart()`: Empties entire cart with confirmation
- **WhatsApp Checkout**: Generates formatted message with order details and redirects to WhatsApp

#### Product Display Pattern
- Products are hardcoded in HTML with inline `onclick` handlers
- Each product button calls `addToCart()` with a product object:
  ```html
  onclick="addToCart({id: 'product-id', name: 'Product Name', price: 30000, image: '../assets/images/product.jpg'})"
  ```

#### Styling Architecture
- **CSS Variables**: Color scheme defined in `:root` selector in `styles.css`
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 480px
- **Component-based CSS**: Separate files for navigation, cart, and subcategories
- **Key Colors**:
  - Primary green: `#264b3a` / `#233c30`
  - Gold accent: `#D4B895`
  - Background beige: `#F8F5F2`

#### Modal System
- Cart modal implemented with vanilla JavaScript
- Event delegation for dynamic cart item controls
- Notifications system with temporary toast messages

### Cross-Page Functionality
- Cart state persists across all pages via localStorage
- Navigation menu consistent across all pages
- Cart count badge updates dynamically
- All product pages share the same JavaScript file (`main.js`)

## Important Considerations

### Current Issues to Address
1. **Filename Typo**: `pages/Accesosrios.html` should be renamed to `Accesorios.html`
2. **Price Inconsistencies**: Product prices differ between `main.js` hardcoded catalog and inline HTML
3. **Image Path Dependencies**: Product pages use relative paths (`../assets/images/`) - be careful when moving files
4. **No Build Process**: Changes to CSS/JS take effect immediately but require manual browser refresh

### WhatsApp Integration Details
- Phone number: +54 299 590-1714 (Argentina)
- Message formatting includes product list, quantities, and total
- URL encoding handled via `encodeURIComponent()`

### localStorage Schema
```javascript
// Cart structure in localStorage
{
  "cart": [
    {
      "id": "mate-imp-1",
      "name": "Mate Imperial",
      "price": 38000,
      "image": "../assets/images/matealgarrobo1.jpg",
      "quantity": 2
    }
  ]
}
```

### SEO and Meta Tags
- Site includes Open Graph tags for social sharing
- Structured data setup started but incomplete (empty Schema.org script)
- Canonical URL: https://mateicos.com
- Primary language: Spanish (es)

## Contact and Business Information
- **Business**: Mateicos - Artisanal mate products from Neuquén, Patagonia, Argentina
- **Email**: mateicos.contacto@gmail.com
- **Phone/WhatsApp**: +54 299 590-1714
- **Instagram**: @mateicos.oficial
- **GitHub Repository**: https://github.com/Markopamichh/mateicos

## Development Tips

### Adding New Products
1. Create product card HTML in appropriate category page
2. Ensure `onclick` handler includes all required fields: `id`, `name`, `price`, `image`
3. Use consistent image paths relative to the page location
4. Prices should be in Argentine Pesos (whole numbers, no decimals)

### Modifying Styles
- Global color changes: Update CSS variables in `styles.css` `:root` selector
- Component-specific changes: Check the appropriate CSS file (nav, cart, subcategorias)
- Mobile responsiveness: Test at 768px and 480px breakpoints

### Debugging Cart Issues
1. Check browser console for errors
2. Inspect localStorage: `localStorage.getItem('cart')`
3. Clear cart data: `localStorage.removeItem('cart')`
4. Verify product object structure in `onclick` handlers