FROM node:20-alpine
RUN apk add --no-cache tree libc6-compat
WORKDIR /app

COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci 

COPY frontend ./ 
COPY backend /app/backend
RUN tree -L 2 /app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
