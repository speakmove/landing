# Record of Processing Activities (RoPA)

**GDPR Article 30** — internal document, not published.
**Last reviewed:** 2026-05-21

This document records the processing activities undertaken by SpeakMove (Dmytro Fenko, UK sole trader). Update on every change to data flow, sub-processor, or retention period.

---

## 1. Controller

- **Legal name:** Dmytro Fenko (UK sole trader, trading as SpeakMove)
- **Address:** Weston-super-Mare, UK, BS23 1RH
- **ICO registration:** ZC141876 (data controller)
- **Contact:** hi@speakmove.app
- **DPO:** Not required (< 250 staff, no large-scale special-category processing — exemption under Art. 37). DPO role performed by the controller.

## 2. Processing Activities

### Activity #1: Voice-to-text transcription

- **Purpose:** Convert user voice messages to text so the AI can respond
- **Lawful basis:**
  - Art. 6(1)(b) — performance of contract (subscription service)
  - Art. 9(2)(a) — explicit consent for biometric-class data (collected on first /start)
- **Categories of data subjects:** Telegram users 18+ who interact with @SpeakMoveBot
- **Categories of personal data:**
  - Voice audio (biometric class under Art. 4(14))
  - Text transcript (derived from voice)
- **Recipients:**
  - **Groq Inc.** (US) — Whisper STT API
  - **OpenAI** (US, optional fallback) — Whisper-large-v3 API
- **Retention:** Voice audio deleted within 24h after transcription. Text transcript retained until user deletes via /settings.
- **International transfers:**
  - US (Groq, OpenAI) — Standard Contractual Clauses (SCCs) + DPA in place
- **Security measures:**
  - TLS encryption in transit
  - No long-term storage of voice on SpeakMove servers
  - Pseudonymisation: voice file linked by random UUID, not Telegram ID

### Activity #2: LLM-generated response and feedback

- **Purpose:** Generate the bot's English reply + native-language feedback to user
- **Lawful basis:** Art. 6(1)(b) — performance of contract
- **Data subjects:** Telegram users 18+
- **Personal data:** Text transcript (input), generated text (output), conversation history
- **Recipients:**
  - **OpenAI** (US) — GPT-4o-mini API
- **Retention:** Conversation history retained until user deletes via /settings.
- **International transfers:** US (OpenAI) — SCCs + DPA
- **Security measures:** TLS, no PII enrichment, OpenAI zero-retention API setting where supported

### Activity #3: Text-to-speech (bot voice reply)

- **Purpose:** Generate British-accented audio reply
- **Lawful basis:** Art. 6(1)(b)
- **Data subjects:** Telegram users 18+
- **Personal data:** Text input (English sentence). No user-identifiable data sent.
- **Recipients:**
  - **OpenAI** (US) — TTS HD API
  - **Hume AI** (US, planned for V0.5) — Octave 2 TTS API
- **Retention:** Generated audio file ephemeral (sent to Telegram, not stored).
- **International transfers:** US — SCCs + DPA
- **Security measures:** TLS, no user-id in TTS payload

### Activity #4: Subscription billing

- **Purpose:** Process £9.90/mo subscription
- **Lawful basis:**
  - Art. 6(1)(b) — performance of contract
  - Art. 6(1)(c) — legal obligation (UK tax law, VAT, MOSS)
- **Data subjects:** Paying users
- **Personal data:** Card data (handled by Stripe), email, name (if provided to Stripe), billing address (Stripe), subscription state, payment history
- **Recipients:**
  - **Stripe Payments UK Ltd** (UK) — payment processor
- **Retention:**
  - SpeakMove side: subscription state until account cancellation + 30 days
  - Stripe side: 7 years (UK HMRC tax requirement)
- **International transfers:** UK only for processing. Stripe may route through US for fraud screening — covered by Stripe SCCs.
- **Security measures:** PCI-DSS by Stripe; SpeakMove never touches raw card data.

### Activity #5: Telegram bot communication

- **Purpose:** Deliver bot messages to user
- **Lawful basis:** Art. 6(1)(b)
- **Data subjects:** Telegram users 18+
- **Personal data:** Telegram User ID, language code, chat messages
- **Recipients:**
  - **Telegram FZ-LLC** (UAE) — messaging infrastructure
- **Retention:** Telegram retains per its own policy. SpeakMove keeps only message references, not full text.
- **International transfers:** UAE (Telegram) — Telegram operates own privacy framework. UK adequacy: not yet recognised; Telegram offers SCCs through its Terms.
- **Security measures:** Bot API token kept in env vars, rotated quarterly.

### Activity #6: Hosting & application infrastructure

- **Purpose:** Run the application, database, web landing page
- **Lawful basis:** Art. 6(1)(f) — legitimate interest (operating the service)
- **Personal data:** Application logs (may contain Telegram ID), database rows
- **Recipients:**
  - **Vercel** (US) — landing page hosting (speakmove.app)
  - **Hetzner Cloud** (Germany, planned) or **Railway** (US) — bot backend + Postgres
- **Retention:** Logs 30 days. Database per Activity #1-#5 retention.
- **International transfers:** US (Vercel) — SCCs. Germany (Hetzner) — EU/UK adequacy.

## 3. Data subject rights mechanism

- **Right of access (Art. 15):** Email hi@speakmove.app → manual export within 30 days
- **Right to rectification (Art. 16):** /settings in bot, or email
- **Right to erasure (Art. 17):** /settings in bot ("Delete my data") or email
- **Right to data portability (Art. 20):** Email request → JSON export
- **Right to restrict / object (Art. 18, 21):** Email
- **Right to withdraw consent (Art. 7(3)):** Cancel subscription = stop voice processing

## 4. Breach response (Art. 33–34)

- **Detection:** Application logs, Sentry error monitoring, Telegram bot health-check
- **Internal escalation:** Owner notified immediately via PagerDuty/Telegram alert
- **ICO notification:** Within 72h if breach poses risk to data subjects (Art. 33(1))
- **Data subject notification:** Direct Telegram message if high risk (Art. 34(1))

## 5. Review schedule

- **Annual full review:** Every May, alongside ICO renewal
- **Ad-hoc review triggers:**
  - New sub-processor added
  - Data category change
  - Retention period change
  - Incident or near-miss
