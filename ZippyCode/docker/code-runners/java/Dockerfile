# docker/code-runners/java/Dockerfile
FROM openjdk:11-jdk-slim

# Install necessary tools
RUN apt-get update && apt-get install -y \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for code execution
WORKDIR /code

# Set security constraints
RUN addgroup --system coderunner && \
    adduser --system --ingroup coderunner coderunner && \
    chown -R coderunner:coderunner /code

# Limit resources
RUN ulimit -v 262144  # 256MB memory limit
RUN ulimit -t 30      # 30 seconds CPU time limit

# Switch to non-root user
USER coderunner

# Default command
CMD ["bash"]