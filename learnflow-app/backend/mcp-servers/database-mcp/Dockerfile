# MCP Database Server Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy MCP server code
COPY http_server.py /app/

# Create non-root user for security
RUN useradd -m -u 1001 mcpuser && chown -R mcpuser:mcpuser /app
USER mcpuser

# Expose HTTP port
EXPOSE 9001

# Environment
ENV PYTHONUNBUFFERED=1
ENV DATABASE_HOST=postgres.postgres.svc.cluster.local
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=learnflow
ENV DATABASE_USER=learnflow

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:9001/health').read()" || exit 1

# Run HTTP server
CMD ["python", "http_server.py"]
