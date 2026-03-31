# Nawa POS

بداية عملية لمشروع POS مبني بـ `React + Node.js` مع تجهيز قاعدة البيانات على `SQL Server` وتخزين الصور في مجلد خارجي اسمه `المرفقات`.

## قاعدة البيانات

- المحرك المستهدف: `SQL Server`
- النسخة المناسبة المجانية: `SQL Server Express`
- ORM: `Prisma`
- ملف الـ schema: `prisma/schema.prisma`

### الإعداد

1. انسخ `.env.example` إلى `.env`
2. عدل قيمة `DATABASE_URL` بما يناسب جهازك أو السيرفر
3. شغل:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## الصور والمرفقات

- أي صور أو ملفات للبرنامج يتم تخزينها داخل مجلد `المرفقات`
- قاعدة البيانات تخزن `metadata + relativePath` فقط
- الرفع يتم عبر `POST /api/attachments`

## أوامر التشغيل

```bash
npm run server
npm run dev
```

## ملاحظات مهمة

- الخادم الحالي فيه تجهيز SQL Server والمرفقات، لكن باقي وحدات النظام ما زالت في مرحلة بناء تدريجي.
- الهدف من هذا التعديل هو تثبيت اتجاه الإنتاج الصحيح: `SQL Server + filesystem attachments`.
- بيانات الدخول الافتراضية بعد الـ seed:

```text
admin / Admin@123
cashier01 / 123456
NFC: CARD-0148
```
