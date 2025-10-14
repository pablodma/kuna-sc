# Multi-stage build for Spring Boot application
FROM eclipse-temurin:17-jdk-alpine AS builder

# Install Maven
RUN apk add --no-cache maven

# Set working directory
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B || true

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# List the target directory to verify JAR was created
RUN ls -la target/

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/financing-offer-api-0.0.1-SNAPSHOT.jar app.jar

# Verify the JAR was copied
RUN ls -la

# Expose port
EXPOSE 8080

# Run the application - JAR is in /app/app.jar, not /app/target/
CMD ["java", "-Dserver.port=${PORT:-8080}", "-jar", "/app/app.jar"]
