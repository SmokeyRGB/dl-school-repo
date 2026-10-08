# Check-in 2 – Flatmate.io – transcript (DRAFT 2, based on the German walkthrough)
---

## PART 1 – DEMO (≈ 3:15)

**[Login page]**
Hi everyone. Today I'm showing my MVP of Flatmate.io.
It's a casting app for bigger households. Think shared apartments with five or more people, or living projects.
It makes finding a new flatmate easier.

I'm on the login page. You can log in as the household, or as a resident.
The household sets everything up: it manages residents, round settings and so on.
But for the demo I'll be a resident - A new flatmate who just moved in and has to vote in a new round.

**[Join link]**
For that I get a join link from the household.
You can see my name already, because the household prepared my profile.
So I only need a password. [type password]
Email is optional. I joined through the link, so I don't need it - I decided against mail verification to maximize streamlined onboarding.
Providing an email is just handy later, to reset my password, or log in without the household code.

**[Dashboard → screening]**
Now I'm on the dashboard. It says: please vote in the current round, the autumn round.
Five applications are waiting for me.
This is the core screen. For every applicant I say how I feel:
definitely, good, rather not, or absolutely not.
[rate the cards, keep talking short]
Important: I can only see the ranking after I voted. That's on purpose. It's the reward for taking part.

**[Ranking]**
And here's the ranking. Every applicant has a score.
Two rooms are free, so the top two are highlighted. Those are the people who could move in.
[click "(?)"]
Here I can see how a score is calculated.
What my own vote counted for, and how many votes are needed before a score shows up at all.
Down here: not enough people voted for Ahmed, so he has no score yet.
Otherwise one single vote of "definitely" would give him 100 percent. That would be misleading.
The household can set how many votes are needed.

**[Moderator view]**
For the demo, I'll make myself a moderator now.
[reload]
After a reload there's a new "invite" button.
It gives me a ready-made text that I can copy and send to the applicant.
I'd ask when they have time for a meeting in person.

**[OPTIONAL – add application]**
[OPTIONAL] New applications go in under "Organization", in the current round.
Right now you type them in as free text.

**[Not in the MVP / next]**
What's coming next: scheduling inside the app.
Everyone in the flat enters their free time slots, and the app helps to find a date.
Also: the free text will be parsed automatically, so name and details are filled in for you.
And one rule from day one: no AI decides about people. AI may only help to structure text.

---

## PART 2 – WORKFLOW (≈ 1:00)

So, that's the application. Let me briefly explain how I built it.

I started with a specification and then worked my way through the project in vertical slices, using OpenSpec together with Claude Code.

Opus handles the planning, Sonnet subagents implement parts of it, and then I go through the code with additional reviews, including Copilot.

Before every push i ran a pre push gate with npm run verify that caught quite a few things that both the AI and I had missed.

There were also two main things where I lost a lot of time.

### The first was the way I handled my specifications.

I started with a very rigid spec process and wrote about 146,000 words of documentation before I had my first line of code.
Looking back, I would have started with less and worked my way forward with living specifications.
Some decisions turned out to be impractical once I actually implemented them. Changing those decisions then meant going back through a lot of documentation.
I also kept older specifications around as legacy documents and wrote newer decisions on top of them.
The problem was that the AI could still find the old versions and sometimes followed them, even when a newer decision contradicted them.
It would then try to combine both versions, which created even more complexity and back and forth.
Next time, I'd rather refactor the specifications themselves and keep them as the current source of truth. I'd use a separate document to log what changed, while Git keeps the actual history.

### The second problem was how I handled bugs found during reviews at the first days of implementation.
If a reviewer found one specific bug, I usually fixed that bug. I didn't always stop and ask how that bug came to live and how to avoid it in the future.
I eventually created an implementation-hazards file that the AI reads at the start of every session, and where it logs findings.
That helped a lot.

### The third problem was my specifications.
I kept older specifications around as legacy documents and wrote newer decisions on top of them.
The problem was that the AI could still find the old version and sometimes followed it, even when a newer decision contradicted it.
It would then try to combine both versions, which created even more complexity and back and forth.
Next time, I'd rather refactor old specifications, keeping them as source of truth and logging my changes in a different document.

Thank you. Questions?

---

## IF SOMETHING BREAKS
"This should show the ranking. It failed because the demo database is slow, or the seed state changed. Here's a screenshot of that step." → switch to fallback, carry on.

---

## WHAT I CHANGED vs. DRAFT 1 (and why)
- Audience now "bigger households, 5+ people / living projects" (your words).
- Entry is the login page with the household/resident choice, then the prepared join link (name pre-filled, password only). Draft 1 had a blank join form.
- 5 applications (as in your walkthrough), not 6.
- Added: what "(?)" shows (your vote's points, votes needed), why Ahmed has no score (100 % from one vote is misleading), household sets the threshold.
- Added: invite button gives a copy-ready text; add application via Organization.
- Roadmap now matches your own: timetable/scheduling, automatic text parsing.
- Cut / softened: the "who lives here" screen, the more formal "key decision" wording. Dropped fillers ("so", "basically") and long sentences.
