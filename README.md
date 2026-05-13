# Platform Metrics Framework Builder

## What is this?

A browser-based tool that generates a complete metrics framework for any product, powered by Claude. Enter your product context, get a structured framework covering your north star, input metrics, guardrails, and the vanity metrics to avoid.

**Live:** [your-url-here]

---

## Why I built it

Metrics is one of the areas I wanted to get sharper on as a platform PM. Not just knowing the concepts but being able to apply them quickly and articulate the reasoning clearly.

So I did two things. First I studied how metrics frameworks actually work in practice — north star metrics, leading and lagging indicators, guardrail metrics, and metric constellations. Then I built a tool that forces me to apply that thinking to real products.

The process of building it taught me as much as using it. You can't write a good prompt for Claude without understanding what a good metrics framework actually looks like. And you can't evaluate Claude's output without knowing what you're looking for.

---

## How it works

**Six inputs capture the product context that actually determines which metrics matter:**

1. What the product does
2. Who the primary user is — role and context, not a persona
3. What problem it solves — what the user struggles with without it
4. Product stage — because early stage products need different metrics than mature ones
5. Business model — because free tools measure different things than subscription platforms

**The output covers five layers of a complete metrics framework:**

- **North Star** — the one metric that goes up when users get real value
- **Vanity alternative** — the obvious wrong choice, and why it misleads
- **Input metrics** — three leading indicators ranked by criticality
- **Guardrail metric** — what prevents gaming the north star
- **Secondary success metric** — captures users the north star misses
- **Metric constellation** — how all five tell the complete story together

---

## What I learned building this

The hardest part wasn't the codeit was writing a prompt that produced specific frameworks rather than generic ones.
The difference between a vanity metric and a north star is easy to explain but hard to apply consistently. Take a project management tool  "tasks created" goes up every time someone uses the product, but it doesn't tell you whether work actually got done. "Tasks completed by due date" is harder to measure but captures real value. Getting Claude to make that distinction reliably for any product required being precise about what value delivery actually means and that precision is now something I apply when evaluating any product's metrics, not just when using this tool.

---

## Stack

- React
- Anthropic Claude API
- Google Fonts — DM Sans, DM Serif Display, DM Mono

---

## Run Locally

```bash
git clone https://github.com/yourusername/metrics-framework-builder
cd metrics-framework-builder
npm install
npm run dev
```

---

*Built as a portfolio project. Part of a broader body of work on platform PM thinking — including platform teardowns of Stripe and Amazon Seller Central.*
