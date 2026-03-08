# Zomato Clone Docker Deep Dive & Connectivity Guide

This document explains **exactly** what every line in the Docker configuration means, why it was written, how the database is connected, and how the MERN stack speaks to each other behind the scenes.

---

## 1. The Backend `Dockerfile` Explained
*(Location: `backend/Dockerfile`)*

```dockerfile
# 1. FROM node:18-alpine
```
- **What it does**: This tells Docker to use the official Node.js version 18 image based on "Alpine Linux" as the starting point.
- **Why**: "Alpine" is a stripped-down, ultra-lightweight version of Linux. It keeps your final image size very small (megabytes instead of gigabytes), which is perfect for deploying APIs quickly to an EC2 instance.

```dockerfile
# 2. WORKDIR /app
```
- **What it does**: This creates a new directory named `/app` inside the container and CD's (changes directory) into it.
- **Why**: It ensures all subsequent commands (copying files, installing packages) happen cleanly inside this specific folder rather than littering the root of the container.

```dockerfile
# 3. COPY package*.json ./
```
- **What it does**: This copies both `package.json` and `package-lock.json` from your machine into the `/app` folder inside the container.
- **Why**: We copy *only* these files first to take advantage of Docker's layer caching. If your code changes but your dependencies don't, Docker won't have to re-download all npm packages every time!

```dockerfile
# 4. RUN npm install
```
- **What it does**: Executes `npm install` inside the container.
- **Why**: This reads the `package.json` we just copied and installs Express, Mongoose, Socket.io, etc., securely inside the container environment.

```dockerfile
# 5. COPY . .
```
- **What it does**: Copies everything else from your `backend` folder into the container's `/app` folder.
- **Why**: This brings in your actual API code (`server.js`, controllers, models). (We deleted the `.dockerignore` per your request, so it copies everything).

```dockerfile
# 6. EXPOSE 5000
```
- **What it does**: Documents that the application inside the container expects to receive traffic on port 5000. 
- **Why**: While it doesn't actually publish the port to the host machine by itself, it's a best practice to document which port the developer needs to map.

```dockerfile
# 7. CMD ["npm", "start"]
```
- **What it does**: This is the default command that runs when the container finally starts up.
- **Why**: It triggers the `start` script in your `package.json` (`node src/server.js`), actually turning on the backend API server.

---

## 2. The Frontend `Dockerfile` Explained
*(Location: `frontend/Dockerfile`)*

Building a React app is different from a Node API. React code must be "compiled" into static HTML/JS/CSS files, which then need a web server (like Nginx) to serve them to users. We use a **Multi-Stage Build** to do this efficiently.

```dockerfile
# 1. FROM node:18-alpine AS build
```
- **What it does**: Starts the first stage (named "build") using Node.js to compile the React/Vite code.

```dockerfile
# 2. WORKDIR /app
# 3. COPY package*.json ./
# 4. RUN npm install
# 5. COPY . .
```
- **What it does**: Exact same as the backend. Creates the folder, copies packages, installs dependencies, then copies your React components in.

```dockerfile
# 6. RUN npm run build
```
- **What it does**: Executes Vite's build command inside the container.
- **Why**: This compiles all your `.jsx` and Tailwind files into browser-friendly, minified static files and places them in a `dist` folder. 

```dockerfile
# 7. FROM nginx:alpine
```
- **What it does**: Starts the **second stage** of the build using Nginx (a lightning-fast web server). Everything from the first stage is thrown away *except* what we explicitly copy next. 

```dockerfile
# 8. COPY --from=build /app/dist /usr/share/nginx/html
```
- **What it does**: Grabs *only* the compiled `dist` folder from the first "build" stage and places it into Nginx's default serving directory.
- **Why**: This results in a tiny, highly-secure production container that only contains static files and a web server, rather than the entire Node.js runtime and heavy source code.

```dockerfile
# 9. COPY nginx.conf /etc/nginx/conf.d/default.conf
```
- **What it does**: Overwrites Nginx's default configuration with our custom `nginx.conf`.
- **Why**: Our custom config does two critical things: 
  1. Handles React Router correctly by redirecting 404s back to `index.html`. 
  2. Acts as a **Reverse Proxy** to route `/api` requests to the backend container seamlessly.

```dockerfile
# 10. EXPOSE 80
# 11. CMD ["nginx", "-g", "daemon off;"]
```
- **What it does**: Exposes standard HTTP Port 80, and runs Nginx in the foreground so the Docker container stays alive.

---

## 3. The `docker-compose.yml` Explained
*(Location: `docker-compose.yml`)*

This file orchestrates the entire application. It tells Docker how to build and connect all three pieces (MongoDB, Backend, Frontend) together on your EC2 instance.

```yaml
version: '3.8'
```
- Defines the schema version. 3.8 is standard and modern.

### MongoDB Service
```yaml
services:
  mongodb:
    image: mongo:latest
    container_name: zomato_mongo
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - zomato-network
```
- `image: mongo`: Downloads the official, pre-built MongoDB database from the internet. No Dockerfile needed!
- `container_name`: Gives it a friendly name.
- `ports: "27017:27017"`: Maps your EC2 machine's port 27017 to the container's port 27017.
- `volumes:`: **Crucial step.** It maps the database storage directory inside the container (`/data/db`) to a persistent volume built by Docker (`mongodb_data`). **Why?** If the MongoDB container crashes or stops, your users' data/orders won't be deleted!
- `networks:` Puts MongoDB on a private virtual network called `zomato-network`.

### Backend Service
```yaml
  backend:
    build: ./backend
    container_name: zomato_backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongodb:27017/zomato
      - PORT=5000
      - JWT_SECRET=supersecretjwtkeyzomato123
    depends_on:
      - mongodb
    networks:
      - zomato-network
```
- `build: ./backend`: Tells Docker to find the `backend/Dockerfile` and build it from scratch.
- `environment:`: Injects environment variables dynamically into the container (explained in depth in section 4 below).
- `depends_on: - mongodb`: Ensures the database container boots up *before* the backend tries to connect to it.
- `networks:`: Connects it to the same network as MongoDB and the Frontend. **Why?** Docker provides automatic DNS resolution. The backend can reach MongoDB simply by calling its service name `mongodb`.

### Frontend Service
```yaml
  frontend:
    build: ./frontend
    container_name: zomato_frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - zomato-network
```
- Similar concepts. It builds the React multi-stage Dockerfile, maps it to the standard web traffic port (80), and puts it on the same network so Nginx can successfully proxy requests to the backend.

### Volumes and Networks Definitions
```yaml
networks:
  zomato-network:
    driver: bridge

volumes:
  mongodb_data:
```
- These define the empty skeleton rules at the bottom of the file telling Docker to literally create the private isolated network router and the persistent hard drive logic used by the services above.

---

## 4. How the Database & Frontend Connections Work

### A. How Backend connects to MongoDB

Normally, if you run a database locally, you'd connect using: `mongodb://localhost:27017`.
**However, in Docker, `localhost` means the container itself!** The Node API container doesn't have MongoDB installed inside it.

How did we fix this? Through **Environment Variables & Docker Networks**.
In the `docker-compose.yml`, we injected this environment variable into the backend:
```yaml
environment:
  - MONGO_URI=mongodb://mongodb:27017/zomato
```
1. Instead of `localhost`, we use the exact name of the database service: `mongodb`.
2. Because both containers are on `zomato-network`, Docker runs an internal DNS server. When Node tries to connect to `mongodb`, Docker automatically routes it to the specific IP address of the MongoDB container.
3. Your `backend/src/server.js` code dynamically reads this value like this:
   ```javascript
   mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/zomato')
   ```

### B. How Frontend connects to Backend

Similarly, the frontend React code running in the user's browser needs to know how to talk to the backend API.

Instead of hardcoding the EC2 IP address (which can be annoying and rigid), we utilize **Nginx Reverse Proxy**.
In `frontend/nginx.conf`, we wrote:
```nginx
location /api/ {
    proxy_pass http://backend:5000;
}
```
1. The user's browser makes an API call or tries to open a Socket.io WebSocket connection relative to the domain they are on (e.g., `fetch('/api/restaurants')`).
2. That request hits the Frontend Nginx container serving the HTML.
3. Nginx sees the `/api` prefix, and says, *"Aha! This isn't a static page. I need to forward this to the backend."*
4. Nginx internally routes the traffic across the `zomato-network` to `http://backend:5000`.
5. The frontend stays completely agnostic of IP addresses and ports, making the deployment incredibly robust.
