# ระบบบริหารจัดการคำขอทุนการศึกษา (Scholarship Request Management System)

## สารบัญ

- [Tech Stack](#เทคโนโลยีที่ใช้)
- [Project Structure](#โครงสร้างโปรเจกต์)
- [การติดตั้งและรันระบบด้วย Docker Compose](#การติดตั้งและรันระบบ)
- [การตั้งค่า Environment Variables](#environment-variables)
- [บัญชีผู้ใช้ทดสอบ](#บัญชีผู้ใช้ทดสอบ)
- [การนำเข้าข้อมูลตัวอย่าง (Seed Data)](#การนำเข้าข้อมูลตัวอย่าง-seed-data)
- [ฟีเจอร์ที่พัฒนา](#ฟีเจอร์ที่พัฒนา)
- [ฟีเจอร์เสริม](#ฟีเจอร์เสริม)
- [เอกสารออกแบบระบบ](#เอกสารออกแบบระบบ)
---

## เทคโนโลยีที่ใช้

| ส่วนประกอบ | เทคโนโลยี |
|---|---|
| Frontend | React.js  |
| Backend | .NET 10 API  |
| Database | PostgreSQL 18.6 |
| ORM | EF Core |
| Container | Docker, Docker Compose |
| Library | Recharts, Axios, MUI, Zod, Sweetalert2  |

---

## โครงสร้างโปรเจกต์

```
.
├── SRMFrontend/   # โค้ดฝั่ง Frontend
├── Backend/       # โค้ดฝั่ง Backend / RESTful API
├── Backend/SRMBackend/init-db  # Seed scripts
├── docs/    # ER Diagram, Architecture
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## การติดตั้งและรันระบบ

### สิ่งที่ต้องมีก่อนเริ่ม (Prerequisites)

- [Docker](https://www.docker.com/) และ Docker Compose
- (ถ้ามี) Node.js เวอร์ชัน 26.7.0 ขึ้นไป สำหรับการรันแบบไม่ใช้ Docker

### ขั้นตอนการติดตั้งและรัน

1. Clone repository

   ```bash
   git clone https://github.com/takorn47/Scholarship-Request-Management.git

   cd Scholarship-Request-Management
   ```

2. คัดลอกไฟล์ .env

   ```bash
   cp .env.example .env
   ```

   จากนั้นแก้ไขค่าตัวแปรใน `.env` ตามต้องการ (ดูรายละเอียดหัวข้อ [environment-variables](#environment-variables))

3. รันระบบ

   ```bash
   docker compose build --no-cache

   docker compose up -d
   ```

4. เข้าใช้งานระบบ

   | ส่วน | URL |
   |---|---|
   | หน้าเว็บ (Frontend) | http://localhost:3000 |
   | REST API (Backend) | http://localhost:8080 |
   | PostgreSQL | localhost:5432 |

5. หยุดการทำงานของระบบ

   ```bash
   docker compose down -v
   ```

---

## Environment Variables

รายละเอียดตัวแปรทั้งหมดอยู่ในไฟล์ `.env.example` ตัวอย่างตัวแปรที่จำเป็น:

| ตัวแปร | คำอธิบาย | ตัวอย่างค่า |
|---|---|---|
| `POSTGRES_DB` | ชื่อฐานข้อมูล PostgreSQL | `scholarshipDb` |
| `POSTGRES_USER` | Username สำหรับเชื่อมต่อ PostgreSQL | `postgres` |
| `POSTGRES_PASSWORD` | Password สำหรับเชื่อมต่อ PostgreSQL | `change-me` |
| `POSTGRES_PORT` | พอร์ตของ PostgreSQL | `5432` |
| `BACKEND_PORT` | พอร์ตที่ Backend (SRMBackend) ใช้รัน | `8080` |
| `JWT_ISSUER` | Issuer ของ JWT Token | `https://localhost:5001` |
| `JWT_AUDIENCE` | Audience ของ JWT Token | `https://localhost:5001` |
| `JWT_KEY` | Secret key สำหรับออก Token การเข้าสู่ระบบ | `change-me-to-a-long-random-secret` |
| `CORS_ALLOWED_ORIGINS` | Origin ที่อนุญาตให้เรียก Backend ได้ (CORS) | `http://localhost:3000` |
| `FRONTEND_PORT` | พอร์ตที่ Frontend (SRMFrontend) ใช้รัน | `3000` |
| `VITE_API_URL` | URL ของ API ที่ Frontend เรียกใช้ (ต้องเป็น URL ที่ browser เข้าถึงได้ ไม่ใช่ hostname ภายใน docker network เช่น `backend`) | `http://localhost:8080` |

---

## บัญชีผู้ใช้ทดสอบ

สำหรับเข้าสู่ระบบหน้าจัดการ (เจ้าหน้าที่):

| Username | Password | 
|---|---|
| `admin` | `AdminPassword123!` |


---

## การนำเข้าข้อมูลตัวอย่าง (Seed Data)


ตอนรันคำสั่ง docker compose up จะมีการ seed ข้อมูลเข้าสู่ฐานข้อมูลโดยผ่าน /docker-entrypoint-initdb.d อยู่แล้ว

---

## ฟีเจอร์ที่พัฒนา

- [X] แสดงรายการคำขอทุน (ตาราง + แบ่งหน้า 10 รายการ/หน้า)
- [X] การยื่นคำขอทุนสำหรับนักศึกษา (หน้าสาธารณะ + ตรวจสอบข้อมูล + PDPA Consent)
- [X] การเพิ่ม/แก้ไขคำขอทุน โดยเจ้าหน้าที่
- [X] การลบคำขอทุน (Soft Delete + ยืนยันก่อนลบ)
- [X] ระบบเข้าสู่ระบบ / ค้นหา-กรอง / จัดการสถานะคำขอ
- [X] หน้าจอแดชบอร์ดสรุปภาพรวม (พร้อมกราฟ)
- [X] ออกแบบ UX/UI
- [X] ออกแบบและเชื่อมต่อฐานข้อมูล PostgreSQL
- [X] จัดทำ Docker (Dockerfile + docker-compose)

---

## ฟีเจอร์เสริม

รายการเพิ่มเติมที่พัฒนานอกเหนือจากข้อกำหนดหลัก :

- **การใช้ AI Tools ช่วยพัฒนา:** ใช้ Claude Code ในการช่วยเขียน Frontend และช่วยสร้างเอกสาร Document 
- **การจัดเก็บรหัสผ่านอย่างปลอดภัย:** ใช้อัลกอริทึม SHA256 ในการ Hash และ การเก็บรหัสผ่าน จะเก็บเป็น Hashing โดยแยกเป็น 2 Column เป้น Hash กับ Salt เพราะตอน Generate รหัสผ่านจะสุ่ม Salt ใหม่ทุกครั้ง และไม่สามารถรู้รหัสผ่านต้นทางได้

---

## เอกสารออกแบบระบบ

- [System Architecture Diagram](./docs/architecture.png)
- [ER Diagram](./docs/er_diagram.png)
