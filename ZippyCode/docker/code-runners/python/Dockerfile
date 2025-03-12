# docker/code-runners/python/Dockerfile
FROM python:3.7-alpine

# Install necessary tools
RUN apt-get update && apt-get install -y \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for code execution
WORKDIR /app

# Switch to non-root user
USER coderunner

# Default command
CMD ["bash"]