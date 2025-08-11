-- ============================================================================
-- BLONG Additional Quiz Categories Seed Script
-- Adds comprehensive quiz categories with questions and options
-- ============================================================================

-- Insert additional quiz categories
INSERT INTO quiz_categories (id, key, name, description, order_index, is_active) VALUES
('core_values_cat', 'core_values', 'Core Values Assessment', 'Identify your fundamental values and life priorities', 4, true),
('communication_cat', 'communication_style', 'Communication Style', 'Understand your communication patterns and preferences in relationships', 5, true),
('lifestyle_cat', 'lifestyle_compatibility', 'Lifestyle Preferences', 'Share your lifestyle preferences and activity interests', 6, true),
('emotional_int_cat', 'emotional_intelligence', 'Emotional Intelligence', 'Assess your ability to understand and manage emotions', 7, true)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- CORE VALUES QUESTIONS
-- ============================================================================

-- Core Values Questions
INSERT INTO quiz_questions (id, category_id, question_key, question_text, question_type, order_index, is_active) VALUES
('cv_q1', 'core_values_cat', 'cv_family_importance', 'Family relationships are the most important thing in my life', 'LIKERT_5', 1, true),
('cv_q2', 'core_values_cat', 'cv_career_success', 'I prioritize career success and professional achievement', 'LIKERT_5', 2, true),
('cv_q3', 'core_values_cat', 'cv_financial_security', 'Financial security is essential for my happiness', 'LIKERT_5', 3, true),
('cv_q4', 'core_values_cat', 'cv_personal_freedom', 'I value personal freedom and independence above all', 'LIKERT_5', 4, true),
('cv_q5', 'core_values_cat', 'cv_helping_others', 'Helping others and making a difference is my priority', 'LIKERT_5', 5, true),
('cv_q6', 'core_values_cat', 'cv_traditional_values', 'I believe in traditional values and customs', 'LIKERT_5', 6, true),
('cv_q7', 'core_values_cat', 'cv_adventure', 'Adventure and new experiences excite me', 'LIKERT_5', 7, true),
('cv_q8', 'core_values_cat', 'cv_spiritual_beliefs', 'Spiritual or religious beliefs guide my decisions', 'LIKERT_5', 8, true),
('cv_q9', 'core_values_cat', 'cv_honesty', 'I value honesty and authenticity in all relationships', 'LIKERT_5', 9, true),
('cv_q10', 'core_values_cat', 'cv_personal_growth', 'Personal growth and self-improvement are important to me', 'LIKERT_5', 10, true),
('cv_q11', 'core_values_cat', 'cv_stability', 'I prefer stability and routine over change', 'LIKERT_5', 11, true),
('cv_q12', 'core_values_cat', 'cv_creativity', 'Creative expression is essential to who I am', 'LIKERT_5', 12, true),
('cv_q13', 'core_values_cat', 'cv_loyalty', 'I value loyalty and commitment in relationships', 'LIKERT_5', 13, true),
('cv_q14', 'core_values_cat', 'cv_education', 'Education and intellectual growth matter to me', 'LIKERT_5', 14, true),
('cv_q15', 'core_values_cat', 'cv_equality', 'I believe in equality and social justice', 'LIKERT_5', 15, true),
('cv_q16', 'core_values_cat', 'cv_health_fitness', 'Health and physical fitness are priorities for me', 'LIKERT_5', 16, true),
('cv_q17', 'core_values_cat', 'cv_recognition', 'I value recognition and appreciation from others', 'LIKERT_5', 17, true),
('cv_q18', 'core_values_cat', 'cv_environment', 'Environmental responsibility is important to me', 'LIKERT_5', 18, true),
('cv_q19', 'core_values_cat', 'cv_leadership', 'I prefer to lead rather than follow', 'LIKERT_5', 19, true),
('cv_q20', 'core_values_cat', 'cv_peace_harmony', 'Peace and harmony are essential in my life', 'LIKERT_5', 20, true),
('cv_q21', 'core_values_cat', 'cv_efficiency', 'I value efficiency and getting things done', 'LIKERT_5', 21, true),
('cv_q22', 'core_values_cat', 'cv_fun_enjoyment', 'Fun and enjoyment should be part of daily life', 'LIKERT_5', 22, true),
('cv_q23', 'core_values_cat', 'cv_calculated_risks', 'I believe in taking calculated risks for growth', 'LIKERT_5', 23, true),
('cv_q24', 'core_values_cat', 'cv_community', 'Community involvement and civic duty matter to me', 'LIKERT_5', 24, true),
('cv_q25', 'core_values_cat', 'cv_simplicity', 'I value simplicity and minimalism in life', 'LIKERT_5', 25, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- COMMUNICATION STYLE QUESTIONS
-- ============================================================================

-- Communication Style Questions
INSERT INTO quiz_questions (id, category_id, question_key, question_text, question_type, order_index, is_active) VALUES
('cs_q1', 'communication_cat', 'cs_immediate_discussion', 'I prefer to discuss problems immediately when they arise', 'LIKERT_5', 1, true),
('cs_q2', 'communication_cat', 'cs_think_before_speak', 'I often think before I speak in conversations', 'LIKERT_5', 2, true),
('cs_q3', 'communication_cat', 'cs_express_emotions', 'I express my emotions openly and directly', 'LIKERT_5', 3, true),
('cs_q4', 'communication_cat', 'cs_comfortable_silence', 'I am comfortable with silence during conversations', 'LIKERT_5', 4, true),
('cs_q5', 'communication_cat', 'cs_written_communication', 'I prefer written communication over verbal discussions', 'LIKERT_5', 5, true),
('cs_q6', 'communication_cat', 'cs_ask_questions', 'I ask many questions to understand others better', 'LIKERT_5', 6, true),
('cs_q7', 'communication_cat', 'cs_initiate_difficult', 'I tend to be the one who initiates difficult conversations', 'LIKERT_5', 7, true),
('cs_q8', 'communication_cat', 'cs_use_humor', 'I use humor to lighten tense situations', 'LIKERT_5', 8, true),
('cs_q9', 'communication_cat', 'cs_listen_more', 'I prefer to listen more than I speak', 'LIKERT_5', 9, true),
('cs_q10', 'communication_cat', 'cs_direct_straightforward', 'I am direct and straightforward in my communication', 'LIKERT_5', 10, true),
('cs_q11', 'communication_cat', 'cs_body_language', 'I often use gestures and body language when speaking', 'LIKERT_5', 11, true),
('cs_q12', 'communication_cat', 'cs_one_on_one', 'I prefer one-on-one conversations over group discussions', 'LIKERT_5', 12, true),
('cs_q13', 'communication_cat', 'cs_avoid_confrontation', 'I tend to avoid confrontational conversations', 'LIKERT_5', 13, true),
('cs_q14', 'communication_cat', 'cs_share_stories', 'I share personal stories to connect with others', 'LIKERT_5', 14, true),
('cs_q15', 'communication_cat', 'cs_process_time', 'I prefer to have time to process before responding', 'LIKERT_5', 15, true),
('cs_q16', 'communication_cat', 'cs_express_disagreement', 'I am comfortable expressing disagreement', 'LIKERT_5', 16, true),
('cs_q17', 'communication_cat', 'cs_check_understanding', 'I often check if others understand what I mean', 'LIKERT_5', 17, true),
('cs_q18', 'communication_cat', 'cs_face_to_face', 'I prefer face-to-face conversations over phone calls', 'LIKERT_5', 18, true),
('cs_q19', 'communication_cat', 'cs_talkative_comfortable', 'I tend to be more talkative in comfortable settings', 'LIKERT_5', 19, true),
('cs_q20', 'communication_cat', 'cs_specific_examples', 'I use specific examples to explain my points', 'LIKERT_5', 20, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- LIFESTYLE COMPATIBILITY QUESTIONS
-- ============================================================================

-- Lifestyle Questions
INSERT INTO quiz_questions (id, category_id, question_key, question_text, question_type, order_index, is_active) VALUES
('ls_q1', 'lifestyle_cat', 'ls_staying_in', 'I prefer staying in rather than going out on weekends', 'LIKERT_5', 1, true),
('ls_q2', 'lifestyle_cat', 'ls_new_restaurants', 'I enjoy trying new restaurants and cuisines', 'LIKERT_5', 2, true),
('ls_q3', 'lifestyle_cat', 'ls_plan_advance', 'I like to plan activities well in advance', 'LIKERT_5', 3, true),
('ls_q4', 'lifestyle_cat', 'ls_outdoor_activities', 'I prefer outdoor activities over indoor entertainment', 'LIKERT_5', 4, true),
('ls_q5', 'lifestyle_cat', 'ls_social_events', 'I enjoy attending social events and parties', 'LIKERT_5', 5, true),
('ls_q6', 'lifestyle_cat', 'ls_wake_early', 'I prefer to wake up early and start my day', 'LIKERT_5', 6, true),
('ls_q7', 'lifestyle_cat', 'ls_traveling', 'I enjoy traveling to new places regularly', 'LIKERT_5', 7, true),
('ls_q8', 'lifestyle_cat', 'ls_quiet_evenings', 'I prefer quiet evenings at home', 'LIKERT_5', 8, true),
('ls_q9', 'lifestyle_cat', 'ls_physically_active', 'I like to be physically active most days', 'LIKERT_5', 9, true),
('ls_q10', 'lifestyle_cat', 'ls_cultural_activities', 'I enjoy cultural activities like museums and theaters', 'LIKERT_5', 10, true),
('ls_q11', 'lifestyle_cat', 'ls_spontaneous', 'I prefer spontaneous activities over planned ones', 'LIKERT_5', 11, true),
('ls_q12', 'lifestyle_cat', 'ls_cooking_home', 'I enjoy cooking and preparing meals at home', 'LIKERT_5', 12, true),
('ls_q13', 'lifestyle_cat', 'ls_daily_routine', 'I like to have a regular daily routine', 'LIKERT_5', 13, true),
('ls_q14', 'lifestyle_cat', 'ls_learning_skills', 'I enjoy learning new skills and hobbies', 'LIKERT_5', 14, true),
('ls_q15', 'lifestyle_cat', 'ls_small_gatherings', 'I prefer small gatherings over large parties', 'LIKERT_5', 15, true),
('ls_q16', 'lifestyle_cat', 'ls_shopping', 'I enjoy shopping and browsing stores', 'LIKERT_5', 16, true),
('ls_q17', 'lifestyle_cat', 'ls_time_nature', 'I like to spend time in nature regularly', 'LIKERT_5', 17, true),
('ls_q18', 'lifestyle_cat', 'ls_save_money', 'I prefer to save money rather than spend on experiences', 'LIKERT_5', 18, true),
('ls_q19', 'lifestyle_cat', 'ls_reading_books', 'I enjoy reading books in my free time', 'LIKERT_5', 19, true),
('ls_q20', 'lifestyle_cat', 'ls_stay_up_late', 'I like to stay up late rather than go to bed early', 'LIKERT_5', 20, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- EMOTIONAL INTELLIGENCE QUESTIONS
-- ============================================================================

-- Emotional Intelligence Questions
INSERT INTO quiz_questions (id, category_id, question_key, question_text, question_type, order_index, is_active) VALUES
('ei_q1', 'emotional_int_cat', 'ei_identify_emotions', 'I can easily identify my emotions as they occur', 'LIKERT_5', 1, true),
('ei_q2', 'emotional_int_cat', 'ei_understand_triggers', 'I understand what triggers my emotional reactions', 'LIKERT_5', 2, true),
('ei_q3', 'emotional_int_cat', 'ei_calm_self', 'I can calm myself down when I feel upset', 'LIKERT_5', 3, true),
('ei_q4', 'emotional_int_cat', 'ei_notice_discomfort', 'I notice when others are feeling uncomfortable', 'LIKERT_5', 4, true),
('ei_q5', 'emotional_int_cat', 'ei_read_expressions', 'I can read people''s emotions from their facial expressions', 'LIKERT_5', 5, true),
('ei_q6', 'emotional_int_cat', 'ei_adapt_behavior', 'I adapt my behavior based on others'' emotional states', 'LIKERT_5', 6, true),
('ei_q7', 'emotional_int_cat', 'ei_self_motivate', 'I can motivate myself even when facing difficulties', 'LIKERT_5', 7, true),
('ei_q8', 'emotional_int_cat', 'ei_calm_pressure', 'I remain calm under pressure', 'LIKERT_5', 8, true),
('ei_q9', 'emotional_int_cat', 'ei_help_others', 'I can help others feel better when they are down', 'LIKERT_5', 9, true),
('ei_q10', 'emotional_int_cat', 'ei_thoughts_feelings', 'I understand the connection between my thoughts and feelings', 'LIKERT_5', 10, true),
('ei_q11', 'emotional_int_cat', 'ei_control_impulses', 'I can control my impulses effectively', 'LIKERT_5', 11, true),
('ei_q12', 'emotional_int_cat', 'ei_empathize', 'I empathize easily with others'' experiences', 'LIKERT_5', 12, true),
('ei_q13', 'emotional_int_cat', 'ei_bounce_back', 'I can bounce back quickly from setbacks', 'LIKERT_5', 13, true),
('ei_q14', 'emotional_int_cat', 'ei_emotions_decisions', 'I recognize when my emotions affect my decisions', 'LIKERT_5', 14, true),
('ei_q15', 'emotional_int_cat', 'ei_sense_mood', 'I can sense the mood of a room when I enter', 'LIKERT_5', 15, true),
('ei_q16', 'emotional_int_cat', 'ei_express_appropriately', 'I express my emotions appropriately in different situations', 'LIKERT_5', 16, true),
('ei_q17', 'emotional_int_cat', 'ei_delay_gratification', 'I can delay gratification for long-term goals', 'LIKERT_5', 17, true),
('ei_q18', 'emotional_int_cat', 'ei_impact_others', 'I understand how my emotions impact others', 'LIKERT_5', 18, true),
('ei_q19', 'emotional_int_cat', 'ei_maintain_optimism', 'I can maintain optimism during challenging times', 'LIKERT_5', 19, true),
('ei_q20', 'emotional_int_cat', 'ei_manage_conflicts', 'I effectively manage conflicts in relationships', 'LIKERT_5', 20, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- QUIZ OPTIONS (Likert Scale 1-5 for all questions)
-- ============================================================================

-- Function to generate options for all questions
DO $$
DECLARE
    question_record RECORD;
    question_ids TEXT[] := ARRAY[
        'cv_q1', 'cv_q2', 'cv_q3', 'cv_q4', 'cv_q5', 'cv_q6', 'cv_q7', 'cv_q8', 'cv_q9', 'cv_q10',
        'cv_q11', 'cv_q12', 'cv_q13', 'cv_q14', 'cv_q15', 'cv_q16', 'cv_q17', 'cv_q18', 'cv_q19', 'cv_q20',
        'cv_q21', 'cv_q22', 'cv_q23', 'cv_q24', 'cv_q25',
        'cs_q1', 'cs_q2', 'cs_q3', 'cs_q4', 'cs_q5', 'cs_q6', 'cs_q7', 'cs_q8', 'cs_q9', 'cs_q10',
        'cs_q11', 'cs_q12', 'cs_q13', 'cs_q14', 'cs_q15', 'cs_q16', 'cs_q17', 'cs_q18', 'cs_q19', 'cs_q20',
        'ls_q1', 'ls_q2', 'ls_q3', 'ls_q4', 'ls_q5', 'ls_q6', 'ls_q7', 'ls_q8', 'ls_q9', 'ls_q10',
        'ls_q11', 'ls_q12', 'ls_q13', 'ls_q14', 'ls_q15', 'ls_q16', 'ls_q17', 'ls_q18', 'ls_q19', 'ls_q20',
        'ei_q1', 'ei_q2', 'ei_q3', 'ei_q4', 'ei_q5', 'ei_q6', 'ei_q7', 'ei_q8', 'ei_q9', 'ei_q10',
        'ei_q11', 'ei_q12', 'ei_q13', 'ei_q14', 'ei_q15', 'ei_q16', 'ei_q17', 'ei_q18', 'ei_q19', 'ei_q20'
    ];
    question_id TEXT;
BEGIN
    FOREACH question_id IN ARRAY question_ids
    LOOP
        -- Insert 5-point Likert scale options for each question
        INSERT INTO quiz_options (id, question_id, option_key, option_text, score_value, order_index) VALUES
        (question_id || '_opt1', question_id, question_id || '_strongly_disagree', 'Strongly Disagree', 1, 1),
        (question_id || '_opt2', question_id, question_id || '_disagree', 'Disagree', 2, 2),
        (question_id || '_opt3', question_id, question_id || '_neutral', 'Neutral', 3, 3),
        (question_id || '_opt4', question_id, question_id || '_agree', 'Agree', 4, 4),
        (question_id || '_opt5', question_id, question_id || '_strongly_agree', 'Strongly Agree', 5, 5)
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END $$;

-- ============================================================================
-- VERIFICATION AND CLEANUP
-- ============================================================================

-- Verify the data was inserted correctly
DO $$
DECLARE
    category_count INTEGER;
    question_count INTEGER;
    option_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO category_count FROM quiz_categories WHERE key IN ('core_values', 'communication_style', 'lifestyle_compatibility', 'emotional_intelligence');
    SELECT COUNT(*) INTO question_count FROM quiz_questions WHERE category_id IN ('core_values_cat', 'communication_cat', 'lifestyle_cat', 'emotional_int_cat');
    SELECT COUNT(*) INTO option_count FROM quiz_options WHERE question_id LIKE 'cv_%' OR question_id LIKE 'cs_%' OR question_id LIKE 'ls_%' OR question_id LIKE 'ei_%';

    RAISE NOTICE 'Additional quiz categories seeded successfully:';
    RAISE NOTICE 'Categories added: %', category_count;
    RAISE NOTICE 'Questions added: %', question_count;
    RAISE NOTICE 'Options added: %', option_count;

    IF category_count = 4 AND question_count = 85 AND option_count = 425 THEN
        RAISE NOTICE '✅ All data seeded successfully!';
    ELSE
        RAISE WARNING '⚠️ Data counts do not match expected values';
    END IF;
END $$;