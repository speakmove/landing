# Data Protection Impact Assessment (DPIA) — Voice Processing

**GDPR Article 35** — internal document, not published.
**First created:** 2026-05-21
**Reason for DPIA:** Voice recordings = biometric data (Art. 4(14)). Even when not used for unique identification, processing audio at scale triggers Art. 35(3)(b) — "processing on a large scale of special categories of data".

---

## 1. Description of processing (Art. 35(7)(a))

### Nature of processing
- Users record voice messages in Telegram while interacting with @SpeakMoveBot
- SpeakMove receives audio (typically 5–15 second clips)
- Audio sent to Groq Whisper API (US) for speech-to-text transcription
- Transcript stored in SpeakMove database
- Audio file **deleted within 24 hours**

### Scope
- Target audience: ~100–500 paying users in V0, scaling to 5,000+ in V1+
- Audio volume: ~15 min/day/user max → ~1500 min/day at V1 scale
- Data subject category: adult immigrants in UK (18+), Russian/Ukrainian native speakers

### Context
- Service: Telegram bot for English speaking practice
- Voluntary use, no employment or coercion context
- Users opt-in by initiating /start in Telegram

### Purpose
- Train spoken English by repetition
- Provide AI-generated grammar/pronunciation feedback in user's native language

## 2. Necessity & proportionality (Art. 35(7)(b))

### Why is biometric audio necessary?
- The product's core value is **voice practice** — processing audio is fundamental, not incidental
- Text-only alternatives would defeat the product's purpose (Duolingo / Speak-style)

### Alternative considered
- **On-device transcription** (browser Whisper.cpp) — rejected: insufficient accuracy on non-native accents, heavy battery cost on Telegram-embedded clients
- **No transcript retention** — rejected: progress tracking and dialogue continuity require text history

### Data minimisation
- ✅ Voice audio deleted within 24h (only transcription window)
- ✅ Transcript can be deleted by user via /settings
- ✅ No voice clustering, fingerprinting, or speaker identification

## 3. Risks to data subjects (Art. 35(7)(c))

| # | Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|---|
| 1 | Voice intercepted in transit | Low | High | TLS encryption end-to-end. HTTPS to Groq. Telegram MTProto encryption. |
| 2 | Voice retained beyond 24h due to bug | Medium | High | Automated cron-based deletion job. Monitoring + alert if voice files > 24h old. |
| 3 | Sub-processor (Groq, OpenAI) misuses voice for training | Low | High | Contractual: zero-retention API setting; DPA-bound; Groq/OpenAI commitments not to train on enterprise API inputs |
| 4 | Voice used for identification by attacker who gains DB access | Low | High | Voice deleted within 24h — minimal exposure window. Pseudonymised file paths (UUID, not Telegram ID). |
| 5 | Re-identification from transcript content (user mentions name/address in speech) | Medium | Medium | User notice in /settings: "don't share addresses, full names, or banking details in voice". Sensitive info filtering in V1. |
| 6 | Child user accidentally onboarded despite 18+ rule | Low | High | Age confirmation gate on /start. Disclaimer page. /privacy explicit age requirement. |
| 7 | International transfer to US (Groq, OpenAI) post-Schrems II | Low | Medium | SCCs + DPA in place. UK Data Bridge with US (DPF) recognition for Stripe. Monitor regulator guidance. |
| 8 | Voice stress / mental harm from immigrant-stress scenarios | Low | Low | Disclaimer page: "not therapy, not crisis support". Sign-off prompt: if user expresses crisis (e.g. self-harm) bot redirects to Samaritans 116-123. |

## 4. Measures to address risks (Art. 35(7)(d))

### Technical
- TLS 1.3 in transit
- Voice file pseudonymisation (UUID, no Telegram ID in path)
- Automated deletion job (cron daily, alerts if files > 24h old)
- Application logs scrubbed of voice file paths after 7 days
- Database backup encryption at rest

### Organisational
- /privacy explicit voice + biometric notice
- /disclaimer explicit AI accuracy + 18+ + voice notice
- Age confirmation gate (V0.5 — checkbox on /start)
- Quarterly review of sub-processor contracts
- Monthly DPIA review until 1,000 users reached

### Legal
- Standard Contractual Clauses with all US-based sub-processors
- DPA with Stripe (built into Stripe's services agreement)
- ICO ZC141876 registration up to date
- Customer-facing rights mechanism (email + /settings in bot)

## 5. Consultation

### DPO consulted?
- N/A — DPO role performed by controller (Dmytro Fenko)

### Data subjects consulted?
- V0: pilot users will be asked for feedback on privacy notice clarity (3-question survey at month 3)

### ICO consulted?
- Not required at V0 scope. Threshold: > 10,000 users or new high-risk processing → consider prior consultation under Art. 36.

## 6. Conclusion

**Risk level after mitigation:** Low-Medium

**Decision:** Proceed with processing. Voice processing is necessary for the product's core value, risks are mitigated through 24h deletion, pseudonymisation, SCCs, and clear user notice.

**Re-assessment trigger:**
- New sub-processor
- Change in retention (longer than 24h)
- Introduction of voice cloning / synthesis on user voice
- Audit by ICO

## 7. Sign-off

- **DPIA author:** Dmytro Fenko (controller)
- **Date:** 2026-05-21
- **Next review:** 2026-08-21 (quarterly) or on event trigger
