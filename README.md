# Premium Tee E-commerce

Full-stack T-shirt e-commerce project with a premium React storefront, Express/MySQL backend, KHQR checkout flow, and admin dashboard.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MySQL, JWT, Multer
- Database: MySQL schema + seed SQL
- Admin: secure login, dashboard metrics, product CRUD, order status management

## Folder structure

```text
.
|-- frontend/
|-- backend/
|-- database/
|-- README.md
```

## Features

- Responsive storefront with hero section, featured products, search, filters, sale badges, and pagination
- Product detail page with gallery, size selection, and add-to-cart flow
- Cart, checkout, KHQR payment QR, screenshot upload, and order success flow
- Contact page with Telegram, Facebook, and click-to-call phone support
- Dark/light mode toggle
- SEO metadata via `react-helmet-async`
- Coupon support with sample codes: `SAVE10`, `VIP15`
- Admin login, product add/edit/delete, order verification, status updates, and sales dashboard

## API endpoints

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/order`
- `POST /api/admin/login`
- `POST /api/products/admin/product/add`
- `PUT /api/products/admin/product/:id`
- `DELETE /api/products/admin/product/:id`
- `POST /api/admin/order/update/:id`
- `GET /api/admin/orders`
- `GET /api/admin/dashboard`

## Database setup

1. Create a MySQL database server locally or use PlanetScale.
2. Run [`database/schema.sql`](C:\Users\langv\Documents\New project\database\schema.sql).
3. Run [`database/seed.sql`](C:\Users\langv\Documents\New project\database\seed.sql).

Seed admin credentials:

- Username: `admin`
- Password: `admin123`

## Local setup

### 1. Backend

1. Copy [`backend/.env.example`](C:\Users\langv\Documents\New project\backend\.env.example) to `backend/.env`.
2. Fill in MySQL credentials and `JWT_SECRET`.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the API:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

1. Copy [`frontend/.env.example`](C:\Users\langv\Documents\New project\frontend\.env.example) to `frontend/.env`.
2. Adjust social/contact links and KHQR payload if needed.
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Deployment

### Frontend to Vercel

1. Import the `frontend` folder into Vercel.
2. Set environment variables from [`frontend/.env.example`](C:\Users\langv\Documents\New project\frontend\.env.example).
3. Build command: `npm run build`
4. Output directory: `dist`
5. The included [`vercel.json`](C:\Users\langv\Documents\New project\frontend\vercel.json) keeps React routes working on refresh.

### Backend to Render or Railway

1. Import the `backend` folder into Render or Railway.
2. Set environment variables from [`backend/.env.example`](C:\Users\langv\Documents\New project\backend\.env.example).
3. Start command: `npm start`
4. Add a persistent disk if you want uploaded screenshots stored beyond deploys. Otherwise use external object storage.
5. A starter [`render.yaml`](C:\Users\langv\Documents\New project\render.yaml) is included for Render deployment.

### Database

- Local MySQL: use the included SQL files.
- PlanetScale: create a database, run the schema/seed, and update backend env values.

## Notes

- `payment_screenshot` is uploaded to `backend/uploads`.
- KHQR verification is manual through the admin dashboard.
- Email notification is left optional and not wired to an SMTP provider in this scaffold.
- Telegram notification is supported through `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the backend env.
- For production, add rate limiting, stricter image storage, HTTPS-only cookies if moving auth to cookies, and server-side coupon management.
- Update [`frontend/public/robots.txt`](C:\Users\langv\Documents\New project\frontend\public\robots.txt) and [`frontend/public/sitemap.xml`](C:\Users\langv\Documents\New project\frontend\public\sitemap.xml) with your final live domain before asking Google to index the site.

## Google Indexing

1. Deploy the frontend to its final public URL.
2. Replace `https://your-frontend-domain.vercel.app` in:
   - [`frontend/.env.example`](C:\Users\langv\Documents\New project\frontend\.env.example)
   - [`frontend/public/robots.txt`](C:\Users\langv\Documents\New project\frontend\public\robots.txt)
   - [`frontend/public/sitemap.xml`](C:\Users\langv\Documents\New project\frontend\public\sitemap.xml)
3. In Google Search Console, add your final site URL as a property.
4. Submit `/sitemap.xml`.
5. Request indexing for the home page and key pages like `/shop` and `/contact`.

## Ready files

- Backend entry: [`backend/server.js`](C:\Users\langv\Documents\New project\backend\server.js)
- Frontend entry: [`frontend/src/App.jsx`](C:\Users\langv\Documents\New project\frontend\src\App.jsx)
- SQL schema: [`database/schema.sql`](C:\Users\langv\Documents\New project\database\schema.sql)
- SQL seed: [`database/seed.sql`](C:\Users\langv\Documents\New project\database\seed.sql)
