---
title: "Argus Panoptes Chatbot"
summary: "An autonomous Slack agent that turns robotics APIs, scouting data, and match logs into searchable analysis and useful graphics."
category: "AI | Data | Robotics Strategy"
group: "project"
period: "FIRST Robotics Competition Team 2590 | 2026"
date: 2026-06-01
image: "/images/project-placeholder.svg"
media:
  - src: "media/Argus1.jpg"
    fit: "contain"
    alt: "Argus Panoptes chatbot interface in Slack"
    caption: "Argus delivers scouting and match insights inside the team’s existing Slack workflow."
  - src: "media/Argus2.jpg"
    alt: "2026 Innovation in Control Award"
    caption: "Innovation in Control recognition for the autonomous systems and analytics work behind Argus."
---

Argus is an autonomous Slack agent I developed for FIRST Robotics Competition Team 2590. It connects competition APIs, scouting records, match logs, analytical sheets, and generated graphics. The team can move from raw event data to an answer inside Slack.

The system combines Python API integrations, the Nanobot framework, and a MiniMax language model. Argus gathers current data, runs the right scraper or workflow, formats the result, and returns a concise analysis through Slack.

## Technical architecture

- **Data acquisition:** Built Python API scrapers for scouting information, match results, event context, and team records.
- **Workflow automation:** Connected custom GitHub workflows to scheduled or event-driven jobs. This reduced the manual work needed to move new match data into the analysis pipeline.
- **AI orchestration:** Integrated Nanobot and MiniMax LLM tooling to interpret requests, select data operations, and turn structured results into Slack responses.
- **Analytics delivery:** Sent scouting data and match logs to analytical sheets and generated graphics for quick comparison during competitions.
- **Team interface:** Designed Argus for Slack so scouting, software, drive team, and strategy members could query shared information without switching dashboards.
- **Reliability and iteration:** Used repeatable GitHub workflows and API steps to rerun, debug, and extend the pipeline as the team's needs changed.

## Strategy impact

Argus connected technical infrastructure to match decisions. The team could ask for information in Slack and receive analysis in the same channel where strategy was discussed. This shortened the path from data collection to alliance evaluation, match preparation, and post-match review.

The project also taught me how to design AI around constrained, domain-specific data. I had to choose when to use deterministic API logic, when to invoke language-model reasoning, how to preserve structured facts, and how to state uncertainty clearly.

## What I built

- Python API scrapers for scouting, event, and match data
- Nanobot and MiniMax integration for autonomous Slack workflows
- Custom GitHub Actions for repeatable data collection and processing
- Automated pipelines into Google Sheets and analytical graphics
- Conversational retrieval of competition intelligence for scouting and strategy
- A maintainable bridge between robotics data infrastructure and real-time team decisions
