# docker/app/Dockerfile
FROM openjdk:11-jdk-slim

# Install Docker CLI
RUN apt-get update && \
    apt-get install -y docker.io && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the application jar
COPY target/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]