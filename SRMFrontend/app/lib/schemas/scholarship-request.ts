import { z } from "zod";

export const scholarshipRequestSchema = z.object({
  studentId: z.string().trim().min(1, "กรุณากรอกรหัสนักศึกษา"),
  studentTitleId: z.coerce
    .number({ error: "กรุณาเลือกคำนำหน้าชื่อ" })
    .int()
    .positive("กรุณาเลือกคำนำหน้าชื่อ"),
  studentName: z.string().trim().min(1, "กรุณากรอกชื่อ"),
  studentLname: z.string().trim().min(1, "กรุณากรอกนามสกุล"),
  gradeLevel: z.coerce
    .number({ error: "กรุณากรอกชั้นปีเป็นตัวเลข" })
    .int("ชั้นปีต้องเป็นจำนวนเต็ม")
    .min(1, "ชั้นปีต้องมีค่าอย่างน้อย 1")
    .max(8, "ชั้นปีต้องไม่เกิน 8"),
  gpax: z.coerce
    .number({ error: "กรุณากรอกเกรดเฉลี่ยเป็นตัวเลข" })
    .min(0, "เกรดเฉลี่ยต้องไม่ต่ำกว่า 0")
    .max(4, "เกรดเฉลี่ยต้องไม่เกิน 4"),
  studentEmail: z
    .string()
    .trim()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),
  scholarshipTypeId: z.coerce
    .number({ error: "กรุณาเลือกประเภททุน" })
    .int()
    .positive("กรุณาเลือกประเภททุน"),
  requestedAmount: z.coerce
    .number({ error: "กรุณากรอกจำนวนเงินเป็นตัวเลข" })
    .gt(0, "จำนวนเงินที่ขอต้องมากกว่า 0"),
  bankAccountNumber: z
    .string()
    .trim()
    .min(1, "กรุณากรอกเลขที่บัญชีธนาคาร")
    .regex(/^\d+$/, "เลขที่บัญชีธนาคารต้องเป็นตัวเลขเท่านั้น"),
  requestReason: z
    .string()
    .trim()
    .min(10, "กรุณากรอกเหตุผลการขอทุนอย่างน้อย 10 ตัวอักษร"),
  facId: z.string().trim().min(1, "กรุณาเลือกคณะ"),
  deptName: z.string().trim().min(1, "กรุณากรอกสาขา"),
  pdpaConsentVersion: z.coerce
    .number({
      error: "กรุณายินยอมการเก็บและใช้ข้อมูลส่วนบุคคลก่อนส่งคำขอ",
    })
    .int()
    .positive("กรุณายินยอมการเก็บและใช้ข้อมูลส่วนบุคคลก่อนส่งคำขอ"),
});

export type ScholarshipRequestFormInput = z.input<
  typeof scholarshipRequestSchema
>;
export type ScholarshipRequestFormValues = z.output<
  typeof scholarshipRequestSchema
>;
