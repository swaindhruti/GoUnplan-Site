'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Contact form validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),
  subject: z.enum(['general', 'booking', 'custom', 'support', 'partnership'], {
    errorMap: () => ({ message: 'Please select a valid subject' }),
  }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

// Map form subject values to enum values
const subjectMap: Record<string, 'GENERAL' | 'BOOKING' | 'CUSTOM' | 'SUPPORT' | 'PARTNERSHIP'> = {
  general: 'GENERAL',
  booking: 'BOOKING',
  custom: 'CUSTOM',
  support: 'SUPPORT',
  partnership: 'PARTNERSHIP',
};

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Validate form data
    const validatedData = contactFormSchema.parse(formData);

    // Create contact record in database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: subjectMap[validatedData.subject],
        message: validatedData.message,
        status: 'PENDING',
      },
    });

    // Revalidate the contact page
    revalidatePath('/contact');

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      contactId: contact.id,
    };
  } catch (error) {
    console.error('Contact form submission error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your form data and try again.',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      };
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}

// Get all contacts (for admin dashboard)
export async function getAllContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      contacts,
    };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return {
      success: false,
      message: 'Failed to fetch contacts',
    };
  }
}

// Update contact status (for admin dashboard)
export async function updateContactStatus(
  contactId: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
) {
  try {
    const contact = await prisma.contact.update({
      where: {
        id: contactId,
      },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      contact,
    };
  } catch (error) {
    console.error('Error updating contact status:', error);
    return {
      success: false,
      message: 'Failed to update contact status',
    };
  }
}

// Get contact statistics (for admin dashboard)
export async function getContactStats() {
  try {
    const [total, pending, inProgress, resolved, closed] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'PENDING' } }),
      prisma.contact.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.contact.count({ where: { status: 'RESOLVED' } }),
      prisma.contact.count({ where: { status: 'CLOSED' } }),
    ]);

    return {
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        closed,
      },
    };
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return {
      success: false,
      message: 'Failed to fetch contact statistics',
    };
  }
}
