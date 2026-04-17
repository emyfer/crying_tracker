# 💧 Crying Tracker

Crying Tracker is a lightweight web application designed for logging and analyzing crying events as structured data.

Instead of traditional journaling, the app focuses on tracking measurable attributes such as frequency, intensity, and reasons, providing a clear overview through simple visualizations.

---

## Concept

The goal of this project is to treat emotional events as data points.

By collecting and organizing inputs over time, users can:
- identify patterns
- observe trends
- gain insights through visualization rather than text-based reflection

---

## Core Features

### Event Logging
- Record individual crying events
- Store intensity levels and optional notes
- Timestamp each entry automatically

### Data Visualization
- Display crying frequency over time
- Visualize intensity distribution
- Clean and minimal chart-based overview

### Pattern Tracking
- Identify recurring trends
- Analyze behavior over days/weeks

### Authentication
- Secure login system using Auth0
- User-specific data isolation

### Data Persistence
- All entries stored in PostgreSQL database on Neon database
- Structured and scalable data model

---

## UI / UX Design

The application follows a minimal and user-focused design approach, prioritizing clarity and ease of use.

### Principles
- **Simplicity first** – no unnecessary elements, only core actions
- **Low cognitive load** – users can log events quickly without friction
- **Consistency** – unified color palette and component styling
- **Accessibility** – readable contrast and responsive layout

### User Experience
- Fast interaction flow (log event in a few clicks)
- Clear visual hierarchy for important data
- Immediate feedback through charts and summaries
- Designed for both desktop and mobile usage

### Visual Style
- Soft neutral background (#E5E5E5)
- Muted accent color (#7086B4)
- Card-based layout with subtle shadows
- Clean typography and spacing

---

## Tech Stack

**Frontend**
- EJS (templating)
- CSS (custom styling)

**Backend**
- Node.js
- Express.js

**Database**
- PostgreSQL

**Authentication**
- Auth0 (OpenID Connect)

**Data Visualization**
- Chart.js

---

## Project Focus

This project emphasizes:
- full-stack development
- authentication flows
- database design
- transforming user input into meaningful visual data

---

## Possible Extensions

- Advanced filtering (date ranges, tags)
- Exporting data (CSV/JSON)
- More detailed analytics
- Dashboard improvements

---


Built as a personal full-stack project.
