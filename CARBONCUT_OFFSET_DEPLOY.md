# CARBONCUT — Carbon Footprint Tracking & Validated Offset Order Portal

Static web application demonstrating **JavaScript Form Validation** (`onsubmit`, `oninput`, conditional `if/else` checks, and live field highlighting), an interactive **Carbon Offset Order & Billing** calculator (`Rs.`), a **Carbon Footprint Tracking Calculator**, and a live JavaScript **CRUD** task checklist.

## Files Included
- `index.html` — Root HTML entry point for GitHub Pages and Vercel.
- `carboncut_offset_catalog.css` — Responsive storefront catalog, validated form, total bill badge, and checklist styles.
- `carboncut_validation_billing.js` — Real-time `oninput` / `onsubmit` validation, order bill computation, carbon calculator, and CRUD task array (`addTask()`).
- `vercel.json` — Zero-config Vercel static deployment configuration.

## GitHub & Vercel Deployment Steps
1. Extract `carboncut_offset_order_portal.zip` and open a terminal inside `carboncut_offset_order_portal`.
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add CARBONCUT validated offset order website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/carboncut-offset-order-portal.git
   git push -u origin main
   ```
3. Open [vercel.com](https://vercel.com), click **Add New → Project**, import `carboncut-offset-order-portal`, keep Framework Preset as **Other**, and click **Deploy**.
