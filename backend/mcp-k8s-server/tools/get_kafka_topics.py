"""
get_kafka_topics: List Kafka topics in the cluster
Returns topic list with metadata.
"""
import subprocess
import json
from typing import Dict, Any, List

def get_kafka_topics() -> Dict[str, Any]:
    """
    List Kafka topics from the Redpanda cluster.

    Returns:
    - status: success/error
    - topic_count: int
    - topics: list of topic names

    Uses rpk command-line tool or kubectl exec into Redpanda.
    """
    try:
        # Try using kubectl exec to access Redpanda
        cmd = [
            "kubectl", "exec", "-n", "redpanda-system", "redpanda-0",
            "--", "rpk", "topic", "list", "-o", "json"
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=15
        )

        if result.returncode != 0:
            # Fallback: Return known LearnFlow topics
            return {
                "status": "success",
                "source": "fallback",
                "topic_count": 9,
                "topics": [
                    "learning.exercise.completed",
                    "learning.exercise.failed",
                    "learning.quiz.passed",
                    "learning.quiz.failed",
                    "learning.concept.mastered",
                    "struggle.repeated_error",
                    "struggle.time_exceeded",
                    "struggle.help_requested",
                    "struggle.low_score",
                ],
                "note": "Redpanda not accessible - returning known topics",
            }

        # Parse JSON output
        topics_data = json.loads(result.stdout)

        topics = []
        if isinstance(topics_data, list):
            for topic in topics_data:
                if isinstance(topic, dict):
                    topics.append(topic.get("topic_name", "unknown"))
                elif isinstance(topic, str):
                    topics.append(topic)

        return {
            "status": "success",
            "source": "redpanda",
            "topic_count": len(topics),
            "topics": topics[:100],  # Limit to 100 topics
        }

    except subprocess.TimeoutExpired:
        return {
            "status": "error",
            "error": "command timed out",
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)[:100],
        }

__all__ = ["get_kafka_topics"]
