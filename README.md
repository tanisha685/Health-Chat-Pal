# 🏥 Health ChatPal  
An AI-powered medical assistance platform that helps users ask health-related questions, track symptoms, and receive guided suggestions through a clean and intuitive chat interface.

Built using **Next.js**, **Node.js**, **Express.js**, **MongoDB**, and **Gemini/OpenAI APIs**, Health ChatPal provides fast, context-aware, real-time health insights. The project also supports **Docker-based backend deployment** for easy setup and development.

---

## 🚀 Features

### 🤖 AI-Powered Medical Chat  
- Ask any health-related question in natural language  
- Instant, AI-generated replies powered by Gemini/OpenAI  
- Context-aware conversations  

### 🩺 Symptom Tracking  
- Submit symptoms and get potential causes  
- Suggested next steps for better clarity  

### ⚡ Real-Time Response Handling  
- WebSocket-based streaming  
- Smooth, fast chat experience  

### 🔐 Secure Backend  
- Express.js API  
- Environment-based API key security  
- Input validation & error handling  

### 🧠 MongoDB Integration  
- Stores chat history and user interactions  
- Enhances personalized responses  

### 📱 Responsive UI  
- Built with Next.js + modern CSS  
- Optimized for mobile and desktop  

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js  
- React.js  
- Tailwind CSS  
- WebSockets  

### **Backend**
- Node.js  
- Express.js  
- Gemini / OpenAI LLM API  
- MongoDB (Mongoose)

### **DevOps**
- Docker  
- Docker Compose  

---

## 🧰 Prerequisites

Before you begin, ensure you have installed:

### **Docker**
- Docker Desktop (for containerized backend)

### **Node.js**
- Node.js 16+ (for frontend development)

### **Git**
- Version control system

---

# 🔧 Backend Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/tanisha685/Health-ChatPal.git
cd Health-ChatPal
````

### **2. Navigate to Backend Directory**

```bash
cd backend
```

### **3. Configure Environment Variables**

If `.env.example` exists:

```bash
cp .env.example .env
```

Otherwise create your own `.env`:

```env
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# LLM Provider API Key
LLM_API_KEY=your_gemini_or_openai_api_key

# Server Port
PORT=5000
```

---

# 🐳 Backend With Docker

### **4. Build and Start Backend (First Time)**

```bash
docker-compose up --build
```

This will:

* Build the Node.js backend container
* Start MongoDB (if configured)
* Install all backend dependencies
* Run the backend API

### **5. Verify Backend is Running**

* **Health Check:**
  [http://localhost:5000/health](http://localhost:5000/health)

* **Chat Endpoint:**
  [http://localhost:5000/api/chat](http://localhost:5000/api/chat)

* **Symptoms Endpoint:**
  [http://localhost:5000/api/symptoms](http://localhost:5000/api/symptoms)

---

# 🎨 Frontend Setup (Next.js)

### **1. Navigate to Frontend Directory**

```bash
cd ../frontend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Start Development Server**

```bash
npm run dev
```

### **4. Open in Browser**

👉 [http://localhost:3000](http://localhost:3000)

---

# 🔄 Subsequent Development Sessions

### **Backend**

```bash
cd backend
docker-compose up
```

### **Frontend**

```bash
cd frontend
npm run dev
```

---

## 📂 Project Structure

```
Health-ChatPal
│── backend/              # Express.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── server.js
│   └── Dockerfile
│
│── frontend/             # Next.js frontend
│   ├── pages/
│   ├── components/
│   ├── utils/
│   └── styles/
│
└── docker-compose.yml
```

---


## 🤝 Contributing

Contributions are always welcome!
Please open a pull request or submit an issue.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ✨ Author

**Tanisha Srivastava**
🔗 GitHub: [@tanisha685](https://github.com/tanisha685)

```
