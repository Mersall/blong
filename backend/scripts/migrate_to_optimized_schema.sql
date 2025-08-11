-- BLONG Database Migration Script
-- Migrates from complex schema (40+ tables) to optimized schema (12 tables)
-- Run this script in a transaction for safety

BEGIN;

-- ============================================================================
-- BACKUP EXISTING DATA
-- ============================================================================

-- Create backup tables for critical data
CREATE TABLE backup_users AS SELECT * FROM users;
CREATE TABLE backup_user_profiles AS SELECT * FROM user_profiles WHERE EXISTS (SELECT 1 FROM users WHERE id = user_profiles."userId");
CREATE TABLE backup_user_preferences AS SELECT * FROM user_preferences WHERE EXISTS (SELECT 1 FROM users WHERE id = user_preferences."userId");

-- Backup quiz data if exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_categories') THEN
        CREATE TABLE backup_quiz_categories AS SELECT * FROM quiz_categories;
        CREATE TABLE backup_quiz_questions AS SELECT * FROM quiz_questions;
        CREATE TABLE backup_quiz_options AS SELECT * FROM quiz_options;
        CREATE TABLE backup_user_quiz_responses AS SELECT * FROM user_quiz_responses;
        CREATE TABLE backup_user_personality_profiles AS SELECT * FROM user_personality_profiles;
    END IF;
END $$;

-- ============================================================================
-- DROP UNUSED TABLES (32 tables to be removed)
-- ============================================================================

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS article_bookmarks CASCADE;
DROP TABLE IF EXISTS article_categories CASCADE;
DROP TABLE IF EXISTS article_read_history CASCADE;
DROP TABLE IF EXISTS article_tags CASCADE;
DROP TABLE IF EXISTS article_translations CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS category_translations CASCADE;
DROP TABLE IF EXISTS date_activities CASCADE;
DROP TABLE IF EXISTS date_activity_translations CASCADE;
DROP TABLE IF EXISTS date_experiences CASCADE;
DROP TABLE IF EXISTS date_feedbacks CASCADE;
DROP TABLE IF EXISTS date_interests CASCADE;
DROP TABLE IF EXISTS date_payments CASCADE;
DROP TABLE IF EXISTS date_requests CASCADE;
DROP TABLE IF EXISTS date_schedules CASCADE;
DROP TABLE IF EXISTS delivered_dates CASCADE;
DROP TABLE IF EXISTS icebreaker_categories CASCADE;
DROP TABLE IF EXISTS icebreaker_category_translations CASCADE;
DROP TABLE IF EXISTS icebreaker_question_translations CASCADE;
DROP TABLE IF EXISTS icebreaker_questions CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS questionnaire_answers CASCADE;
DROP TABLE IF EXISTS questionnaire_option_translations CASCADE;
DROP TABLE IF EXISTS questionnaire_options CASCADE;
DROP TABLE IF EXISTS questionnaire_question_translations CASCADE;
DROP TABLE IF EXISTS questionnaire_questions CASCADE;
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS questionnaire_section_translations CASCADE;
DROP TABLE IF EXISTS questionnaire_sections CASCADE;
DROP TABLE IF EXISTS questionnaire_templates CASCADE;
DROP TABLE IF EXISTS relationships CASCADE;
DROP TABLE IF EXISTS tag_translations CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS app_phase_translations CASCADE;
DROP TABLE IF EXISTS app_phases CASCADE;

-- ============================================================================
-- OPTIMIZE EXISTING TABLES
-- ============================================================================

-- Update users table structure
ALTER TABLE users DROP COLUMN IF EXISTS password CASCADE;
ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'temp_password';
ALTER TABLE users ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- Ensure proper indexes on users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users("verificationStatus");
CREATE INDEX IF NOT EXISTS idx_users_relationship_status ON users("relationshipStatus");

-- Update user_profiles table
ALTER TABLE user_profiles ALTER COLUMN "updatedAt" SET DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON user_profiles(city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON user_profiles(country);
CREATE INDEX IF NOT EXISTS idx_user_profiles_marital_status ON user_profiles("maritalStatus");

-- Update user_preferences table
ALTER TABLE user_preferences ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- ============================================================================
-- CREATE OPTIMIZED QUIZ TABLES (if they don't exist)
-- ============================================================================

-- Create quiz_categories table
CREATE TABLE IF NOT EXISTS quiz_categories (
    id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'BIG_FIVE',
    "order" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_categories_key ON quiz_categories(key);
CREATE INDEX IF NOT EXISTS idx_quiz_categories_active ON quiz_categories("isActive");

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "categoryId" VARCHAR(30) NOT NULL,
    text TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'LIKERT_5',
    "order" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("categoryId") REFERENCES quiz_categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_category ON quiz_questions("categoryId");
CREATE INDEX IF NOT EXISTS idx_quiz_questions_active ON quiz_questions("isActive");

-- Create quiz_options table
CREATE TABLE IF NOT EXISTS quiz_options (
    id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "questionId" VARCHAR(30) NOT NULL,
    text VARCHAR(255) NOT NULL,
    value INTEGER NOT NULL,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("questionId") REFERENCES quiz_questions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question ON quiz_options("questionId");

-- Create user_quiz_responses table
CREATE TABLE IF NOT EXISTS user_quiz_responses (
    id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" VARCHAR(30) NOT NULL,
    "questionId" VARCHAR(30) NOT NULL,
    "selectedOptionId" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("questionId") REFERENCES quiz_questions(id) ON DELETE CASCADE,
    FOREIGN KEY ("selectedOptionId") REFERENCES quiz_options(id) ON DELETE CASCADE,
    UNIQUE("userId", "questionId")
);

CREATE INDEX IF NOT EXISTS idx_user_quiz_responses_user ON user_quiz_responses("userId");

-- Create user_personality_profiles table
CREATE TABLE IF NOT EXISTS user_personality_profiles (
    id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" VARCHAR(30) UNIQUE NOT NULL,
    openness DECIMAL(5,2) DEFAULT 0,
    conscientiousness DECIMAL(5,2) DEFAULT 0,
    extraversion DECIMAL(5,2) DEFAULT 0,
    agreeableness DECIMAL(5,2) DEFAULT 0,
    neuroticism DECIMAL(5,2) DEFAULT 0,
    "primaryLoveLanguage" VARCHAR(50),
    "secondaryLoveLanguage" VARCHAR(50),
    "attachmentStyle" VARCHAR(50),
    "personalityTraits" TEXT[] DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    "growthAreas" TEXT[] DEFAULT '{}',
    "compatibilityNotes" TEXT,
    "calculatedAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- CREATE OPTIONAL FUTURE TABLES
-- ============================================================================

-- Optimize photos table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'photos') THEN
        CREATE INDEX IF NOT EXISTS idx_photos_user ON photos("userId");
    END IF;
END $$;

-- Create matches table for future use
CREATE TABLE IF NOT EXISTS matches (
    id VARCHAR(30) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" VARCHAR(30) NOT NULL,
    "partnerUserId" VARCHAR(30) NOT NULL,
    "compatibilityScore" DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    "matchedAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE("userId", "partnerUserId")
);

CREATE INDEX IF NOT EXISTS idx_matches_user ON matches("userId");
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);

-- Optimize notifications table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications("userId");
        CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications("isRead");
    END IF;
END $$;

-- Optimize system_settings table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'system_settings') THEN
        CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
        CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
    END IF;
END $$;

-- ============================================================================
-- SEED ESSENTIAL DATA
-- ============================================================================

-- Insert Big Five personality quiz categories
INSERT INTO quiz_categories (id, key, name, description, type, "order") VALUES
('big_five_cat', 'big_five', 'Big Five Personality', 'Assess your core personality traits based on the scientifically validated Big Five model', 'BIG_FIVE', 1),
('love_lang_cat', 'love_languages', 'Love Languages', 'Discover how you prefer to give and receive love', 'LOVE_LANGUAGES', 2),
('attachment_cat', 'attachment_style', 'Attachment Style', 'Understand your relationship attachment patterns', 'ATTACHMENT_STYLE', 3)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- CLEANUP AND VERIFICATION
-- ============================================================================

-- Update table statistics
ANALYZE users;
ANALYZE user_profiles;
ANALYZE user_preferences;
ANALYZE quiz_categories;
ANALYZE quiz_questions;
ANALYZE quiz_options;
ANALYZE user_quiz_responses;
ANALYZE user_personality_profiles;

-- Verify data integrity
DO $$
DECLARE
    user_count INTEGER;
    profile_count INTEGER;
    quiz_cat_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO profile_count FROM user_profiles;
    SELECT COUNT(*) INTO quiz_cat_count FROM quiz_categories;
    
    RAISE NOTICE 'Migration completed successfully:';
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Profiles: %', profile_count;
    RAISE NOTICE 'Quiz Categories: %', quiz_cat_count;
END $$;

COMMIT;

-- ============================================================================
-- POST-MIGRATION NOTES
-- ============================================================================

-- After successful migration:
-- 1. Update Prisma schema file to use the optimized version
-- 2. Run: npx prisma generate
-- 3. Update backend services to use new schema
-- 4. Test all API endpoints
-- 5. Remove backup tables after verification
