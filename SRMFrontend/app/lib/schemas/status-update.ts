import { z } from "zod";

export const statusUpdateSchema = z.object({
  statusId: z.coerce
    .number({ error: "กรุณาเลือกสถานะ" })
    .int()
    .positive("กรุณาเลือกสถานะ"),
  remake: z.string().trim().optional().default(""),
});

export type StatusUpdateFormInput = z.input<typeof statusUpdateSchema>;
export type StatusUpdateFormValues = z.output<typeof statusUpdateSchema>;
