-- LearnFlow Database Schema
-- Initial schema for Phase 3

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_level VARCHAR(50) DEFAULT 'beginner'
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
    topic_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20),
    order_index INTEGER
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id VARCHAR(100) PRIMARY KEY,
    topic_id VARCHAR(100) REFERENCES topics(topic_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    starter_code TEXT,
    test_cases JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    submission_id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255) REFERENCES students(student_id),
    exercise_id VARCHAR(100) REFERENCES exercises(exercise_id),
    code TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    passed BOOLEAN,
    feedback TEXT
);

-- Student progress table
CREATE TABLE IF NOT EXISTS student_progress (
    progress_id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) REFERENCES students(student_id),
    topic_id VARCHAR(100) REFERENCES topics(topic_id),
    mastery_score DECIMAL(5,2) DEFAULT 0.0,
    exercises_completed INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, topic_id)
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    conversation_id VARCHAR(255) PRIMARY KEY,
    student_id VARCHAR(255) REFERENCES students(student_id),
    agent_type VARCHAR(50) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    messages JSONB
);

-- Struggle alerts table
CREATE TABLE IF NOT EXISTS struggle_alerts (
    alert_id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) REFERENCES students(student_id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE
);

-- Code reviews table
CREATE TABLE IF NOT EXISTS code_reviews (
    review_id VARCHAR(255) PRIMARY KEY,
    submission_id VARCHAR(255) REFERENCES submissions(submission_id),
    feedback_summary TEXT,
    score INTEGER,
    suggestions JSONB,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exercise attempts table
CREATE TABLE IF NOT EXISTS exercise_attempts (
    attempt_id SERIAL PRIMARY KEY,
    student_id VARCHAR(255) REFERENCES students(student_id),
    exercise_id VARCHAR(100) REFERENCES exercises(exercise_id),
    attempt_number INTEGER DEFAULT 1,
    code TEXT,
    passed BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
