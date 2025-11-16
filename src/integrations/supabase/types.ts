export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_summary: {
        Row: {
          completed_deliveries: number | null
          created_at: string | null
          id: string
          month_year: string
          people_fed_estimate: number | null
          total_donations: number | null
          total_weight_kg: number | null
          user_id: string
        }
        Insert: {
          completed_deliveries?: number | null
          created_at?: string | null
          id?: string
          month_year: string
          people_fed_estimate?: number | null
          total_donations?: number | null
          total_weight_kg?: number | null
          user_id: string
        }
        Update: {
          completed_deliveries?: number | null
          created_at?: string | null
          id?: string
          month_year?: string
          people_fed_estimate?: number | null
          total_donations?: number | null
          total_weight_kg?: number | null
          user_id?: string
        }
        Relationships: []
      }
      delivery_tracking: {
        Row: {
          created_at: string | null
          delivery_time: string | null
          donation_id: string
          donor_rating: number | null
          id: string
          ngo_id: string
          ngo_rating: number | null
          notes: string | null
          pickup_time: string | null
          status: string | null
          volunteer_id: string
          volunteer_rating: number | null
        }
        Insert: {
          created_at?: string | null
          delivery_time?: string | null
          donation_id: string
          donor_rating?: number | null
          id?: string
          ngo_id: string
          ngo_rating?: number | null
          notes?: string | null
          pickup_time?: string | null
          status?: string | null
          volunteer_id: string
          volunteer_rating?: number | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string | null
          donation_id?: string
          donor_rating?: number | null
          id?: string
          ngo_id?: string
          ngo_rating?: number | null
          notes?: string | null
          pickup_time?: string | null
          status?: string | null
          volunteer_id?: string
          volunteer_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_requests: {
        Row: {
          created_at: string | null
          distance_km: number | null
          donation_id: string
          id: string
          ngo_id: string
          request_message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          donation_id: string
          id?: string
          ngo_id: string
          request_message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          donation_id?: string
          id?: string
          ngo_id?: string
          request_message?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_requests_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          accepted_at: string | null
          accepted_by_ngo: string | null
          assigned_volunteer: string | null
          created_at: string | null
          description: string | null
          donor_id: string
          expire_at: string
          food_category: Database["public"]["Enums"]["food_category"]
          food_image_url: string | null
          id: string
          pickup_address: string
          pickup_city: string
          pickup_latitude: number | null
          pickup_longitude: number | null
          prepared_at: string | null
          quality_notes: string | null
          quantity: string
          status: Database["public"]["Enums"]["donation_status"] | null
          temperature_indicator: string | null
          title: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by_ngo?: string | null
          assigned_volunteer?: string | null
          created_at?: string | null
          description?: string | null
          donor_id: string
          expire_at: string
          food_category: Database["public"]["Enums"]["food_category"]
          food_image_url?: string | null
          id?: string
          pickup_address: string
          pickup_city: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          prepared_at?: string | null
          quality_notes?: string | null
          quantity: string
          status?: Database["public"]["Enums"]["donation_status"] | null
          temperature_indicator?: string | null
          title: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by_ngo?: string | null
          assigned_volunteer?: string | null
          created_at?: string | null
          description?: string | null
          donor_id?: string
          expire_at?: string
          food_category?: Database["public"]["Enums"]["food_category"]
          food_image_url?: string | null
          id?: string
          pickup_address?: string
          pickup_city?: string
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          prepared_at?: string | null
          quality_notes?: string | null
          quantity?: string
          status?: Database["public"]["Enums"]["donation_status"] | null
          temperature_indicator?: string | null
          title?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ngo_profiles: {
        Row: {
          beneficiaries_count: number | null
          created_at: string | null
          description: string | null
          id: string
          operating_hours: string | null
          organization_name: string
          registration_number: string | null
          user_id: string
          vehicle_capacity: string | null
          verified: boolean | null
        }
        Insert: {
          beneficiaries_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          operating_hours?: string | null
          organization_name: string
          registration_number?: string | null
          user_id: string
          vehicle_capacity?: string | null
          verified?: boolean | null
        }
        Update: {
          beneficiaries_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          operating_hours?: string | null
          organization_name?: string
          registration_number?: string | null
          user_id?: string
          vehicle_capacity?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_profiles: {
        Row: {
          availability_status: boolean | null
          created_at: string | null
          id: string
          rating: number | null
          total_deliveries: number | null
          user_id: string
          vehicle_number: string | null
          vehicle_type: string | null
        }
        Insert: {
          availability_status?: boolean | null
          created_at?: string | null
          id?: string
          rating?: number | null
          total_deliveries?: number | null
          user_id: string
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Update: {
          availability_status?: boolean | null
          created_at?: string | null
          id?: string
          rating?: number | null
          total_deliveries?: number | null
          user_id?: string
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      donation_status:
        | "available"
        | "accepted"
        | "picked_up"
        | "delivered"
        | "cancelled"
      food_category:
        | "cooked_food"
        | "raw_food"
        | "packaged_food"
        | "beverages"
        | "bakery"
        | "dairy"
        | "fruits_vegetables"
      user_role: "donor" | "ngo" | "volunteer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      donation_status: [
        "available",
        "accepted",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      food_category: [
        "cooked_food",
        "raw_food",
        "packaged_food",
        "beverages",
        "bakery",
        "dairy",
        "fruits_vegetables",
      ],
      user_role: ["donor", "ngo", "volunteer"],
    },
  },
} as const
