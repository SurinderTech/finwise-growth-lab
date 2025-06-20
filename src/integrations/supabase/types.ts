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
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          month: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          id?: string
          month: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          month?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          notes: string | null
          payment_method: string | null
          receipt_image_url: string | null
          recurring_frequency: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_method?: string | null
          receipt_image_url?: string | null
          recurring_frequency?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_method?: string | null
          receipt_image_url?: string | null
          recurring_frequency?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_games: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_minutes: number | null
          game_type: string
          id: string
          is_active: boolean | null
          reward_xp: number | null
          rules: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_minutes?: number | null
          game_type: string
          id?: string
          is_active?: boolean | null
          reward_xp?: number | null
          rules?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_duration_minutes?: number | null
          game_type?: string
          id?: string
          is_active?: boolean | null
          reward_xp?: number | null
          rules?: Json | null
          title?: string
        }
        Relationships: []
      }
      fraud_scenarios: {
        Row: {
          content: Json
          created_at: string | null
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          id: string
          is_active: boolean | null
          points: number | null
          scenario_type: Database["public"]["Enums"]["fraud_alert_type"]
          title: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          description: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          scenario_type: Database["public"]["Enums"]["fraud_alert_type"]
          title: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          id?: string
          is_active?: boolean | null
          points?: number | null
          scenario_type?: Database["public"]["Enums"]["fraud_alert_type"]
          title?: string
        }
        Relationships: []
      }
      fraud_training_progress: {
        Row: {
          completed_at: string | null
          id: string
          is_correct: boolean | null
          points_earned: number | null
          scenario_id: string | null
          user_answer: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          scenario_id?: string | null
          user_answer?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          scenario_id?: string | null
          user_answer?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_training_progress_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "fraud_scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_training_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          completed_at: string | null
          final_score: number | null
          game_data: Json | null
          game_id: string | null
          id: string
          score: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["game_status"] | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          final_score?: number | null
          game_data?: Json | null
          game_id?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          final_score?: number | null
          game_data?: Json | null
          game_id?: string | null
          id?: string
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["game_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "financial_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          buy_price: number
          current_price: number
          id: string
          portfolio_id: string | null
          purchased_at: string | null
          quantity: number
          sold_at: string | null
          status: Database["public"]["Enums"]["investment_status"] | null
          stock_name: string
          stock_symbol: string
          total_amount: number
          user_id: string | null
        }
        Insert: {
          buy_price: number
          current_price: number
          id?: string
          portfolio_id?: string | null
          purchased_at?: string | null
          quantity: number
          sold_at?: string | null
          status?: Database["public"]["Enums"]["investment_status"] | null
          stock_name: string
          stock_symbol: string
          total_amount: number
          user_id?: string | null
        }
        Update: {
          buy_price?: number
          current_price?: number
          id?: string
          portfolio_id?: string | null
          purchased_at?: string | null
          quantity?: number
          sold_at?: string | null
          status?: Database["public"]["Enums"]["investment_status"] | null
          stock_name?: string
          stock_symbol?: string
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          full_name: string | null
          level: number | null
          rank: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          full_name?: string | null
          level?: number | null
          rank?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          full_name?: string | null
          level?: number | null
          rank?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          video_url: string | null
          xp_reward: number | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          video_url?: string | null
          xp_reward?: number | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          video_url?: string | null
          xp_reward?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string | null
          id: string
          total_invested: number | null
          total_profit_loss: number | null
          updated_at: string | null
          user_id: string | null
          virtual_balance: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          total_invested?: number | null
          total_profit_loss?: number | null
          updated_at?: string | null
          user_id?: string | null
          virtual_balance?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          total_invested?: number | null
          total_profit_loss?: number | null
          updated_at?: string | null
          user_id?: string | null
          virtual_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          email: string | null
          experience_level:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          financial_goals: string[] | null
          full_name: string | null
          id: string
          monthly_income: number | null
          occupation: string | null
          phone_number: string | null
          risk_tolerance: number | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          email?: string | null
          experience_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          financial_goals?: string[] | null
          full_name?: string | null
          id: string
          monthly_income?: number | null
          occupation?: string | null
          phone_number?: string | null
          risk_tolerance?: number | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          email?: string | null
          experience_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          financial_goals?: string[] | null
          full_name?: string | null
          id?: string
          monthly_income?: number | null
          occupation?: string | null
          phone_number?: string | null
          risk_tolerance?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number | null
          completed_at: string | null
          id: string
          quiz_id: string | null
          score: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["quiz_status"] | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          attempt_number?: number | null
          completed_at?: string | null
          id?: string
          quiz_id?: string | null
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["quiz_status"] | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          attempt_number?: number | null
          completed_at?: string | null
          id?: string
          quiz_id?: string | null
          score?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["quiz_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          id: string
          max_attempts: number | null
          module_id: string | null
          passing_score: number | null
          questions: Json
          time_limit_minutes: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_attempts?: number | null
          module_id?: string | null
          passing_score?: number | null
          questions: Json
          time_limit_minutes?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_attempts?: number | null
          module_id?: string | null
          passing_score?: number | null
          questions?: Json
          time_limit_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      saving_goals: {
        Row: {
          category: string | null
          created_at: string | null
          current_amount: number | null
          description: string | null
          id: string
          is_achieved: boolean | null
          target_amount: number
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          id?: string
          is_achieved?: boolean | null
          target_amount: number
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          id?: string
          is_achieved?: boolean | null
          target_amount?: number
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saving_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string | null
          fees: number | null
          id: string
          investment_id: string | null
          portfolio_id: string | null
          price: number
          quantity: number
          stock_symbol: string
          total_amount: number
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          fees?: number | null
          id?: string
          investment_id?: string | null
          portfolio_id?: string | null
          price: number
          quantity: number
          stock_symbol: string
          total_amount: number
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          fees?: number | null
          id?: string
          investment_id?: string | null
          portfolio_id?: string | null
          price?: number
          quantity?: number
          stock_symbol?: string
          total_amount?: number
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          id: string
          module_id: string | null
          progress_percentage: number | null
          time_spent_minutes: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          achievements: Json | null
          badges: Json | null
          coins: number | null
          created_at: string | null
          id: string
          last_activity_date: string | null
          level: number | null
          streak_days: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievements?: Json | null
          badges?: Json | null
          coins?: number | null
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievements?: Json | null
          badges?: Json | null
          coins?: number | null
          created_at?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          streak_days?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string | null
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
      difficulty_level: "beginner" | "intermediate" | "advanced"
      fraud_alert_type:
        | "phishing"
        | "fake_call"
        | "suspicious_transaction"
        | "scam_website"
      game_status: "not_started" | "in_progress" | "completed"
      investment_status: "active" | "completed" | "pending"
      quiz_status: "active" | "completed" | "failed"
      transaction_type: "buy" | "sell"
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
    Enums: {
      difficulty_level: ["beginner", "intermediate", "advanced"],
      fraud_alert_type: [
        "phishing",
        "fake_call",
        "suspicious_transaction",
        "scam_website",
      ],
      game_status: ["not_started", "in_progress", "completed"],
      investment_status: ["active", "completed", "pending"],
      quiz_status: ["active", "completed", "failed"],
      transaction_type: ["buy", "sell"],
    },
  },
} as const
