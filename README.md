# Азын сугалаа — Lucky draw full-stack demo

Promotional lucky-draw campaign site: users submit VAT receipts; admins review entries and run a weighted random draw on a spinning wheel. Stack: **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **Express**, **MongoDB**, **JWT**, **Multer**.

## Project structure

```
Bosa-CPN/
├── README.md                 # This file
├── frontend/                 # Next.js App Router
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Public homepage (Mongolian sections)
│   │   ├── globals.css
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       ├── dashboard/page.tsx   # Submissions, approve/reject, delete
│   │       └── draw/page.tsx        # Pool selection + spin wheel
│   ├── components/
│   │   ├── FloatingDecor.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowToParticipate.tsx
│   │   ├── PrizeSection.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── WinnersSection.tsx
│   │   ├── SubmitReceiptForm.tsx
│   │   ├── SiteFooter.tsx
│   │   └── admin/SpinWheel.tsx
│   └── lib/
│       ├── constants.ts       # Nav labels, prizes, 9 products
│       └── api.ts             # REST helpers + auth header
├── backend/                  # Express API
│   ├── package.json
│   ├── uploads/               # Local receipt files (Multer)
│   └── src/
│       ├── index.js           # Server, CORS, static /uploads
│       ├── db.js
│       ├── multerConfig.js
│       ├── seed.js            # Optional dummy data
│       ├── seedAdmin.js       # `node src/seedAdmin.js user pass`
│       ├── middleware/auth.js
│       ├── models/
│       │   ├── Submission.js
│       │   ├── Winner.js
│       │   └── Admin.js
│       └── routes/
│           ├── submissions.js
│           ├── admin.js
│           ├── winners.js
│           └── draw.js
└── .gitignore
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a connection string (MongoDB Atlas)

## Setup

### 1. MongoDB

Start local MongoDB, or create a cluster and copy the URI.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, CORS_ORIGIN, optional ADMIN_USERNAME / ADMIN_PASSWORD
npm install
npm run dev
```

On first start, if no admin exists, a default admin is created from `ADMIN_USERNAME` / `ADMIN_PASSWORD` (defaults: `admin` / `admin123`). Change the password in production.

**API (examples)**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/user/register` | — | JSON: `phone`, `password` (≥6), optional `email`, `age` → `{ token, user }` |
| POST | `/api/user/login` | — | JSON: `phone`, `password` → `{ token, user }` |
| GET | `/api/user/me` | User JWT | Profile `{ phone, email, age }` |
| GET | `/api/submissions/mine` | User JWT | Current user’s submissions |
| POST | `/api/submissions` | User JWT | Multipart: `receiptNumber` (e.g. `AA00000000`), `totalAmount`, `receipt` (image); phone/email from account |
| GET | `/api/submissions` | JWT | Optional `?status=pending|approved|rejected` |
| PATCH | `/api/submissions/:id/status` | JWT | JSON `{ "status": "approved" \| "rejected" \| "pending" }` |
| DELETE | `/api/submissions/:id` | JWT | Delete submission |
| POST | `/api/admin/login` | — | JSON `{ username, password }` → `{ token }` |
| GET | `/api/admin/users` | Admin JWT | All registered campaign users (no password fields) |
| DELETE | `/api/admin/users/:id` | Admin JWT | Deletes user and all submissions linked to that user |
| GET | `/api/admin/me` | JWT | Current admin |
| GET | `/api/winners` | — | Public winners list |
| GET | `/api/draw/pool` | JWT | Eligible approved participants (excludes phones already winners) |
| POST | `/api/draw/spin` | JWT | JSON `{ prizeName, submissionIds?: string[] }` |

Uploaded files are served at `http://localhost:5000/uploads/...`.

**Optional dummy data**

```bash
cd backend
npm run seed
```

Creates sample submissions and one public winner row (plus internal `__dummy__` test rows you can delete in admin).

**Create/reset admin password**

```bash
node src/seedAdmin.js myuser mypassword
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Users submit receipts at [http://localhost:3000/barimt](http://localhost:3000/barimt) (also linked from the header as **Баримт оруулах**). Admin entry (no public header link): [http://localhost:3000/admin](http://localhost:3000/admin). `/admin/login` redirects to `/admin`.

### 4. Production notes

- Set strong `JWT_SECRET` and secure MongoDB.
- Serve the API over HTTPS; set `CORS_ORIGIN` to your frontend origin(s), comma-separated if needed.
- For scalable file storage, replace Multer disk storage with S3/Cloudinary and store the resulting URL in `receiptImage`.
- Run `next build && next start` for the frontend and `npm start` for the backend.

## Homepage sections (public)

Header menu labels and sections match the brief: **Үндсэн нүүр**, **Хэрхэн оролцох вэ?**, **Шагналууд**, **Ялагчид**, **Урамшууллын бүтээгдэхүүнүүд**, **Баримт оруулах** — plus hero, prize pool copy, animated product grid, winners, and receipt form.

## License

Use freely for your campaign; adjust branding and legal copy as required.
