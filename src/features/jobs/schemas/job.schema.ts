import { z } from 'zod';

export const jobStatusEnum = z.enum([
  'Pending', 'Assigned', 'Accepted', 'Travelling', 'Arrived', 
  'Started', 'Completed', 'Cancelled', 'Failed', 'NoAccess', 
  'CustomerNotAvailable', 'Rescheduled'
]);

export const jobPriorityEnum = z.enum(['Low', 'Normal', 'High', 'Urgent']);

export const jobFailureReasonEnum = z.enum([
  'NO_ACCESS', 'CUSTOMER_ABSENT', 'MATERIAL_MISSING', 
  'WEATHER', 'TECHNICAL_FAILURE', 'OTHER'
]);

export const updateJobStatusSchema = z.object({
  status: jobStatusEnum,
  failureReason: jobFailureReasonEnum.optional(),
  cancellationReason: z.string().optional(),
  completionNotes: z.string().optional(),
  version_token: z.string().optional(),
});

export const assignJobSchema = z.object({
  assigned_user_id: z.string().uuid("Please select a technician"),
  version_token: z.string().optional(),
  override_conflict: z.boolean().optional(),
});

export const rescheduleJobSchema = z.object({
  new_scheduled_start: z.string().datetime(),
  version_token: z.string().optional(),
});

export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
export type AssignJobInput = z.infer<typeof assignJobSchema>;
export type RescheduleJobInput = z.infer<typeof rescheduleJobSchema>;
