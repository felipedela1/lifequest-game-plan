export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          rarity: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          rarity: string
          requirement_type: string
          requirement_value: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          rarity?: string
          requirement_type?: string
          requirement_value?: number
          title?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      badges: {
        Row: {
          condition_data: Json
          condition_type: string
          created_at: string
          description: string
          icon_name: string
          id: string
          is_active: boolean | null
          name: string
          rarity: string
        }
        Insert: {
          condition_data: Json
          condition_type: string
          created_at?: string
          description: string
          icon_name: string
          id?: string
          is_active?: boolean | null
          name: string
          rarity: string
        }
        Update: {
          condition_data?: Json
          condition_type?: string
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon_name: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          icon_name: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      demo_tasks: {
        Row: {
          category: string
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_duration: number | null
          id: string
          notes: string | null
          priority: string | null
          recurring_interval: number | null
          recurring_type: string | null
          tags: string[] | null
          title: string
          xp_reward: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          priority?: string | null
          recurring_interval?: number | null
          recurring_type?: string | null
          tags?: string[] | null
          title: string
          xp_reward?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_duration?: number | null
          id?: string
          notes?: string | null
          priority?: string | null
          recurring_interval?: number | null
          recurring_type?: string | null
          tags?: string[] | null
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      levels: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          level_number: number
          name: string
          rewards: Json | null
          xp_required: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          level_number: number
          name: string
          rewards?: Json | null
          xp_required: number
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          level_number?: number
          name?: string
          rewards?: Json | null
          xp_required?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          full_name: string | null
          id: string
          is_premium: boolean | null
          language: string | null
          notification_email: boolean | null
          notification_push: boolean | null
          premium_expires_at: string | null
          theme: string | null
          timezone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          language?: string | null
          notification_email?: boolean | null
          notification_push?: boolean | null
          premium_expires_at?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          language?: string | null
          notification_email?: boolean | null
          notification_push?: boolean | null
          premium_expires_at?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_duration: number | null
          category: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          due_date: string | null
          estimated_duration: number | null
          id: string
          is_archived: boolean | null
          notes: string | null
          parent_task_id: string | null
          priority: string | null
          recurring_interval: number | null
          recurring_type: string | null
          reminder_at: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          actual_duration?: number | null
          category: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          parent_task_id?: string | null
          priority?: string | null
          recurring_interval?: number | null
          recurring_type?: string | null
          reminder_at?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          actual_duration?: number | null
          category?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          is_archived?: boolean | null
          notes?: string | null
          parent_task_id?: string | null
          priority?: string | null
          recurring_interval?: number | null
          recurring_type?: string | null
          reminder_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          average_daily_xp: number | null
          best_streak: number | null
          created_at: string
          current_xp: number
          id: string
          last_activity_date: string | null
          level: number
          monthly_streak: number | null
          streak: number
          tasks_completed_month: number | null
          tasks_completed_today: number | null
          tasks_completed_week: number | null
          time_spent_today: number | null
          time_spent_total: number | null
          total_tasks_completed: number | null
          total_xp: number
          updated_at: string
          user_id: string
          weekly_streak: number | null
        }
        Insert: {
          average_daily_xp?: number | null
          best_streak?: number | null
          created_at?: string
          current_xp?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          monthly_streak?: number | null
          streak?: number
          tasks_completed_month?: number | null
          tasks_completed_today?: number | null
          tasks_completed_week?: number | null
          time_spent_today?: number | null
          time_spent_total?: number | null
          total_tasks_completed?: number | null
          total_xp?: number
          updated_at?: string
          user_id: string
          weekly_streak?: number | null
        }
        Update: {
          average_daily_xp?: number | null
          best_streak?: number | null
          created_at?: string
          current_xp?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          monthly_streak?: number | null
          streak?: number
          tasks_completed_month?: number | null
          tasks_completed_today?: number | null
          tasks_completed_week?: number | null
          time_spent_today?: number | null
          time_spent_total?: number | null
          total_tasks_completed?: number | null
          total_xp?: number
          updated_at?: string
          user_id?: string
          weekly_streak?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
