# NEX Associate v3.0 — Standalone Web Application Package 👨‍🏫📚

---

## 📌 Executive Overview

This directory contains the complete, standalone **HTML, CSS, and JS web application** for **NEX Associate** (The Teacher AI Assistant & Distribution Gateway for Nexus Learning), saved at:

$$\mathtt{C:\backslash Users\backslash hp\backslash Desktop\backslash NEX\ Associate}$$

---

## 📁 Directory Structure & File Inventory

```
C:\Users\hp\Desktop\NEX Associate\
├── index.html                           # Main Standalone Single-Page Web Application
├── css/
│   └── styles.css                       # Official Nexus Learning Brand Glassmorphism Stylesheet
├── js/
│   ├── data/
│   │   └── curriculum_data.js           # Curriculum Standards, Subject Catalog, & Subagent Registry
│   ├── engine/
│   │   ├── teacher_billing_engine.js    # Per-Subject Billing & Discount Calculator
│   │   ├── agent_orchestrator.js        # 9-Lead Agent Orchestra Engine & Fallback Gateway
│   │   └── api_client.js                # NEX Curriculum REST API Connector & Feedback Forwarder
│   └── ui/
│       └── app.js                       # Main UI Application Controller & Navigation Handler
└── README.md                            # Documentation & Quick-Start Guide
```

---

## 🚀 Key Features Implemented

1. **Dashboard & Telemetry**:
   - Overview of active classes (15 classes), students reached (1,240), weekly hours saved (6.5 hrs/week), and active subagent workforce.

2. **Teacher Profile & Per-Subject Billing Portal**:
   - Select Curriculum Framework (**NERDC**, **Cambridge**, **American**, **Harmonized**).
   - Select Class / Grade Level (**Primary 1–6**, **JSS 1–3**, **SS 1–3**).
   - Select Teaching Subjects with real-time per-subject pricing (₦1,500 / $3.00 per subject / month) and tiered volume discounts (10% to 20% OFF).

3. **Materials Query & Distribution Gateway**:
   - Query **NEX Curriculum REST API** (`POST /v1/kits/lesson`, `POST /v1/kits/assessment`).
   - Fetch 13-Section Lesson Plans, 5-Step Notebooks, Flashcard Decks, and WAEC/IGCSE Test Question Papers.
   - Includes WhatsApp Business API delivery, PDF export, and Word export.

4. **Multi-Tier Subagent Orchestra (9 Lead Agents & 27 Micro-Agents)**:
   - Visualizes the 9 Lead Agents (`nex_schedule_dispatcher`, `nex_inspector_compliance`, `nex_vernacular_inclusion`, `nex_teacher_coach`, `nex_lead_lesson_planner`, `nex_note_specialist`, `nex_lead_assessment_engine`, `nex_lead_curriculum_harmonizer`, `nex_lead_math_validator`) and their recruited Tier-3 Micro-Agents.

5. **Teacher Feedback & Relay Portal**:
   - Forward teacher and school comments to NEX Curriculum (`POST /v1/feedback/submit`).
   - View real-time resolution messages and patch notes relayed back to teachers.

---

## 🌐 How to Launch

Simply open [`C:\Users\hp\Desktop\NEX Associate\index.html`](file:///C:/Users/hp/Desktop/NEX%20Associate/index.html) in any standard web browser (Chrome, Edge, Firefox, Safari). No backend server setup required.
