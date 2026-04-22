# Step 1: Base image
FROM node:18

# Step 2: Create folder inside container
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy full project
COPY . .

# Step 6: Expose port
EXPOSE 5000

# Step 7: Run app
CMD ["node", "server.js"]