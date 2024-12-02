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
      area_and_weight_cost: {
        Row: {
          cost_extra_per_kg: number
          distribution_costs_id: string
          id: string
        }
        Insert: {
          cost_extra_per_kg?: number
          distribution_costs_id?: string
          id?: string
        }
        Update: {
          cost_extra_per_kg?: number
          distribution_costs_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_and_weight_cost_distribution_costs_id_fkey"
            columns: ["distribution_costs_id"]
            isOneToOne: true
            referencedRelation: "distribution_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      area_and_weight_information: {
        Row: {
          area_and_weight_cost_id: string
          coverage_area_id: string
          distributor_id: string
          id: string
        }
        Insert: {
          area_and_weight_cost_id?: string
          coverage_area_id?: string
          distributor_id?: string
          id?: string
        }
        Update: {
          area_and_weight_cost_id?: string
          coverage_area_id?: string
          distributor_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "area_and_weight_information_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributor_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "area_and_weight_information_sub_re_area_and_weight_cost_id_fkey"
            columns: ["area_and_weight_cost_id"]
            isOneToOne: false
            referencedRelation: "area_and_weight_cost"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "area_and_weight_information_sub_region_coverage_id_fkey"
            columns: ["coverage_area_id"]
            isOneToOne: false
            referencedRelation: "coverage_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      area_weight_cost_range: {
        Row: {
          area_and_weight_information_id: string | null
          base_cost: number | null
          id: string
          weight_from: number | null
          weight_to: number | null
        }
        Insert: {
          area_and_weight_information_id?: string | null
          base_cost?: number | null
          id?: string
          weight_from?: number | null
          weight_to?: number | null
        }
        Update: {
          area_and_weight_information_id?: string | null
          base_cost?: number | null
          id?: string
          weight_from?: number | null
          weight_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "area_weight_cost_range_sub_re_area_and_weight_information__fkey"
            columns: ["area_and_weight_information_id"]
            isOneToOne: false
            referencedRelation: "area_and_weight_information"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          img_url: string | null
          name: string | null
          product_id: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          img_url?: string | null
          name?: string | null
          product_id?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          img_url?: string | null
          name?: string | null
          product_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      beers: {
        Row: {
          aroma: string | null
          brewers_note: string | null
          category: string | null
          color: string | null
          consumption_temperature: number | null
          created_at: string | null
          ebc: number | null
          family: string | null
          fermentation: string | null
          fg: number | null
          format: string | null
          hops_type: string | null
          ibu: number | null
          ingredients: string[] | null
          intensity: number | null
          is_gluten: boolean | null
          malt_type: string | null
          og: number | null
          pairing: string | null
          product_id: string
          recommended_glass: string | null
          sku: string | null
          srm: number | null
          volume: number | null
          weight: number | null
        }
        Insert: {
          aroma?: string | null
          brewers_note?: string | null
          category?: string | null
          color?: string | null
          consumption_temperature?: number | null
          created_at?: string | null
          ebc?: number | null
          family?: string | null
          fermentation?: string | null
          fg?: number | null
          format?: string | null
          hops_type?: string | null
          ibu?: number | null
          ingredients?: string[] | null
          intensity?: number | null
          is_gluten?: boolean | null
          malt_type?: string | null
          og?: number | null
          pairing?: string | null
          product_id: string
          recommended_glass?: string | null
          sku?: string | null
          srm?: number | null
          volume?: number | null
          weight?: number | null
        }
        Update: {
          aroma?: string | null
          brewers_note?: string | null
          category?: string | null
          color?: string | null
          consumption_temperature?: number | null
          created_at?: string | null
          ebc?: number | null
          family?: string | null
          fermentation?: string | null
          fg?: number | null
          format?: string | null
          hops_type?: string | null
          ibu?: number | null
          ingredients?: string[] | null
          intensity?: number | null
          is_gluten?: boolean | null
          malt_type?: string | null
          og?: number | null
          pairing?: string | null
          product_id?: string
          recommended_glass?: string | null
          sku?: string | null
          srm?: number | null
          volume?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "beers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_info: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          document_id: string | null
          id: string
          is_company: boolean | null
          is_default: boolean | null
          lastname: string | null
          name: string | null
          owner_id: string | null
          phone: string | null
          region: string | null
          sub_region: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          is_company?: boolean | null
          is_default?: boolean | null
          lastname?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          region?: string | null
          sub_region?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          is_company?: boolean | null
          is_default?: boolean | null
          lastname?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          region?: string | null
          sub_region?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_experience_participants: {
        Row: {
          correct_answers: number | null
          cp_id: string | null
          created_at: string
          event_id: string | null
          experience_id: string | null
          gamification_id: string | null
          id: string
          incorrect_answers: number | null
          is_cash: boolean | null
          is_finished: boolean | null
          is_paid: boolean | null
          score: number | null
        }
        Insert: {
          correct_answers?: number | null
          cp_id?: string | null
          created_at?: string
          event_id?: string | null
          experience_id?: string | null
          gamification_id?: string | null
          id?: string
          incorrect_answers?: number | null
          is_cash?: boolean | null
          is_finished?: boolean | null
          is_paid?: boolean | null
          score?: number | null
        }
        Update: {
          correct_answers?: number | null
          cp_id?: string | null
          created_at?: string
          event_id?: string | null
          experience_id?: string | null
          gamification_id?: string | null
          id?: string
          incorrect_answers?: number | null
          is_cash?: boolean | null
          is_finished?: boolean | null
          is_paid?: boolean | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bm_experience_participants_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_master_experience_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_master_experience_participants_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_beer_master_participation_gamification_id_fkey"
            columns: ["gamification_id"]
            isOneToOne: false
            referencedRelation: "gamification"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bm_experience_user_responses: {
        Row: {
          answer: string | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          participation_id: string | null
          question_id: string | null
          score: number | null
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          participation_id?: string | null
          question_id?: string | null
          score?: number | null
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          participation_id?: string | null
          question_id?: string | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_beer_master_experience_user_response_participation_id_fk"
            columns: ["participation_id"]
            isOneToOne: false
            referencedRelation: "bm_experience_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_bm_experience_user_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "bm_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_game_organizers: {
        Row: {
          bm_game_id: string
          created_at: string
          owner_id: string
        }
        Insert: {
          bm_game_id?: string
          created_at?: string
          owner_id?: string
        }
        Update: {
          bm_game_id?: string
          created_at?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bm_game_organizers_bm_game_id_fkey"
            columns: ["bm_game_id"]
            isOneToOne: false
            referencedRelation: "bm_steps_game_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bm_game_organizers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_game_participants: {
        Row: {
          bm_game_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          bm_game_id?: string
          created_at?: string
          user_id?: string
        }
        Update: {
          bm_game_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bm_game_participants_bm_game_id_fkey"
            columns: ["bm_game_id"]
            isOneToOne: false
            referencedRelation: "bm_steps_game_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bm_game_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_game_steps_registered: {
        Row: {
          correct_answers: number | null
          created_at: string
          current_question_index: number | null
          is_completed: boolean | null
          is_qr_scanned: boolean | null
          is_unlocked: boolean | null
          step_id: string
          time_spent: number | null
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string
          current_question_index?: number | null
          is_completed?: boolean | null
          is_qr_scanned?: boolean | null
          is_unlocked?: boolean | null
          step_id?: string
          time_spent?: number | null
          user_id?: string
        }
        Update: {
          correct_answers?: number | null
          created_at?: string
          current_question_index?: number | null
          is_completed?: boolean | null
          is_qr_scanned?: boolean | null
          is_unlocked?: boolean | null
          step_id?: string
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bm_game_steps_registered_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "bm_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bm_game_steps_registered_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_questions: {
        Row: {
          category: string | null
          correct_answer: string | null
          difficulty: string | null
          experience_id: string | null
          id: string
          incorrect_answers: string[] | null
          product_id: string | null
          question: string | null
          type: string | null
        }
        Insert: {
          category?: string | null
          correct_answer?: string | null
          difficulty?: string | null
          experience_id?: string | null
          id?: string
          incorrect_answers?: string[] | null
          product_id?: string | null
          question?: string | null
          type?: string | null
        }
        Update: {
          category?: string | null
          correct_answer?: string | null
          difficulty?: string | null
          experience_id?: string | null
          id?: string
          incorrect_answers?: string[] | null
          product_id?: string | null
          question?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_bm_question_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_bm_question_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_steps: {
        Row: {
          bm_state_id: string | null
          correct_answers: number | null
          created_at: string
          current_question_index: number | null
          description: string | null
          id: string
          is_completed: boolean | null
          is_qr_scanned: boolean | null
          is_unlocked: boolean | null
          last_visited: string | null
          location: string | null
          step_number: number | null
          time_spent: number | null
          title: string | null
        }
        Insert: {
          bm_state_id?: string | null
          correct_answers?: number | null
          created_at?: string
          current_question_index?: number | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          is_qr_scanned?: boolean | null
          is_unlocked?: boolean | null
          last_visited?: string | null
          location?: string | null
          step_number?: number | null
          time_spent?: number | null
          title?: string | null
        }
        Update: {
          bm_state_id?: string | null
          correct_answers?: number | null
          created_at?: string
          current_question_index?: number | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          is_qr_scanned?: boolean | null
          is_unlocked?: boolean | null
          last_visited?: string | null
          location?: string | null
          step_number?: number | null
          time_spent?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bm_steps_bm_state_id_fkey"
            columns: ["bm_state_id"]
            isOneToOne: false
            referencedRelation: "bm_steps_game_state"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_steps_achievements: {
        Row: {
          bm_game_id: string | null
          description: string | null
          how_to_achieve: string | null
          icon: string | null
          id: string
          name: string | null
          points: number | null
          progress: number | null
          rarity: string | null
          share_message: string | null
          target: number | null
          type: string | null
          unlocked_at: string | null
        }
        Insert: {
          bm_game_id?: string | null
          description?: string | null
          how_to_achieve?: string | null
          icon?: string | null
          id?: string
          name?: string | null
          points?: number | null
          progress?: number | null
          rarity?: string | null
          share_message?: string | null
          target?: number | null
          type?: string | null
          unlocked_at?: string | null
        }
        Update: {
          bm_game_id?: string | null
          description?: string | null
          how_to_achieve?: string | null
          icon?: string | null
          id?: string
          name?: string | null
          points?: number | null
          progress?: number | null
          rarity?: string | null
          share_message?: string | null
          target?: number | null
          type?: string | null
          unlocked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bm_steps_achievements_bm_game_id_fkey"
            columns: ["bm_game_id"]
            isOneToOne: false
            referencedRelation: "bm_steps_game_state"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_steps_game_state: {
        Row: {
          created_at: string
          current_step: number | null
          description: string | null
          event_id: string | null
          id: string
          location: string | null
          progress: number | null
          title: string | null
          total_points: number | null
          total_steps: number | null
        }
        Insert: {
          created_at?: string
          current_step?: number | null
          description?: string | null
          event_id?: string | null
          id?: string
          location?: string | null
          progress?: number | null
          title?: string | null
          total_points?: number | null
          total_steps?: number | null
        }
        Update: {
          created_at?: string
          current_step?: number | null
          description?: string | null
          event_id?: string | null
          id?: string
          location?: string | null
          progress?: number | null
          title?: string | null
          total_points?: number | null
          total_steps?: number | null
        }
        Relationships: []
      }
      bm_steps_questions: {
        Row: {
          answered: boolean | null
          bm_step_id: string | null
          correct_answer: number | null
          created_at: string
          difficulty: string | null
          explanation: string | null
          id: string
          options: string[] | null
          points: number | null
          text: string | null
        }
        Insert: {
          answered?: boolean | null
          bm_step_id?: string | null
          correct_answer?: number | null
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: string[] | null
          points?: number | null
          text?: string | null
        }
        Update: {
          answered?: boolean | null
          bm_step_id?: string | null
          correct_answer?: number | null
          created_at?: string
          difficulty?: string | null
          explanation?: string | null
          id?: string
          options?: string[] | null
          points?: number | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bm_steps_questions_bm_step_id_fkey"
            columns: ["bm_step_id"]
            isOneToOne: false
            referencedRelation: "bm_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      bm_steps_rewards: {
        Row: {
          bm_step_id: string | null
          claim_location: string | null
          claimed: boolean | null
          correct_answers: number | null
          description: string | null
          id: string
          name: string | null
          total_questions: number | null
        }
        Insert: {
          bm_step_id?: string | null
          claim_location?: string | null
          claimed?: boolean | null
          correct_answers?: number | null
          description?: string | null
          id?: string
          name?: string | null
          total_questions?: number | null
        }
        Update: {
          bm_step_id?: string | null
          claim_location?: string | null
          claimed?: boolean | null
          correct_answers?: number | null
          description?: string | null
          id?: string
          name?: string | null
          total_questions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bm_steps_rewards_bm_step_id_fkey"
            columns: ["bm_step_id"]
            isOneToOne: false
            referencedRelation: "bm_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      box_pack_items: {
        Row: {
          box_pack_id: string | null
          id: string
          product_id: string | null
          quantity: number | null
          slots_per_product: number | null
        }
        Insert: {
          box_pack_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          slots_per_product?: number | null
        }
        Update: {
          box_pack_id?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          slots_per_product?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "box_pack_items_box_pack_id_fkey"
            columns: ["box_pack_id"]
            isOneToOne: false
            referencedRelation: "box_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_pack_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      box_packs: {
        Row: {
          id: string
          product_id: string | null
          slots_per_box: number | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          slots_per_box?: number | null
        }
        Update: {
          id?: string
          product_id?: string | null
          slots_per_box?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_box_pack_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      breweries: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string | null
          foundation_year: number | null
          guided_tours: string | null
          history: string | null
          id: string
          logo: string | null
          name: string | null
          producer_id: string | null
          region: string | null
          rrss_fb: string | null
          rrss_ig: string | null
          rrss_linkedin: string | null
          special_processing_methods: string[] | null
          sub_region: string | null
          types_of_beers_produced: string[] | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          foundation_year?: number | null
          guided_tours?: string | null
          history?: string | null
          id?: string
          logo?: string | null
          name?: string | null
          producer_id?: string | null
          region?: string | null
          rrss_fb?: string | null
          rrss_ig?: string | null
          rrss_linkedin?: string | null
          special_processing_methods?: string[] | null
          sub_region?: string | null
          types_of_beers_produced?: string[] | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          foundation_year?: number | null
          guided_tours?: string | null
          history?: string | null
          id?: string
          logo?: string | null
          name?: string | null
          producer_id?: string | null
          region?: string | null
          rrss_fb?: string | null
          rrss_ig?: string | null
          rrss_linkedin?: string | null
          special_processing_methods?: string[] | null
          sub_region?: string | null
          types_of_beers_produced?: string[] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brewery_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      business_orders: {
        Row: {
          created_at: string | null
          distributor_id: string | null
          id: string
          invoice_period: string | null
          net_revenue_distributor: number | null
          net_revenue_producer: number | null
          order_id: string | null
          platform_comission_distributor: number | null
          platform_comission_producer: number | null
          producer_id: string | null
          status: string | null
          total_sales: number | null
          tracking_id: string | null
        }
        Insert: {
          created_at?: string | null
          distributor_id?: string | null
          id?: string
          invoice_period?: string | null
          net_revenue_distributor?: number | null
          net_revenue_producer?: number | null
          order_id?: string | null
          platform_comission_distributor?: number | null
          platform_comission_producer?: number | null
          producer_id?: string | null
          status?: string | null
          total_sales?: number | null
          tracking_id?: string | null
        }
        Update: {
          created_at?: string | null
          distributor_id?: string | null
          id?: string
          invoice_period?: string | null
          net_revenue_distributor?: number | null
          net_revenue_producer?: number | null
          order_id?: string | null
          platform_comission_distributor?: number | null
          platform_comission_producer?: number | null
          producer_id?: string | null
          status?: string | null
          total_sales?: number | null
          tracking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_orders_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributor_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "business_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_orders_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "business_orders_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "shipment_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_item: {
        Row: {
          campaign_id: string
          created_at: string | null
          product_id: string
          product_price: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          product_id: string
          product_price?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          product_id?: string
          product_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_item_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: true
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_item_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          campaign_discount: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          goal: string | null
          id: string
          img_url: string | null
          is_public: boolean | null
          name: string | null
          owner_id: string | null
          slogan: string | null
          social_cause: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          campaign_discount?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          img_url?: string | null
          is_public?: boolean | null
          name?: string | null
          owner_id?: string | null
          slogan?: string | null
          social_cause?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          campaign_discount?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          img_url?: string | null
          is_public?: boolean | null
          name?: string | null
          owner_id?: string | null
          slogan?: string | null
          social_cause?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consumption_point_user: {
        Row: {
          company_description: string | null
          company_name: string | null
          created_at: string
          is_authorized: boolean | null
          user_id: string
        }
        Insert: {
          company_description?: string | null
          company_name?: string | null
          created_at?: string
          is_authorized?: boolean | null
          user_id?: string
        }
        Update: {
          company_description?: string | null
          company_name?: string | null
          created_at?: string
          is_authorized?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumption_point_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consumption_points: {
        Row: {
          cover_letter_name: string | null
          cp_organizer_status: number | null
          created_at: string | null
          cv_name: string | null
          id: string
          owner_id: string | null
        }
        Insert: {
          cover_letter_name?: string | null
          cp_organizer_status?: number | null
          created_at?: string | null
          cv_name?: string | null
          id?: string
          owner_id?: string | null
        }
        Update: {
          cover_letter_name?: string | null
          cp_organizer_status?: number | null
          created_at?: string | null
          cv_name?: string | null
          id?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consumption_points_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coverage_areas: {
        Row: {
          administrative_division: string
          city: string | null
          country: string
          country_iso_code: string
          distributor_id: string
          id: string
          region: string
          sub_region: string | null
        }
        Insert: {
          administrative_division: string
          city?: string | null
          country?: string
          country_iso_code?: string
          distributor_id?: string
          id?: string
          region: string
          sub_region?: string | null
        }
        Update: {
          administrative_division?: string
          city?: string | null
          country?: string
          country_iso_code?: string
          distributor_id?: string
          id?: string
          region?: string
          sub_region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coverage_areas__distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributor_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cp: {
        Row: {
          address: string | null
          cp_description: string | null
          cp_id: string | null
          cp_name: string | null
          created_at: string
          geoArgs: Json | null
          id: string
          is_booking_required: boolean | null
          is_internal_organizer: boolean | null
          logo_url: string | null
          maximum_capacity: number | null
          organizer_email: string | null
          organizer_lastname: string | null
          organizer_name: string | null
          organizer_phone: string | null
          owner_id: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          cp_description?: string | null
          cp_id?: string | null
          cp_name?: string | null
          created_at?: string
          geoArgs?: Json | null
          id?: string
          is_booking_required?: boolean | null
          is_internal_organizer?: boolean | null
          logo_url?: string | null
          maximum_capacity?: number | null
          organizer_email?: string | null
          organizer_lastname?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          owner_id?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          cp_description?: string | null
          cp_id?: string | null
          cp_name?: string | null
          created_at?: string
          geoArgs?: Json | null
          id?: string
          is_booking_required?: boolean | null
          is_internal_organizer?: boolean | null
          logo_url?: string | null
          maximum_capacity?: number | null
          organizer_email?: string | null
          organizer_lastname?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          owner_id?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cp_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "consumption_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cp_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cp_events: {
        Row: {
          cp_id: string | null
          created_at: string
          end_date: string | null
          event_id: string | null
          id: string
          is_active: boolean | null
          is_cervezanas_event: boolean | null
          owner_id: string | null
          start_date: string | null
        }
        Insert: {
          cp_id?: string | null
          created_at?: string
          end_date?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          is_cervezanas_event?: boolean | null
          owner_id?: string | null
          start_date?: string | null
        }
        Update: {
          cp_id?: string | null
          created_at?: string
          end_date?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          is_cervezanas_event?: boolean | null
          owner_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cp_events_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cp_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      cp_fixed: {
        Row: {
          address: string | null
          cp_description: string | null
          cp_id: string | null
          cp_name: string | null
          created_at: string | null
          end_date: string | null
          geoArgs: Json | null
          id: string
          is_booking_required: boolean | null
          is_internal_organizer: boolean | null
          logo_url: string | null
          maximum_capacity: number | null
          organizer_email: string | null
          organizer_lastname: string | null
          organizer_name: string | null
          organizer_phone: string | null
          owner_id: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          cp_description?: string | null
          cp_id?: string | null
          cp_name?: string | null
          created_at?: string | null
          end_date?: string | null
          geoArgs?: Json | null
          id?: string
          is_booking_required?: boolean | null
          is_internal_organizer?: boolean | null
          logo_url?: string | null
          maximum_capacity?: number | null
          organizer_email?: string | null
          organizer_lastname?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          cp_description?: string | null
          cp_id?: string | null
          cp_name?: string | null
          created_at?: string | null
          end_date?: string | null
          geoArgs?: Json | null
          id?: string
          is_booking_required?: boolean | null
          is_internal_organizer?: boolean | null
          logo_url?: string | null
          maximum_capacity?: number | null
          organizer_email?: string | null
          organizer_lastname?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cp_fixed_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "consumption_points"
            referencedColumns: ["id"]
          },
        ]
      }
      cp_mobile: {
        Row: {
          address: string | null
          cp_description: string | null
          cp_id: string | null
          cp_name: string | null
          created_at: string | null
          end_date: string | null
          geoArgs: Json | null
          id: string
          is_booking_required: boolean | null
          is_internal_organizer: boolean | null
          logo_url: string | null
          maximum_capacity: number | null
          organizer_email: string | null
          organizer_lastname: string | null
          organizer_name: string | null
          organizer_phone: string | null
          owner_id: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          cp_description?: string | null
          cp_id?: string | null
          cp_name?: string | null
          created_at?: string | null
          end_date?: string | null
          geoArgs?: Json | null
          id?: string
          is_booking_required?: boolean | null
          is_internal_organizer?: boolean | null
          logo_url?: string | null
          maximum_capacity?: number | null
          organizer_email?: string | null
          organizer_lastname?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          cp_description?: string | null
          cp_id?: string | null
          cp_name?: string | null
          created_at?: string | null
          end_date?: string | null
          geoArgs?: Json | null
          id?: string
          is_booking_required?: boolean | null
          is_internal_organizer?: boolean | null
          logo_url?: string | null
          maximum_capacity?: number | null
          organizer_email?: string | null
          organizer_lastname?: string | null
          organizer_name?: string | null
          organizer_phone?: string | null
          owner_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cp_mobile_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "consumption_points"
            referencedColumns: ["id"]
          },
        ]
      }
      cp_products: {
        Row: {
          cp_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          pack_name: string | null
          price: number | null
          product_name: string | null
          product_pack_id: string | null
          quantity: number | null
          stock: number | null
          stock_consumed: number | null
        }
        Insert: {
          cp_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          pack_name?: string | null
          price?: number | null
          product_name?: string | null
          product_pack_id?: string | null
          quantity?: number | null
          stock?: number | null
          stock_consumed?: number | null
        }
        Update: {
          cp_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          pack_name?: string | null
          price?: number | null
          product_name?: string | null
          product_pack_id?: string | null
          quantity?: number | null
          stock?: number | null
          stock_consumed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cp_products_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cp_products_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: false
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      cpf_events: {
        Row: {
          cp_id: string
          created_at: string | null
          event_id: string
          is_active: boolean | null
          is_cervezanas_event: boolean | null
          owner_id: string | null
        }
        Insert: {
          cp_id: string
          created_at?: string | null
          event_id: string
          is_active?: boolean | null
          is_cervezanas_event?: boolean | null
          owner_id?: string | null
        }
        Update: {
          cp_id?: string
          created_at?: string | null
          event_id?: string
          is_active?: boolean | null
          is_cervezanas_event?: boolean | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpf_events_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp_fixed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpf_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      cpf_products: {
        Row: {
          cp_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          product_pack_id: string | null
          stock: number | null
          stock_consumed: number | null
        }
        Insert: {
          cp_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          product_pack_id?: string | null
          stock?: number | null
          stock_consumed?: number | null
        }
        Update: {
          cp_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          product_pack_id?: string | null
          stock?: number | null
          stock_consumed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cpf_products_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp_fixed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpf_products_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: true
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      cpm_events: {
        Row: {
          cp_id: string
          event_id: string
          id: string
          is_active: boolean | null
          is_cervezanas_event: boolean | null
          owner_id: string | null
        }
        Insert: {
          cp_id: string
          event_id: string
          id?: string
          is_active?: boolean | null
          is_cervezanas_event?: boolean | null
          owner_id?: string | null
        }
        Update: {
          cp_id?: string
          event_id?: string
          id?: string
          is_active?: boolean | null
          is_cervezanas_event?: boolean | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cpm_events_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp_mobile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpm_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      cpm_products: {
        Row: {
          cp_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          price: number | null
          product_pack_id: string | null
          stock: number | null
          stock_consumed: number | null
        }
        Insert: {
          cp_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          product_pack_id?: string | null
          stock?: number | null
          stock_consumed?: number | null
        }
        Update: {
          cp_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          product_pack_id?: string | null
          stock?: number | null
          stock_consumed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cpm_products_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp_mobile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cpm_products_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: false
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      customize_settings: {
        Row: {
          colors: Json | null
          created_at: string | null
          family_styles: Json | null
          id: string
          owner_id: string
        }
        Insert: {
          colors?: Json | null
          created_at?: string | null
          family_styles?: Json | null
          id?: string
          owner_id: string
        }
        Update: {
          colors?: Json | null
          created_at?: string | null
          family_styles?: Json | null
          id?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customize_settings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      distribution: {
        Row: {
          business_order_id: string | null
          created_at: string | null
          delivery_date: string | null
          estimated_time: number | null
          feedback: string | null
          id: string
          order_status: string | null
          origin_distributor: string | null
          price: number | null
          shipment_date: string | null
          type: string | null
        }
        Insert: {
          business_order_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          estimated_time?: number | null
          feedback?: string | null
          id?: string
          order_status?: string | null
          origin_distributor?: string | null
          price?: number | null
          shipment_date?: string | null
          type?: string | null
        }
        Update: {
          business_order_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          estimated_time?: number | null
          feedback?: string | null
          id?: string
          order_status?: string | null
          origin_distributor?: string | null
          price?: number | null
          shipment_date?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distribution_business_order_id_fkey"
            columns: ["business_order_id"]
            isOneToOne: true
            referencedRelation: "business_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribution_origin_distributor_fkey"
            columns: ["origin_distributor"]
            isOneToOne: true
            referencedRelation: "distributor_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      distribution_contracts: {
        Row: {
          created_at: string
          distributor_accepted: boolean | null
          distributor_id: string
          message: string | null
          producer_accepted: boolean | null
          producer_id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          distributor_accepted?: boolean | null
          distributor_id: string
          message?: string | null
          producer_accepted?: boolean | null
          producer_id: string
          status?: string | null
        }
        Update: {
          created_at?: string
          distributor_accepted?: boolean | null
          distributor_id?: string
          message?: string | null
          producer_accepted?: boolean | null
          producer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distribution_contracts_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributor_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "distribution_contracts_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      distribution_costs: {
        Row: {
          created_at: string
          distribution_costs_in_product: boolean
          distributor_id: string
          id: string
          selected_method: string
        }
        Insert: {
          created_at?: string
          distribution_costs_in_product?: boolean
          distributor_id: string
          id?: string
          selected_method?: string
        }
        Update: {
          created_at?: string
          distribution_costs_in_product?: boolean
          distributor_id?: string
          id?: string
          selected_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribution_costs_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: true
            referencedRelation: "distributor_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      distributor_user: {
        Row: {
          bank_account: string | null
          company_description: string | null
          company_email: string | null
          company_fb: string | null
          company_history_description: string | null
          company_history_year: number | null
          company_ig: string | null
          company_legal_representative: string | null
          company_linkedin: string | null
          company_logo: string | null
          company_mission: string | null
          company_name: string | null
          company_phone: string | null
          company_values: string | null
          company_vision: string | null
          company_website: string | null
          created_at: string | null
          id_number: string | null
          is_active: boolean | null
          is_authorized: boolean | null
          location_id: string | null
          opening_hours: Json | null
          user_id: string
        }
        Insert: {
          bank_account?: string | null
          company_description?: string | null
          company_email?: string | null
          company_fb?: string | null
          company_history_description?: string | null
          company_history_year?: number | null
          company_ig?: string | null
          company_legal_representative?: string | null
          company_linkedin?: string | null
          company_logo?: string | null
          company_mission?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_values?: string | null
          company_vision?: string | null
          company_website?: string | null
          created_at?: string | null
          id_number?: string | null
          is_active?: boolean | null
          is_authorized?: boolean | null
          location_id?: string | null
          opening_hours?: Json | null
          user_id: string
        }
        Update: {
          bank_account?: string | null
          company_description?: string | null
          company_email?: string | null
          company_fb?: string | null
          company_history_description?: string | null
          company_history_year?: number | null
          company_ig?: string | null
          company_legal_representative?: string | null
          company_linkedin?: string | null
          company_logo?: string | null
          company_mission?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_values?: string | null
          company_vision?: string | null
          company_website?: string | null
          created_at?: string | null
          id_number?: string | null
          is_active?: boolean | null
          is_authorized?: boolean | null
          location_id?: string | null
          opening_hours?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "distributor_user_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "profile_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distributor_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_experiences: {
        Row: {
          cp_id: string | null
          created_at: string
          event_id: string | null
          experience_id: string | null
          id: string
        }
        Insert: {
          cp_id?: string | null
          created_at?: string
          event_id?: string | null
          experience_id?: string | null
          id?: string
        }
        Update: {
          cp_id?: string | null
          created_at?: string
          event_id?: string | null
          experience_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_experiences_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_event_experiences_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_event_experiences_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      event_order_cps: {
        Row: {
          cp_id: string | null
          created_at: string
          event_order_id: string | null
          id: string
          notes: string | null
          order_number: string | null
          status: string | null
        }
        Insert: {
          cp_id?: string | null
          created_at?: string
          event_order_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          status?: string | null
        }
        Update: {
          cp_id?: string | null
          created_at?: string
          event_order_id?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_order_cps_cp_id_fkey"
            columns: ["cp_id"]
            isOneToOne: false
            referencedRelation: "cp_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_order_cps_event_order_id_fkey"
            columns: ["event_order_id"]
            isOneToOne: false
            referencedRelation: "event_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      event_order_items: {
        Row: {
          created_at: string | null
          event_order_cp_id: string
          id: string
          is_reviewed: boolean | null
          product_pack_id: string
          quantity: number | null
          quantity_served: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          event_order_cp_id: string
          id?: string
          is_reviewed?: boolean | null
          product_pack_id: string
          quantity?: number | null
          quantity_served?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          event_order_cp_id?: string
          id?: string
          is_reviewed?: boolean | null
          product_pack_id?: string
          quantity?: number | null
          quantity_served?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_order_items_event_order_cp_id_fkey"
            columns: ["event_order_cp_id"]
            isOneToOne: false
            referencedRelation: "event_order_cps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_order_items_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: false
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      event_orders: {
        Row: {
          created_at: string | null
          currency: string | null
          customer_id: string | null
          discount: number | null
          discount_code: string | null
          event_id: string | null
          id: string
          order_number: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          discount?: number | null
          discount_code?: string | null
          event_id?: string | null
          id?: string
          order_number?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          discount?: number | null
          discount_code?: string | null
          event_id?: string | null
          id?: string
          order_number?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participation: {
        Row: {
          attendance_date: string | null
          consumer_id: string | null
          created_at: string
          event_id: string | null
          id: string
          is_following: boolean | null
        }
        Insert: {
          attendance_date?: string | null
          consumer_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_following?: boolean | null
        }
        Update: {
          attendance_date?: string | null
          consumer_id?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          is_following?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "public_event_participation_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_event_participation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          geoArgs: Json | null
          id: string
          is_activated: boolean | null
          is_cervezanas_event: boolean | null
          logo_url: string | null
          name: string | null
          owner_id: string | null
          promotional_url: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          geoArgs?: Json | null
          id?: string
          is_activated?: boolean | null
          is_cervezanas_event?: boolean | null
          logo_url?: string | null
          name?: string | null
          owner_id?: string | null
          promotional_url?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          geoArgs?: Json | null
          id?: string
          is_activated?: boolean | null
          is_cervezanas_event?: boolean | null
          logo_url?: string | null
          name?: string | null
          owner_id?: string | null
          promotional_url?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
          price: number | null
          producer_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          price?: number | null
          producer_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          price?: number | null
          producer_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_beer_master_experience_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fixed_event_order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          stock_original: number | null
          stock_to_consume: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          stock_original?: number | null
          stock_to_consume?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          stock_original?: number | null
          stock_to_consume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fixed_event_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "fixed_event_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_event_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      fixed_event_orders: {
        Row: {
          cp_f_owner: string | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          discount: number | null
          discount_code: string | null
          id: string
          order_number: string | null
          payment_method: string | null
          status: string | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          cp_f_owner?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          discount?: number | null
          discount_code?: string | null
          id?: string
          order_number?: string | null
          payment_method?: string | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          cp_f_owner?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          discount?: number | null
          discount_code?: string | null
          id?: string
          order_number?: string | null
          payment_method?: string | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixed_event_orders_cp_f_owner_fkey"
            columns: ["cp_f_owner"]
            isOneToOne: true
            referencedRelation: "cp_fixed"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_event_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flatrate_and_weight_cost: {
        Row: {
          base_cost: number | null
          created_at: string
          distribution_costs_id: string
          id: string
          updated_at: string | null
          weight_from: number | null
          weight_to: number | null
        }
        Insert: {
          base_cost?: number | null
          created_at?: string
          distribution_costs_id: string
          id?: string
          updated_at?: string | null
          weight_from?: number | null
          weight_to?: number | null
        }
        Update: {
          base_cost?: number | null
          created_at?: string
          distribution_costs_id?: string
          id?: string
          updated_at?: string | null
          weight_from?: number | null
          weight_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flatrate_and_weight_cost_distribution_costs_id_fkey"
            columns: ["distribution_costs_id"]
            isOneToOne: false
            referencedRelation: "distribution_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      flatrate_cost: {
        Row: {
          created_at: string
          distribution_costs_id: string
          europe_distribution_cost: number | null
          international_distribution_cost: number | null
          is_checked_europe: boolean | null
          is_checked_international: boolean | null
          is_checked_local: boolean | null
          is_checked_national: boolean | null
          local_distribution_cost: number | null
          national_distribution_cost: number | null
        }
        Insert: {
          created_at?: string
          distribution_costs_id: string
          europe_distribution_cost?: number | null
          international_distribution_cost?: number | null
          is_checked_europe?: boolean | null
          is_checked_international?: boolean | null
          is_checked_local?: boolean | null
          is_checked_national?: boolean | null
          local_distribution_cost?: number | null
          national_distribution_cost?: number | null
        }
        Update: {
          created_at?: string
          distribution_costs_id?: string
          europe_distribution_cost?: number | null
          international_distribution_cost?: number | null
          is_checked_europe?: boolean | null
          is_checked_international?: boolean | null
          is_checked_local?: boolean | null
          is_checked_national?: boolean | null
          local_distribution_cost?: number | null
          national_distribution_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flatrate_cost_distribution_costs_id_fkey"
            columns: ["distribution_costs_id"]
            isOneToOne: true
            referencedRelation: "distribution_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification: {
        Row: {
          score: number | null
          user_id: string
        }
        Insert: {
          score?: number | null
          user_id: string
        }
        Update: {
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices_producer: {
        Row: {
          created_at: string
          file_path: string | null
          id: string
          invoice_period: string | null
          name: string | null
          producer_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          id?: string
          invoice_period?: string | null
          name?: string | null
          producer_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string | null
          id?: string
          invoice_period?: string | null
          name?: string | null
          producer_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_producer_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          owner_id: string | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner_id?: string | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          owner_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      local_distribution: {
        Row: {
          country: string | null
          coverage_area_id: string | null
          created_at: string | null
          from: number | null
          id: string
          to: number | null
        }
        Insert: {
          country?: string | null
          coverage_area_id?: string | null
          created_at?: string | null
          from?: number | null
          id?: string
          to?: number | null
        }
        Update: {
          country?: string | null
          coverage_area_id?: string | null
          created_at?: string | null
          from?: number | null
          id?: string
          to?: number | null
        }
        Relationships: []
      }
      monthly_products: {
        Row: {
          category: string | null
          created_at: string | null
          month: number | null
          product_id: string
          year: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          month?: number | null
          product_id: string
          year?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          month?: number | null
          product_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          source: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          source?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          source?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          business_order_id: string
          created_at: string | null
          is_reviewed: boolean | null
          product_name: string | null
          product_pack_id: string
          product_pack_name: string | null
          product_price: number | null
          quantity: number | null
          subtotal: number | null
        }
        Insert: {
          business_order_id: string
          created_at?: string | null
          is_reviewed?: boolean | null
          product_name?: string | null
          product_pack_id: string
          product_pack_name?: string | null
          product_price?: number | null
          quantity?: number | null
          subtotal?: number | null
        }
        Update: {
          business_order_id?: string
          created_at?: string | null
          is_reviewed?: boolean | null
          product_name?: string | null
          product_pack_id?: string
          product_pack_name?: string | null
          product_price?: number | null
          quantity?: number | null
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_business_order_id_fkey"
            columns: ["business_order_id"]
            isOneToOne: false
            referencedRelation: "business_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: false
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_country: string | null
          billing_document_id: string | null
          billing_is_company: boolean | null
          billing_lastname: string | null
          billing_name: string | null
          billing_phone: string | null
          billing_region: string | null
          billing_sub_region: string | null
          billing_zipcode: string | null
          created_at: string | null
          currency: string | null
          customer_name: string | null
          discount: number | null
          estimated_date: string | null
          id: string
          is_consumer_email_sent: boolean | null
          is_distributor_email_sent: boolean | null
          is_producer_email_sent: boolean | null
          issue_date: string | null
          order_number: string | null
          owner_id: string | null
          payment_method: string | null
          promo_code: string | null
          shipping: number | null
          shipping_address: string | null
          shipping_address_extra: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_document_id: string | null
          shipping_lastname: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_region: string | null
          shipping_sub_region: string | null
          shipping_zipcode: string | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total: number | null
          tracking_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_document_id?: string | null
          billing_is_company?: boolean | null
          billing_lastname?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_region?: string | null
          billing_sub_region?: string | null
          billing_zipcode?: string | null
          created_at?: string | null
          currency?: string | null
          customer_name?: string | null
          discount?: number | null
          estimated_date?: string | null
          id?: string
          is_consumer_email_sent?: boolean | null
          is_distributor_email_sent?: boolean | null
          is_producer_email_sent?: boolean | null
          issue_date?: string | null
          order_number?: string | null
          owner_id?: string | null
          payment_method?: string | null
          promo_code?: string | null
          shipping?: number | null
          shipping_address?: string | null
          shipping_address_extra?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_document_id?: string | null
          shipping_lastname?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_region?: string | null
          shipping_sub_region?: string | null
          shipping_zipcode?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          tracking_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_document_id?: string | null
          billing_is_company?: boolean | null
          billing_lastname?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_region?: string | null
          billing_sub_region?: string | null
          billing_zipcode?: string | null
          created_at?: string | null
          currency?: string | null
          customer_name?: string | null
          discount?: number | null
          estimated_date?: string | null
          id?: string
          is_consumer_email_sent?: boolean | null
          is_distributor_email_sent?: boolean | null
          is_producer_email_sent?: boolean | null
          issue_date?: string | null
          order_number?: string | null
          owner_id?: string | null
          payment_method?: string | null
          promo_code?: string | null
          shipping?: number | null
          shipping_address?: string | null
          shipping_address_extra?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_document_id?: string | null
          shipping_lastname?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_region?: string | null
          shipping_sub_region?: string | null
          shipping_zipcode?: string | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          tracking_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_paid: number | null
          created_at: string
          id: string
          invoice_id: string | null
          payment_date: string | null
          payment_method: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_producer"
            referencedColumns: ["id"]
          },
        ]
      }
      producer_user: {
        Row: {
          company_description: string | null
          company_email: string
          company_fb: string | null
          company_history_description: string | null
          company_history_year: number | null
          company_ig: string | null
          company_legal_representative: string | null
          company_linkedin: string | null
          company_logo: string | null
          company_mission: string | null
          company_name: string | null
          company_phone: string
          company_values: string | null
          company_vision: string | null
          company_website: string | null
          created_at: string
          id_number: string | null
          is_active: boolean | null
          is_authorized: boolean | null
          location_id: string | null
          user_id: string
        }
        Insert: {
          company_description?: string | null
          company_email?: string
          company_fb?: string | null
          company_history_description?: string | null
          company_history_year?: number | null
          company_ig?: string | null
          company_legal_representative?: string | null
          company_linkedin?: string | null
          company_logo?: string | null
          company_mission?: string | null
          company_name?: string | null
          company_phone?: string
          company_values?: string | null
          company_vision?: string | null
          company_website?: string | null
          created_at?: string
          id_number?: string | null
          is_active?: boolean | null
          is_authorized?: boolean | null
          location_id?: string | null
          user_id: string
        }
        Update: {
          company_description?: string | null
          company_email?: string
          company_fb?: string | null
          company_history_description?: string | null
          company_history_year?: number | null
          company_ig?: string | null
          company_legal_representative?: string | null
          company_linkedin?: string | null
          company_logo?: string | null
          company_mission?: string | null
          company_name?: string | null
          company_phone?: string
          company_values?: string | null
          company_vision?: string | null
          company_website?: string | null
          created_at?: string
          id_number?: string | null
          is_active?: boolean | null
          is_authorized?: boolean | null
          location_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "producer_user_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "profile_location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "producer_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inventory: {
        Row: {
          created_at: string | null
          id: string
          limit_notification: number | null
          product_id: string | null
          quantity: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          limit_notification?: number | null
          product_id?: string | null
          quantity?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          limit_notification?: number | null
          product_id?: string | null
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_lots: {
        Row: {
          created_at: string | null
          expiration_date: string | null
          id: string
          limit_notification: number | null
          lot_id: string | null
          lot_name: string | null
          lot_number: string | null
          manufacture_date: string | null
          owner_id: string | null
          packaging: string | null
          product_id: string | null
          quantity: number | null
          recipe: string | null
        }
        Insert: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          limit_notification?: number | null
          lot_id?: string | null
          lot_name?: string | null
          lot_number?: string | null
          manufacture_date?: string | null
          owner_id?: string | null
          packaging?: string | null
          product_id?: string | null
          quantity?: number | null
          recipe?: string | null
        }
        Update: {
          created_at?: string | null
          expiration_date?: string | null
          id?: string
          limit_notification?: number | null
          lot_id?: string | null
          lot_name?: string | null
          lot_number?: string | null
          manufacture_date?: string | null
          owner_id?: string | null
          packaging?: string | null
          product_id?: string | null
          quantity?: number | null
          recipe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_lots_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_lots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean | null
          product_id: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_packs: {
        Row: {
          created_at: string
          id: string
          img_url: string | null
          name: string | null
          price: number | null
          product_id: string
          quantity: number | null
          randomUUID: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          img_url?: string | null
          name?: string | null
          price?: number | null
          product_id: string
          quantity?: number | null
          randomUUID?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          img_url?: string | null
          name?: string | null
          price?: number | null
          product_id?: string
          quantity?: number | null
          randomUUID?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_packs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_promo_codes: {
        Row: {
          created_at: string
          order_id: string | null
          product_id: string
          product_pack_id: string | null
          promo_code_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          order_id?: string | null
          product_id: string
          product_pack_id?: string | null
          promo_code_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          order_id?: string | null
          product_id?: string
          product_pack_id?: string | null
          promo_code_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_promo_codes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_promo_codes_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: false
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_promo_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_products_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brewery_id: string | null
          campaign_id: string | null
          category: string | null
          created_at: string | null
          description: string | null
          discount_code: string | null
          discount_percent: number | null
          id: string
          is_archived: boolean | null
          is_available: boolean
          is_monthly: boolean | null
          is_public: boolean | null
          name: string | null
          owner_id: string | null
          price: number | null
          type: string | null
          weight: number | null
        }
        Insert: {
          brewery_id?: string | null
          campaign_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_code?: string | null
          discount_percent?: number | null
          id?: string
          is_archived?: boolean | null
          is_available?: boolean
          is_monthly?: boolean | null
          is_public?: boolean | null
          name?: string | null
          owner_id?: string | null
          price?: number | null
          type?: string | null
          weight?: number | null
        }
        Update: {
          brewery_id?: string | null
          campaign_id?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_code?: string | null
          discount_percent?: number | null
          id?: string
          is_archived?: boolean | null
          is_available?: boolean
          is_monthly?: boolean | null
          is_public?: boolean | null
          name?: string | null
          owner_id?: string | null
          price?: number | null
          type?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brewery_id_fkey"
            columns: ["brewery_id"]
            isOneToOne: false
            referencedRelation: "breweries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_location: {
        Row: {
          address_1: string | null
          address_2: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string | null
          document_id: string | null
          id: string
          lastname: string | null
          name: string | null
          owner_id: string | null
          phone: string | null
          postalcode: number | null
          region: string | null
          sub_region: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          lastname?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          postalcode?: number | null
          region?: string | null
          sub_region?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          lastname?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          postalcode?: number | null
          region?: string | null
          sub_region?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_location_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          discount_type: string | null
          discount_value: number | null
          expiration_date: string | null
          id: string
          is_active: boolean | null
          max_usage_per_user: number | null
          max_uses: number | null
          product_id: string | null
          product_pack_id: string | null
          start_date: string | null
          updated_at: string | null
          uses: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          max_usage_per_user?: number | null
          max_uses?: number | null
          product_id?: string | null
          product_pack_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          uses?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          max_usage_per_user?: number | null
          max_uses?: number | null
          product_id?: string | null
          product_pack_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_product_pack_id_fkey"
            columns: ["product_pack_id"]
            isOneToOne: false
            referencedRelation: "product_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number | null
          business_order_id: string | null
          created_at: string
          id: string
          invoice_id: string | null
          reason: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          business_order_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          business_order_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          reason?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_business_order_id_fkey"
            columns: ["business_order_id"]
            isOneToOne: false
            referencedRelation: "business_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices_producer"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          appearance: number | null
          aroma: number | null
          bitterness: number | null
          comment: string | null
          created_at: string | null
          id: string
          mouthfeel: number | null
          overall: number | null
          owner_id: string | null
          product_id: string | null
          taste: number | null
          updated_at: string | null
        }
        Insert: {
          appearance?: number | null
          aroma?: number | null
          bitterness?: number | null
          comment?: string | null
          created_at?: string | null
          id?: string
          mouthfeel?: number | null
          overall?: number | null
          owner_id?: string | null
          product_id?: string | null
          taste?: number | null
          updated_at?: string | null
        }
        Update: {
          appearance?: number | null
          aroma?: number | null
          bitterness?: number | null
          comment?: string | null
          created_at?: string | null
          id?: string
          mouthfeel?: number | null
          overall?: number | null
          owner_id?: string | null
          product_id?: string | null
          taste?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_records_items: {
        Row: {
          business_order_id: string | null
          id: string
          net_amount: number | null
          platform_commission: number | null
          product_name: string | null
          product_pack_name: string | null
          product_quantity: number | null
          sales_records_id: string | null
          total_sales: number | null
        }
        Insert: {
          business_order_id?: string | null
          id?: string
          net_amount?: number | null
          platform_commission?: number | null
          product_name?: string | null
          product_pack_name?: string | null
          product_quantity?: number | null
          sales_records_id?: string | null
          total_sales?: number | null
        }
        Update: {
          business_order_id?: string | null
          id?: string
          net_amount?: number | null
          platform_commission?: number | null
          product_name?: string | null
          product_pack_name?: string | null
          product_quantity?: number | null
          sales_records_id?: string | null
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_business_order_id_fkey"
            columns: ["business_order_id"]
            isOneToOne: false
            referencedRelation: "business_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["sales_records_id"]
            isOneToOne: false
            referencedRelation: "sales_records_producer"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_records_producer: {
        Row: {
          created_at: string
          id: string
          invoice_period: string | null
          producer_email: string | null
          producer_id: string | null
          producer_username: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_period?: string | null
          producer_email?: string | null
          producer_id?: string | null
          producer_username?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invoice_period?: string | null
          producer_email?: string | null
          producer_id?: string | null
          producer_username?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_producer_id_fkey"
            columns: ["producer_id"]
            isOneToOne: false
            referencedRelation: "producer_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      shipment_tracking: {
        Row: {
          created_at: string
          estimated_date: string | null
          id: string
          is_updated_by_distributor: boolean | null
          order_id: string | null
          shipment_company: string | null
          shipment_tracking_id: string | null
          shipment_url: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          estimated_date?: string | null
          id?: string
          is_updated_by_distributor?: boolean | null
          order_id?: string | null
          shipment_company?: string | null
          shipment_tracking_id?: string | null
          shipment_url?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          estimated_date?: string | null
          id?: string
          is_updated_by_distributor?: boolean | null
          order_id?: string | null
          shipment_company?: string | null
          shipment_tracking_id?: string | null
          shipment_url?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipment_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipment_tracking_messages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          tracking_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          tracking_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          tracking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipmnent_tracking_messages_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "shipment_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_info: {
        Row: {
          address: string | null
          address_extra: string | null
          address_observations: string | null
          city: string | null
          country: string | null
          created_at: string | null
          document_id: string | null
          id: string
          is_default: boolean | null
          lastname: string | null
          name: string | null
          owner_id: string | null
          phone: string | null
          region: string | null
          sub_region: string | null
          updated_at: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          address_extra?: string | null
          address_observations?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          is_default?: boolean | null
          lastname?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          region?: string | null
          sub_region?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          address_extra?: string | null
          address_observations?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          is_default?: boolean | null
          lastname?: string | null
          name?: string | null
          owner_id?: string | null
          phone?: string | null
          region?: string | null
          sub_region?: string | null
          updated_at?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_info_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trigger_auditoria: {
        Row: {
          action_type: string | null
          created_at: string
          details: string | null
          id: number
          related_table: string | null
          trigger_name: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          details?: string | null
          id?: number
          related_table?: string | null
          trigger_name?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string
          details?: string | null
          id?: number
          related_table?: string | null
          trigger_name?: string | null
        }
        Relationships: []
      }
      user_promo_codes: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          promo_code_id: string | null
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          promo_code_id?: string | null
          used_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          promo_code_id?: string | null
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_promo_codes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_codes_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reports: {
        Row: {
          created_at: string
          description: string | null
          file: string | null
          id: string
          is_resolved: boolean | null
          reporter_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file?: string | null
          id?: string
          is_resolved?: boolean | null
          reporter_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file?: string | null
          id?: string
          is_resolved?: boolean | null
          reporter_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bg_url: string | null
          birthdate: string | null
          cp_organizer_status: number | null
          created_at: string | null
          email: string | null
          id: string
          lastname: string | null
          name: string | null
          provider: string | null
          role: string[] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bg_url?: string | null
          birthdate?: string | null
          cp_organizer_status?: number | null
          created_at?: string | null
          email?: string | null
          id: string
          lastname?: string | null
          name?: string | null
          provider?: string | null
          role?: string[] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bg_url?: string | null
          birthdate?: string | null
          cp_organizer_status?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          lastname?: string | null
          name?: string | null
          provider?: string | null
          role?: string[] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      correct_access_level_format: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      correct_specific_access_level_format: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
      update_raw_user_meta_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

