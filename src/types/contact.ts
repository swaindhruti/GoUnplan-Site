export interface ContactFormData {
  name: string;
  email: string;
  subject: "general" | "booking" | "custom" | "support" | "partnership";
  message: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  contactId?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: "GENERAL" | "BOOKING" | "CUSTOM" | "SUPPORT" | "PARTNERSHIP";
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  closed: number;
}
