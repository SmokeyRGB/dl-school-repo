# Check-in 2 – Flatmate.io – transcript (DRAFT 2, based on the German walkthrough)
---

## PART 1 – DEMO (≈ 3:15)

**[Login page]**
Hi everyone. Today I'm showing my MVP of Flatmate.io.
It's a casting app for bigger households. Think shared apartments with five or more people, or living projects.
It makes finding a new flatmate easier and fairer for everyone involved.

Right now, I'm on the login page. You can log in as the household, or as a resident.
The household account is for setting everything up: it manages residents, round settings and so on.
But for the demo this is already done and I'll be a new flatmate who never used the app before and has to vote in a casting round in progress.

**[Join link]**
For that I alredy got a join link from my flatmates, that I'll just paste here.
You can see my name already, because the household prepared my profile for me - otherwise it would just inform me what household i'm joining.
I only need a password. [type password] Email is optional. I joined through the link, so I don't need it - 
I decided against mail verification to maximize streamlined onboarding.
Providing an email is just handy later, to reset my password, or log in without the household code.

**[Dashboard → screening]**
Now I'm on the dashboard. It says: please vote in the current round, the autumn round.
There are applications waiting for me to vote for.
This is the core screen. For every applicant I say how I feel:
definitely, good, rather not, or absolutely not.
[rate the cards, keep talking short]
Important: I can only see the ranking after I voted. That's on purpose. It's the reward for taking part - also to avoid being group pressured on my decision.

**[Ranking]**
And here's the ranking. Every applicant has a score.
Two rooms are free, so the top two are highlighted. Those are the people who could move in.
[click "(?)"]
Here I can see how a score is calculated to understand how my voting is weighted in & what the rules of the household are.
Down here: not enough people voted for Ahmed, so he has no score yet.
Otherwise one single vote of "definitely" would give him 100 percent. That would be misleading.
The household can set in their settings how many votes are needed.

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

I worked from specifications in vertical slices, using OpenSpec. Opus handles planning, Sonnet subagents implement, and I review the results with Copilot and my own checks.

Before every push, I ran `npm run verify`. It checks types, tests and custom lints, and caught quite a few things that both the AI and I missed.

Where I lost the most time was the specification process.

I wrote around 146,000 words before my first line of code. Some decisions turned out to be impractical, and changing them meant updating a lot of documentation.

I also kept old specs as legacy. The AI sometimes followed those even when newer decisions contradicted them, and tried to combine both versions.

Next time, I'd keep one current source of truth and let Git handle the history.

I also learned to document recurring bugs and their causes in hazard files, rather than just fixing individual instances.

If you have any additional questions i'm happy to answer them / show you more of the app.


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
