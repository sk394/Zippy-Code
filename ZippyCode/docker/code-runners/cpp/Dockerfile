# docker/code-runners/cpp/Dockerfile
FROM gcc:latest

# Install necessary tools
RUN apt-get update && apt-get install -y \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for code execution
WORKDIR /app

# Default command
CMD ["bash"]