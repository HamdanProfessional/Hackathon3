-- Rollback script for initial schema

-- Drop indexes
DROP INDEX IF EXISTS idx_error_frequency_student;
DROP INDEX IF EXISTS idx_struggles_resolved;
DROP INDEX IF EXISTS idx_struggles_student;
DROP INDEX IF EXISTS idx_conversation_history_timestamp;
DROP INDEX IF EXISTS idx_conversation_history_student;
DROP INDEX IF EXISTS idx_code_submissions_student;
DROP INDEX IF EXISTS idx_exercise_submissions_exercise;
DROP INDEX IF EXISTS idx_exercise_submissions_student;
DROP INDEX IF EXISTS idx_progress_student;

-- Drop tables (in reverse order due to foreign keys)
DROP TABLE IF EXISTS error_frequency;
DROP TABLE IF EXISTS learning_streaks;
DROP TABLE IF EXISTS struggles;
DROP TABLE IF EXISTS conversation_history;
DROP TABLE IF EXISTS code_reviews;
DROP TABLE IF EXISTS code_submissions;
DROP TABLE IF EXISTS exercise_submissions;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS students;
