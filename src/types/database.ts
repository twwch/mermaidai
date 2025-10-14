export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          google_id: string
          email: string
          name: string | null
          picture: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          google_id: string
          email: string
          name?: string | null
          picture?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          google_id?: string
          email?: string
          name?: string | null
          picture?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      diagrams: {
        Row: {
          id: string
          project_id: string
          name: string
          mermaid_code: string
          layout: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          mermaid_code: string
          layout?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          mermaid_code?: string
          layout?: string
          theme?: string
          created_at?: string
          updated_at?: string
        }
      }
      diagram_history: {
        Row: {
          id: string
          diagram_id: string
          mermaid_code: string
          user_prompt: string | null
          ai_response: string | null
          layout: string
          theme: string
          created_at: string
        }
        Insert: {
          id?: string
          diagram_id: string
          mermaid_code: string
          user_prompt?: string | null
          ai_response?: string | null
          layout?: string
          theme?: string
          created_at?: string
        }
        Update: {
          id?: string
          diagram_id?: string
          mermaid_code?: string
          user_prompt?: string | null
          ai_response?: string | null
          layout?: string
          theme?: string
          created_at?: string
        }
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
  }
}
