#!/usr/bin/env python3
"""
Apply LearnFlow database schema to PostgreSQL.
Run this script locally to create all required tables.
"""
import subprocess
import sys

# Kubernetes configuration
NAMESPACE = "postgres"
POD_NAME = "postgres-postgresql-0"
DB_USER = "learnflow"
DB_NAME = "learnflow"
DB_PASSWORD = "learnflow123"

# SQL statements to execute
SQL_STATEMENTS = [
    # Students table
    """
    CREATE TABLE IF NOT EXISTS students (
        student_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        current_level VARCHAR(50) DEFAULT 'beginner'
    )
    """,

    # Topics table
    """
    CREATE TABLE IF NOT EXISTS topics (
        topic_id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty_level VARCHAR(20),
        order_index INTEGER
    )
    """,

    # Exercises table
    """
    CREATE TABLE IF NOT EXISTS exercises (
        exercise_id VARCHAR(100) PRIMARY KEY,
        topic_id VARCHAR(100) REFERENCES topics(topic_id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(20),
        starter_code TEXT,
        test_cases JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,

    # Submissions table
    """
    CREATE TABLE IF NOT EXISTS submissions (
        submission_id VARCHAR(255) PRIMARY KEY,
        student_id VARCHAR(255) REFERENCES students(student_id),
        exercise_id VARCHAR(100) REFERENCES exercises(exercise_id),
        code TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        passed BOOLEAN,
        feedback TEXT
    )
    """,

    # Student progress table
    """
    CREATE TABLE IF NOT EXISTS student_progress (
        progress_id SERIAL PRIMARY KEY,
        student_id VARCHAR(255) REFERENCES students(student_id),
        topic_id VARCHAR(100) REFERENCES topics(topic_id),
        mastery_score DECIMAL(5,2) DEFAULT 0.0,
        exercises_completed INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, topic_id)
    )
    """,

    # Conversations table
    """
    CREATE TABLE IF NOT EXISTS conversations (
        conversation_id VARCHAR(255) PRIMARY KEY,
        student_id VARCHAR(255) REFERENCES students(student_id),
        agent_type VARCHAR(50) NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        messages JSONB
    )
    """,

    # Struggle alerts table
    """
    CREATE TABLE IF NOT EXISTS struggle_alerts (
        alert_id SERIAL PRIMARY KEY,
        student_id VARCHAR(255) REFERENCES students(student_id),
        alert_type VARCHAR(50) NOT NULL,
        severity VARCHAR(20) DEFAULT 'medium',
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved BOOLEAN DEFAULT FALSE
    )
    """,

    # Code reviews table
    """
    CREATE TABLE IF NOT EXISTS code_reviews (
        review_id VARCHAR(255) PRIMARY KEY,
        submission_id VARCHAR(255) REFERENCES submissions(submission_id),
        feedback_summary TEXT,
        score INTEGER,
        suggestions JSONB,
        reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,

    # Exercise attempts table
    """
    CREATE TABLE IF NOT EXISTS exercise_attempts (
        attempt_id SERIAL PRIMARY KEY,
        student_id VARCHAR(255) REFERENCES students(student_id),
        exercise_id VARCHAR(100) REFERENCES exercises(exercise_id),
        attempt_number INTEGER DEFAULT 1,
        code TEXT,
        passed BOOLEAN,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
]


def exec_psql(sql):
    """Execute SQL statement via kubectl exec."""
    cmd = [
        "kubectl", "exec", "-n", NAMESPACE, POD_NAME, "--",
        "bash", "-c",
        f"PGPASSWORD={DB_PASSWORD} psql -U {DB_USER} -d {DB_NAME} -c \"{sql.strip()}\""
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    return result


def main():
    """Apply all database migrations."""
    print("=" * 60)
    print("LearnFlow Database Migration")
    print("=" * 60)
    print()

    success_count = 0
    fail_count = 0

    for i, sql in enumerate(SQL_STATEMENTS, 1):
        table_name = sql.split("IF NOT EXISTS ")[1].split(" ")[0]
        print(f"[{i}/{len(SQL_STATEMENTS)}] Creating table: {table_name}...", end=" ")

        result = exec_psql(sql)

        if result.returncode == 0:
            print("[OK]")
            success_count += 1
        else:
            print(f"[FAILED]")
            print(f"  Error: {result.stderr}")
            fail_count += 1

    print()
    print("=" * 60)
    print(f"Migration complete: {success_count} succeeded, {fail_count} failed")
    print("=" * 60)

    # Verify tables
    print()
    print("Verifying tables...")
    result = exec_psql(r"\dt")
    if result.returncode == 0:
        print(result.stdout)
    else:
        print(f"Error listing tables: {result.stderr}")

    return 0 if fail_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
