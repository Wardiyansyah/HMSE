

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."get_user_by_username"("username_input" "text") RETURNS TABLE("user_id" "uuid", "email" "text", "full_name" "text", "role" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.role
  FROM public.profiles p
  WHERE p.username = username_input;
END;
$$;


ALTER FUNCTION "public"."get_user_by_username"("username_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    user_role text;
    user_username text;
    user_full_name text;
BEGIN
    -- Extract metadata with defaults
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    user_username := COALESCE(NEW.raw_user_meta_data->>'username', '');
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    -- Log the attempt
    RAISE LOG 'Creating profile for user: % with username: % and role: %', NEW.id, user_username, user_role;
    
    -- Insert the profile
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        username, 
        role, 
        created_at, 
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        user_username,
        user_role::text,
        NOW(),
        NOW()
    );
    
    RAISE LOG 'Profile created successfully for user: %', NEW.id;
    
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
        -- Don't fail the auth process, just log the error
        RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "achievement_type" character varying(100) NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "badge_icon" character varying(255),
    "points_earned" integer DEFAULT 0,
    "criteria_met" "jsonb",
    "earned_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "learning_path_id" "uuid",
    "content_module_id" "uuid",
    "assessment_type" character varying(50) NOT NULL,
    "questions" "jsonb" NOT NULL,
    "user_responses" "jsonb",
    "ai_analysis" "jsonb",
    "score" numeric(5,2),
    "max_score" numeric(5,2) DEFAULT 100.00,
    "feedback" "text",
    "recommendations" "text"[],
    "difficulty_adjustment" numeric(3,2),
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ai_assessments_assessment_type_check" CHECK ((("assessment_type")::"text" = ANY ((ARRAY['quiz'::character varying, 'essay'::character varying, 'oral'::character varying, 'practical'::character varying, 'adaptive'::character varying])::"text"[])))
);


ALTER TABLE "public"."ai_assessments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_interactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "interaction_type" "text" NOT NULL,
    "prompt" "text" NOT NULL,
    "response" "text",
    "context" "jsonb" DEFAULT '{}'::"jsonb",
    "subject_id" "uuid",
    "class_id" "uuid",
    "tokens_used" integer DEFAULT 0,
    "response_time" integer,
    "satisfaction_rating" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "ai_interactions_interaction_type_check" CHECK (("interaction_type" = ANY (ARRAY['chat'::"text", 'content_generation'::"text", 'assessment'::"text", 'recommendation'::"text"]))),
    CONSTRAINT "ai_interactions_satisfaction_rating_check" CHECK ((("satisfaction_rating" >= 1) AND ("satisfaction_rating" <= 5)))
);


ALTER TABLE "public"."ai_interactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_data" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "event_type" character varying(100) NOT NULL,
    "event_data" "jsonb" NOT NULL,
    "session_id" "uuid",
    "learning_path_id" "uuid",
    "content_module_id" "uuid",
    "timestamp" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "subject_id" "uuid" NOT NULL,
    "class_id" "uuid" NOT NULL,
    "teacher_id" "uuid" NOT NULL,
    "due_date" timestamp with time zone NOT NULL,
    "max_score" integer DEFAULT 100,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "assignments_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'closed'::character varying])::"text"[])))
);


ALTER TABLE "public"."assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "student_id" "uuid",
    "class_id" "uuid",
    "subject_id" "uuid",
    "teacher_id" "uuid",
    "date" "date" NOT NULL,
    "status" "text" DEFAULT 'present'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "attendance_status_check" CHECK (("status" = ANY (ARRAY['present'::"text", 'absent'::"text", 'late'::"text", 'excused'::"text"])))
);


ALTER TABLE "public"."attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."classes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nama_kelas" character varying(50) NOT NULL,
    "tingkat" integer NOT NULL,
    "jurusan" character varying(50),
    "tahun_ajaran" character varying(20) NOT NULL,
    "wali_kelas_id" "uuid",
    "kapasitas" integer DEFAULT 30,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "classes_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::"text"[]))),
    CONSTRAINT "classes_tingkat_check" CHECK ((("tingkat" >= 1) AND ("tingkat" <= 12)))
);


ALTER TABLE "public"."classes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."click_points" (
    "student_user_id" "uuid" NOT NULL,
    "point_value" bigint DEFAULT '0'::bigint,
    "point_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."click_points" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_generation_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "request_type" character varying(50) NOT NULL,
    "subject_area" character varying(100) NOT NULL,
    "topic" character varying(255) NOT NULL,
    "target_audience" character varying(100),
    "difficulty_level" character varying(20),
    "duration_minutes" integer,
    "special_requirements" "text",
    "input_parameters" "jsonb",
    "generated_content" "jsonb",
    "generation_status" character varying(20) DEFAULT 'pending'::character varying,
    "ai_model_used" character varying(100),
    "generation_time_ms" integer,
    "quality_score" numeric(3,2),
    "user_rating" integer,
    "user_feedback" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "content_generation_requests_difficulty_level_check" CHECK ((("difficulty_level")::"text" = ANY ((ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying])::"text"[]))),
    CONSTRAINT "content_generation_requests_generation_status_check" CHECK ((("generation_status")::"text" = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying])::"text"[]))),
    CONSTRAINT "content_generation_requests_request_type_check" CHECK ((("request_type")::"text" = ANY ((ARRAY['lesson_plan'::character varying, 'quiz'::character varying, 'presentation'::character varying, 'worksheet'::character varying, 'video_script'::character varying])::"text"[]))),
    CONSTRAINT "content_generation_requests_user_rating_check" CHECK ((("user_rating" >= 1) AND ("user_rating" <= 5)))
);


ALTER TABLE "public"."content_generation_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."content_modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "learning_path_id" "uuid",
    "title" character varying(255) NOT NULL,
    "description" "text",
    "content_type" character varying(50) NOT NULL,
    "content_data" "jsonb",
    "order_index" integer NOT NULL,
    "estimated_duration" integer,
    "difficulty_score" numeric(3,2),
    "ai_generated" boolean DEFAULT false,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "content_modules_content_type_check" CHECK ((("content_type")::"text" = ANY ((ARRAY['video'::character varying, 'text'::character varying, 'interactive'::character varying, 'quiz'::character varying, 'assignment'::character varying, 'simulation'::character varying])::"text"[]))),
    CONSTRAINT "content_modules_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'draft'::character varying])::"text"[])))
);


ALTER TABLE "public"."content_modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."grades" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "assignment_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "subject_id" "uuid" NOT NULL,
    "score" numeric(5,2) NOT NULL,
    "max_score" numeric(5,2) NOT NULL,
    "feedback" "text",
    "graded_at" timestamp with time zone DEFAULT "now"(),
    "graded_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "grades_max_score_check" CHECK (("max_score" > (0)::numeric)),
    CONSTRAINT "grades_score_check" CHECK (("score" >= (0)::numeric))
);


ALTER TABLE "public"."grades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_materials" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "content" "text",
    "subject_id" "uuid",
    "class_id" "uuid",
    "teacher_id" "uuid",
    "material_type" "text" DEFAULT 'document'::"text",
    "file_url" "text",
    "file_size" integer,
    "file_type" "text",
    "is_published" boolean DEFAULT false,
    "ai_generated" boolean DEFAULT false,
    "ai_prompt" "text",
    "tags" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "learning_materials_material_type_check" CHECK (("material_type" = ANY (ARRAY['document'::"text", 'video'::"text", 'audio'::"text", 'link'::"text", 'ai_generated'::"text"])))
);


ALTER TABLE "public"."learning_materials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_paths" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "subject_area" character varying(100) NOT NULL,
    "difficulty_level" character varying(20),
    "estimated_duration" integer,
    "prerequisites" "text"[],
    "learning_objectives" "text"[],
    "tags" "text"[],
    "is_adaptive" boolean DEFAULT true,
    "created_by" "uuid",
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "learning_paths_difficulty_level_check" CHECK ((("difficulty_level")::"text" = ANY ((ARRAY['beginner'::character varying, 'intermediate'::character varying, 'advanced'::character varying, 'expert'::character varying])::"text"[]))),
    CONSTRAINT "learning_paths_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'draft'::character varying])::"text"[])))
);


ALTER TABLE "public"."learning_paths" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "type" character varying(50) NOT NULL,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" character varying(50) NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" "text" NOT NULL,
    "full_name" character varying(255) NOT NULL,
    "role" character varying(20) NOT NULL,
    "phone" character varying(20),
    "address" "text",
    "date_of_birth" "date",
    "gender" character varying(10),
    "avatar_url" "text",
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "profiles_gender_check" CHECK ((("gender")::"text" = ANY ((ARRAY['male'::character varying, 'female'::character varying])::"text"[]))),
    CONSTRAINT "profiles_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['student'::character varying, 'teacher'::character varying, 'admin'::character varying])::"text"[]))),
    CONSTRAINT "profiles_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying])::"text"[])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schools" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "phone" "text",
    "email" "text",
    "website" "text",
    "logo_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schools" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_assignments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "assignment_id" "uuid",
    "student_id" "uuid",
    "submission_text" "text",
    "attachments" "jsonb" DEFAULT '[]'::"jsonb",
    "score" integer,
    "feedback" "text",
    "status" "text" DEFAULT 'not_submitted'::"text",
    "submitted_at" timestamp with time zone,
    "graded_at" timestamp with time zone,
    "graded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "student_assignments_status_check" CHECK (("status" = ANY (ARRAY['not_submitted'::"text", 'submitted'::"text", 'graded'::"text", 'late'::"text"])))
);


ALTER TABLE "public"."student_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "student_id" "uuid",
    "subject_id" "uuid",
    "class_id" "uuid",
    "current_grade" numeric(5,2),
    "total_assignments" integer DEFAULT 0,
    "completed_assignments" integer DEFAULT 0,
    "attendance_rate" numeric(5,2) DEFAULT 0,
    "last_activity" timestamp with time zone,
    "strengths" "text"[],
    "weaknesses" "text"[],
    "ai_recommendations" "text",
    "semester" "text" NOT NULL,
    "school_year" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."student_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "nisn" character varying(20),
    "nis" character varying(20),
    "class_id" "uuid",
    "tanggal_masuk" "date" NOT NULL,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "students_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'graduated'::character varying, 'transferred'::character varying])::"text"[])))
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subjects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "kode_mata_pelajaran" character varying(20) NOT NULL,
    "nama_mata_pelajaran" character varying(255) NOT NULL,
    "tingkat" integer[] NOT NULL,
    "deskripsi" "text",
    "sks" integer DEFAULT 1,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "subjects_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::"text"[])))
);


ALTER TABLE "public"."subjects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teacher_subjects" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "teacher_id" "uuid",
    "subject_id" "uuid",
    "class_id" "uuid",
    "school_year" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."teacher_subjects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teachers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "nip" character varying(30) NOT NULL,
    "tanggal_mulai_kerja" "date" NOT NULL,
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "teachers_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'retired'::character varying])::"text"[])))
);


ALTER TABLE "public"."teachers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "learning_path_id" "uuid",
    "content_module_id" "uuid",
    "progress_percentage" numeric(5,2) DEFAULT 0.00,
    "completion_status" character varying(20) DEFAULT 'not_started'::character varying,
    "time_spent" integer DEFAULT 0,
    "score" numeric(5,2),
    "attempts" integer DEFAULT 0,
    "last_accessed" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_progress_completion_status_check" CHECK ((("completion_status")::"text" = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'skipped'::character varying])::"text"[]))),
    CONSTRAINT "user_progress_progress_percentage_check" CHECK ((("progress_percentage" >= (0)::numeric) AND ("progress_percentage" <= (100)::numeric)))
);


ALTER TABLE "public"."user_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."virtual_tutor_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "session_type" character varying(50) DEFAULT 'general'::character varying,
    "subject_area" character varying(100),
    "conversation_history" "jsonb" DEFAULT '[]'::"jsonb",
    "session_summary" "text",
    "learning_insights" "jsonb",
    "recommended_actions" "text"[],
    "session_duration" integer,
    "satisfaction_rating" integer,
    "started_at" timestamp with time zone DEFAULT "now"(),
    "ended_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "virtual_tutor_sessions_satisfaction_rating_check" CHECK ((("satisfaction_rating" >= 1) AND ("satisfaction_rating" <= 5))),
    CONSTRAINT "virtual_tutor_sessions_session_type_check" CHECK ((("session_type")::"text" = ANY ((ARRAY['general'::character varying, 'subject_specific'::character varying, 'homework_help'::character varying, 'exam_prep'::character varying])::"text"[])))
);


ALTER TABLE "public"."virtual_tutor_sessions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_assessments"
    ADD CONSTRAINT "ai_assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_interactions"
    ADD CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_data"
    ADD CONSTRAINT "analytics_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_class_id_subject_id_date_key" UNIQUE ("student_id", "class_id", "subject_id", "date");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."click_points"
    ADD CONSTRAINT "click_points_pkey" PRIMARY KEY ("point_id");



ALTER TABLE ONLY "public"."content_generation_requests"
    ADD CONSTRAINT "content_generation_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_modules"
    ADD CONSTRAINT "content_modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_assignment_id_student_id_key" UNIQUE ("assignment_id", "student_id");



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_materials"
    ADD CONSTRAINT "learning_materials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_paths"
    ADD CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."schools"
    ADD CONSTRAINT "schools_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_assignments"
    ADD CONSTRAINT "student_assignments_assignment_id_student_id_key" UNIQUE ("assignment_id", "student_id");



ALTER TABLE ONLY "public"."student_assignments"
    ADD CONSTRAINT "student_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_student_id_subject_id_semester_school_year_key" UNIQUE ("student_id", "subject_id", "semester", "school_year");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_nis_key" UNIQUE ("nis");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_nisn_key" UNIQUE ("nisn");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_kode_mata_pelajaran_key" UNIQUE ("kode_mata_pelajaran");



ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teacher_subjects"
    ADD CONSTRAINT "teacher_subjects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teacher_subjects"
    ADD CONSTRAINT "teacher_subjects_teacher_id_subject_id_class_id_school_year_key" UNIQUE ("teacher_id", "subject_id", "class_id", "school_year");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_nip_key" UNIQUE ("nip");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_id_content_module_id_key" UNIQUE ("user_id", "content_module_id");



ALTER TABLE ONLY "public"."virtual_tutor_sessions"
    ADD CONSTRAINT "virtual_tutor_sessions_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_achievements_type" ON "public"."achievements" USING "btree" ("achievement_type");



CREATE INDEX "idx_achievements_user_id" ON "public"."achievements" USING "btree" ("user_id");



CREATE INDEX "idx_ai_assessments_completed" ON "public"."ai_assessments" USING "btree" ("completed_at");



CREATE INDEX "idx_ai_assessments_type" ON "public"."ai_assessments" USING "btree" ("assessment_type");



CREATE INDEX "idx_ai_assessments_user_id" ON "public"."ai_assessments" USING "btree" ("user_id");



CREATE INDEX "idx_analytics_event_type" ON "public"."analytics_data" USING "btree" ("event_type");



CREATE INDEX "idx_analytics_timestamp" ON "public"."analytics_data" USING "btree" ("timestamp");



CREATE INDEX "idx_analytics_user_id" ON "public"."analytics_data" USING "btree" ("user_id");



CREATE INDEX "idx_assignments_class_id" ON "public"."assignments" USING "btree" ("class_id");



CREATE INDEX "idx_assignments_subject_id" ON "public"."assignments" USING "btree" ("subject_id");



CREATE INDEX "idx_assignments_teacher_id" ON "public"."assignments" USING "btree" ("teacher_id");



CREATE INDEX "idx_attendance_date" ON "public"."attendance" USING "btree" ("date");



CREATE INDEX "idx_attendance_student_id" ON "public"."attendance" USING "btree" ("student_id");



CREATE INDEX "idx_content_generation_status" ON "public"."content_generation_requests" USING "btree" ("generation_status");



CREATE INDEX "idx_content_generation_type" ON "public"."content_generation_requests" USING "btree" ("request_type");



CREATE INDEX "idx_content_generation_user_id" ON "public"."content_generation_requests" USING "btree" ("user_id");



CREATE INDEX "idx_content_modules_learning_path" ON "public"."content_modules" USING "btree" ("learning_path_id");



CREATE INDEX "idx_content_modules_order" ON "public"."content_modules" USING "btree" ("order_index");



CREATE INDEX "idx_content_modules_type" ON "public"."content_modules" USING "btree" ("content_type");



CREATE INDEX "idx_grades_assignment_id" ON "public"."grades" USING "btree" ("assignment_id");



CREATE INDEX "idx_grades_student_id" ON "public"."grades" USING "btree" ("student_id");



CREATE INDEX "idx_learning_paths_difficulty" ON "public"."learning_paths" USING "btree" ("difficulty_level");



CREATE INDEX "idx_learning_paths_status" ON "public"."learning_paths" USING "btree" ("status");



CREATE INDEX "idx_learning_paths_subject_area" ON "public"."learning_paths" USING "btree" ("subject_area");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_role" ON "public"."profiles" USING "btree" ("role");



CREATE INDEX "idx_profiles_status" ON "public"."profiles" USING "btree" ("status");



CREATE INDEX "idx_profiles_username" ON "public"."profiles" USING "btree" ("username");



CREATE INDEX "idx_students_class_id" ON "public"."students" USING "btree" ("class_id");



CREATE INDEX "idx_students_user_id" ON "public"."students" USING "btree" ("user_id");



CREATE INDEX "idx_teachers_user_id" ON "public"."teachers" USING "btree" ("user_id");



CREATE INDEX "idx_tutor_sessions_started" ON "public"."virtual_tutor_sessions" USING "btree" ("started_at");



CREATE INDEX "idx_tutor_sessions_type" ON "public"."virtual_tutor_sessions" USING "btree" ("session_type");



CREATE INDEX "idx_tutor_sessions_user_id" ON "public"."virtual_tutor_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_user_progress_learning_path" ON "public"."user_progress" USING "btree" ("learning_path_id");



CREATE INDEX "idx_user_progress_status" ON "public"."user_progress" USING "btree" ("completion_status");



CREATE INDEX "idx_user_progress_user_id" ON "public"."user_progress" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."attendance" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."learning_materials" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."student_assignments" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "handle_updated_at" BEFORE UPDATE ON "public"."student_progress" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_ai_assessments_updated_at" BEFORE UPDATE ON "public"."ai_assessments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_assignments_updated_at" BEFORE UPDATE ON "public"."assignments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_classes_updated_at" BEFORE UPDATE ON "public"."classes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_content_generation_updated_at" BEFORE UPDATE ON "public"."content_generation_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_content_modules_updated_at" BEFORE UPDATE ON "public"."content_modules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_grades_updated_at" BEFORE UPDATE ON "public"."grades" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_learning_paths_updated_at" BEFORE UPDATE ON "public"."learning_paths" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_notifications_updated_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_students_updated_at" BEFORE UPDATE ON "public"."students" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_subjects_updated_at" BEFORE UPDATE ON "public"."subjects" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_teachers_updated_at" BEFORE UPDATE ON "public"."teachers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tutor_sessions_updated_at" BEFORE UPDATE ON "public"."virtual_tutor_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_progress_updated_at" BEFORE UPDATE ON "public"."user_progress" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."ai_assessments"
    ADD CONSTRAINT "ai_assessments_content_module_id_fkey" FOREIGN KEY ("content_module_id") REFERENCES "public"."content_modules"("id");



ALTER TABLE ONLY "public"."ai_assessments"
    ADD CONSTRAINT "ai_assessments_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id");



ALTER TABLE ONLY "public"."ai_assessments"
    ADD CONSTRAINT "ai_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."analytics_data"
    ADD CONSTRAINT "analytics_data_content_module_id_fkey" FOREIGN KEY ("content_module_id") REFERENCES "public"."content_modules"("id");



ALTER TABLE ONLY "public"."analytics_data"
    ADD CONSTRAINT "analytics_data_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id");



ALTER TABLE ONLY "public"."analytics_data"
    ADD CONSTRAINT "analytics_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."students"("user_id");



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id");



ALTER TABLE ONLY "public"."assignments"
    ADD CONSTRAINT "assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id");



ALTER TABLE ONLY "public"."attendance"
    ADD CONSTRAINT "attendance_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_wali_kelas_id_fkey" FOREIGN KEY ("wali_kelas_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."click_points"
    ADD CONSTRAINT "click_points_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "public"."students"("user_id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."content_generation_requests"
    ADD CONSTRAINT "content_generation_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."content_modules"
    ADD CONSTRAINT "content_modules_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_graded_by_fkey" FOREIGN KEY ("graded_by") REFERENCES "public"."teachers"("id");



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."grades"
    ADD CONSTRAINT "grades_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id");



ALTER TABLE ONLY "public"."learning_paths"
    ADD CONSTRAINT "learning_paths_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_assignments"
    ADD CONSTRAINT "student_assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_content_module_id_fkey" FOREIGN KEY ("content_module_id") REFERENCES "public"."content_modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "public"."learning_paths"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."virtual_tutor_sessions"
    ADD CONSTRAINT "virtual_tutor_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Anyone can insert notifications" ON "public"."notifications" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can insert profiles" ON "public"."profiles" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can insert students" ON "public"."students" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can insert teachers" ON "public"."teachers" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view active content modules" ON "public"."content_modules" FOR SELECT USING ((("status")::"text" = 'active'::"text"));



CREATE POLICY "Anyone can view active learning paths" ON "public"."learning_paths" FOR SELECT USING ((("status")::"text" = 'active'::"text"));



CREATE POLICY "Anyone can view assignments" ON "public"."assignments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view classes" ON "public"."classes" FOR SELECT USING (true);



CREATE POLICY "Anyone can view grades" ON "public"."grades" FOR SELECT USING (true);



CREATE POLICY "Anyone can view subjects" ON "public"."subjects" FOR SELECT USING (true);



CREATE POLICY "Students can view own data" ON "public"."students" FOR SELECT USING (true);



CREATE POLICY "System can create achievements" ON "public"."achievements" FOR INSERT WITH CHECK (true);



CREATE POLICY "System can insert analytics" ON "public"."analytics_data" FOR INSERT WITH CHECK (true);



CREATE POLICY "Teachers can manage assignments" ON "public"."assignments" USING (true);



CREATE POLICY "Teachers can manage content modules" ON "public"."content_modules" USING (true);



CREATE POLICY "Teachers can manage grades" ON "public"."grades" USING (true);



CREATE POLICY "Teachers can manage their learning paths" ON "public"."learning_paths" USING (true);



CREATE POLICY "Teachers can view own data" ON "public"."teachers" FOR SELECT USING (true);



CREATE POLICY "Users can create AI interactions" ON "public"."ai_interactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create assessments" ON "public"."ai_assessments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can create generation requests" ON "public"."content_generation_requests" USING (true);



CREATE POLICY "Users can manage their own sessions" ON "public"."virtual_tutor_sessions" USING (true);



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (true);



CREATE POLICY "Users can update their own progress" ON "public"."user_progress" USING (true);



CREATE POLICY "Users can view own AI interactions" ON "public"."ai_interactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own notifications" ON "public"."notifications" FOR SELECT USING (true);



CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Users can view their own achievements" ON "public"."achievements" FOR SELECT USING (true);



CREATE POLICY "Users can view their own analytics" ON "public"."analytics_data" FOR SELECT USING (true);



CREATE POLICY "Users can view their own assessments" ON "public"."ai_assessments" FOR SELECT USING (true);



CREATE POLICY "Users can view their own progress" ON "public"."user_progress" FOR SELECT USING (true);



CREATE POLICY "Users can view their own requests" ON "public"."content_generation_requests" FOR SELECT USING (true);



CREATE POLICY "Users can view their own sessions" ON "public"."virtual_tutor_sessions" FOR SELECT USING (true);



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_assessments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_interactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_data" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."click_points" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_generation_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_modules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."grades" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_materials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."learning_paths" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teachers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."virtual_tutor_sessions" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_by_username"("username_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_by_username"("username_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_by_username"("username_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."ai_assessments" TO "anon";
GRANT ALL ON TABLE "public"."ai_assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_assessments" TO "service_role";



GRANT ALL ON TABLE "public"."ai_interactions" TO "anon";
GRANT ALL ON TABLE "public"."ai_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_interactions" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_data" TO "anon";
GRANT ALL ON TABLE "public"."analytics_data" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_data" TO "service_role";



GRANT ALL ON TABLE "public"."assignments" TO "anon";
GRANT ALL ON TABLE "public"."assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."assignments" TO "service_role";



GRANT ALL ON TABLE "public"."attendance" TO "anon";
GRANT ALL ON TABLE "public"."attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance" TO "service_role";



GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";



GRANT ALL ON TABLE "public"."click_points" TO "anon";
GRANT ALL ON TABLE "public"."click_points" TO "authenticated";
GRANT ALL ON TABLE "public"."click_points" TO "service_role";



GRANT ALL ON TABLE "public"."content_generation_requests" TO "anon";
GRANT ALL ON TABLE "public"."content_generation_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."content_generation_requests" TO "service_role";



GRANT ALL ON TABLE "public"."content_modules" TO "anon";
GRANT ALL ON TABLE "public"."content_modules" TO "authenticated";
GRANT ALL ON TABLE "public"."content_modules" TO "service_role";



GRANT ALL ON TABLE "public"."grades" TO "anon";
GRANT ALL ON TABLE "public"."grades" TO "authenticated";
GRANT ALL ON TABLE "public"."grades" TO "service_role";



GRANT ALL ON TABLE "public"."learning_materials" TO "anon";
GRANT ALL ON TABLE "public"."learning_materials" TO "authenticated";
GRANT ALL ON TABLE "public"."learning_materials" TO "service_role";



GRANT ALL ON TABLE "public"."learning_paths" TO "anon";
GRANT ALL ON TABLE "public"."learning_paths" TO "authenticated";
GRANT ALL ON TABLE "public"."learning_paths" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."schools" TO "anon";
GRANT ALL ON TABLE "public"."schools" TO "authenticated";
GRANT ALL ON TABLE "public"."schools" TO "service_role";



GRANT ALL ON TABLE "public"."student_assignments" TO "anon";
GRANT ALL ON TABLE "public"."student_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."student_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."student_progress" TO "anon";
GRANT ALL ON TABLE "public"."student_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."student_progress" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."subjects" TO "anon";
GRANT ALL ON TABLE "public"."subjects" TO "authenticated";
GRANT ALL ON TABLE "public"."subjects" TO "service_role";



GRANT ALL ON TABLE "public"."teacher_subjects" TO "anon";
GRANT ALL ON TABLE "public"."teacher_subjects" TO "authenticated";
GRANT ALL ON TABLE "public"."teacher_subjects" TO "service_role";



GRANT ALL ON TABLE "public"."teachers" TO "anon";
GRANT ALL ON TABLE "public"."teachers" TO "authenticated";
GRANT ALL ON TABLE "public"."teachers" TO "service_role";



GRANT ALL ON TABLE "public"."user_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_progress" TO "service_role";



GRANT ALL ON TABLE "public"."virtual_tutor_sessions" TO "anon";
GRANT ALL ON TABLE "public"."virtual_tutor_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."virtual_tutor_sessions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
