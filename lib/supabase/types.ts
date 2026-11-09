export type Json = string | number | boolean | null | {
  [key: string]: Json | undefined;
} | Json[];

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: {
          id: string;
          name: string;
          listing_url: string;
          parser_strategy: string | null;
          active: boolean;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          listing_url: string;
          parser_strategy?: string | null;
          active?: boolean;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sources"]["Insert"]>;
      };
      articles: {
        Row: {
          id: string;
          source_id: string;
          url: string;
          canonical_url: string | null;
          title: string;
          slug: string | null;
          image_url: string;
          published_at: string;
          raw_text: string | null;
          scraped_at: string;
          analyzed_at: string | null;
          created_at: string;
          category: string;
          location: string;
          sources_count: number;
        };
        Insert: {
          id?: string;
          source_id: string;
          url: string;
          canonical_url?: string | null;
          title: string;
          slug?: string | null;
          image_url: string;
          published_at: string;
          raw_text?: string | null;
          scraped_at?: string;
          analyzed_at?: string | null;
          created_at?: string;
          category?: string;
          location?: string;
          sources_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
      };
      article_analyses: {
        Row: {
          id: string;
          article_id: string;
          summary: string | null;
          sentiment_score: number | null;
          sentiment_label: "positive" | "neutral" | "negative" | null;
          bias_score: number | null;
          bias_label: "left" | "center" | "right" | "mixed" | "unclear" | null;
          left_percentage: number;
          center_percentage: number;
          right_percentage: number;
          confidence: number | null;
          framing_notes: string[];
          loaded_terms: string[];
          disclaimer: string | null;
          model: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          summary?: string | null;
          sentiment_score?: number | null;
          sentiment_label?: "positive" | "neutral" | "negative" | null;
          bias_score?: number | null;
          bias_label?: "left" | "center" | "right" | "mixed" | "unclear" | null;
          left_percentage?: number;
          center_percentage?: number;
          right_percentage?: number;
          confidence?: number | null;
          framing_notes?: string[];
          loaded_terms?: string[];
          disclaimer?: string | null;
          model?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["article_analyses"]["Insert"]>;
      };
      logs: {
        Row: {
          id: string;
          level: string;
          message: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          level: string;
          message: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["logs"]["Insert"]>;
      };
      oxylabs_schedules: {
        Row: {
          id: string;
          source_id: string;
          oxylabs_remote_id: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          oxylabs_remote_id: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["oxylabs_schedules"]["Insert"]>;
      };
      oxylabs_schedule_runs: {
        Row: {
          id: string;
          schedule_id: string;
          remote_run_id: string | null;
          result_status: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          schedule_id: string;
          remote_run_id?: string | null;
          result_status?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["oxylabs_schedule_runs"]["Insert"]>;
      };
    };
  };
}