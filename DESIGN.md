# RailSutra — DESIGN.md

> **Purpose:** This document defines the complete UI/UX direction, visual language, interaction principles, information architecture, and screen-level design requirements for **RailSutra**.
>
> It is intended to be used with **Google Stitch MCP/API, Antigravity, and AI coding agents** to generate a consistent, production-quality B2B railway operations platform.

---

# 1. Product Design Direction

## Product

**RailSutra**

## Product Type

B2B Railway Operations Intelligence & Decision-Support Platform.

## Design Objective

RailSutra should feel like a combination of:

- A modern railway operations control center
- An enterprise analytics platform
- A geospatial intelligence system
- A predictive AI platform
- A premium SaaS product

The interface must communicate:

**Trust + Intelligence + Precision + Operational Awareness**

The product should look sophisticated without becoming visually noisy.

---

# 2. Core Design Philosophy

## 2.1 Data First

RailSutra is a data-heavy product.

The interface must prioritize:

1. Operationally important information
2. Alerts and exceptions
3. Trends
4. Spatial information
5. Recommendations
6. Detailed data

Avoid decorative UI that competes with operational information.

---

## 2.2 Map as a First-Class Interface

The railway map is not merely a visualization.

It is one of RailSutra's primary interaction surfaces.

Users should be able to:

- Inspect railway corridors
- Identify bottlenecks
- View congestion
- Inspect assets
- View demand
- View environmental risks
- Explore regions
- Select railway sections
- See predictive insights

---

## 2.3 Progressive Disclosure

Do not show every possible metric simultaneously.

Use:

**Overview → Summary → Details → Deep Analysis**

Example:

```text
Dashboard
    ↓
Click Bottleneck
    ↓
Bottleneck Summary
    ↓
Operational Metrics
    ↓
Predicted Impact
    ↓
Recommended Actions
    ↓
Scenario Simulation
```

---

## 2.4 Exceptions Over Everything

RailSutra should visually prioritize problems.

Examples:

- Critical bottleneck
- Passenger demand spike
- Track capacity shortage
- High maintenance risk
- Weather disruption
- Predicted delay propagation

Normal operations should remain visually quieter.

---

# 3. Visual Identity

## Overall Visual Style

**Dark enterprise intelligence interface with subtle Indian railway/geospatial identity.**

Avoid:

- Generic AI neon interfaces
- Excessive gradients
- Gaming aesthetics
- Excessive glassmorphism
- Overly colorful dashboards
- Consumer-app styling

RailSutra should feel operational and credible.

---

# 4. Color System

## Primary Background

Use deep navy / near-black tones.

Recommended palette:

```text
Background:
#07111F
#0B1626
#0F1C2E

Surface:
#111F32
#14243A
#172A42

Border:
#26384D
#30445B
```

---

## Primary Accent

Railway-inspired blue.

```text
Primary:
#3B82F6

Primary Light:
#60A5FA

Primary Dark:
#2563EB
```

Use primarily for:

- Selected states
- Navigation
- Active map elements
- Buttons
- Links
- Interactive charts

---

## Semantic Colors

### Success

```text
#22C55E
```

For:

- Healthy assets
- On-time operations
- Low-risk conditions

### Warning

```text
#F59E0B
```

For:

- Moderate congestion
- Maintenance approaching
- Capacity pressure

### Critical

```text
#EF4444
```

For:

- Severe congestion
- Failure risks
- Critical alerts

### Information

```text
#38BDF8
```

For:

- Informational alerts
- Weather
- Analytics

---

# 5. Typography

Use a modern highly readable sans-serif.

Preferred:

**Inter**

Alternatives:

- Geist
- IBM Plex Sans
- Manrope

Typography hierarchy:

```text
Page Title:       28–32px / Semibold
Section Heading:  20–24px / Semibold
Card Heading:     15–18px / Semibold
Body:             14px
Secondary:        12–13px
Data/KPI:          24–36px / Semibold
Micro Labels:     10–12px / Medium
```

Avoid extremely large typography inside operational dashboards.

---

# 6. Iconography

Use one consistent icon library.

Preferred:

**Lucide Icons**

Icons should be:

- Simple
- Thin-to-medium weight
- Consistent
- Recognizable

Avoid mixing icon styles.

---

# 7. Layout System

Use a structured enterprise dashboard layout.

Recommended desktop structure:

```text
┌──────────────────────────────────────────────────────────────┐
│ Top Bar                                                      │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                 │
│ Sidebar    │ Main Content                                    │
│            │                                                 │
│            │                                                 │
│            │                                                 │
└────────────┴─────────────────────────────────────────────────┘
```

---

# 8. Navigation

## Left Sidebar

Primary navigation:

```text
RailSutra Logo

Overview
Operations
Demand
Network
Maintenance
Risk Intelligence
Simulation
Reports

────────────────────

Alerts

────────────────────

Settings
Help
```

The sidebar should support:

- Collapsed mode
- Expanded mode
- Tooltips
- Active-state indicator
- Keyboard navigation

---

# 9. Top Navigation

Top bar should contain:

### Left

- Current page title
- Optional breadcrumb

### Center / Search

Global command/search interface.

Example:

```text
Search trains, stations, assets, corridors...
```

Support command-style interaction eventually:

```text
⌘ K
```

### Right

- System status
- Notifications
- Date/time context
- User profile

---

# 10. Global System Status

Display a subtle system-health indicator.

Example:

```text
● Systems Operational
```

Possible states:

```text
Operational
Degraded
Partial Outage
Offline
```

This should remain unobtrusive.

---

# 11. Login Page

## Primary Design Recommendation

The login experience should be one of RailSutra's strongest visual moments.

Use an **animated Indian railway network map as the background**.

The first impression should immediately communicate:

> Railway network + live data + intelligence.

---

# 12. Login Background Concept

Create a full-screen dark map visualization.

### Background

- Deep navy background
- Very subtle Indian geographic outline
- Railway corridors represented as thin lines
- Major railway junctions represented as nodes
- Subtle network glow
- Sparse data particles

### Animated Elements

Small train indicators should move along selected railway corridors.

Do not animate every route.

Use approximately:

**5–10 moving indicators**

Animation should be:

- Slow
- Smooth
- Predictable
- Elegant
- Low distraction

---

# 13. Railway Network Animation

Animation sequence:

```text
Railway Network Appears
        ↓
Junction Nodes Illuminate
        ↓
Train Indicators Begin Moving
        ↓
Subtle Network Pulses
        ↓
Data Particles Move
        ↓
Login Interface Remains Stable
```

Avoid:

- Flashing
- Rapid movement
- Excessive particle effects
- Constant map zoom
- Excessive route brightness

---

# 14. Login Composition

Recommended layout:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                ANIMATED RAILWAY NETWORK                      │
│                                                              │
│                    ┌───────────────┐                         │
│                    │   RAILSUTRA   │                         │
│                    │               │                         │
│                    │ Enterprise    │                         │
│                    │ Railway       │                         │
│                    │ Intelligence  │                         │
│                    │               │                         │
│                    │ Email         │                         │
│                    │ Password      │                         │
│                    │               │                         │
│                    │    SIGN IN    │                         │
│                    └───────────────┘                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Login card:

- Semi-transparent dark surface
- Subtle blur
- Thin border
- Very small shadow
- 14–18px radius
- No excessive glassmorphism

---

# 15. Login Branding

Logo:

**RailSutra**

Possible tagline:

> **Intelligence for Every Route.**

Alternative:

> **Smarter Rail Operations.**

Avoid a generic AI-style logo.

The logo should communicate railway/network intelligence.

---

# 16. Login Microinteraction

When the user clicks **Sign In**:

```text
Button
 ↓
Loading indicator
 ↓
Map/network activity subtly increases
 ↓
Dashboard transition
```

Avoid a generic page reload.

Use a short transition into the dashboard.

---

# 17. Dashboard

The dashboard is the primary operational workspace.

## Layout

Top:

```text
Overview
Today · 13 Aug 2026

[System Status] [Alerts] [User]
```

Then:

```text
KPI Row
```

Example:

```text
Active Trains
1,248

Network Utilization
82.4%

Average Delay
8.7 min

Capacity Pressure
High

Maintenance Risk
17 Assets
```

---

# 18. Dashboard Hierarchy

Recommended order:

### Level 1 — Operational State

- Active trains
- Network utilization
- Delays
- Capacity
- Critical alerts

### Level 2 — Spatial Intelligence

Large interactive railway map.

### Level 3 — Predictive Intelligence

- Demand forecast
- Congestion forecast
- Maintenance risk
- Regional risk

### Level 4 — Recommendations

Show what RailSutra recommends doing next.

---

# 19. Command Center Map

The map should occupy a significant portion of the dashboard.

Recommended:

**45–60% of initial viewport height**

Controls:

```text
Layers
Filters
Time
Region
Train
Risk
```

---

# 20. Map Layers

Available layers should include:

### Operations

- Live trains
- Delays
- Train density

### Network

- Railway tracks
- Stations
- Junctions

### Demand

- Passenger demand
- Forecast demand
- Capacity pressure

### Risk

- Bottlenecks
- Maintenance risk
- Weather risk
- Environmental risk

### Geography

- Terrain
- Elevation
- Rivers
- Administrative boundaries

---

# 21. Map Interaction

When a user selects a railway section:

Open a contextual side panel.

Example:

```text
SECTION: KYN → LTT

Capacity Utilization
91%

Current Traffic
High

Predicted Congestion
Critical

Average Delay
12 min

Risk
High

Recommended Action
Reduce dispatch interval
and prioritize express traffic.
```

Buttons:

```text
Analyze Section
Simulate
View Trains
View History
```

---

# 22. KPI Cards

KPI cards should be compact.

Structure:

```text
LABEL
VALUE
CHANGE
CONTEXT
```

Example:

```text
NETWORK UTILIZATION

82.4%

↑ 4.2%

vs yesterday
```

Avoid giant decorative cards.

---

# 23. Demand Intelligence Screen

Purpose:

Understand future passenger pressure.

Components:

- Demand forecast chart
- Historical demand
- Festival overlay
- Origin-destination heatmap
- Capacity comparison
- Regional demand map
- Special train recommendation

---

# 24. Demand Forecast Visualization

Chart should show:

```text
Historical
────────────

Forecast
- - - - - -

Capacity
────────────
```

Use a visible distinction between:

- Observed data
- Forecast
- Available capacity
- Predicted shortage

---

# 25. Festival Mode

Provide a focused view for festival demand.

Example:

```text
Festival Demand Intelligence

Chhath Puja

Forecast Demand
+31%

Capacity Gap
14 trains

Peak Window
16:00–23:00

Highest Pressure
Bihar / UP corridors
```

Add region-specific map highlighting.

---

# 26. Network Analytics Screen

Primary focus:

**Where is the railway network under pressure?**

Components:

- Network map
- Congestion heatmap
- Bottleneck ranking
- Track utilization chart
- Delay propagation
- Station dwell time
- Directional imbalance

---

# 27. Bottleneck Detail Panel

Show:

```text
BOTTLENECK

Severity:
Critical

Location:
...

Track Configuration:
2 Outbound / 1 Inbound

Current Utilization:
94%

Predicted Peak:
98%

Impact:
High

Recommended Action:
Re-sequence trains
```

The recommendation should be visually prominent.

---

# 28. Maintenance Dashboard

The maintenance interface should feel more structured and operational than consumer maintenance software.

Key sections:

- Asset health overview
- Risk ranking
- Maintenance due
- Failure probability
- Regional environmental exposure
- Maintenance calendar
- Component issues

---

# 29. Asset Health Visualization

Example:

```text
Asset Health

Healthy        78%
Monitor        15%
At Risk         5%
Critical        2%
```

Use accessible colors and labels, not color alone.

---

# 30. Asset Detail Screen

Include:

```text
Asset ID
Asset Type
Location
Age
Operational Hours
Distance
Current Health
Risk Score
Next Maintenance
```

Then:

### Maintenance Timeline

```text
2023
Inspection

2024
Component Replacement

2025
Overhaul

2026
Current Risk Assessment
```

---

# 31. Regional Risk Intelligence

Display a map plus regional ranking.

Example:

```text
Regional Risk

West Coast
Humidity: High
Corrosion Risk: High

Northern Plains
Temperature Stress: High

East
Rainfall Exposure: High
```

Use explainable risk indicators.

Avoid presenting AI predictions as unquestionable truth.

---

# 32. Scenario Simulator

This is one of RailSutra's most differentiated experiences.

The user selects:

```text
Scenario

Increase train frequency
+10%

Corridor
Mumbai → Pune

Duration
18:00–23:00
```

Then click:

**RUN SIMULATION**

---

# 33. Simulation Result

Present:

```text
CURRENT
vs
SIMULATED
```

Metrics:

- Congestion
- Delay
- Capacity utilization
- Passenger capacity
- Station waiting time
- Operational risk

Use comparison charts.

---

# 34. Recommendation Panel

Every major analytical screen should eventually produce an understandable recommendation.

Format:

```text
RAILSUTRA RECOMMENDS

Increase service frequency by 2 trains
between 18:00 and 22:00.

Expected result:

↓ 14% congestion
↓ 9% average delay
↑ 11% passenger capacity
```

Important:

Recommendations must indicate that they are **decision support**, not autonomous commands.

---

# 35. Alerts Center

Use a dedicated alert drawer/page.

Alert structure:

```text
[CRITICAL]

Track Capacity Risk

Section XX is predicted to exceed
95% utilization within 45 minutes.

Recommended Action
Review dispatch sequence.

[Analyze]
```

---

# 36. Alert Prioritization

Priority order:

```text
Critical
High
Medium
Low
Informational
```

Do not make every alert visually aggressive.

---

# 37. Reports

Reports should feel enterprise-grade.

Categories:

- Network Performance
- Demand
- Capacity
- Congestion
- Maintenance
- Risk
- Regional Analysis
- Festival Operations

Actions:

```text
View
Export PDF
Export CSV
Share
```

---

# 38. Global Search

Global search should support:

- Train number
- Train name
- Station
- Railway section
- Junction
- Asset ID
- Region
- Alert
- Report

Use keyboard shortcut:

**⌘/Ctrl + K**

Search results should be grouped.

Example:

```text
Trains
Stations
Assets
Sections
Reports
```

---

# 39. Loading States

Never leave blank screens during loading.

Use:

- Skeleton cards
- Map loading state
- Chart skeletons
- Table skeletons
- Progress indicators

Avoid unnecessary spinners.

---

# 40. Empty States

Every major screen should have an intentional empty state.

Example:

```text
No critical maintenance risks detected.

All monitored assets are currently
within the defined risk threshold.
```

---

# 41. Error States

Errors must be actionable.

Bad:

> Something went wrong.

Better:

> Weather data could not be updated.

```text
Last successful update:
14:52

[Retry]
```

---

# 42. Real-Time Data Indicators

Because RailSutra is a dynamic platform, show data freshness.

Examples:

```text
Updated 12 sec ago
```

or:

```text
Live
●
```

For delayed external data:

```text
Data delayed by 2 min
```

This is important for trust.

---

# 43. Tables

Tables are important for B2B operations.

Recommended columns should be:

- Compact
- Sortable
- Filterable
- Searchable
- Resizable where useful

Provide:

- Sticky header
- Row hover
- Pagination
- Bulk actions where applicable

Avoid overly dense tables on mobile.

---

# 44. Charts

Charts should answer questions, not merely decorate dashboards.

Every chart should have:

- Clear title
- Unit
- Time period
- Legend where necessary
- Tooltip
- Data freshness

Avoid unnecessary 3D charts.

---

# 45. Animation System

Animation should be subtle.

Use animation for:

- Page transitions
- Map movement
- KPI changes
- Alert appearance
- Loading
- Hover interactions
- Panel transitions

Avoid:

- Constant bouncing
- Large transitions
- Flashing
- Excessive parallax

---

# 46. Motion Philosophy

RailSutra's motion should feel like:

**A living railway network.**

Not:

**A flashy AI dashboard.**

Recommended durations:

```text
Micro interaction: 120–180ms
Panel transition: 180–250ms
Page transition: 250–400ms
Map animation: slow / continuous
```

Respect:

```text
prefers-reduced-motion
```

---

# 47. Responsive Design

The product is desktop-first because B2B operations users may work on large displays.

But it should remain usable on:

- Laptop
- Tablet
- Mobile

On smaller screens:

- Sidebar collapses
- KPI cards stack
- Maps reduce height
- Panels become bottom sheets
- Tables become scrollable
- Complex dashboards become vertically structured

---

# 48. Large Screen / Control Room Mode

Support large monitors.

For operations centers:

- 1440p
- 4K
- Wide monitors

Use additional horizontal space for:

- Map
- Alerts
- Analytics
- Secondary panels

Avoid simply stretching cards.

---

# 49. Accessibility

Requirements:

- WCAG-aware contrast
- Keyboard navigation
- Visible focus states
- Semantic HTML
- Accessible labels
- Screen-reader-friendly controls
- Don't use color as the only indicator
- Reduced-motion support

---

# 50. Design Tokens

Create reusable tokens for:

- Colors
- Spacing
- Radius
- Shadows
- Typography
- Borders
- Animation
- Breakpoints

Example spacing system:

```text
4
8
12
16
20
24
32
40
48
64
```

Use spacing consistently.

---

# 51. Border Radius

Recommended:

```text
Small:
8px

Cards:
12px

Large panels:
16px

Login:
16–20px

Buttons:
8–10px
```

Avoid excessive pill-shaped UI.

---

# 52. Shadows

Use subtle shadows only.

Dark UI should rely more on:

- Border contrast
- Surface elevation
- Background separation

than heavy shadows.

---

# 53. Glass / Blur

Use glass effects selectively.

Good locations:

- Login card
- Floating map controls
- Overlay panels

Avoid applying glassmorphism to the whole application.

---

# 54. Dashboard Density

RailSutra is an operational platform.

The dashboard should support **high information density without becoming cluttered**.

Recommended:

- Tight card padding
- Compact labels
- Clear hierarchy
- Strong grouping
- Consistent spacing

---

# 55. Design Language for AI

Avoid making everything look "AI generated".

AI should appear through:

- Predictions
- Recommendations
- Confidence indicators
- Forecasts
- Risk scores
- Scenario analysis

Not through:

- Purple gradients everywhere
- Glowing "AI" labels
- Excessive chatbot UI

---

# 56. Explainability

Predictions should be explainable whenever possible.

Example:

```text
Why is this section high risk?

• Passenger demand +18%
• Track occupancy 91%
• Heavy rainfall forecast
• Average dwell time +4 min
```

This builds enterprise trust.

---

# 57. Confidence Indicators

Where applicable:

```text
Prediction Confidence
87%
```

Use carefully.

Never invent confidence scores merely for visual appeal.

Only display them when produced by the underlying model/system.

---

# 58. AI Recommendation UX

Recommendations should include:

1. Recommendation
2. Reason
3. Expected impact
4. Supporting data
5. User action

Example:

```text
RECOMMENDED ACTION

Add 2 services during peak period.

Why?
Demand forecast exceeds available
capacity by 18%.

Expected impact
↓ Congestion
↑ Passenger capacity

[Simulate]
```

---

# 59. User Roles

Design the interface to support future role-based experiences.

Potential roles:

- Operations Manager
- Network Controller
- Maintenance Manager
- Infrastructure Manager
- Analyst
- Administrator
- Executive

Do not create separate products for each role.

Instead dynamically prioritize relevant information.

---

# 60. Landing / Login → Product Transition

Recommended visual sequence:

```text
Animated Railway Network
        ↓
User Login
        ↓
Network becomes brighter
        ↓
Map transitions toward dashboard
        ↓
Operations Command Center
```

This should create a strong first impression.

---

# 61. Suggested Landing Copy

Primary:

> **Railway Intelligence, Built for Operations.**

Secondary:

> Predict demand. Understand congestion. Prevent failures. Make better operational decisions.

CTA:

**Sign In**

Secondary:

**View Platform**

---

# 62. Component Library

Create reusable components for:

### Navigation

- Sidebar
- Topbar
- Breadcrumb
- Command Menu

### Data

- KPI Card
- Data Table
- Chart Card
- Statistic
- Timeline
- Status Badge

### Maps

- Map Container
- Map Controls
- Layer Switcher
- Legend
- Map Popup
- Asset Panel

### AI

- Recommendation Card
- Prediction Card
- Confidence Indicator
- Risk Score
- Scenario Result

### Operations

- Alert Card
- Incident Panel
- Train Status
- Capacity Indicator
- Maintenance Indicator

---

# 63. Component Consistency

Every component should support:

```text
Default
Hover
Active
Focus
Disabled
Loading
Empty
Error
```

Where relevant.

---

# 64. Notifications

Use toast notifications for low-priority feedback.

Example:

```text
Simulation completed successfully.
```

Critical operational information should **not** rely only on a toast.

---

# 65. Confirmation Dialogs

Use confirmation dialogs for potentially destructive actions.

Examples:

- Delete
- Archive
- Reset
- Remove scenario
- Modify saved configuration

Avoid unnecessary confirmation dialogs for normal navigation.

---

# 66. Data Freshness & Provenance

When practical, expose:

- Last updated
- Data source
- Data quality
- Forecast horizon
- Model/version information

This is particularly useful for enterprise users.

---

# 67. Trust & Transparency

RailSutra should visually communicate:

> **The system assists decisions. Humans remain responsible for operational authorization.**

Especially for:

- Dispatch recommendations
- Maintenance decisions
- Rerouting
- Capacity allocation

---

# 68. Suggested Main Navigation

Final recommendation:

```text
Overview

Operations
  ├── Live Network
  ├── Train Operations
  └── Capacity

Demand
  ├── Forecast
  ├── Festivals
  └── Regional Demand

Network
  ├── Bottlenecks
  ├── Congestion
  └── Track Analytics

Maintenance
  ├── Asset Health
  ├── Maintenance
  └── Predictive Risk

Risk Intelligence
  ├── Regional Risk
  ├── Weather
  └── Environmental

Simulation

Reports

Alerts
```

---

# 69. Default Dashboard

The first authenticated screen should answer these questions immediately:

### What is happening?

Operational overview.

### Where is it happening?

Interactive map.

### What will happen next?

Predictions.

### What is at risk?

Alerts and risk.

### What should we do?

Recommendations.

This should be the primary UX philosophy of the dashboard.

---

# 70. Recommended Dashboard Layout

```text
┌──────────────────────────────────────────────────────────────┐
│ RailSutra   Overview                    Search   Alerts User │
├────────────┬─────────────────────────────────────────────────┤
│            │ KPI  │ KPI  │ KPI  │ KPI  │ KPI                │
│            ├─────────────────────────────────────────────────┤
│ Sidebar    │                                                 │
│            │              LIVE NETWORK MAP                   │
│            │                                                 │
│            │                                                 │
│            ├───────────────────────┬─────────────────────────┤
│            │ Demand Forecast       │ Critical Alerts         │
│            ├───────────────────────┼─────────────────────────┤
│            │ Network Analytics     │ Recommendations         │
└────────────┴───────────────────────┴─────────────────────────┘
```

---

# 71. Mobile Dashboard

Prioritize:

```text
Alerts
↓
KPIs
↓
Map
↓
Recommendations
↓
Analytics
```

Do not attempt to reproduce the desktop dashboard pixel-for-pixel.

---

# 72. Dark Mode / Light Mode

### Default

**Dark mode**

This best matches:

- Control room environments
- Maps
- Dense analytics
- Railway night operations
- Data visualization

### Optional

Light mode may be added later.

If implemented, maintain the same design tokens and hierarchy.

---

# 73. Login Page Theme

Login should remain dark even if light mode is eventually supported.

The animated railway network is part of RailSutra's brand identity.

---

# 74. Map Visual Language

Railway lines should be visually distinct from normal roads.

Recommended:

```text
Railway:
thin luminous line

Primary corridor:
slightly thicker line

High congestion:
yellow/orange intensity

Critical congestion:
red intensity

Selected route:
bright blue highlight

Healthy:
subtle blue/green

Maintenance risk:
orange/red
```

Never make the entire map glow.

---

# 75. Map Performance

The map is a critical component.

Design and implementation should account for:

- Large railway datasets
- Layer toggling
- Clustering
- Progressive loading
- Viewport-based rendering
- Efficient animations
- Smooth zooming

Do not animate thousands of objects simultaneously.

---

# 76. Data Visualization Rules

### Use line charts for:

- Time trends
- Demand
- Delay
- Capacity

### Use bar charts for:

- Route comparison
- Region comparison
- Asset risk ranking

### Use heatmaps for:

- Geographic demand
- Congestion
- Risk

### Use maps for:

- Spatial intelligence

### Use tables for:

- Precise operational records

---

# 77. Design Don'ts

Never let the interface become:

- A generic admin dashboard
- A crypto-style dashboard
- A gaming interface
- A neon cyberpunk UI
- A consumer travel app
- A dashboard full of meaningless cards

RailSutra is an **enterprise operations product**.

---

# 78. Stitch / AI Generation Instructions

When generating RailSutra screens using Google Stitch:

## Always maintain

- Same navigation structure
- Same typography
- Same design tokens
- Same spacing
- Same map language
- Same card styling
- Same alert semantics
- Same component patterns

## Do not allow

- Random color changes
- Different sidebar designs
- Different button styles
- Different typography between screens
- Unrelated illustration styles
- Excessive gradients
- Excessive rounded cards
- Inconsistent map controls

---

# 79. Stitch Screen Generation Priority

Generate screens in this order:

### 1. Login

Highest visual importance.

### 2. Main Dashboard

Establish the core design system.

### 3. Live Network

Establish map interaction.

### 4. Demand Intelligence

Establish analytical charts.

### 5. Network/Bottleneck Analytics

Establish network intelligence.

### 6. Maintenance

Establish asset management.

### 7. Risk Intelligence

Establish regional intelligence.

### 8. Scenario Simulator

Establish decision-support workflow.

### 9. Alerts

Establish operational notifications.

### 10. Reports

Establish enterprise output.

---

# 80. Primary Visual Benchmark

The overall experience should feel closer to:

- Modern enterprise analytics
- Professional air-traffic/rail operations tooling
- Premium geospatial platforms
- High-end infrastructure control systems

than:

- Typical ERP dashboards
- Generic admin panels
- Consumer railway apps

---

# 81. Final Product Experience

A user should enter RailSutra and immediately understand:

```text
I can see the railway network.
          ↓
I can understand what is happening.
          ↓
I can see what is likely to happen.
          ↓
I can identify risks.
          ↓
I can simulate possible decisions.
          ↓
I can see recommended actions.
```

That is the central UX loop.

---

# 82. Final Design Principle

## RailSutra should feel like:

> **A living digital intelligence layer over the railway network.**

The interface should make the network feel alive through:

- Movement
- Data
- Predictions
- Alerts
- Spatial intelligence
- Operational context

But the product must always remain:

**Calm. Precise. Trustworthy. Professional.**

---

# 83. One-Line Design Brief for AI Tools

Use this as the primary design instruction when generating RailSutra screens:

> **Design RailSutra as a premium dark enterprise railway operations intelligence platform: a living interactive railway map at the center, dense but elegant operational analytics, subtle railway-inspired blue accents, high information clarity, explainable AI recommendations, predictive risk visualization, and restrained cinematic motion that makes the network feel alive without distracting the operator.**
