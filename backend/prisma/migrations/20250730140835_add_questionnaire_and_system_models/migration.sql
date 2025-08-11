-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'EMAIL', 'NUMBER', 'SELECT', 'MULTISELECT', 'RANGE', 'SLIDER', 'BOOLEAN', 'DATE', 'LIKERT_5', 'LIKERT_7', 'RANKING');

-- CreateTable
CREATE TABLE "questionnaire_templates" (
    "id" TEXT NOT NULL,
    "phase" "RelationshipPhase" NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_sections" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "estimatedTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionnaire_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_section_translations" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "questionnaire_section_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_questions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "validationRules" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionnaire_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_question_translations" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT,
    "helpText" TEXT,

    CONSTRAINT "questionnaire_question_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questionnaire_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_option_translations" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "questionnaire_option_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_responses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "phase" "RelationshipPhase" NOT NULL,
    "completedAt" TIMESTAMP(3),
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire_answers" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questionnaire_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "flag" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_phases" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_phase_translations" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "app_phase_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icebreaker_categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "icebreaker_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icebreaker_category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "icebreaker_category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icebreaker_questions" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "icebreaker_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icebreaker_question_translations" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "icebreaker_question_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date_activities" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "date_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date_activity_translations" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" JSONB,

    CONSTRAINT "date_activity_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_templates_phase_version_key" ON "questionnaire_templates"("phase", "version");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_section_translations_sectionId_language_key" ON "questionnaire_section_translations"("sectionId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_question_translations_questionId_language_key" ON "questionnaire_question_translations"("questionId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_option_translations_optionId_language_key" ON "questionnaire_option_translations"("optionId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_responses_userId_templateId_key" ON "questionnaire_responses"("userId", "templateId");

-- CreateIndex
CREATE UNIQUE INDEX "questionnaire_answers_responseId_questionId_key" ON "questionnaire_answers"("responseId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "app_phases_key_key" ON "app_phases"("key");

-- CreateIndex
CREATE UNIQUE INDEX "app_phase_translations_phaseId_language_key" ON "app_phase_translations"("phaseId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "icebreaker_categories_key_key" ON "icebreaker_categories"("key");

-- CreateIndex
CREATE UNIQUE INDEX "icebreaker_category_translations_categoryId_language_key" ON "icebreaker_category_translations"("categoryId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "icebreaker_question_translations_questionId_language_key" ON "icebreaker_question_translations"("questionId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "date_activities_key_key" ON "date_activities"("key");

-- CreateIndex
CREATE UNIQUE INDEX "date_activity_translations_activityId_language_key" ON "date_activity_translations"("activityId", "language");

-- AddForeignKey
ALTER TABLE "questionnaire_sections" ADD CONSTRAINT "questionnaire_sections_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "questionnaire_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_section_translations" ADD CONSTRAINT "questionnaire_section_translations_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "questionnaire_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_questions" ADD CONSTRAINT "questionnaire_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "questionnaire_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_question_translations" ADD CONSTRAINT "questionnaire_question_translations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questionnaire_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_options" ADD CONSTRAINT "questionnaire_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questionnaire_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_option_translations" ADD CONSTRAINT "questionnaire_option_translations_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "questionnaire_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "questionnaire_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "questionnaire_responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questionnaire_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_phase_translations" ADD CONSTRAINT "app_phase_translations_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "app_phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "icebreaker_category_translations" ADD CONSTRAINT "icebreaker_category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "icebreaker_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "icebreaker_questions" ADD CONSTRAINT "icebreaker_questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "icebreaker_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "icebreaker_question_translations" ADD CONSTRAINT "icebreaker_question_translations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "icebreaker_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_activity_translations" ADD CONSTRAINT "date_activity_translations_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "date_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
