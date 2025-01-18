
# Use the official Node.js image
FROM node:23-alpine

# Set the working directory
WORKDIR /app/server

# Copy package.json and application files
COPY package.json ./
COPY tsconfig.json ./ 
COPY global.d.ts ./ 
# COPY .env ./ 
COPY src ./src

# Install dependencies
RUN npm install

RUN npx tsc || echo "TypeScript errors ignored, continuing build."

RUN addgroup -g 10014 choreo && \
    adduser --disabled-password --no-create-home --uid 10014 --ingroup choreo choreouser

USER 10014

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
