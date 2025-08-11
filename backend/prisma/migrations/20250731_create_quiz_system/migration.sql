-- Create Quiz System Migration
-- This migration creates the new personality-based quiz system

-- Create Quiz Categories table
CREATE TABLE "quiz_categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_categories_pkey" PRIMARY KEY ("id")
);

-- Create Quiz Questions table
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "question_key" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "question_type" TEXT NOT NULL,
    "trait" TEXT,
    "reverse_scored" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- Create Quiz Options table
CREATE TABLE "quiz_options" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "option_key" TEXT NOT NULL,
    "option_text" TEXT NOT NULL,
    "score_value" INTEGER,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- Create User Quiz Responses table
CREATE TABLE "user_quiz_responses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL,
    "score" INTEGER,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_quiz_responses_pkey" PRIMARY KEY ("id")
);

-- Create User Personality Profiles table
CREATE TABLE "user_personality_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "openness_score" INTEGER,
    "conscientiousness_score" INTEGER,
    "extraversion_score" INTEGER,
    "agreeableness_score" INTEGER,
    "neuroticism_score" INTEGER,
    "primary_love_language" TEXT,
    "secondary_love_language" TEXT,
    "attachment_style" TEXT,
    "lifestyle_preferences" JSONB,
    "matching_preferences" JSONB,
    "completed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_personality_profiles_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "quiz_categories_key_key" ON "quiz_categories"("key");
CREATE UNIQUE INDEX "quiz_questions_question_key_key" ON "quiz_questions"("question_key");
CREATE UNIQUE INDEX "user_quiz_responses_user_id_question_id_key" ON "user_quiz_responses"("user_id", "question_id");
CREATE UNIQUE INDEX "user_personality_profiles_user_id_key" ON "user_personality_profiles"("user_id");

-- Add foreign key constraints
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "quiz_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_quiz_responses" ADD CONSTRAINT "user_quiz_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_quiz_responses" ADD CONSTRAINT "user_quiz_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_quiz_responses" ADD CONSTRAINT "user_quiz_responses_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "quiz_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_personality_profiles" ADD CONSTRAINT "user_personality_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
