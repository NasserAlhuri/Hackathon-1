# Nekhwa / نخوة - PRD

## Overview
Mobile prototype for a community food rescue app in Qatar connecting donors, volunteers, NGOs and people in need.

## Tech Stack
- React Native + Expo Router (SDK 54)
- Frontend-only prototype with React Context for state
- Mock Qatar sample data (no backend / no auth)

## Branding
- Primary: Qatar Maroon #8A1538
- Accent: Soft Green #4E7B62 (sustainability)
- Background: Warm beige #FAF9F6

## Roles
1. Individual donor
2. Organization donor
3. Volunteer driver
4. NGO / charity receiver
5. Person requesting food

## Screens
- Splash (animated logo) → Role selection → Role-specific home
- Tabs (donor/individual/org): Home / Deliveries / Impact / Profile
- Forms: Quick donation, Bulk donation, Request food
- Safety check result (safe / caution / risky)
- NGO dashboard

## Core Logic
- Auto-switch to Bulk mode when meal count >= 50
- Safety computed from storage × prep-time (cold/hot/room-temp)
- Vehicle matching: <50 Van, 50-199 Refrigerated Van, 200+ Truck
- High-risk food routes to NGO review instead of direct delivery

## i18n
- Default English, toggle to Arabic (نخوة)
- RTL-aware layouts via `isRTL` flag in context

## Qatar Locations seeded
Doha, Al Rayyan, Lusail, The Pearl, Education City, Souq Waqif, Al Wakrah, Al Khor, West Bay
