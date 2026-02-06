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
      gsc_alert_rules: {
        Row: {
          alert_type: string
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean | null
          name: string
          notify_email: boolean | null
          notify_slack: boolean | null
          severity: string
          thresholds: Json
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          notify_email?: boolean | null
          notify_slack?: boolean | null
          severity?: string
          thresholds?: Json
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          notify_email?: boolean | null
          notify_slack?: boolean | null
          severity?: string
          thresholds?: Json
          updated_at?: string
        }
        Relationships: []
      }
      gsc_alerts: {
        Row: {
          affected_date: string | null
          affected_query: string | null
          affected_url: string | null
          alert_type: string
          comparison_period: string | null
          created_at: string
          description: string | null
          details: Json | null
          id: string
          metric_value: number | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          rule_id: string
          severity: string
          status: string
          threshold_value: number | null
          title: string
          updated_at: string
        }
        Insert: {
          affected_date?: string | null
          affected_query?: string | null
          affected_url?: string | null
          alert_type: string
          comparison_period?: string | null
          created_at?: string
          description?: string | null
          details?: Json | null
          id?: string
          metric_value?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id: string
          severity?: string
          status?: string
          threshold_value?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          affected_date?: string | null
          affected_query?: string | null
          affected_url?: string | null
          alert_type?: string
          comparison_period?: string | null
          created_at?: string
          description?: string | null
          details?: Json | null
          id?: string
          metric_value?: number | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string
          severity?: string
          status?: string
          threshold_value?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gsc_alerts_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "gsc_alert_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      gsc_canonical_groups: {
        Row: {
          canonical_url: string
          created_at: string
          id: string
          is_duplicate_issue: boolean | null
          primary_variant: string | null
          total_clicks: number | null
          total_impressions: number | null
          updated_at: string
          variant_count: number | null
        }
        Insert: {
          canonical_url: string
          created_at?: string
          id?: string
          is_duplicate_issue?: boolean | null
          primary_variant?: string | null
          total_clicks?: number | null
          total_impressions?: number | null
          updated_at?: string
          variant_count?: number | null
        }
        Update: {
          canonical_url?: string
          created_at?: string
          id?: string
          is_duplicate_issue?: boolean | null
          primary_variant?: string | null
          total_clicks?: number | null
          total_impressions?: number | null
          updated_at?: string
          variant_count?: number | null
        }
        Relationships: []
      }
      gsc_country_metrics: {
        Row: {
          clicks: number
          country: string
          created_at: string
          ctr: number
          date: string
          id: string
          impressions: number
          position: number
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          country: string
          created_at?: string
          ctr?: number
          date: string
          id?: string
          impressions?: number
          position?: number
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          country?: string
          created_at?: string
          ctr?: number
          date?: string
          id?: string
          impressions?: number
          position?: number
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_device_metrics: {
        Row: {
          clicks: number
          created_at: string
          ctr: number
          date: string
          device: string
          id: string
          impressions: number
          position: number
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number
          date: string
          device: string
          id?: string
          impressions?: number
          position?: number
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number
          date?: string
          device?: string
          id?: string
          impressions?: number
          position?: number
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_page_aggregates: {
        Row: {
          avg_ctr: number
          avg_position: number
          computed_date: string
          created_at: string
          delta_clicks_mom: number | null
          delta_clicks_wow: number | null
          delta_impressions_mom: number | null
          delta_impressions_wow: number | null
          delta_position_mom: number | null
          delta_position_wow: number | null
          id: string
          is_loser: boolean | null
          is_winner: boolean | null
          normalized_url: string
          pct_change_clicks_mom: number | null
          pct_change_clicks_wow: number | null
          pct_change_impressions_mom: number | null
          pct_change_impressions_wow: number | null
          search_type: string
          site_property: string
          total_clicks: number
          total_impressions: number
          window_type: string
        }
        Insert: {
          avg_ctr?: number
          avg_position?: number
          computed_date: string
          created_at?: string
          delta_clicks_mom?: number | null
          delta_clicks_wow?: number | null
          delta_impressions_mom?: number | null
          delta_impressions_wow?: number | null
          delta_position_mom?: number | null
          delta_position_wow?: number | null
          id?: string
          is_loser?: boolean | null
          is_winner?: boolean | null
          normalized_url: string
          pct_change_clicks_mom?: number | null
          pct_change_clicks_wow?: number | null
          pct_change_impressions_mom?: number | null
          pct_change_impressions_wow?: number | null
          search_type?: string
          site_property?: string
          total_clicks?: number
          total_impressions?: number
          window_type: string
        }
        Update: {
          avg_ctr?: number
          avg_position?: number
          computed_date?: string
          created_at?: string
          delta_clicks_mom?: number | null
          delta_clicks_wow?: number | null
          delta_impressions_mom?: number | null
          delta_impressions_wow?: number | null
          delta_position_mom?: number | null
          delta_position_wow?: number | null
          id?: string
          is_loser?: boolean | null
          is_winner?: boolean | null
          normalized_url?: string
          pct_change_clicks_mom?: number | null
          pct_change_clicks_wow?: number | null
          pct_change_impressions_mom?: number | null
          pct_change_impressions_wow?: number | null
          search_type?: string
          site_property?: string
          total_clicks?: number
          total_impressions?: number
          window_type?: string
        }
        Relationships: []
      }
      gsc_page_metrics: {
        Row: {
          clicks: number
          created_at: string
          ctr: number
          date: string
          id: string
          impressions: number
          normalized_url: string
          position: number
          raw_url: string
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number
          date: string
          id?: string
          impressions?: number
          normalized_url: string
          position?: number
          raw_url: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number
          date?: string
          id?: string
          impressions?: number
          normalized_url?: string
          position?: number
          raw_url?: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_page_query_metrics: {
        Row: {
          clicks: number
          created_at: string
          ctr: number
          date: string
          id: string
          impressions: number
          normalized_url: string
          position: number
          query: string
          raw_url: string
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number
          date: string
          id?: string
          impressions?: number
          normalized_url: string
          position?: number
          query: string
          raw_url: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number
          date?: string
          id?: string
          impressions?: number
          normalized_url?: string
          position?: number
          query?: string
          raw_url?: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_query_aggregates: {
        Row: {
          avg_ctr: number
          avg_position: number
          computed_date: string
          created_at: string
          delta_clicks_mom: number | null
          delta_clicks_wow: number | null
          delta_impressions_mom: number | null
          delta_impressions_wow: number | null
          delta_position_mom: number | null
          delta_position_wow: number | null
          id: string
          is_cannibalized: boolean | null
          query: string
          ranking_page_count: number | null
          search_type: string
          site_property: string
          top_page_url: string | null
          total_clicks: number
          total_impressions: number
          window_type: string
        }
        Insert: {
          avg_ctr?: number
          avg_position?: number
          computed_date: string
          created_at?: string
          delta_clicks_mom?: number | null
          delta_clicks_wow?: number | null
          delta_impressions_mom?: number | null
          delta_impressions_wow?: number | null
          delta_position_mom?: number | null
          delta_position_wow?: number | null
          id?: string
          is_cannibalized?: boolean | null
          query: string
          ranking_page_count?: number | null
          search_type?: string
          site_property?: string
          top_page_url?: string | null
          total_clicks?: number
          total_impressions?: number
          window_type: string
        }
        Update: {
          avg_ctr?: number
          avg_position?: number
          computed_date?: string
          created_at?: string
          delta_clicks_mom?: number | null
          delta_clicks_wow?: number | null
          delta_impressions_mom?: number | null
          delta_impressions_wow?: number | null
          delta_position_mom?: number | null
          delta_position_wow?: number | null
          id?: string
          is_cannibalized?: boolean | null
          query?: string
          ranking_page_count?: number | null
          search_type?: string
          site_property?: string
          top_page_url?: string | null
          total_clicks?: number
          total_impressions?: number
          window_type?: string
        }
        Relationships: []
      }
      gsc_query_metrics: {
        Row: {
          clicks: number
          created_at: string
          ctr: number
          date: string
          id: string
          impressions: number
          position: number
          query: string
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number
          date: string
          id?: string
          impressions?: number
          position?: number
          query: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number
          date?: string
          id?: string
          impressions?: number
          position?: number
          query?: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_search_appearance_metrics: {
        Row: {
          clicks: number
          created_at: string
          ctr: number
          date: string
          id: string
          impressions: number
          position: number
          search_appearance: string
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number
          date: string
          id?: string
          impressions?: number
          position?: number
          search_appearance: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number
          date?: string
          id?: string
          impressions?: number
          position?: number
          search_appearance?: string
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_site_aggregates: {
        Row: {
          avg_ctr: number
          avg_position: number
          computed_date: string
          created_at: string
          delta_clicks_mom: number | null
          delta_clicks_wow: number | null
          delta_ctr_mom: number | null
          delta_ctr_wow: number | null
          delta_impressions_mom: number | null
          delta_impressions_wow: number | null
          delta_position_mom: number | null
          delta_position_wow: number | null
          id: string
          pct_change_clicks_mom: number | null
          pct_change_clicks_wow: number | null
          pct_change_impressions_mom: number | null
          pct_change_impressions_wow: number | null
          search_type: string
          site_property: string
          total_clicks: number
          total_impressions: number
          window_type: string
        }
        Insert: {
          avg_ctr?: number
          avg_position?: number
          computed_date: string
          created_at?: string
          delta_clicks_mom?: number | null
          delta_clicks_wow?: number | null
          delta_ctr_mom?: number | null
          delta_ctr_wow?: number | null
          delta_impressions_mom?: number | null
          delta_impressions_wow?: number | null
          delta_position_mom?: number | null
          delta_position_wow?: number | null
          id?: string
          pct_change_clicks_mom?: number | null
          pct_change_clicks_wow?: number | null
          pct_change_impressions_mom?: number | null
          pct_change_impressions_wow?: number | null
          search_type?: string
          site_property?: string
          total_clicks?: number
          total_impressions?: number
          window_type: string
        }
        Update: {
          avg_ctr?: number
          avg_position?: number
          computed_date?: string
          created_at?: string
          delta_clicks_mom?: number | null
          delta_clicks_wow?: number | null
          delta_ctr_mom?: number | null
          delta_ctr_wow?: number | null
          delta_impressions_mom?: number | null
          delta_impressions_wow?: number | null
          delta_position_mom?: number | null
          delta_position_wow?: number | null
          id?: string
          pct_change_clicks_mom?: number | null
          pct_change_clicks_wow?: number | null
          pct_change_impressions_mom?: number | null
          pct_change_impressions_wow?: number | null
          search_type?: string
          site_property?: string
          total_clicks?: number
          total_impressions?: number
          window_type?: string
        }
        Relationships: []
      }
      gsc_site_metrics: {
        Row: {
          clicks: number
          created_at: string
          ctr: number
          date: string
          id: string
          impressions: number
          position: number
          search_type: string
          site_property: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          created_at?: string
          ctr?: number
          date: string
          id?: string
          impressions?: number
          position?: number
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          created_at?: string
          ctr?: number
          date?: string
          id?: string
          impressions?: number
          position?: number
          search_type?: string
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_sync_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          current_dimension: string | null
          date_from: string
          date_to: string
          error_details: Json | null
          errors_count: number | null
          id: string
          job_type: string
          progress_percent: number | null
          rows_fetched: number | null
          rows_inserted: number | null
          rows_updated: number | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_dimension?: string | null
          date_from: string
          date_to: string
          error_details?: Json | null
          errors_count?: number | null
          id?: string
          job_type: string
          progress_percent?: number | null
          rows_fetched?: number | null
          rows_inserted?: number | null
          rows_updated?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_dimension?: string | null
          date_from?: string
          date_to?: string
          error_details?: Json | null
          errors_count?: number | null
          id?: string
          job_type?: string
          progress_percent?: number | null
          rows_fetched?: number | null
          rows_inserted?: number | null
          rows_updated?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_sync_state: {
        Row: {
          created_at: string
          dimension: string
          id: string
          last_sync_at: string | null
          last_synced_date: string | null
          next_sync_at: string | null
          site_property: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dimension: string
          id?: string
          last_sync_at?: string | null
          last_synced_date?: string | null
          next_sync_at?: string | null
          site_property?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dimension?: string
          id?: string
          last_sync_at?: string | null
          last_synced_date?: string | null
          next_sync_at?: string | null
          site_property?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_url_registry: {
        Row: {
          avg_position: number | null
          canonical_group_id: string | null
          created_at: string
          first_seen: string
          host_variant: string | null
          id: string
          is_image: boolean | null
          is_legacy_cms: boolean | null
          is_pdf: boolean | null
          language: string | null
          last_seen: string
          normalized_url: string
          protocol_variant: string | null
          raw_url: string
          route_key: string | null
          total_clicks: number | null
          total_impressions: number | null
          trailing_slash_variant: boolean | null
          updated_at: string
        }
        Insert: {
          avg_position?: number | null
          canonical_group_id?: string | null
          created_at?: string
          first_seen?: string
          host_variant?: string | null
          id?: string
          is_image?: boolean | null
          is_legacy_cms?: boolean | null
          is_pdf?: boolean | null
          language?: string | null
          last_seen?: string
          normalized_url: string
          protocol_variant?: string | null
          raw_url: string
          route_key?: string | null
          total_clicks?: number | null
          total_impressions?: number | null
          trailing_slash_variant?: boolean | null
          updated_at?: string
        }
        Update: {
          avg_position?: number | null
          canonical_group_id?: string | null
          created_at?: string
          first_seen?: string
          host_variant?: string | null
          id?: string
          is_image?: boolean | null
          is_legacy_cms?: boolean | null
          is_pdf?: boolean | null
          language?: string | null
          last_seen?: string
          normalized_url?: string
          protocol_variant?: string | null
          raw_url?: string
          route_key?: string | null
          total_clicks?: number | null
          total_impressions?: number | null
          trailing_slash_variant?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gsc_url_registry_canonical_group_id_fkey"
            columns: ["canonical_group_id"]
            isOneToOne: false
            referencedRelation: "gsc_canonical_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      landingpage_content: {
        Row: {
          created_at: string | null
          featured_items: Json | null
          highlights_text_de: string | null
          highlights_text_en: string | null
          highlights_text_fr: string | null
          highlights_text_it: string | null
          id: string
          intro_de: string | null
          intro_en: string | null
          intro_fr: string | null
          intro_it: string | null
          items_found_count: number | null
          last_check: string | null
          last_menu_hash: string | null
          last_successful_update: string | null
          menu_highlights: Json | null
          page_slug: string
          prices_summary: Json | null
          season_info: Json | null
          source_menu_ids: string[] | null
          update_status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured_items?: Json | null
          highlights_text_de?: string | null
          highlights_text_en?: string | null
          highlights_text_fr?: string | null
          highlights_text_it?: string | null
          id?: string
          intro_de?: string | null
          intro_en?: string | null
          intro_fr?: string | null
          intro_it?: string | null
          items_found_count?: number | null
          last_check?: string | null
          last_menu_hash?: string | null
          last_successful_update?: string | null
          menu_highlights?: Json | null
          page_slug: string
          prices_summary?: Json | null
          season_info?: Json | null
          source_menu_ids?: string[] | null
          update_status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured_items?: Json | null
          highlights_text_de?: string | null
          highlights_text_en?: string | null
          highlights_text_fr?: string | null
          highlights_text_it?: string | null
          id?: string
          intro_de?: string | null
          intro_en?: string | null
          intro_fr?: string | null
          intro_it?: string | null
          items_found_count?: number | null
          last_check?: string | null
          last_menu_hash?: string | null
          last_successful_update?: string | null
          menu_highlights?: Json | null
          page_slug?: string
          prices_summary?: Json | null
          season_info?: Json | null
          source_menu_ids?: string[] | null
          update_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string | null
          description: string | null
          description_en: string | null
          description_fr: string | null
          description_it: string | null
          id: string
          menu_id: string
          name: string
          name_en: string | null
          name_fr: string | null
          name_it: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          id?: string
          menu_id: string
          name: string
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          id?: string
          menu_id?: string
          name?: string
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string | null
          category_id: string
          created_at: string | null
          description: string | null
          description_en: string | null
          description_fr: string | null
          description_it: string | null
          id: string
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          name: string
          name_en: string | null
          name_fr: string | null
          name_it: string | null
          price: number | null
          price_display: string | null
          sort_order: number | null
        }
        Insert: {
          allergens?: string | null
          category_id: string
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          id?: string
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          price?: number | null
          price_display?: string | null
          sort_order?: number | null
        }
        Update: {
          allergens?: string | null
          category_id?: string
          created_at?: string | null
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          id?: string
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          price?: number | null
          price_display?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string | null
          id: string
          is_published: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type"]
          pdf_url: string | null
          published_at: string | null
          slug: string | null
          slug_en: string | null
          slug_fr: string | null
          slug_it: string | null
          sort_order: number | null
          subtitle: string | null
          subtitle_en: string | null
          subtitle_fr: string | null
          subtitle_it: string | null
          title: string | null
          title_en: string | null
          title_fr: string | null
          title_it: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          menu_type: Database["public"]["Enums"]["menu_type"]
          pdf_url?: string | null
          published_at?: string | null
          slug?: string | null
          slug_en?: string | null
          slug_fr?: string | null
          slug_it?: string | null
          sort_order?: number | null
          subtitle?: string | null
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_it?: string | null
          title?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          menu_type?: Database["public"]["Enums"]["menu_type"]
          pdf_url?: string | null
          published_at?: string | null
          slug?: string | null
          slug_en?: string | null
          slug_fr?: string | null
          slug_it?: string | null
          sort_order?: number | null
          subtitle?: string | null
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_it?: string | null
          title?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      seo_alert_event: {
        Row: {
          affected_path: string | null
          affected_query: string | null
          baseline_value: number | null
          created_at: string
          description: string | null
          details: Json | null
          detected_date: string
          id: string
          metric_name: string | null
          metric_value: number | null
          pct_change: number | null
          resolved_at: string | null
          resolved_by: string | null
          rule_id: string
          severity: Database["public"]["Enums"]["seo_severity"]
          status: Database["public"]["Enums"]["seo_alert_status"]
          title: string
          updated_at: string
          window: Database["public"]["Enums"]["seo_window"] | null
        }
        Insert: {
          affected_path?: string | null
          affected_query?: string | null
          baseline_value?: number | null
          created_at?: string
          description?: string | null
          details?: Json | null
          detected_date?: string
          id?: string
          metric_name?: string | null
          metric_value?: number | null
          pct_change?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id: string
          severity?: Database["public"]["Enums"]["seo_severity"]
          status?: Database["public"]["Enums"]["seo_alert_status"]
          title: string
          updated_at?: string
          window?: Database["public"]["Enums"]["seo_window"] | null
        }
        Update: {
          affected_path?: string | null
          affected_query?: string | null
          baseline_value?: number | null
          created_at?: string
          description?: string | null
          details?: Json | null
          detected_date?: string
          id?: string
          metric_name?: string | null
          metric_value?: number | null
          pct_change?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          rule_id?: string
          severity?: Database["public"]["Enums"]["seo_severity"]
          status?: Database["public"]["Enums"]["seo_alert_status"]
          title?: string
          updated_at?: string
          window?: Database["public"]["Enums"]["seo_window"] | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_alert_event_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "seo_alert_rule"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_alert_rule: {
        Row: {
          base_severity: Database["public"]["Enums"]["seo_severity"]
          boost_money: boolean
          cooldown_hours: number
          created_at: string
          description: string | null
          id: string
          is_enabled: boolean
          metric: string
          name: string
          operator: string
          scope: Database["public"]["Enums"]["seo_scope"]
          slug: string
          threshold: number
          updated_at: string
          window: Database["public"]["Enums"]["seo_window"]
        }
        Insert: {
          base_severity?: Database["public"]["Enums"]["seo_severity"]
          boost_money?: boolean
          cooldown_hours?: number
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          metric: string
          name: string
          operator?: string
          scope?: Database["public"]["Enums"]["seo_scope"]
          slug: string
          threshold: number
          updated_at?: string
          window?: Database["public"]["Enums"]["seo_window"]
        }
        Update: {
          base_severity?: Database["public"]["Enums"]["seo_severity"]
          boost_money?: boolean
          cooldown_hours?: number
          created_at?: string
          description?: string | null
          id?: string
          is_enabled?: boolean
          metric?: string
          name?: string
          operator?: string
          scope?: Database["public"]["Enums"]["seo_scope"]
          slug?: string
          threshold?: number
          updated_at?: string
          window?: Database["public"]["Enums"]["seo_window"]
        }
        Relationships: []
      }
      seo_baseline_cache: {
        Row: {
          baseline_value: number
          computed_date: string
          created_at: string
          id: string
          metric: string
          sample_count: number | null
          scope: Database["public"]["Enums"]["seo_scope"]
          scope_key: string
          window: Database["public"]["Enums"]["seo_window"]
        }
        Insert: {
          baseline_value: number
          computed_date?: string
          created_at?: string
          id?: string
          metric: string
          sample_count?: number | null
          scope: Database["public"]["Enums"]["seo_scope"]
          scope_key: string
          window: Database["public"]["Enums"]["seo_window"]
        }
        Update: {
          baseline_value?: number
          computed_date?: string
          created_at?: string
          id?: string
          metric?: string
          sample_count?: number | null
          scope?: Database["public"]["Enums"]["seo_scope"]
          scope_key?: string
          window?: Database["public"]["Enums"]["seo_window"]
        }
        Relationships: []
      }
      seo_daily_briefing: {
        Row: {
          alerts_count: number | null
          briefing_date: string
          created_at: string
          id: string
          metrics_snapshot: Json | null
          pipeline_run_id: string | null
          prompts_generated: number | null
          summary_de: string | null
          summary_en: string | null
          tasks_created: number | null
        }
        Insert: {
          alerts_count?: number | null
          briefing_date: string
          created_at?: string
          id?: string
          metrics_snapshot?: Json | null
          pipeline_run_id?: string | null
          prompts_generated?: number | null
          summary_de?: string | null
          summary_en?: string | null
          tasks_created?: number | null
        }
        Update: {
          alerts_count?: number | null
          briefing_date?: string
          created_at?: string
          id?: string
          metrics_snapshot?: Json | null
          pipeline_run_id?: string | null
          prompts_generated?: number | null
          summary_de?: string | null
          summary_en?: string | null
          tasks_created?: number | null
        }
        Relationships: []
      }
      seo_page_catalog: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          is_active: boolean
          notes: string | null
          page_type: Database["public"]["Enums"]["seo_page_type"]
          path: string
          target_keywords: string[] | null
          title_de: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          page_type?: Database["public"]["Enums"]["seo_page_type"]
          path: string
          target_keywords?: string[] | null
          title_de?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          page_type?: Database["public"]["Enums"]["seo_page_type"]
          path?: string
          target_keywords?: string[] | null
          title_de?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_pipeline_run: {
        Row: {
          alerts_detected: number | null
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          prompts_generated: number | null
          started_at: string
          status: string
          steps_completed: string[] | null
          tasks_created: number | null
        }
        Insert: {
          alerts_detected?: number | null
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          prompts_generated?: number | null
          started_at?: string
          status?: string
          steps_completed?: string[] | null
          tasks_created?: number | null
        }
        Update: {
          alerts_detected?: number | null
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          prompts_generated?: number | null
          started_at?: string
          status?: string
          steps_completed?: string[] | null
          tasks_created?: number | null
        }
        Relationships: []
      }
      seo_prompt_pack: {
        Row: {
          alert_event_id: string | null
          area: Database["public"]["Enums"]["seo_prompt_area"]
          context_data: Json | null
          created_at: string
          executed_at: string | null
          id: string
          is_executed: boolean
          prompt_text: string
          result_summary: string | null
          task_id: string | null
          title: string
        }
        Insert: {
          alert_event_id?: string | null
          area: Database["public"]["Enums"]["seo_prompt_area"]
          context_data?: Json | null
          created_at?: string
          executed_at?: string | null
          id?: string
          is_executed?: boolean
          prompt_text: string
          result_summary?: string | null
          task_id?: string | null
          title: string
        }
        Update: {
          alert_event_id?: string | null
          area?: Database["public"]["Enums"]["seo_prompt_area"]
          context_data?: Json | null
          created_at?: string
          executed_at?: string | null
          id?: string
          is_executed?: boolean
          prompt_text?: string
          result_summary?: string | null
          task_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_prompt_pack_alert_event_id_fkey"
            columns: ["alert_event_id"]
            isOneToOne: false
            referencedRelation: "seo_alert_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_prompt_pack_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "seo_task"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_task: {
        Row: {
          affected_path: string | null
          alert_event_id: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["seo_severity"]
          prompt_pack_id: string | null
          status: Database["public"]["Enums"]["seo_task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          affected_path?: string | null
          alert_event_id?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["seo_severity"]
          prompt_pack_id?: string | null
          status?: Database["public"]["Enums"]["seo_task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          affected_path?: string | null
          alert_event_id?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["seo_severity"]
          prompt_pack_id?: string | null
          status?: Database["public"]["Enums"]["seo_task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_task_alert_event_id_fkey"
            columns: ["alert_event_id"]
            isOneToOne: false
            referencedRelation: "seo_alert_event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_task_prompt_pack_id_fkey"
            columns: ["prompt_pack_id"]
            isOneToOne: false
            referencedRelation: "seo_prompt_pack"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      boost_severity: {
        Args: {
          p_base: Database["public"]["Enums"]["seo_severity"]
          p_page_type: Database["public"]["Enums"]["seo_page_type"]
        }
        Returns: Database["public"]["Enums"]["seo_severity"]
      }
      get_page_type: {
        Args: { p_path: string }
        Returns: Database["public"]["Enums"]["seo_page_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      normalize_seo_path: { Args: { p_url: string }; Returns: string }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "admin" | "staff"
      menu_type:
        | "lunch"
        | "food"
        | "drinks"
        | "christmas"
        | "valentines"
        | "special"
      seo_alert_status: "open" | "acknowledged" | "resolved" | "false_positive"
      seo_page_type:
        | "money"
        | "pillar"
        | "cluster"
        | "trust"
        | "legal"
        | "legacy"
      seo_prompt_area:
        | "redirects"
        | "titles"
        | "content"
        | "schema"
        | "internal_linking"
        | "new_page"
        | "canonicalization"
        | "technical"
      seo_scope:
        | "site"
        | "page"
        | "query"
        | "canonical_group"
        | "device"
        | "country"
        | "appearance"
      seo_severity: "low" | "medium" | "high" | "critical"
      seo_task_status: "open" | "in_progress" | "done" | "wont_fix"
      seo_window: "daily" | "wow" | "mom"
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
      app_role: ["admin", "staff"],
      menu_type: [
        "lunch",
        "food",
        "drinks",
        "christmas",
        "valentines",
        "special",
      ],
      seo_alert_status: ["open", "acknowledged", "resolved", "false_positive"],
      seo_page_type: ["money", "pillar", "cluster", "trust", "legal", "legacy"],
      seo_prompt_area: [
        "redirects",
        "titles",
        "content",
        "schema",
        "internal_linking",
        "new_page",
        "canonicalization",
        "technical",
      ],
      seo_scope: [
        "site",
        "page",
        "query",
        "canonical_group",
        "device",
        "country",
        "appearance",
      ],
      seo_severity: ["low", "medium", "high", "critical"],
      seo_task_status: ["open", "in_progress", "done", "wont_fix"],
      seo_window: ["daily", "wow", "mom"],
    },
  },
} as const
