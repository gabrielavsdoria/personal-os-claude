# Case study · A personal operations system run with AI agents

**English** · [Português](case-study.pt-BR.md)

> I designed and operate a personal operations system: specialized AI agents (Claude skills), Google Apps Script automations and a database of the system's own parts, with governance rules so it stays reliable as it grows. This is the story of how it works and what it produced in its first month.

---

## 1. Problem

In October 2026 I was an environmental engineering student juggling, at the same time, classes with materials spread across Moodle, Google Classroom and email; 12+ internship hiring processes on different portals, each with its own stages and deadlines; a university extension project; and the usual personal commitments.

Each task was doable. The bottleneck was **coordination**: knowing what was due first, where each file lived, what to prioritize, and not letting things fall between tools. I also wanted support for executive functions (planning, starting, staying focused) that didn't depend on willpower.

A first attempt, letting AI help ad hoc in separate chats, created a new problem: rules repeated in many places drifted apart, scheduled jobs failed silently when they needed a login, and nobody (including me) could say what the system was made of.

## 2. Design

Four layers, each with a clear job ([architecture](architecture.md)):

| Layer | What it is | Example |
|---|---|---|
| **Sources** | where information is born | Gmail, Google Calendar (8 calendars by life area), Drive in a Johnny Decimal structure, Moodle, job portals |
| **Agents** | Claude skills with one responsibility each, plus Apps Script for deterministic work | internship radar, hiring-stage prep, morning brief, weekly plan, file clean-up; hourly calendar watcher, Gmail module |
| **Governance** | what keeps the system coherent | System Map database, system log, single-source rules with version stamps, dated principles, decision records |
| **Outputs** | what reaches me | a priority queue, 25-minute focus blocks on the calendar, prep docs, a daily dashboard |

Three design choices shaped everything else:

1. **Agents propose, I validate.** Every block an agent creates lands on a separate "suggestions" calendar with no color. It only becomes a real commitment after I accept it ([decision 0002](decisions/0002-sugestoes-em-agenda-separada.md)). No agent sends email, applies to a job or deletes a file on its own.
2. **One fact, one place.** Each piece of data has exactly one owner: the radar skill is the only writer of the priority sheet; the morning brief only reads it. Rules that must appear in several places carry a version stamp (e.g. `⟦CORES 2026-10-27⟧`) and the Map lists every place a rule appears, so they are updated together.
3. **Use AI only where judgment is needed.** Anything that runs every hour or every week without me looking moved to Apps Script, which costs no AI tokens ([P1, P2](principles.md)). Scheduled AI tasks only trigger a skill; the procedure lives in the skill, in one place ([decision 0003](decisions/0003-tarefa-agendada-so-roda-skill.md)).

## 3. How a day and a week work

**A weekday**
- **6:00** · The morning brief reads every calendar, the last 24 hours of email and the priority queue, then publishes a dashboard and sends a 5–7 line message. It always opens with one concrete two-minute first step ("open the portal email from 09/08 and click View details"), never a to-do list.
- **During the day** · I work in 25-minute blocks, one focus each, with the first step written in the event. The career total is capped at 2 hours per weekday.
- **Every hour** · The calendar watcher (Apps Script) puts each new event in the right calendar and color based on its title.
- **End of every chat** · The `encerrar-chat` skill logs at most 5 decision lines, updates the parts that changed in the Map and hands me a ready-to-paste prompt for the next task.

**A week**
- **Sunday 16:00** · Apps Script records the Drive folder tree.
- **Sunday 17:00** · Quick file clean-up: the agent proposes moves and deletions; nothing happens before my OK.
- **Sunday 18:00** · The weekly plan triages the calendar (expired suggestions are rescheduled or removed, and every missed one is logged to find patterns), then proposes the next two weeks. Events are created only after I approve.
- **Sunday and Wednesday** · The internship radar sweeps portals and email, re-scores each process (0–100) and proposes at most 3 new applications per week ([decision 0001](decisions/0001-prazo-fora-da-nota.md)).
- **Before each hiring stage** · The prep skill researches company, market and people with sources, builds a block-by-block plan and a focus page, and afterwards logs what I learned.

## 4. Governance

| Mechanism | What it does |
|---|---|
| **System Map** | A database of every part of the system (skills, tasks, scripts, docs, pages) with owner, status, parent and pending items. Nothing is deleted: retired parts keep their history. Writes use version checks. [Schema](../templates/mapa-schema.md) |
| **Change log** | One entry per change, linked to the chat that made it and the parts it affects. |
| **System log (Diário)** | At most 5 decision lines per conversation, append-only; a correction is a new line. Every Sunday the new lines are folded into the system record. [Format](../templates/diario-linha.md) |
| **Proposals with a mini-PRD** | Every improvement idea gets: why, done-when, reversible?, risk. Status goes from idea to in use. |
| **Dated principles** | 45 rules that guide other decisions, each with the date and the problem it came from. [Selection](principles.md) |
| **Versioned skills** | Every skill carries a version and what changed. One chat at a time edits a skill or a scheduled task, always starting from the current version. |
| **Research before building** | Before implementing a proposal, check current external sources and say what changed. The personal app was chosen after reviewing 115 sources and scoring 5 options ([decision 0004](decisions/0004-app-em-apps-script.md)). |
| **Security from day one** | Simulate before executing; never delete events, emails or files; agents never type passwords (expired login or captcha = skip and report); no secrets in code; health data never reaches a published page. |

## 5. Results (October 2026)

All numbers were counted on Oct 29, 2026, from the System Map database and the execution logs. None are estimates.

| What | Count | Source |
|---|---|---|
| Parts registered in the System Map | **275** (52 Drive docs, 43 Markdown files, 39 ideas, 30 groups, 25 pages, 24 skills incl. retired and planned, 21 work fronts, 15 scripts, 10 projects, 5 docs, 4 routines, 4 scheduled tasks (2 active), 2 sheets, 1 root); 11 flagged sensitive | Map, `pecas` |
| Changes logged | **252** between Oct 5 and Oct 27 (134 on Oct 22, the day the Map moved to a database) | Map, `log` |
| Improvement proposals, each with a mini-PRD | **101** (25 idea, 21 proposed, 19 in progress, 20 in use, 11 done, 5 decided) | Map, `propostas` |
| Dated design principles | **45** | system record |
| Active custom skills | **16**, ≈2,675 lines of instructions in total | skill files |
| Iterations of key skills | Moodle collection: 13 versions in the Map · exam study plan: v4 · internship radar: v5 · chat close-out: v5 | Map and skill headers |
| Calendar events reorganized by the scripts | batch 1: 47 + 5 (Oct 21) · batch 2: more than 200 | Apps Script log |
| Emails archived on the Gmail module's first run | **273**, with 7 labels (nothing sent, forwarded or deleted) | Apps Script log |
| Course files renamed to the naming standard | **163** (Oct 13) | Moodle manifest |
| Drive folders recorded in the tree | **160** (Oct 21) | Apps Script log |
| Hiring processes ranked on the radar's first run | **12** | radar sheet |
| Personal app decision | **115** sources reviewed; 5 options scored (Apps Script web app 25, AppSheet 23, local PWA 23, Firebase 19, Claude page 16) | decision 0004 |

Timeline: AI-assisted Drive organization since Sep 2026 · system log since Oct 5 · Map as a database since Oct 21.

## 6. What I learned

- **Good agents have small scopes.** Each skill owns one responsibility and reads the others as sources instead of copying their rules. Changing a rule means changing one place.
- **Data needs an owner.** One writer per place prevents two versions of the truth.
- **Automation can overload too.** The sheet holds the backlog; the calendar shows little. Limits (3 applications a week, 2 hours of career work a day) protect time instead of just organizing it.
- **Scheduled jobs and logins don't mix.** Jobs that needed a login or a computer turned on failed silently. They became on-demand skills, and only cloud-only work stays scheduled (P1).
- **An unused report is a cost.** Automations that spent tokens without anyone using the result were removed or moved to Apps Script (P2).
- **Governance pays for itself early.** With the Map and the log, a change to the color rule reached every place it appears at once, and the version stamp showed which copies were still behind.

Tool-level lessons (connector limits, API quirks): [lessons.md](lessons.md).

## 7. Next steps

- **Install the personal app** (v0.2, already reviewed for security): a phone screen to accept, reject or move agent suggestions without opening a chat, starting in simulation mode for a week.
- Switch the calendar watcher from "warn" to "fix" once the warnings under the new color rule are checked.
- Seven more Apps Script automations are drafted (time spent per life area, exams without a review block, daily backup of the system's spreadsheets), all with a simulation mode, none installed yet.

---

Built by [Gabriela Dória](https://github.com/gabrielavsdoria) · Environmental Engineering, Poli-USP
