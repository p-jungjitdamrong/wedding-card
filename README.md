# Fah & Non — Wedding E-Card

การ์ดเชิญงานมงคลสมรสออนไลน์ (mobile-first) ธีม **Minimal Luxury × Thai Modern**
พิธีเช้า วันเสาร์ที่ 20 มีนาคม 2570 ณ วัดราชนัดดารามวรวิหาร กรุงเทพมหานคร

---

## ★ แก้ข้อความทั้งหมดที่ไฟล์เดียว

```
assets/js/content.js
```

**ข้อความทุกบรรทัดบนเว็บอยู่ในไฟล์นี้** ทั้งชื่อบ่าวสาว กำหนดการ ที่อยู่ ที่จอดรถ
ข้อความในฟอร์ม ข้อความขอบคุณ ไปจนถึงคำอธิบายตอนแชร์ลิงก์
ไม่ต้องแตะ `index.html` หรือ `main.js` เลย

ตัวอย่าง — เพิ่มลำดับพิธี แค่เพิ่มบรรทัดใน `schedule.items`:

```js
{ time: '10:15', unit: 'น.', title: 'ถ่ายภาพหมู่กับแขกผู้มีเกียรติ',
  note: 'Group Photo', highlight: false },
```

### สวิตช์เปิด/ปิดฟอร์มตอบรับ

```js
rsvp: {
  enabled: true,        // false = ซ่อนส่วนตอบรับทั้ง section ไปเลย
  fields: {
    guestCount: true,   // ถามจำนวนผู้ร่วมงานไหม
    slots:      true,   // ถามช่วงพิธีที่สะดวกร่วมไหม
    wishes:     true    // ให้เขียนคำอวยพรไหม
  },
  ...
}
```

ปิดช่องไหน ช่องนั้นหายไปจากฟอร์มและถูกข้ามการตรวจสอบให้อัตโนมัติ

### สวิตช์อื่นที่ใช้บ่อย

| ตำแหน่งใน content.js | ใช้ทำอะไร |
|---|---|
| `event.startISO` / `endISO` | วันเวลางาน — ใช้กับนับถอยหลังและปุ่มบันทึกลงปฏิทิน |
| `rsvp.endpoint` | ว่าง = เก็บลงเครื่องแขก + ให้กดคัดลอกส่ง LINE · ใส่ URL = POST เข้าระบบ |
| `venue.mapsUrl` | ลิงก์ Google Maps ของสถานที่ |
| `info.dress.swatches` | วงกลมตัวอย่างสีชุด เพิ่ม/ลบได้ |
| `music.src` | ไฟล์เพลง — ไม่มีไฟล์ = ปุ่มเพลงซ่อนอัตโนมัติ |
| `monogram` | ตัวอักษรบนโลโก้ประตู |

---

## โครงสร้างไฟล์

```
WeddingCard/
├── index.html              # โครงหน้าเว็บ (ไม่มีข้อความ hardcode)
├── assets/
│   ├── js/content.js       # ★ ข้อความ + สวิตช์ทั้งหมด
│   ├── js/main.js          # ตัวขับเคลื่อน — ปกติไม่ต้องแก้
│   ├── css/style.css       # สไตล์ทั้งหมด
│   ├── audio/              # วางไฟล์ ambient.mp3 ตรงนี้
│   └── img/
└── README.md
```

## เปิดดูในเครื่อง

ดับเบิลคลิก `index.html` ได้เลย หรือถ้าอยากได้ auto-reload ใช้ VS Code + Live Server
(จะรันผ่าน `python3 -m http.server 4321` ก็ได้ แต่ไม่จำเป็น — เว็บไม่ได้พึ่ง Python)

## Deploy ขึ้น GitHub Pages

```bash
git init && git add . && git commit -m "wedding e-card"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

จากนั้นที่ repo → **Settings → Pages → Source: Deploy from a branch → main / (root)**
รอสักครู่จะได้ลิงก์ `https://<user>.github.io/<repo>/`

> เวลาอัปเดตข้อความ: แก้ `content.js` → commit → push แล้วเว็บอัปเดตเอง
> ถ้าเห็นเป็นของเก่าให้เพิ่มเลข version ท้าย `content.js?v=1` ใน index.html เป็น `?v=2`

**ก่อนแชร์ทาง LINE** ควรเพิ่มรูป preview ใน `<head>` ของ index.html:

```html
<meta property="og:image" content="https://<user>.github.io/<repo>/assets/img/preview.jpg" />
```

---

## รายละเอียดทางเทคนิค

- **Landing** — ประตูคู่ 3D (`rotateY` + `perspective`) แตะที่โลโก้ F&N (หรือที่ไหนก็ได้) เพื่อเปิด
  ลำดับ: โลโก้เรืองแสง → แสงลอดตามรอยต่อ → **ประตูผลักเปิดเข้าไปด้านใน** พร้อมบานค่อย ๆ มืดลงตามมุมที่หันหนีแสง
  + กล้องเคลื่อนตามเข้าไป → ลำแสงฟุ้ง → การ์ดซุ้มโค้งลอยขึ้น
- **ลูกเล่นบนการ์ด** — ลำแสงวิ่งรอบขอบทอง (`stroke-dashoffset` + `pathLength`), ดาวประกาย 14 จุดสุ่มตำแหน่ง,
  แสงกวาดทแยงทั้งใบทุก 9 วินาที
- **GSAP** โหลดจาก CDN — ถ้าโหลดไม่ได้จะ fallback ไปใช้ CSS transition อัตโนมัติ
- **prefers-reduced-motion** — ข้าม animation ทั้งหมด แสดงเนื้อหาทันที
- Animation ใช้เฉพาะ `transform` / `opacity` เพื่อรักษา 60fps
- ภาพประกอบเป็น inline SVG ทั้งหมด (โลหะปราสาท, ซุ้มโค้ง, ลายกนก) ไม่มีไฟล์รูปให้โหลด
- Fonts: Great Vibes · Cormorant Garamond · Trirong · Noto Sans Thai (Google Fonts)
- รองรับ `@media print` สำหรับพิมพ์เป็นเอกสาร
