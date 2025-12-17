# 🧠 Early-Stage Brain Cancer Detection & Assistance System

## Overview

This project is a **full-stack AI-powered web application** developed as a **5th Semester mini-project**, focused on **early-stage brain cancer detection** and **patient-friendly cancer-related assistance**.

It combines:

* A **CNN-based brain tumor classification model (VGG16)** for MRI image analysis
* A **RAG (Retrieval-Augmented Generation) chatbot** built using **LangChain**
* A **secure, authenticated web platform** with persistent user memory

The goal is not just prediction, but **context-aware, explainable, and simplified medical assistance** for users.

---

## Key Features

### 🧬 Brain Tumor Detection (ML Module)

* MRI image classification using **CNN with VGG16 architecture**
* Trained on brain tumor MRI datasets
* Detects:

  * Whether a tumor exists
  * Type of brain tumor (if detected)
* Prediction results are:

  * Stored in the database
  * Automatically shared with the chatbot for contextual awareness

---

### 🤖 Cancer Assistance Chatbot (RAG System)

* Built using **LangChain** with a **RAG pipeline**
* Uses **free LLMs via OpenRouter**
* Knowledge base created from:

  * *Gale Encyclopedia of Cancer*
  * *Oxford Handbook of Oncology*
* Text extracted, chunked, embedded, and stored in **Pinecone Vector DB**
* The chatbot:

  * Answers cancer-related queries
  * Simplifies complex medical terms into human-friendly language
  * Avoids hallucination by grounding responses in verified medical sources

---

### 🧠 Persistent User Memory

* Every user conversation is stored in **PostgreSQL**
* On each new query:

  * Previous chats are fetched using **user_id (foreign key)**
  * Included in the system prompt as context
* Enables:

  * Conversation continuity
  * Personalized responses
  * Context-aware explanations

---

### 🔐 Authentication & Security

* **JWT-based authentication**
* Passwords stored using **secure hashing**
* Each API endpoint is protected
* User-specific isolation of:

  * Chat history
  * MRI uploads
  * Prediction results

---

## Tech Stack

### Frontend

* **React.js**
* **Tailwind CSS**
* Responsive UI
* Integrated chatbot + MRI upload interface

### Backend

* **Flask (Python)**
* RESTful APIs
* JWT authentication
* PostgreSQL integration

### Machine Learning

* **CNN (VGG16)** for MRI classification
* Image preprocessing and normalization

### RAG & NLP

* **LangChain**
* **Pinecone Vector Database**
* **OpenRouter (Free LLM models)**
* Custom prompt engineering for medical simplification

### Database

* **PostgreSQL**
* Tables include:

  * Users
  * Chats
  * MRI Predictions
  * Authentication data

### API Testing

* **Postman**

---

## System Architecture

1. User registers/logs in (JWT Auth)
2. User can:

   * Ask cancer-related questions
   * Upload brain MRI images
3. MRI image → ML model → Tumor detection
4. Prediction stored in PostgreSQL
5. Chatbot fetches:

   * User chat history
   * Latest MRI prediction (if available)
6. RAG pipeline retrieves relevant medical knowledge from Pinecone
7. LLM generates a grounded, simplified response
8. Response stored and displayed in UI

---

## Database Design (Simplified)

* **users**

  * id (PK)
  * email
  * password_hash

* **chats**

  * id (PK)
  * user_id (FK)
  * message
  * sender (user/bot)
  * timestamp

* **mri_predictions**

  * id (PK)
  * user_id (FK)
  * tumor_detected
  * tumor_type
  * confidence_score

---

## Installation & Setup

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

```
JWT_SECRET_KEY=
DATABASE_URL=
PINECONE_API_KEY=
OPENROUTER_API_KEY=
```

---

## API Endpoints (Examples)

* `POST /auth/register`
* `POST /auth/login`
* `POST /chat/query`
* `POST /mri/upload`
* `GET /chat/history`

---

## Limitations

* Not a medical diagnostic tool
* Model accuracy depends on dataset quality
* Free LLMs have token and latency limitations

---

## Disclaimer

⚠️ This project is **for academic and research purposes only**.
It is **NOT a replacement for professional medical diagnosis or treatment**.

---

## Future Improvements

* Add explainable AI (Grad-CAM for MRI predictions)
* Multilingual chatbot support
* Doctor dashboard for clinical review
* Deployment with Docker & CI/CD

---

## Author

**Indrajeet Bhujbal**
Software Developer | AI & Full Stack Enthusiast

---

## License

MIT License
