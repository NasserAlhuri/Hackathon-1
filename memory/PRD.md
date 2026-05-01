# Nekhwa / نخوة - PRD

## Overview
Mobile prototype for a community food rescue app in Qatar.

## Tech Stack
- React Native + Expo Router (SDK 54)
- Frontend-only prototype with React Context state
- Mock data (no backend, no auth)

## Roles (3)
- **Donor** — donate food, small or large
- **Volunteer** — pickup & deliver food
- **Recipient** — request food for family

## Features
- **Unified Donate flow**: auto-switches Quick (<50 meals) ↔ Bulk (≥50 meals) based on meal count
  - Quick: photo, prep hours, storage chips, allergens → safety check result
  - Bulk: photo, event type, pickup time, packaging, vehicle suggestion, NGO assignment
- **Role-aware Home**: each role sees own stats + relevant actions only
- **Role-aware Activity tab**: deliveries (volunteer) / my donations (donor) / my requests (recipient)
- **Impact Dashboard as bottom-sheet modal (85% height)**:
  - Hero meal count + people fed
  - 8 stats: meals, waste, CO₂, water, volunteers, deliveries, areas, response time
  - Weekly + monthly trend charts
  - Top areas served (bars), Top NGOs (ranked), Food categories (stacked), Peak hours
  - Back arrow + "Back" text closes
- **8 languages**: English, العربية, اردو, हिन्दी, മലയാളം, বাংলা, Filipino, नेपाली
- **Language picker** as bottom sheet from header globe button or Profile → Language
- **RTL** auto-applied for Arabic & Urdu

## Routes
- `/` splash → `/role-select` → `/(tabs)/home|activity|profile`
- `/donate` (unified), `/request-food`, `/safety-result`, `/impact` (modal)

## Branding
- Primary: Qatar maroon `#8A1538`
- Accent: Soft green `#4E7B62`
- Background: Beige `#FAF9F6`

## Qatar Locations
Doha, Al Rayyan, Lusail, The Pearl, Education City, Souq Waqif, Al Wakrah, Al Khor, West Bay
