# docker/code-runners/java/Dockerfile
FROM openjdk:11-jdk-slim

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