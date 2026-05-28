import { z } from 'zod'

export const createOrderSchema = z.object({
  name:      z.string().min(2,  'Name must be at least 2 characters'),
  phone:     z.string().min(7,  'Please enter a valid phone number'),
  email:     z.string().email('Invalid email').optional().or(z.literal('')),
  item:      z.string().min(1,  'Please select an item'),
  itemName:  z.string().min(1,  'Item name required'),
  itemPrice: z.number().positive('Price must be positive'),
  addOns:    z.array(z.string()).default([]),
  quantity:  z.number().int().min(1).max(50).default(1),
  orderType: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().optional().or(z.literal('')),
  date:      z.string().min(1, 'Please select a date'),
  notes:     z.string().max(500).default(''),
  total:     z.number().positive(),
})

export const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
