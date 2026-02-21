# Base image with Node installed
FROM node:18

# Create working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json FIRST
COPY package*.json ./

# Install dependencies inside container
RUN npm install

# Now copy remaining backend code
COPY . .

# Backend runs on port 5000
EXPOSE 5000

# Start backend
CMD ["npm", "start"]