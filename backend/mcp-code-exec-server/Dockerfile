FROM python:3.11-slim

WORKDIR /app

# Install prlimit for resource limits (Linux only)
RUN apt-get update && \
    apt-get install -y util-linux && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 mcpuser && \
    chown -R mcpuser:mcpuser /app

USER mcpuser

CMD ["python", "-m", "mcp-code-exec-server.main"]
