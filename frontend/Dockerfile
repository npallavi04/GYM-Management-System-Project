FROM node:20

WORKDIR /app

# Copy package.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose frontend port
EXPOSE 3000

# Run frontend
CMD ["npm", "start"]
