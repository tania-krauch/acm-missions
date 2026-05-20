# Web Game Proposal Template (Guideline Format)

Use this template to prepare your group project proposal in the required six-section format.

---

## Proposal Header

| Field | Value |
|---|---|
| Project Title | [Insert title] |
| Course / Section | [Insert course] |
| Group Number | [Insert group no.] |
| Submission Date | [YYYY-MM-DD] |
| Proposal Version | [v0.1 / v1.0] |

---

## 1) Background, Objective, and Brief Literature Review

### 1.1 Background

[Explain the context of the problem, current situation, and why this game/product is relevant.]

### 1.2 Objective

| Objective Type | Statement |
|---|---|
| General Objective | [Main goal of the project] |
| Specific Objective 1 | [Measurable objective] |
| Specific Objective 2 | [Measurable objective] |
| Specific Objective 3 | [Measurable objective] |

### 1.3 Brief Literature Review (If Necessary)

| Source / Existing Game / Paper | Key Finding | Relevance to Project |
|---|---|---|
| [Reference 1] | [Summary] | [How it informs design] |
| [Reference 2] | [Summary] | [How it informs design] |
| [Reference 3] | [Summary] | [How it informs design] |

---

## 2) Proposed System and Its Functionality

> Most important section: describe target product functionality as precisely as possible.

### 2.1 System Overview

[Describe what the proposed web game system does end-to-end.]

### 2.2 Functional Scope

| Module | Description | Inputs | Outputs | Rules / Constraints |
|---|---|---|---|---|
| [Module 1] | [What it does] | [Input data] | [Output/result] | [Validation/business rules] |
| [Module 2] | [What it does] | [Input data] | [Output/result] | [Validation/business rules] |
| [Module 3] | [What it does] | [Input data] | [Output/result] | [Validation/business rules] |
| [Module 4] | [What it does] | [Input data] | [Output/result] | [Validation/business rules] |

### 2.3 Core Use Cases

| Actor | Use Case | Precondition | Main Flow | Postcondition |
|---|---|---|---|---|
| [Player] | [Ex: Start Match] | [Condition before action] | [Step-by-step flow] | [State after action] |
| [Player] | [Ex: Build/Upgrade] | [Condition before action] | [Step-by-step flow] | [State after action] |
| [Admin/System] | [Ex: Matchmaking/Monitoring] | [Condition before action] | [Step-by-step flow] | [State after action] |

### 2.4 Non-Functional Requirements

| Category | Target |
|---|---|
| Performance | [Ex: 60 FPS client, sub-150 ms action handling] |
| Reliability | [Ex: reconnect and state recovery support] |
| Security | [Ex: authenticated actions, server validation] |
| Scalability | [Expected concurrent users/sessions] |
| Usability | [Ex: intuitive controls, short onboarding] |

### 2.5 Block Diagram (If Necessary)

Paste or draw a diagram here.

```text
[Client UI] --> [Game Client Logic] --> [API/Socket Layer] --> [Game Server]
									   |                     |
									   v                     v
								   [Auth Service]        [Database]
```

### 2.6 Detailed Functional Notes

[Add precise behavior descriptions, edge cases, validations, and expected outputs per feature.]

---

## 3) Programming Language, Operating Systems, and Required Resources

### 3.1 Software Stack

| Category | Choice | Version | Purpose |
|---|---|---|---|
| Programming Language(s) | [TypeScript / JavaScript / etc.] | [Version] | [What it is used for] |
| Frontend Framework/Engine | [Phaser / React / etc.] | [Version] | [What it is used for] |
| Backend Runtime/Framework | [Node.js / Express / etc.] | [Version] | [What it is used for] |
| Database | [MongoDB / PostgreSQL / etc.] | [Version] | [What it is used for] |
| Other Tools | [Git / Vite / testing tools] | [Version] | [What it is used for] |

### 3.2 Operating Systems

| Use | Operating System |
|---|---|
| Development Environment | [Windows / Linux / macOS] |
| Deployment/Hosting Environment | [Linux / cloud image] |
| Target End-User Platform | [Web browser on desktop/mobile] |

### 3.3 Hardware Requirements

| Hardware Type | Minimum Requirement | Recommended |
|---|---|---|
| Developer Machine | [CPU/RAM/Storage] | [CPU/RAM/Storage] |
| Server | [CPU/RAM/Network] | [CPU/RAM/Network] |
| Test Devices | [Desktop/mobile specs] | [Desktop/mobile specs] |

---

## 4) Group Details and Member Responsibilities

| Member Name | Student ID | Role | Main Responsibilities | Deliverables |
|---|---|---|---|---|
| [Lucas Carpenter] | [luccarpe] | [Asset Developer, Audio, Writer, Software Engineer] | [Create and Leicense Assets for developer use, write UX, Tie up loose ends and aid the software engineers. ] | [Audio Mix's + Sound Effect Folder made from SDS SRS documents] |
| [Tania Krauchonak ] | [tkrauch] | [Asset Developer, Writer, Development Lead] | [Responsibility details] | [Expected outputs] |
| [Le Li Kruczek] | [lkruczek] | [Software Engineer] | [Responsibility details] | [Expected outputs] |
| [Member 4] | [ID] | [Role] | [Software Engineer] | [Expected outputs] |

### Collaboration Rules

- [Rule 1: coding/review workflow]
- [Rule 2: communication channel and response time]
- [Rule 3: conflict resolution / escalation]

---

## 5) Mutually Accepted Group Meeting Schedule

| Meeting Type | Day | Time | Duration | Platform / Place | Agenda Owner |
|---|---|---|---|---|---|
| Weekly Planning | [Day] | [Time] | [Duration] | [Online/Room] | [Name] |
| Midweek Checkpoint | [Day] | [Time] | [Duration] | [Online/Room] | [Name] |
| Review and Retrospective | [Day] | [Time] | [Duration] | [Online/Room] | [Name] |

### Attendance and Decision Policy

- Quorum for decisions: [Ex: at least 75% of members]
- Late or absent protocol: [Policy]
- Decision method: [Consensus / Majority vote]

---

## 6) Project Schedule (If Necessary)

### 6.1 Milestone Plan

| Milestone | Date Range | Tasks Included | Owner(s) | Output |
|---|---|---|---|---|
| Requirements Finalization | [Start-End] | [Task list] | [Name(s)] | [Artifact] |
| System Design | [Start-End] | [Task list] | [Name(s)] | [Artifact] |
| Implementation Sprint 1 | [Start-End] | [Task list] | [Name(s)] | [Artifact] |
| Implementation Sprint 2 | [Start-End] | [Task list] | [Name(s)] | [Artifact] |
| Testing and QA | [Start-End] | [Task list] | [Name(s)] | [Artifact] |
| Final Documentation and Demo | [Start-End] | [Task list] | [Name(s)] | [Artifact] |

### 6.2 Weekly Breakdown (Optional)

| Week | Planned Work | Deliverable |
|---|---|---|
| Week 1 | [Plan] | [Deliverable] |
| Week 2 | [Plan] | [Deliverable] |
| Week 3 | [Plan] | [Deliverable] |
| Week 4 | [Plan] | [Deliverable] |
| Week 5 | [Plan] | [Deliverable] |

### 6.3 Risks to Schedule

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| [Risk 1] | [Low/Med/High] | [Low/Med/High] | [Plan] |
| [Risk 2] | [Low/Med/High] | [Low/Med/High] | [Plan] |

---

## Sign-Off

| Name | Role | Signature | Date |
|---|---|---|---|
| [Member / Lead] | [Role] | [Sign] | [YYYY-MM-DD] |
| [Member / Lead] | [Role] | [Sign] | [YYYY-MM-DD] |
| [Adviser / Instructor if required] | [Role] | [Sign] | [YYYY-MM-DD] |
