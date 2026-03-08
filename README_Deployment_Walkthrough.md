# Zomato Clone - Walkthrough & Deployment Guide

## Overview

Based on the [Zomato Clone Tutorial](https://www.youtube.com/watch?v=79F36yYEDyo), I have built a monolithic **MERN (MongoDB, Express, React, Node.js)** clone tailored for quick deployment and easy management. To satisfy your requirement, the codebase is completely **Dockerized** and ready to be run on your **Ubuntu EC2** instance without needing to install Node.js locally.

### Key Features Implemented:
- **Premium UI**: Built with React, Vite, and tailwind configurations designed to mimic Zomato's aesthetic.
- **Global State**: Used `Zustand` for lightning-fast cart and auth state management.
- **Dynamic Routing**: Configured `react-router-dom` for Home (`/`), Restaurant detail (`/restaurant/:id`), Cart (`/cart`), and Tracking (`/orders`).
- **Real-Time Tracking**: Migrated from the video's RabbitMQ implementation to **Socket.io**. The backend broadcasts status updates (`Pending -> Preparing -> OutForDelivery -> Delivered`) directly to connected React clients viewing their orders.

---

## Deployment on Ubuntu EC2

Since you explicitly mentioned: *"i'll be testing on a linux (ubuntu) based ec2 instance and everything will be on docker as i don't wanna install anything other than docker"*. 

Here are the exact steps you need to follow once you copy the `zomato-clone` folder to your EC2 instance.

### Prerequisites (On EC2)
Ensure Docker and Docker Compose are installed on your Ubuntu instance:
```bash
# Update packages
sudo apt-get update

# Install Docker
sudo apt-get install docker.io -y

# Install Docker Compose
sudo apt-get install docker-compose-v2 -y

# Start Docker and add your user to docker group (optional but recommended)
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```
*(You may need to logout and log back in for the group change to take effect).*

### Step-by-Step Execution

1. **Navigate to the project root**:
   ```bash
   cd /path/to/zomato-clone
   ```
   *(Ensure this directory contains `docker-compose.yml`, `frontend/`, and `backend/`)*

2. **Start the containers in detached mode**:
   ```bash
   docker compose up -d --build
   ```

3. **Verify running containers**:
   ```bash
   docker compose ps
   ```
   You should see three containers running: `zomato_mongo`, `zomato_backend`, and `zomato_frontend`.

### Accessing the Application

- **Frontend & API**: Accessible at `http://<YOUR_EC2_PUBLIC_IP>` (Port 80)
   *(Nginx acts as a reverse proxy, so it handles both React UI requests and forwards `/api` and `/socket.io` requests to the backend automatically).*

> **Note**: For real-world usage beyond localhost, make sure your EC2 Security Group allows inbound traffic on port `80` (HTTP). You no longer need to expose port 5000 because Nginx handles the routing internally! 
> *Ideally, in a production environment, you would use a reverse proxy (like Nginx on the host machine) or update `SOCKET_SERVER_URL` and `axios` base URLs in the frontend code to use your EC2's public IP instead of `localhost` before building.*

---

## Validation & Testing the Flow

1. Open your browser to the Frontend URL `http://<YOUR_EC2_PUBLIC_IP>`.
2. Browse the mocked restaurants on the **Home** page.
3. Click a restaurant to view its **Menu**.
4. Click **"ADD +"** to push items into your global `Zustand` cart.
5. Navigate to the **Cart** via the Navbar (you'll see a badge with the item count).
6. Enter a mock address and place the order.
7. You will be redirected to the **Orders** page showing your order status timeline. 
8. Use the **Dev Tools** buttons at the bottom of an order card to simulate Socket.io events (`Preparing`, `OutForDelivery`, `Delivered`) and watch the timeline update in real-time without refreshing!
