FROM node:20-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

COPY frontend ./ 
COPY supabase ../supabase

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
