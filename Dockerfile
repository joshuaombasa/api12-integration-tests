# Use a lightweight base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first to use cached layers
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of the app
COPY . .

# Run the app
EXPOSE 3000
CMD ["npm", "start"]
