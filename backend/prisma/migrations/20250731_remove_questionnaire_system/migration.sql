-- Remove Questionnaire System Migration
-- This migration removes all questionnaire-related tables and data

-- Drop foreign key constraints first
ALTER TABLE "questionnaire_sections" DROP CONSTRAINT IF EXISTS "questionnaire_sections_templateId_fkey";
ALTER TABLE "questionnaire_section_translations" DROP CONSTRAINT IF EXISTS "questionnaire_section_translations_sectionId_fkey";
ALTER TABLE "questionnaire_questions" DROP CONSTRAINT IF EXISTS "questionnaire_questions_sectionId_fkey";
ALTER TABLE "questionnaire_question_translations" DROP CONSTRAINT IF EXISTS "questionnaire_question_translations_questionId_fkey";
ALTER TABLE "questionnaire_options" DROP CONSTRAINT IF EXISTS "questionnaire_options_questionId_fkey";
ALTER TABLE "questionnaire_option_translations" DROP CONSTRAINT IF EXISTS "questionnaire_option_translations_optionId_fkey";
ALTER TABLE "questionnaire_responses" DROP CONSTRAINT IF EXISTS "questionnaire_responses_userId_fkey";
ALTER TABLE "questionnaire_responses" DROP CONSTRAINT IF EXISTS "questionnaire_responses_templateId_fkey";
ALTER TABLE "questionnaire_answers" DROP CONSTRAINT IF EXISTS "questionnaire_answers_responseId_fkey";
ALTER TABLE "questionnaire_answers" DROP CONSTRAINT IF EXISTS "questionnaire_answers_questionId_fkey";

-- Drop questionnaire tables
DROP TABLE IF EXISTS "questionnaire_answers";
DROP TABLE IF EXISTS "questionnaire_responses";
DROP TABLE IF EXISTS "questionnaire_option_translations";
DROP TABLE IF EXISTS "questionnaire_options";
DROP TABLE IF EXISTS "questionnaire_question_translations";
DROP TABLE IF EXISTS "questionnaire_questions";
DROP TABLE IF EXISTS "questionnaire_section_translations";
DROP TABLE IF EXISTS "questionnaire_sections";
DROP TABLE IF EXISTS "questionnaire_templates";

-- Drop QuestionType enum
DROP TYPE IF EXISTS "QuestionType";

-- Note: Keeping other tables like system_settings, languages, app_phases, etc.
-- as they might be used by other parts of the system
