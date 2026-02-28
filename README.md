# MICA — Make India Clean Again

A civic tech platform built for **GDG Madurai 2025** that tackles India's urban waste management crisis through proof-based citizen reporting, municipal accountability, and community gamification.

Demo → [youtu.be/ibGzqbdXskA](https://youtu.be/ibGzqbdXskA)

---

## What it does

MICA gives citizens and municipalities a shared interface to act on waste problems — from a littered street corner to an illegal dump site.

| Feature | What it solves |
|---|---|
| **Quick Report** | Photo + GPS geotagged waste tickets with SHA-256 tamper-evident hashing |
| **Report Someone** | Evidence-gated complaints with witness co-signing and a penalty system for false reports |
| **Nearest Disposal** | Map-based disposal point finder with proof-of-drop verification and UPI cashback rewards |
| **Missions & Leaderboards** | Daily micro-missions, festival event packs, ward/college team rankings |
| **Municipal Dashboard** | Ward-level ticket management, SLA breach tracking, collector assignment, CSV export |

---

## Stack

- **React 19** + TypeScript, Vite
- **Tailwind CSS** with a custom civic design system (`civic-green`, `civic-amber`, `civic-crimson`, `civic-navy`)
- **Framer Motion** for animations
- **Firebase Hosting** — deployed to `asia-east1`

---

## Project structure

```
src/
├── App.tsx                   # view router
├── components/
│   ├── BottomNav.tsx
│   ├── EvidenceScore.tsx
│   ├── PointsTicker.tsx
│   └── RankBadge.tsx
└── views/
    ├── HomePage.tsx
    ├── QuickReport.tsx
    ├── ReportSomeone.tsx
    ├── NearestDisposal.tsx
    ├── MissionsProfile.tsx
    └── MunicipalDashboard.tsx
```

---

## Running locally

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

---

## Pilot & scale plan

Starting with Madurai's **100 wards**, the platform is designed so any city can onboard via a config file — no codebase changes needed. The roadmap targets all **4,041+ Urban Local Bodies** across India across three phases.
