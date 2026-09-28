# TRACK 1 — Fire TV · Deep Research Meta Prompt

> **How to use:** Paste everything inside the `PROMPT` block into a deep-research tool (Gemini Deep Research, ChatGPT Deep Research, Perplexity Deep Research, Claude Research). Fill the `{{VARIABLES}}` first, or leave them as-is and the researcher will pick defaults. Run it once for a broad scan, then re-run Part B/C against the pitch you pick.
>
> **Companion files:** [hackathon.md](hackathon.md) (rules), [ORG.md](ORG.md) (sponsor goals).

---

````
PROMPT
======

# ROLE
You are a senior market-research analyst and product strategist. You combine a
strategy consultant's rigor (MBB / Big 4 style) with a hackathon judge's eye. You
report evidence first, then give your judgment, and you always label which is which.

# MISSION
Find, validate, and size the single best problem to build for in the Fire TV track
of the "Build, Ship, Shape: Amazon Developer Hackathon". Then generate three
genuinely distinct solution pitches for it, and make the market and business case.
The output must help a builder pick an idea that scores highly on all four
equally weighted judging criteria AND could plausibly survive beyond the hackathon.

# VARIABLES (use the defaults if left blank)
- {{BUILDER_PROFILE}}  = solo or small team, AI-native, agent-assisted development
- {{HOME_MARKET}}      = Philippines-based builder; primary launch market = United States (Fire TV's core market). Flag Philippines/SEA differences where they matter.
- {{FOCUS_AREA}}       = open. If blank, evaluate every priority category below.
- {{TIME_LEFT}}        = submission closes Oct 23, 2026, 12:00 PM PDT

# TRACK CONTEXT (treat as given; verify anything marked VERIFY)
- Requirement: a demo-ready app on Fire OS or Vega OS. Any framework (React Native,
  web, Android Kotlin/Java). The demo video must show it running on a real Fire TV
  device or the Fire TV/Vega simulator.
- Sponsor priority categories: AI-enhanced viewing, sports, fitness, family
  entertainment, multi-modal UX, computer vision.
- Judging (equally weighted, scored 1–5 each): Tech Implementation, Design, Potential
  Impact (can it serve an audience beyond the hackathon, e.g. the Fire TV Appstore?),
  Quality of the Idea. Friction logs add up to a 10% bonus.
- Judges call these OBVIOUS: basic streaming UI, simple video player,
  remote-controlled game.
- Judges call these CREATIVE: AI viewing that adapts to household patterns; a
  computer-vision fitness app using the TV camera; multi-modal voice + D-pad + visual
  in one flow.
- Sponsor signals (VERIFY): Vega OS (React Native for Vega, RN 0.72) is Amazon's
  strategic path for future streaming players. Alexa+ is on Fire TV with
  conversational search. Amazon cites U.S. viewers spending ~12 min searching for
  content. Fire TV device count claims range from 200M+ to 300M+ (conflicting Amazon
  pages). Amazon Devices Builder Tools (MCP server + Agent Skills) support Vega.
- Constraints: 10-foot UI, D-pad focus management, limited camera availability on
  Fire TV hardware (VERIFY which devices support cameras/peripherals), Appstore
  policies, children's privacy (COPPA) for family apps.

# RESEARCH RULES (non-negotiable)
1. Every factual claim gets: source name, URL, publication date, and a source tier:
   - T1 Primary: government statistics, company filings (10-K, earnings calls),
     official company blogs and docs, peer-reviewed studies
   - T2 Expert: MBB / Big 4 reports, industry analysts (Nielsen, Parks Associates,
     Antenna, Ampere, Omdia, IDC, Gartner, Forrester), academic preprints
   - T3 Journalistic: Reuters, Bloomberg, FT, WSJ, The Verge, TechCrunch, Variety,
     Hollywood Reporter
   - T4 Web: blogs, forums, Reddit, app-store reviews, vendor marketing
2. Label every statement [FACT] (sourced) or [INFERENCE] (your reasoning).
3. Never invent a number. If a figure can't be found, write `DATA GAP — <what is
   missing> — <how to get it>` and keep going. A visible gap beats a plausible guess.
4. When sources conflict, show both and mark the conflict `RESOLVED (<why>)` or
   `UNRESOLVED`.
5. Prefer data from 2024–2026. Flag anything older than 2023 as `STALE`.
6. Paywalled reports: use the publisher's free executive summary, press release, or
   a reputable citing article, and say which one you used.
7. Do not estimate build effort in hours, sprints, or headcount. Describe scope as a
   list of components only.

# SOURCE MAP (search these deliberately)
- Big 3 (MBB):
  - McKinsey: media & entertainment, the state of AI, the future of TV and
    streaming, connected-fitness/wellness consumer research
  - BCG: media and streaming, consumer AI adoption
  - Bain: technology report, media & entertainment
- Big 4:
  - Deloitte: Digital Media Trends survey, TMT Predictions
  - PwC: Global Entertainment & Media Outlook
  - EY: media & entertainment outlook, connected-home research
  - KPMG: consumer / tech adoption surveys
- Industry and audience data: Nielsen (The Gauge, streaming ratings), Parks
  Associates (connected CE, streaming devices), Antenna (subscriber churn), Ampere
  Analysis, Omdia, Hub Entertainment Research, Leichtman Research, Samba TV, eMarketer
  / Insider Intelligence, Statista (cite the underlying source), Conviva (streaming
  QoE), JustWatch (streaming market share)
- Primary / government: Amazon 10-K and earnings calls, aboutamazon.com,
  developer.amazon.com blogs, Amazon Ads (Fire TV audience), U.S. BLS American Time
  Use Survey, CDC / WHO physical-activity data (fitness), Census household data,
  PSA Philippines (for the PH flag)
- Competitive and app data: Amazon Appstore listings and reviews, Google Play (Android
  TV), Roku Channel Store, Apple TV App Store, Sensor Tower / data.ai, Crunchbase,
  PitchBook, CB Insights (funding and deals)
- Voice of customer: r/fireTV, r/cordcutters, r/homegym, r/Parenting, AFTVnews,
  Amazon Developer forums, 1–3 star app reviews of competing apps
- Sports-specific: Sports Business Journal, league / broadcaster streaming rights news

---

# PART A — PROBLEM (the 5 tests)

Step A0 — Build a candidate list of 8–12 problems, at least one per priority
category (AI-enhanced viewing, sports, fitness, family entertainment, multi-modal
UX, computer vision). Write each problem as:
"<Specific person> struggles to <job> because <root cause>, which costs them <pain>."

Seed candidates to test (add your own):
- Content discovery fatigue: households spend minutes browsing before choosing
- Multi-viewer households: one profile doesn't match who is actually watching
- Following sports across fragmented services, rights, and schedules
- Home fitness: no form feedback or motivation on the biggest screen in the house
- Family co-viewing: parents can't easily curate age-appropriate or educational content
- Accessibility: the D-pad and 10-foot UI are hard for older adults or low-vision users
- Second-screen friction: phone and TV don't coordinate during viewing

Step A1 — Score each candidate on the 5 tests. For every test, answer the questions,
cite evidence, and give a score from 1 to 5 with a one-line justification.

1. IS IT REAL? Does the problem exist in behaviour, not just in opinion?
   - Evidence of the behaviour: time-use data, usage telemetry, surveys with n and
     method stated
   - Voice of customer: at least 5 verbatim complaints from forums or reviews
     (quote under 25 words each, with a link)
   - Existing workarounds people use today (a workaround is proof of a real problem)
   - Pass bar: at least one T1/T2 source AND observable workaround behaviour

2. IS IT LARGE? How many people or households have it, and how often?
   - Number of affected U.S. households or individuals, and how often it happens
     (daily, weekly, per session)
   - Fire TV-reachable share (installed base × segment incidence). Show the formula.
   - Pass bar: millions of affected users in the U.S., or a smaller segment with
     very high frequency or willingness to pay

3. IS IT SIGNIFICANT? How much does it hurt?
   - Cost in time, money, churn, health, or emotion. Quantify where possible.
   - Current spending on alternatives (e.g. connected-fitness subscriptions, sports
     packages)
   - Is it a "hair on fire" problem or a "nice to have"? Rate the pain intensity.
   - Pass bar: a measurable cost, or clear evidence that people already pay to solve it

4. IS IT RELEVANT? Does it fit this sponsor, this platform, and this builder?
   - Maps to a named Fire TV priority category?
   - Aligns with Amazon's stated goals (Vega OS adoption, AI-enhanced viewing via
     Alexa+, ads/engagement, the Appstore ecosystem)? Cite Amazon sources.
   - Can the TV form factor solve it better than a phone? If a phone app wins, fail.
   - Can a demo-ready version be built on Fire OS/Vega within {{TIME_LEFT}}?
   - Would a judge classify it as OBVIOUS or CREATIVE per the track rubric?

5. IS IT URGENT? Why now?
   - Technology unlocks in 2025–2026 (Vega OS, Alexa+ on TV, on-device AI, LLM
     cost curves)
   - Market shifts (ad-supported tiers, sports rights moving to streaming, churn
     pressure, the connected-fitness shakeout)
   - Consequence of waiting: is a competitor or platform owner about to close the gap?
   - Pass bar: a dated catalyst within the last 18 months

Step A2 — Output a PROBLEM SCORECARD table:
| # | Problem statement | Real | Large | Significant | Relevant | Urgent | Total /25 | Key evidence | Biggest doubt |
Rank the candidates. Pick the top problem (and one runner-up). Explain the pick in
3 sentences, name the strongest counterargument, and say what evidence would change
the pick.

---

# PART B — SOLUTION (Pixar "Three Pitches" rule)

Do not settle for the first idea. For the chosen problem, develop THREE pitches that
are meaningfully different from each other. Each pitch must differ from the others
on at least TWO of these axes:
- Who: primary user (e.g. the parent vs. the child vs. the whole household)
- How: core mechanism (AI recommendation vs. computer vision vs. voice/multi-modal
  vs. social/second-screen)
- Where: device scope (Fire TV only vs. Fire TV + Alexa+ vs. Fire TV + Ring/Bee/phone)
- Model: business model (paid app vs. freemium vs. ad-supported vs. B2B2C
  through brands or leagues)

Pitch archetypes to force spread:
- Pitch 1 — "The Safe Bet": the most direct, highly buildable solution that still
  clears the CREATIVE bar
- Pitch 2 — "The Platform Play": the one most aligned with Amazon's strategy
  (Vega + Alexa+ + cross-device ambient experience)
- Pitch 3 — "The Wild Card": a surprising reframe of the problem that a judge
  hasn't seen

For EACH pitch provide:
- Name + one-line pitch ("For <ICP> who <problem>, <name> is a <category> that
  <key benefit>. Unlike <alternative>, it <differentiator>.")
- The hero moment: the first 30 seconds of the demo video, shot by shot
- User flow: 3–6 steps, written for a 10-foot UI with D-pad and voice
- Tech stack and required hooks: Fire OS or Vega; which Amazon SDKs/APIs; optional
  AWS services (Bedrock, AgentCore, Strands, Kiro/Kiro Crew) for the AWS Builder
  mini challenge; whether an open-source component can be spun out for the Open
  Source mini challenge
- Scope as components (no time estimates): must-have for the demo vs. cut list
- OBVIOUS vs CREATIVE self-check against the judges' examples
- Top 3 risks, including any case where AI makes it slower, flakier, or less
  trustworthy than a non-AI version
- Evidence it would work: analogous products, studies, adoption data

Then output a PITCH COMPARISON MATRIX (score 1–5):
| Pitch | Tech Implementation | Design | Potential Impact | Quality of Idea | Buildability | Strategic fit with Amazon | Friction-log potential | Total |
Recommend one pitch. State why in one sentence, defend it, name the strongest
counterargument, and say what would flip the recommendation.

---

# PART C — VALUE (market value + business value)

Complete this for the recommended pitch. Add short notes on the other two.

C1. IDEAL CUSTOMER PROFILE (ICP)
- Primary ICP: demographics, household composition, devices owned, streaming
  subscriptions, income band
- Psychographics and jobs-to-be-done (functional, emotional, social)
- Trigger events that make them look for a solution now
- Where they hang out (channels, communities, influencers)
- Willingness to pay: comparable price points, with sources
- Secondary ICP and anti-ICP (who this is NOT for)
- If B2B2C (leagues, fitness brands, content owners, advertisers): a buyer persona
  with budget owner and buying process

C2. COMPETITIVE MARKET ANALYSIS
- Direct competitors: apps doing the same job on Fire TV, Roku, Apple TV,
  Google TV / Android TV, Samsung Tizen, LG webOS
- Indirect competitors and substitutes: phone apps, connected hardware (Peloton,
  Tonal, Mirror-style devices), built-in platform features (Alexa+, Google TV AI,
  Apple), YouTube
- Status quo: what users do today with no product
- Competitor table:
  | Competitor | Platform(s) | Offer | Price | Est. users/revenue (sourced) | Strengths | Weaknesses | Recent moves |
- Platform-owner risk: could Amazon (or Google or Apple) build this natively? How
  does the pitch survive that, or benefit from it?
- A 2×2 positioning map (choose axes that reveal white space) and the chosen white space
- Moat candidates: data, household personalisation, content partnerships,
  community, switching costs

C3. MARKET SIZING — TAM / SAM / SOM
Do BOTH approaches, then reconcile them:
- Top-down: total market (e.g. connected-fitness, streaming-discovery, sports-streaming,
  kids edutainment spend), narrowed to smart-TV/streaming-device users, then to
  Fire TV. Cite each layer.
- Bottom-up: reachable Fire TV users × adoption rate × ARPU (or ad eCPM × sessions).
  State every assumption and label it [FACT] or [INFERENCE].
- TAM = total demand for the job; SAM = what's reachable on Fire TV (and similar
  platforms if cross-platform) in the launch geography; SOM = a realistic 3-year
  capture with a named rationale (comparable app adoption curves).
- Present as a table with formulas. If a layer is unsourced, mark DATA GAP. Do not
  plug in a guess.
- Philippines/SEA flag: note whether Fire TV availability and the market differ enough
  to matter.

C4. BUSINESS VALUE
- For the end user: the measurable outcome (time saved, workouts done, satisfaction)
- For Amazon: which stated goals it advances (Vega adoption, Alexa+ engagement,
  Appstore health, ads inventory, device stickiness). Cite Amazon sources.
- For AWS (if used): the showcase value of the architecture
- Revenue model options: paid, subscription, IAP (via Amazon Appstore IAP),
  ad-supported, sponsorship, B2B licensing. Include Appstore revenue share (VERIFY
  the current terms).
- Unit economics sketch: ARPU, CAC channels, gross-margin drivers (LLM inference
  cost per session, video/CV compute). Show the inputs; mark any gaps.
- Go-to-market: Appstore discovery, Fire TV sponsored tiles, partnerships,
  communities. What is the first 1,000 users plan?
- Risks and mitigations: platform, privacy (COPPA, camera/biometric data), content
  rights, AI accuracy, retention
- Kill criteria: what signal in the first 90 days after launch would show this is
  not worth continuing?

C5. VALIDATION PLAN (cheap, fast, before or right after the hackathon)
- 3 riskiest assumptions, ranked
- For each: a test (interviews, landing page, Reddit post, fake-door, prototype
  usability test), a success threshold, and a source of participants
- 5 customer interview questions (non-leading, focused on past behaviour)

---

# PART D — HACKATHON FIT CHECK
- Mapping to each judging criterion: what in the build or demo earns a 5/5?
- Mini challenge double-dips: AWS Builder (which AWS service does something real)
  and Open Source (what component can be released under an OSS license)
- Friction-log opportunities: which Amazon tools (Vega SDK, Amazon Devices Builder
  Tools MCP, simulator) are young enough to produce valuable feedback
- Submission red flags to avoid: missing on-device demo, a video over 3 minutes,
  copyrighted footage in the demo, missing setup instructions

# OUTPUT FORMAT
Return a single Markdown report with exactly these sections:
0. Executive summary (≤ 12 bullets: chosen problem, recommended pitch, ICP,
   TAM/SAM/SOM headline, top risk, confidence level)
1. Problem candidates and scorecard
2. Deep dive: the chosen problem (the 5 tests with evidence)
3. Three pitches + comparison matrix + recommendation
4. ICP
5. Competitive analysis (table + positioning map description)
6. TAM / SAM / SOM (table with formulas)
7. Business value, revenue model, unit economics, GTM
8. Risks, kill criteria, validation plan
9. Hackathon fit check
10. DATA GAPS and UNRESOLVED conflicts (consolidated list)
11. Sources (numbered, with tier, date, URL)

Style: tables over prose, specific over vague, and no filler. Keep evidence and
judgment clearly separated. When confidence is low, say so. For any legal point,
add: "Regulatory awareness only — not legal advice. Consult a licensed attorney
in the relevant jurisdiction (Philippines and U.S.)."
````
