import { z } from 'zod';

// ============================================
// Client Validation Schemas
// ============================================

export const createClientSchema = z.object({
  name: z.string()
    .min(1, 'Client name is required')
    .max(200, 'Client name must be 200 characters or less')
    .trim(),
  contact_name: z.string()
    .max(200, 'Contact name must be 200 characters or less')
    .trim()
    .optional()
    .nullable(),
  contact_email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less')
    .trim()
    .optional()
    .nullable()
    .or(z.literal('')),
  contact_phone: z.string()
    .max(50, 'Phone number must be 50 characters or less')
    .trim()
    .optional()
    .nullable(),
  contract_value: z.number()
    .min(0, 'Contract value must be positive')
    .optional()
    .nullable(),
  contract_start_date: z.string()
    .optional()
    .nullable(),
  contract_end_date: z.string()
    .optional()
    .nullable(),
  assigned_to: z.string()
    .uuid('Invalid assignee ID')
    .optional()
    .nullable(),
  notes: z.string()
    .max(5000, 'Notes must be 5000 characters or less')
    .trim()
    .optional()
    .nullable(),
});

export const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().uuid('Invalid client ID'),
  health_score: z.number().min(0).max(100).optional().nullable(),
  risk_level: z.enum(['low', 'medium', 'high']).optional().nullable(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

// ============================================
// Interaction Validation Schemas
// ============================================

export const interactionTypeSchema = z.enum([
  'email', 'call', 'meeting', 'note', 'support', 'other'
]);

export const sentimentSchema = z.enum([
  'positive', 'neutral', 'negative'
]);

export const createInteractionSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  type: interactionTypeSchema,
  subject: z.string()
    .max(500, 'Subject must be 500 characters or less')
    .trim()
    .optional()
    .nullable(),
  details: z.string()
    .max(10000, 'Details must be 10000 characters or less')
    .trim()
    .optional()
    .nullable(),
  sentiment: sentimentSchema.optional().nullable(),
  interaction_date: z.string().optional().nullable(),
});

export type CreateInteractionInput = z.infer<typeof createInteractionSchema>;

// ============================================
// Ticket Validation Schemas
// ============================================

export const ticketPrioritySchema = z.enum([
  'low', 'medium', 'high', 'critical'
]);

export const ticketStatusSchema = z.enum([
  'open', 'in_progress', 'waiting', 'resolved', 'closed'
]);

export const createTicketSchema = z.object({
  client_id: z.string().uuid('Invalid client ID'),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(500, 'Subject must be 500 characters or less')
    .trim(),
  description: z.string()
    .max(10000, 'Description must be 10000 characters or less')
    .trim()
    .optional()
    .nullable(),
  priority: ticketPrioritySchema.optional().nullable(),
  sla_due_date: z.string().optional().nullable(),
  assigned_to: z.string()
    .uuid('Invalid assignee ID')
    .optional()
    .nullable(),
});

export const updateTicketSchema = z.object({
  id: z.string().uuid('Invalid ticket ID'),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  assigned_to: z.string().uuid('Invalid assignee ID').optional().nullable(),
  resolved_at: z.string().optional().nullable(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

// ============================================
// Validation Helper
// ============================================

type ValidationSuccess<T> = { success: true; data: T; error?: never };
type ValidationFailure = { success: false; error: string; data?: never };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMessage = result.error.issues
    .map((issue) => issue.message)
    .join(', ');
  return { success: false, error: errorMessage };
}
