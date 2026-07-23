/**
 * Hand-authored to match supabase/migrations/*.sql exactly. Once a
 * Supabase project is linked, replace this file's contents with the
 * output of:
 *
 *   npm run supabase:types
 *
 * (see package.json — wraps `supabase gen types typescript`). Until
 * then, any schema change made in a new migration must be mirrored
 * here by hand in the same phase.
 */

export type AppointmentStatus = "confirmed" | "completed" | "cancelled" | "no_show";

export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      business_profile: {
        Row: {
          id: boolean;
          name: string;
          description: string;
          address: string;
          phone: string;
          email: string;
          instagram_url: string | null;
          working_hours: Record<string, { open: string; close: string } | null>;
          theme: Record<string, unknown>;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          name: string;
          description: string;
          address: string;
          phone: string;
          email: string;
          instagram_url?: string | null;
          working_hours?: Record<string, { open: string; close: string } | null>;
          theme?: Record<string, unknown>;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          name?: string;
          description?: string;
          address?: string;
          phone?: string;
          email?: string;
          instagram_url?: string | null;
          working_hours?: Record<string, { open: string; close: string } | null>;
          theme?: Record<string, unknown>;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          duration_minutes: number;
          price: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          duration_minutes: number;
          price: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          duration_minutes?: number;
          price?: number;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          guest_name: string;
          guest_phone: string;
          guest_email: string | null;
          customer_id: string | null;
          service_id: string;
          start_time: string;
          end_time: string;
          status: AppointmentStatus;
          notes: string | null;
          cancellation_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          guest_name: string;
          guest_phone: string;
          guest_email?: string | null;
          customer_id?: string | null;
          service_id: string;
          start_time: string;
          end_time: string;
          status?: AppointmentStatus;
          notes?: string | null;
          cancellation_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          guest_name?: string;
          guest_phone?: string;
          guest_email?: string | null;
          customer_id?: string | null;
          service_id?: string;
          start_time?: string;
          end_time?: string;
          status?: AppointmentStatus;
          notes?: string | null;
          cancellation_token?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      blocked_slots: {
        Row: {
          id: string;
          start_time: string;
          end_time: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          start_time: string;
          end_time: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          start_time?: string;
          end_time?: string;
          reason?: string | null;
          created_at?: string;
        };
      };
      loyalty_ledger: {
        Row: {
          id: string;
          customer_id: string;
          appointment_id: string | null;
          points: number;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          appointment_id?: string | null;
          points: number;
          reason?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          appointment_id?: string | null;
          points?: number;
          reason?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      appointment_status: AppointmentStatus;
    };
  };
}
