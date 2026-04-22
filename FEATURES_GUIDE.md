# `FEATURES_GUIDE.md`

```md
# PAAC Features Guide

**Policy-Aware Agent Console**  
User guide for the current prototype

## What PAAC is

PAAC is a prototype trust interface for enterprise AI agents.

It focuses on:
- showing what an agent is doing
- showing what it is allowed to do
- explaining why a runtime decision was made

The current demo is centered on **runtime governance**, not on general chat UX.

## The 4 main screens

### 1. Runtime
Purpose:
- run a seeded scenario
- evaluate an action request
- show allow/block/require approval

What to look at:
- selected scenario
- action request payload
- execution timeline
- matched policies
- risk flags
- latency
- persona-specific explanation

### 2. Agents
Purpose:
- show live inventory of seeded agents
- show tools, owner team, risk tier, and latest event

What to look at:
- which agents exist
- what tools they are allowed to use
- which agents are high-risk

### 3. Policies
Purpose:
- show policy library for the demo
- explain example decision context

What to look at:
- allow/block/require approval
- policy definition
- example decision context fields such as requester, tool, target resource, data class, purpose, environment, and destination

### 4. Audit
Purpose:
- show decision provenance
- show what the runtime layer decided and why

What to look at:
- latest trace
- matched policies
- risk flags
- latency
- decision reason

## How the features connect

PAAC works best when the screens are used together:

- **Runtime** creates a decision
- **Policies** explains the rule behind it
- **Agents** shows which agent was involved
- **Audit** records the result for review

This is the main story of the prototype.

## View modes

The UI supports:
- Engineering
- Security
- Compliance
- Operator

These modes change the explanation emphasis, not the backend decision.

## Themes

The current demo includes:
- Light
- Dark
- High-contrast

## Current UX/UI progress

Implemented:
- multi-screen layout
- grid and single view
- persona tabs
- theme switching
- backend-connected Runtime/Agents/Policies/Audit
- runtime action display
- decision explanation

Still rough:
- some content is seeded/static
- some layouts need polish for long values
- no real-time updates yet
- no advanced policy editing yet

## Current policy/control progress

Implemented:
- action-level decision endpoint
- allow/block/require approval outcomes
- policy matching based on:
  - requester role
  - agent identity
  - tool
  - target resource
  - data classification
  - purpose
  - environment
  - destination
  - baseline behavior
- prompt-injection signal checks
- tool allowlist checks

Not yet implemented:
- multi-step trajectory scoring
- persistent policy editing
- model-backed semantic attack detection
- approval workflow backend
- organization-specific IAM integration

## How to know the demo is successful

A successful demo looks like this:

1. sign in on Runtime
2. run a scenario
3. see the decision update
4. switch to Audit
5. confirm a new latest trace appears

That proves frontend-backend integration is working.

## Accessibility

The current UI includes:
- keyboard-friendly structure
- high-contrast theme
- basic semantic layout
- readable font sizing

This should be described as **accessibility-aware**, not as fully certified compliance.

## Future work

- persistent audit storage
- stronger prompt-injection and context-poisoning detection
- multi-step trajectory evaluation
- real-time streaming updates
- richer policy editing
- organization-specific identity and approval flows
- production-ready auth and deployment