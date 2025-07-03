# 📰 Next.js Article Management App

Proyek ini adalah aplikasi manajemen artikel dengan role **User** dan **Admin**, dibangun menggunakan Next.js dan TailwindCSS. Aplikasi ini mendukung otentikasi, manajemen artikel, dan kategori, dengan fitur pencarian, filter, pagination, serta CRUD lengkap.

---

## 📌 Fitur Lengkap

---

## 1) User

### a) Authentication
- ✅ Login dengan validasi form.
- ✅ Register dengan validasi form.
- ✅ Setelah login/register sukses, redirect ke halaman list artikel.
- ✅ Logout dengan redirect ke halaman login.

### b) List artikel
- ✅ Filter artikel berdasarkan kategori.
- ✅ Searching artikel, dengan debounce (300-500ms).
- ✅ Pagination jika data lebih dari 9 item.

### c) Detail artikel
- ✅ Tampilkan konten lengkap artikel.
- ✅ Other articles, tampilkan maksimal 3 artikel dari kategori yang sama.

---

## 2) Admin

### a) Authentication
- ✅ Login dengan validasi form.
- ✅ Register dengan validasi form.
- ✅ Setelah login/register sukses, redirect ke halaman list artikel admin.
- ✅ Logout dengan redirect ke halaman login.

### b) List categories
- ✅ Searching kategori dengan debounce (300-500ms).
- ✅ Pagination jika data lebih dari 10 item.

### c) Create category
- ✅ Form tambah kategori dengan validasi form.

### d) Edit category
- ✅ Form edit kategori dengan validasi form.

### e) List artikel
- ✅ Filter artikel berdasarkan kategori.
- ✅ Searching artikel dengan debounce (300-500ms).
- ✅ Pagination jika data lebih dari 10 item.

### f) Create article
- ✅ Form tambah artikel dengan validasi form.
- ✅ Tampilkan preview artikel sebelum submit (fetch API).

### g) Edit article
- ✅ Form edit artikel dengan validasi form.
- ✅ Tampilkan preview artikel sebelum submit (fetch API).

---

## 🚀 Cara Menjalankan Proyek

1. **Clone repo ini**
   ```bash
   git clone https://github.com/username/nama-repo.git
   cd nama-repo


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
