-- LearnFlow Database Schema
-- Initial schema for all backend services

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    current_module INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    module INTEGER NOT NULL,
    topic VARCHAR(255) NOT NULL,
    mastery_score DECIMAL(5,2) DEFAULT 0.0,
    mastery_level VARCHAR(20) DEFAULT 'Beginner',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, module, topic)
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module INTEGER NOT NULL,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    starter_code TEXT,
    test_cases JSONB,
    hints JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise submissions table
CREATE TABLE IF NOT EXISTS exercise_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID NOT NULL REFERENCES exercises(exercise_id),
    student_id UUID NOT NULL REFERENCES students(student_id),
    code TEXT NOT NULL,
    passed BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    hints_requested INTEGER DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code submissions table
CREATE TABLE IF NOT EXISTS code_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    code TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Code reviews table
CREATE TABLE IF NOT EXISTS code_reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES code_submissions(submission_id),
    correctness_score DECIMAL(5,2),
    style_score DECIMAL(5,2),
    efficiency_score DECIMAL(5,2),
    readability_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    feedback TEXT,
    suggestions JSONB,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation history table
CREATE TABLE IF NOT EXISTS conversation_history (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    topic VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Struggle alerts table
CREATE TABLE IF NOT EXISTS struggles (
    struggle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    struggle_type VARCHAR(50) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    details TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning streaks table
CREATE TABLE IF NOT EXISTS learning_streaks (
    student_id UUID PRIMARY KEY REFERENCES students(student_id),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Error frequency table (for struggle detection)
CREATE TABLE IF NOT EXISTS error_frequency (
    error_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(student_id),
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    count INTEGER DEFAULT 1,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, error_type, error_message)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress(student_id);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_student ON exercise_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_exercise_submissions_exercise ON exercise_submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_student ON code_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_student ON conversation_history(student_id);
CREATE INDEX IF NOT EXISTS idx_conversation_history_timestamp ON conversation_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_struggles_student ON struggles(student_id);
CREATE INDEX IF NOT EXISTS idx_struggles_resolved ON struggles(resolved);
CREATE INDEX IF NOT EXISTS idx_error_frequency_student ON error_frequency(student_id);
