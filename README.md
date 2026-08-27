# PayToBro

> Recover Every Possible Payment.

---

## What is PayToBro?

PayToBro is an AI-assisted revenue recovery web application built for businesses that accept online payments. 

When customer payments fail at checkout, businesses lose revenue. In most setups, failed transactions are either dropped immediately or retried blindly without knowing why they failed in the first place. PayToBro helps teams understand why transactions fail, estimates the probability of recovering each payment, suggests a practical recovery action, and tracks how much money is recovered.

---

## The Problem

- **Lost Revenue:** Failed payments directly reduce top-line sales and lead to lost customers.
- **Manual Checking is Slow:** Reviewing individual failed orders or invoices by hand takes too much time.
- **One Size Does Not Fit All:** Retrying every failed payment the same way does not work. A temporary bank switch issue can be retried later, but retrying an expired card without an updated payment method will just fail again.
- **Prioritization is Missing:** Merchants need to know which failed payments are worth pursuing first and which ones have a realistic chance of recovery.

---

## Our Solution

PayToBro organizes payment recovery into a clear, visible pipeline:

```
Payment Failed
      ↓
 AI Analysis
      ↓
Failure Classification
      ↓
Recovery Probability
      ↓
Recommended Action
      ↓
Safe Recovery Simulation
      ↓
Outcome Measured
```

Rather than guessing, the system checks the transaction context, categorizes the failure reason, checks safety guardrails (like maximum retry limits), and recommends a specific recovery step.

---

## How PayToBro Works

### 1. Payment Failed
A payment fails at the checkout stage and enters the recovery queue with its transaction ID, customer information, amount, and gateway error message.

### 2. AI Analysis
The engine checks available payment details, past customer transaction history, and failure signals to understand what happened.

### 3. Failure Classification
The failure is categorized into one of five realistic failure types:
- **Temporary bank failure:** The issuing bank or payment switch had a brief technical error or timeout.
- **Expired card:** The customer's card has expired, so retrying the same card will not work.
- **Insufficient funds:** The customer did not have enough balance at checkout time.
- **Authentication failure:** The customer dropped off during OTP or 3D-Secure verification.
- **Network issue:** A network connection dropped before confirmation was received.

### 4. Recovery Prediction
The system calculates a recovery probability percentage (0–100%) by weighing four decision factors:
- Customer payment history
- Failure type severity
- Previous retry attempts
- Customer reliability rating

### 5. Recommended Action
Based on the failure type and score, PayToBro suggests an appropriate next step:
- **Retry payment after 2 hours:** For temporary bank issues after a cool-down window.
- **Suggest alternative payment method:** For expired cards, sending a link for UPI or another card.
- **Schedule smart reminder:** For low balance or missed OTPs, delivered during active hours.
- **Immediate retry via secondary routing switch:** For transient network timeouts.
- **Halt automated recovery:** If maximum retry attempts are reached or an account is flagged.

### 6. Recovery Execution (Safe Simulation)
The application runs in a safe demo/sandbox mode. Clicking recovery actions simulates the payment retry locally without moving real money or charging real cards.

### 7. Measurement
When a payment is marked as recovered in the demo, the system updates the recovered revenue, recovery rate, and analytics charts across the entire dashboard in real time.

---

## Key Features

### Dashboard
- **Key Metrics:** Live overview showing Revenue at Risk (`₹17,49,443.91`), Recoverable Revenue (`₹11,02,400.50`), Revenue Recovered (`₹2,40,800.75`), and Recovery Rate (`72.5%`).
- **Revenue Recovery Chart:** Dual-line graph showing revenue volume alongside recovered amounts across months.
- **Recent Recovery Cases Table:** Quick view of recent failed payments with transaction ID, customer name, amount, failure reason, probability bar, and an analyze button.
- **Quick Copilot Panel:** Embedded AI chat panel right on the dashboard for asking recovery questions.

### Recovery Cases Page
- Filterable list of all demo payment transactions.
- Search bar to find payments by transaction ID (`RZP_9281`), customer name, or failure reason.
- Detail modal showing payment timeline, customer profile, and AI recommendation rationale.

### Recovery Agent Page
- Six connected pipeline stages: **Payment Failed → Analyzing → Classifying → Predicting → Recovering → Measured**.
- **Clickable Stage Cards:** Clicking any stage opens an **AI Execution Inspector** drawer on the right side showing exactly what the system checks at that stage.
- **Run Recovery Simulation Button:** Starts an animated multi-step demo that moves failed payments through each stage with live counter updates.

### PayToBro Copilot
An in-app assistant that answers questions using the project's recovery data. Working prompts include:
- *"Which payments should I prioritize?"* (Identifies high-value opportunities like `RZP_9281`)
- *"Explain today's failures"* (Breaks down why transactions failed)
- *"How much revenue can we recover?"* (Summarizes recovered and recoverable revenue)
- *"Run recovery simulation"* (Triggers the recovery agent pipeline)

### Simulation Lab
A demo testing sandbox where you can trigger simulated recovery cohorts to see how bulk recovery affects pipeline metrics.

### Revenue Analytics Page
- **Payment Recovery Flow:** Connected node cards showing drop-off and conversion percentages from failure to recovery.
- **Recovery Performance:** Visual comparison of failed revenue, recoverable revenue, and recovered revenue.
- **Recovery Funnel:** Stage-by-stage capital triage bar chart.
- **Failure Intelligence:** Breakdown of failure reasons (Bank declines 48%, Expired cards 22%, Insufficient funds 16%, Auth failures 8%, Network issues 6%).
- **Time Filters:** Toggle between 7D, 30D, 90D, and 12M views.

### Audit Logs & Activity Feed
- Live activity feed tracking recent simulated recoveries, retries, and strategy decisions.
- Decision audit trail table displaying recorded transactions with confidence scores and timestamps.

---

## Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript | User interface and dashboard views |
| **Build Tool** | Vite 8 | Fast local dev server and bundling |
| **Styling** | Vanilla CSS | Custom dark fintech layout inspired by modern dashboard density |
| **Icons** | Lucide React | Clean, lightweight UI icons |
| **Backend** | Node.js, Express, TypeScript | REST API for recovery endpoints and simulations |
| **TypeScript Runner** | tsx | Running TypeScript backend directly without separate compile step |
| **State Management** | React Context + LocalStorage | Shared real-time state across pages and local persistence |
| **Testing** | Node.js Test Runner (`tsx --test`) | Unit tests for failure classification and decision engine |

---

## Project Structure

```text
prep/
├── package.json                 # Root scripts to run backend and frontend together
├── backend/
│   ├── package.json             # Backend dependencies (Express, cors, tsx)
│   ├── tsconfig.json            # Backend TypeScript configuration
│   └── src/
│       ├── server.ts            # Express server entry point (port 4000)
│       ├── recovery-engine/     # Core recovery logic
│       │   ├── classifier.ts    # Failure taxonomy classification
│       │   ├── scorer.ts        # Probability scoring and decision factors
│       │   ├── guardrails.ts    # Retry caps and safety rules
│       │   ├── decision-engine.ts # Action selection logic
│       │   └── __tests__/       # Automated unit tests
│       ├── simulation/          # Synthetic cohort simulation logic
│       ├── routes/              # Express API routes
│       └── ai/                  # Service logic for AI summaries and Copilot
└── frontend/
    ├── package.json             # Frontend dependencies (React, Vite, Lucide)
    ├── vite.config.ts           # Vite development server configuration
    ├── index.html               # Main HTML template
    └── src/
        ├── main.tsx             # React DOM root entry
        ├── App.tsx              # Page routing and layout
        ├── index.css            # Core design system tokens and typography
        ├── context/
        │   └── RecoveryContext.tsx # Central shared reactive state
        ├── components/          # Reusable UI components
        │   ├── Sidebar.tsx      # Navigation sidebar
        │   ├── Header.tsx       # Top bar with simulation controls
        │   ├── KpiGrid.tsx      # 4 primary dashboard metric cards
        │   ├── RevenueRecoveryChart.tsx # Revenue wave chart
        │   ├── RightAnalyticsPanel.tsx  # Volume and hourly distribution
        │   ├── RecentRecoveryCases.tsx  # Transaction table
        │   ├── DashboardCopilot.tsx     # Embedded AI chat widget
        │   ├── CaseDetailModal.tsx      # Detailed payment diagnostic modal
        │   └── StageExecutionInspector.tsx # 6-stage deep inspector drawer
        └── pages/               # Application pages
            ├── OverviewPage.tsx         # Main dashboard
            ├── RecoveryAgentPage.tsx    # Autonomous agent pipeline view
            ├── AnalyticsPage.tsx        # Revenue analytics and funnel
            ├── RecoveryCasesPage.tsx    # Payment queues and filters
            ├── CopilotPage.tsx          # Full-page Copilot interface
            ├── SimulationLabPage.tsx    # Sandbox cohort testing
            ├── AuditLogsPage.tsx        # Decision history ledger
            ├── SettingsPage.tsx         # Configuration and reset demo button
            └── WebsitePage.tsx          # Public prototype landing page
```

---

## Run Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm

### 1. Install Dependencies
Run the install command in root, backend, and frontend:
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```
*(Or install inside each folder: `cd backend && npm install && cd ../frontend && npm install`)*

### 2. Start Both Backend and Frontend
From the root directory, run:
```bash
npm run dev
```
This runs the Express API backend on `http://localhost:4000` and the Vite frontend on `http://localhost:5173` at the same time using `concurrently`.

### 3. Open in Browser
Visit **[http://localhost:5173](http://localhost:5173)** to view the dashboard.

### 4. Run Unit Tests
To run the automated decision engine tests:
```bash
npm test
```
This runs 9 unit tests checking classification, recovery probability scoring, guardrail limits, and action selection.

### 5. Build for Production
```bash
npm run build
```
Compiles both the backend with `tsc` and the frontend with Vite.

---

## Demo & Sandbox

This project is designed as a working demonstration of an AI-assisted payment recovery workflow.

- All payment recovery actions are simulated safely in **demo/sandbox mode**.
- No real customer payment accounts, cards, or bank accounts are debited or credited.
- You can reset all demo data back to default at any time by clicking the **Reset Demo** button in the header or Settings page.

---

## Security

This is a buildathon/demo project and should not be treated as production payment infrastructure.

Safety guardrails included in the demo logic:
- Maximum retry caps (stops retrying after 3 attempts to prevent spamming payment rails).
- Permanent decline protection (halts automated retries if an account is flagged or frozen).
- No sensitive card numbers or CVVs are collected or stored.

---

## Project Demo Flow

Here is a recommended 2-minute walkthrough when presenting the project:

1. **Open the Dashboard:** Point out the 4 primary numbers: *Revenue at Risk*, *Recoverable Revenue*, *Revenue Recovered*, and *Recovery Rate*.
2. **Review Recent Cases:** In the table below the chart, look at transaction `RZP_9281` (Rahul Sharma, `₹24,500`).
3. **Inspect the Case:** Click **Analyze** to open the details modal. Notice the failure classification (*Temporary bank failure*), the 92% recovery probability, and the recommended strategy (*Retry after 2 hours*).
4. **Go to Recovery Agent:** Click **Recovery Agent** in the sidebar.
5. **Inspect the Pipeline:** Click on each of the six stage cards (**Payment Failed**, **Analyzing**, **Classifying**, **Predicting**, **Recovering**, **Measured**) to see the AI Execution Inspector drawer explain what happens at each stage.
6. **Run a Simulation:** Click **Run Recovery Simulation** at the top right. Watch the pipeline move live through analyzing, classifying, predicting, and recovering.
7. **Observe the Result:** See `RZP_9281` get recovered, updating the recovered revenue count and crediting the ledger.
8. **Try Copilot:** Open the Copilot panel and click *"Which payments should I prioritize?"* to see how it identifies high-value recovery opportunities.
9. **View Analytics:** Navigate to **Analytics** to see the payment flow conversion percentages, recovery funnel, and failure category breakdown.

---

## Why We Built It

Online payment failures happen all the time, but the way businesses handle them is usually clumsy: either doing nothing and losing the sale, or repeatedly running the same charge until banks block it. 

We built PayToBro to explore a more intelligent approach. By treating failure reasons differently, estimating recovery odds with basic heuristics, and choosing the right response (whether that is waiting a few hours, asking for an alternate UPI ID, or sending a morning reminder), merchants can recover a meaningful portion of lost revenue without frustrating customers.

---

## Future Scope

If taken beyond a buildathon prototype, reasonable next steps would include:
- Real payment gateway integrations (webhooks with Razorpay, Stripe, or Cashfree)
- Connecting live LLM models with structured tool calling for customer support replies
- PostgreSQL database persistence for multi-merchant data
- Automated notification dispatch via WhatsApp Business API and SMS
- Support for recurring subscription billing and mandate recovery

---

## Team / Buildathon

Built with care for a fintech AI buildathon.
