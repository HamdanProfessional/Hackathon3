---
slug: /teacher-guide
title: Teacher Guide - Monitoring Students
sidebar_position: 8
---

# Teacher Guide - Monitoring Students

LearnFlow provides powerful tools for teachers to monitor student progress, identify struggles, and provide targeted help.

---

## Teacher Dashboard

### Accessing the Dashboard

Visit **http://localhost:3001/teacher** and log in with your teacher account.

**Default Teacher Credentials:**
- Email: `teacher@learnflow.dev`
- Password: `teacher123`

### Dashboard Overview

The teacher dashboard provides:

| Section | Description |
|---------|-------------|
| **Class Overview** | Summary of all students and their progress |
| **Struggle Alerts** | Students who need immediate help |
| **Exercise Analytics** | Performance on specific exercises |
| **Module Progress** | Completion rates per module |
| **AI Chat Monitor** | View student-AI conversations (with privacy) |

---

## Monitoring Student Progress

### Class Overview

View all students in your class with key metrics:

```json
{
  "students": [
    {
      "student_id": "student-001",
      "name": "Alice Johnson",
      "overall_mastery": 0.72,
      "exercises_completed": 18,
      "streak_days": 5,
      "last_active": "2026-01-30T15:30:00Z",
      "current_module": "control-flow"
    }
  ]
}
```

**Metrics Explained:**
- **Overall Mastery**: Combined score (0-1) from all activities
- **Exercises Completed**: Total exercises successfully submitted
- **Streak Days**: Consecutive days of learning activity
- **Current Module**: Which module the student is working on

### Individual Student View

Click any student to see detailed progress:

**Progress Tab:**
- Mastery breakdown by module
- Quiz scores over time
- Exercise completion timeline
- Code quality trends

**Activity Tab:**
- Recent exercise submissions
- Chat interactions with AI tutor
- Time spent per module
- Help requests

---

## Struggle Detection

### Automatic Struggle Alerts

LearnFlow automatically detects when students are struggling:

**Triggers:**
- **Repeated Errors**: Same error 3+ times
- **Time Threshold**: >15 minutes on single exercise
- **Multiple Hints**: Using all hints without success
- **Streak Break**: Inactive for 3+ days

### Alert Priority

| Priority | Criteria | Action |
|----------|----------|--------|
| **High** | 5+ failed attempts, same error | Immediate intervention |
| **Medium** | 3 failed attempts, progressing | Monitor closely |
| **Low** | First-time struggle | Self-guided hints sufficient |

### Managing Alerts

View alerts at **http://localhost:3001/teacher/alerts**:

```json
{
  "alerts": [
    {
      "alert_id": "alert-001",
      "student_id": "student-001",
      "student_name": "Alice Johnson",
      "alert_type": "repeated_error",
      "severity": "high",
      "concept": "loops",
      "error_count": 5,
      "last_error": "IndentationError: expected an indented block",
      "exercise_id": "ex_2_3",
      "timestamp": "2026-01-30T16:45:00Z"
    }
  ]
}
```

**Actions:**
1. **Review Student Code**: See what they're struggling with
2. **Send Personal Hint**: Provide targeted guidance
3. **Schedule 1-on-1**: Flag for live help session
4. **Mark as Resolved**: Dismiss alert after help

---

## Exercise Analytics

### Performance by Exercise

See which exercises are most challenging:

**Metrics:**
- **Pass Rate**: % of students who passed on first try
- **Average Attempts**: Mean attempts before success
- **Avg Time**: Time spent on exercise
- **Common Errors**: Most frequent mistakes

**Example Report:**
```
Exercise: ex_2_3 - For Loop Basics
Pass Rate: 65%
Average Attempts: 2.8
Avg Time: 12 minutes
Common Errors:
  - IndentationError: 40%
  - NameError (loop variable): 25%
  - Off-by-one errors: 20%
```

### Module Completion Rates

Track progress through modules:

```
Module Completion (Class of 30 students):
├── Python Basics: ████████████████████ 100% (30/30)
├── Control Flow:  ██████████████░░░░░░ 70%  (21/30)
├── Functions:      ████████░░░░░░░░░░░ 40%  (12/30)
└── Data Structures:███░░░░░░░░░░░░░░░░░ 15%  (5/30)
```

**Use this to:**
- Identify pacing issues
- Adjust difficulty
- Plan review sessions

---

## AI Chat Monitoring

### Conversation Analytics

View aggregated insights from AI chat sessions (respecting student privacy):

**Privacy-First Approach:**
- **No direct access** to individual chat conversations
- **Aggregated analytics** only
- **Anonymized insights** for common issues

**Available Metrics:**
- Most asked questions by concept
- Average time to resolve confusion
- Hint usage patterns
- Concept difficulty rankings

### Concept Difficulty Report

```json
{
  "concept_difficulty": [
    {
      "concept": "loops",
      "avg_mastery_at_question": 0.35,
      "question_count": 145,
      "avg_hints_needed": 2.3,
      "common_confusions": [
        "Difference between for and while",
        "When to use range()",
        "Loop variable scope"
      ]
    }
  ]
}
```

---

## Providing Targeted Help

### Personal Hints

Send custom hints to struggling students:

1. Go to **Alerts** → Select student
2. Review their code and error
3. Compose personalized hint
4. Send - appears in their chat

**Hint Best Practices:**
- Don't give the answer directly
- Point to the specific issue
- Suggest debugging steps
- Encourage problem-solving

### Exercise Modifications

For advanced students, create modified exercises:

**Options:**
- Add bonus challenges
- Increase constraints
- Require optimization
- Remove scaffolding

### Group Management

Create student groups for targeted instruction:

**Use Cases:**
- Advanced: Acceleration track
- Struggling: Additional support
- Project teams: Collaborative exercises

---

## Grading and Assessment

### Automated Grading

Exercises are auto-graded with:

- **Test Cases**: Code runs against predefined tests
- **Code Quality**: PEP 8 compliance checked
- **Efficiency**: Performance benchmarks (where applicable)

### Manual Review Override

Teachers can override automated grades:

**When to Use:**
- Creative solutions that tests don't catch
- Partial credit for good effort
- Exceptional work deserving bonus

### Quiz Management

Create and manage quizzes:

1. Go to **Teacher Dashboard** → **Quizzes**
2. Click **Create Quiz**
3. Add questions (multiple choice, code completion)
4. Set passing threshold
5. Assign to module(s)

---

## Class Management

### Adding Students

**Method 1: Self-Registration**
- Share class code: `CLASS-001`
- Students enter code during signup

**Method 2: Bulk Import**
```bash
curl -X POST http://localhost:8005/api/teacher/students/import \
  -H "Authorization: Bearer <token>" \
  -F "file=@students.csv"
```

CSV Format:
```csv
name,email,class_code
Alice Johnson,alice@school.edu,CLASS-001
Bob Smith,bob@school.edu,CLASS-001
```

### Setting Module Pacing

Control when modules become available:

**Pacing Options:**
- **Self-Paced**: Students progress at their own speed
- **Locked**: Unlock modules manually per schedule
- **Prerequisite**: Must score X% to unlock next

Configure at **Teacher Dashboard** → **Settings** → **Pacing**

---

## Reports and Export

### Progress Reports

Generate comprehensive reports:

**Student Report:**
- Individual progress over time
- Strengths and weaknesses
- Recommended next steps

**Class Report:**
- Average mastery per module
- Attendance/streak data
- Struggle alert summary

### Export Options

**Available Formats:**
- CSV (spreadsheet compatible)
- JSON (for further analysis)
- PDF (formatted reports)

**API Export:**
```bash
# Export all student progress
curl -X GET http://localhost:8005/api/teacher/export/progress \
  -H "Authorization: Bearer <token>" \
  -o class_progress.csv

# Export struggle alerts
curl -X GET http://localhost:8005/api/teacher/export/alerts \
  -H "Authorization: Bearer <token>" \
  -o alerts.json
```

---

## Best Practices

### 1. Check Alerts Daily

Review struggle alerts at the start of each day to provide timely help.

### 2. Use Analytics to Improve

Regularly review exercise analytics to identify problematic content.

### 3. Encourage Peer Learning

Create study groups for students working on similar concepts.

### 4. Celebrate Progress

Acknowledge milestones (streaks, modules completed) to motivate students.

### 5. Provide Context

When students struggle, explain the "why" not just the "how."

---

## Troubleshooting

### Students Not Appearing

**Problem**: Student signed up but not in class list

**Solution**:
1. Verify they used correct class code
2. Check if they're in a different class
3. Manually add via Teacher Dashboard

### Alert Spam

**Problem**: Too many low-priority alerts

**Solution**:
1. Adjust alert sensitivity in Settings
2. Focus on High/Medium priority only
3. Create custom alert rules

### Analytics Not Updating

**Problem**: Progress data seems outdated

**Solution**:
1. Check if services are running: `docker ps`
2. Restart progress service: `docker-compose restart progress-service`
3. Clear browser cache and refresh

---

## Next Steps

- [Student Guide](/student-guide) - Share with your students
- [Backend API](/backend-api) - Integrate with your tools
- [MCP Usage](/mcp-usage) - Use MCP servers for custom integrations

---

**Need Help?** Check the [GitHub Issues](https://github.com/your-org/learnflow/issues) or open a new issue.
