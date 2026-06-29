# Delivery Proof Management System (DPMS)

An Enterprise logistics platform with built-in Role-Based Access Control, Cloudinary image upload, and Gemini AI integration.

## Features

- **JWT Authentication** & Role-Based Access Control
- **Dashboard** with logistics statistics
- **CRUD Operations** for Delivery Records
- **Cloudinary Integration** for proof of delivery image uploads
- **PDF & CSV Export** functionalities
- **Modern Enterprise UI** built with React, Vite, and Tailwind CSS

---

## AI Integration

This project supports two operating modes for its advanced Artificial Intelligence features (AI Summary & Natural Language Search). The backend automatically acts as an AI Service Layer abstraction that handles API routing and fallbacks seamlessly.

### Live AI Mode
Uses the Google Gemini API (gemini-2.5-flash) to provide dynamic logistics analysis and complex Natural Language to SQL conversions.

### Demo Mode
Automatically activates when:
- No API key is available
- The API key is invalid
- The Gemini API rate limit is exceeded (e.g. 429 Too Many Requests)
- The AI service is unavailable (Timeout or Network failure)

This ensures the application always remains fully functional for demonstrations, internships, presentations, and local testing without crashing. In Demo Mode, the AI Summary generates structured, realistic analysis directly from your database statistics, and the AI Search uses a robust local NLP regex parser for standard keyword filtering.

### How to enable Live AI

1. Create a Gemini API Key from Google AI Studio.
2. Add `GEMINI_API_KEY=your_key_here` to the `backend/.env` file.
3. Restart the backend server. The AI Summary dashboard will display a `🟢 Connected` badge instead of `🟡 Demo Mode`.
