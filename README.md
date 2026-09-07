# Sanskriti Suraksha (संस्कृती सुरक्षा)
### AI-Powered Pan-India Living Heritage Early Warning & Knowledge Transmission System

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An innovative cultural intelligence and transmission platform built to identify, assess, and safeguard India's endangered living intangible cultural heritage (ICH).

> 📖 **Looking for comprehensive documentation?**  
> Check out the complete system manual and technical specifications in [**FULL_DETAILS.md**](./FULL_DETAILS.md).

---

## 🌟 Core Highlights

- 🗺️ **Pan-India Living Heritage Map**: Authentic political map of India with interactive spatial coordinate mapping across 9 focus states (Maharashtra, Punjab, Gujarat, Delhi, MP, UP, Assam, Kerala, and Himachal Pradesh), zone filters, and live risk-coded tradition pins.
- 📡 **Early Warning Risk Engine**: Identifies at-risk traditions based on aging practitioner demographics, transmission continuity, and documentation gaps.
- 🤝 **Guru-Shishya Transmission Matchmaker**: Direct master-to-apprentice connection and mentorship tracking system.
- 🗄️ **Knowledge Vault & Validation Queue**: Decentralized cultural archiving with community peer-review before official indexing.
- 🎭 **45 Curated Living Traditions**: Rich multimedia dossiers across the 9 focus regions spanning Arts, Music, Dance, Crafts, Traditional Attire, Festivals, Food, Oral Traditions, and Rituals.
- ⚡ **REST API Backend**: Express + JSON persistent database with backend-enforced registration and authentication workflows.

---

## ⚡ Quick Start

### 1. Clone & Enter Repository
```bash
git clone https://github.com/Tanish09-tech/Heritage-.git
cd Heritage-
```

### 2. Install & Start Full Stack (Backend + Frontend)
```bash
# Run both backend (port 5000) and frontend (port 5174) concurrently
npm run dev
```

Or run them individually:
```bash
# Start Backend API
npm run backend

# Start Frontend App
npm run frontend
```
Open `http://localhost:5174/` in your browser.

---

## 📄 Documentation Index
- Detailed System Specs & Architecture: [FULL_DETAILS.md](./FULL_DETAILS.md)
- REST API Backend Server: `backend/server.js`
- Persistent Database File: `backend/data/db.json`
- Living Traditions Data Layer: `frontend/src/data/heritageData.js`
- Interactive Map Component: `frontend/src/components/HeritageMapView.jsx`

---

## 🔐 Fixed Demo Test Credentials

The backend includes 11 pre-seeded fixed demo accounts (5 Gurus, 5 Students, and 1 Admin) for instant testing, accessible via 1-click quick preset chips on the login screen.

> ⚠️ **Backend Registration Rule**: New users (Shishyas & Gurus) **must register first** with mandatory profile details (Name, DOB, State, Hobbies / Experience / Expertise) before logging in. The backend strictly blocks login attempts for unregistered emails with HTTP 401.

### 🎓 5 Student (Shishya) Credentials
| Role | Name | Email | Password | Pre-filled Mandatory Profile Details |
| :--- | :--- | :--- | :--- | :--- |
| **Shishya 1** | Aniket Deshmukh | `shishya1@sanskriti.gov.in` | `password123` | **DOB**: `2002-05-15`, **State**: `Maharashtra`<br/>**Hobbies**: `Shahiri Powada recitation, Daf percussion, Historical Maratha Ballads` |
| **Shishya 2** | Simran Kaur | `shishya2@sanskriti.gov.in` | `password123` | **DOB**: `2003-11-20`, **State**: `Punjab`<br/>**Hobbies**: `Phulkari folk embroidery, Giddha folk dance, Punjabi folk music` |
| **Shishya 3** | Aarav Patel | `shishya3@sanskriti.gov.in` | `password123` | **DOB**: `2001-09-10`, **State**: `Gujarat`<br/>**Hobbies**: `Bhavai vesha acting, Garba drumming, Kutchi embroidery` |
| **Shishya 4** | Meera Menon | `shishya4@sanskriti.gov.in` | `password123` | **DOB**: `2004-03-08`, **State**: `Kerala`<br/>**Hobbies**: `Koodiyattam facial expressions, Mizhavu drumming, Mohiniyattam` |
| **Shishya 5** | Bishal Saikia | `shishya5@sanskriti.gov.in` | `password123` | **DOB**: `2002-12-14`, **State**: `Assam`<br/>**Hobbies**: `Bihu Dhol playing, Pepa flute, Assamese oral legends` |

### 🧘 5 Master (Guru) Credentials
| Role | Name | Email | Password | Pre-filled Mandatory Profile Details |
| :--- | :--- | :--- | :--- | :--- |
| **Guru 1** | Shahir Tukaram Jagtap | `guru1@sanskriti.gov.in` | `password123` | **State**: `Maharashtra`, **DOB**: `1968-08-20`<br/>**Experience**: `28 Years of continuous Shahiri Akhada & Daf oral tradition`<br/>**Expertise**: `Shahiri Powada (Oral Ballads)` |
| **Guru 2** | Ustad Harinder Singh | `guru2@sanskriti.gov.in` | `password123` | **State**: `Punjab`, **DOB**: `1965-03-12`<br/>**Experience**: `32 Years of traditional Gatka Shastar Vidiya & folk rhythms`<br/>**Expertise**: `Baisakhi & Gatka Martial Art` |
| **Guru 3** | Pandit Raghunath Joshi | `guru3@sanskriti.gov.in` | `password123` | **State**: `Gujarat`, **DOB**: `1970-11-05`<br/>**Experience**: `25 Years of Bhavai Folk Theatre & Garba compositions`<br/>**Expertise**: `Bhavai Folk Theatre` |
| **Guru 4** | Guru Manikandan Nair | `guru4@sanskriti.gov.in` | `password123` | **State**: `Kerala`, **DOB**: `1967-04-18`<br/>**Experience**: `30 Years of Koodiyattam Sanskrit Theatre & Mudras`<br/>**Expertise**: `Koodiyattam Sanskrit Theatre` |
| **Guru 5** | Shrimati Hemlata Gogoi | `guru5@sanskriti.gov.in` | `password123` | **State**: `Assam`, **DOB**: `1972-09-25`<br/>**Experience**: `22 Years of Bihu Folk Dance & Muga Silk Weaving`<br/>**Expertise**: `Rongali Bihu & Folk Instruments` |

### 🏛️ 1 Admin Credential
| Role | Name | Email | Password | Pre-filled Mandatory Profile Details |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Rajesh Sharma | `admin@sanskriti.gov.in` | `adminpassword123` | **Role**: `AUTHORITY`, **State**: `Delhi`<br/>**Designation**: `Director of Living Heritage, Ministry of Culture` |
