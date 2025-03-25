# 1️⃣ Use official Node.js image
FROM node:18

# 2️⃣ Set working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the app
COPY . .

# 6️⃣ Expose Vite’s default development port
EXPOSE 5173

# 7️⃣ Start the Vite development server
CMD ["npm", "run", "dev"]
