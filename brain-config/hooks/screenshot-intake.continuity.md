# Screenshot Intake · Continuity — pickup, subject threads, future correlation

**Purpose:** Make a multi-pass screenshot job survivable across sessions, connect clusters that are the same project weeks apart, and stop the backlog from ever rebuilding.

**Steward:** Fleet Felix (inherited). **Established 2026-08-04**, Michael's direction, in the same breath as the first live run.

---

## 1 · THE PICKUP CONTRACT (Michael, 2026-08-04)

> *"At the end of all your replies, you give me the link to the task that I can open and just say 'pick this up,' and expect the agent to just get it."*

**Every reply during a multi-pass job ends with the session task link.** No exceptions, including replies that are pure conversation. A link Michael has to scroll for is a link he will not use.

<p></p>

**"Pick this up" is a CONTRACT, and the burden is on the parked task, never on the returning agent.** A cold agent opening that task must be able to run without asking a single orienting question. That means the description carries, at all times:

1. **The runbook path** — `hooks/screenshot-intake.md` + the report spec + this file. Named, not implied.
2. **The full immutable skeleton** — every cluster id, span, count, shape, and worked/not-worked state. **Never recomputed.**
3. **The exact next move**, by cluster id. `"Start at C46, work backwards to C30, budget 40 opens."` A handoff that says *continue* is not a handoff.
4. **Every open ruling Michael owes**, listed. A cold agent must not silently re-decide something that was parked as a question.
5. **Any live blocker**, with a pointer. See `screenshot-intake.BLOCKER.md`.

<p></p>

**Update the task BEFORE the reply, not after.** A parked task that lags the conversation by one turn is a task that hands the next agent a stale picture — and the returning agent has no way to know it is stale.

<p></p>

**Bogging down is EXPECTED, not a failure.** The correct end of a heavy pass is: stop on a cluster boundary → update the task → post the link → say plainly that you thinned out. **A session that quietly pushes past its capacity produces a worse artifact than one that stops early and says so.**

---

## 2 · SUBJECT THREADS — clustering across time, not just within it (Michael, 2026-08-04)

> *"The clumping scheme should perhaps be agnostic or reverse, trying to connect initial patterns."*

**Time clustering has a blind spot and it is structural: a project worked on three separate nights produces three clusters that the skeleton cannot connect.** Time proximity finds a *session*. It cannot find a *project*.

<p></p>

So after the time skeleton, run a **second, time-agnostic grouping**: which clusters are about the SAME THING, regardless of when.

<p></p>

**Signals for a subject thread, strongest first:**

1. **Confirmed content** across clusters (only available once images are readable).
2. **Workspace correlation collision** — two clusters whose date ranges land on the *same task, doc, Decision Log or repo* are almost certainly one thread. **This works with zero images and is the strongest currently-available signal.**
3. **Rhythm** — same time of day, same weekday, similar burst shape. Weak alone, corroborating in a pile.
4. **File-size regime** — a cluster of 2–6 MB shots among a folder of KB shots is a different capture context. Diagnostic, not decisive.

<p></p>

**Threads are labelled `T<nn>` and listed SEPARATELY from clusters.** A cluster belongs to at most one thread; an unthreaded cluster is normal and gets no apology. **Threads never renumber clusters** and never replace the chronological map — they are a second index over the same objects.

<p></p>

⚠️ **The thread is a HYPOTHESIS until content confirms it.** Label it `inferred` and say what would falsify it. A wrong thread is worse than no thread, because it routes a whole group to the wrong owner in one motion.

---

## 3 · FUTURE CORRELATION — never rebuild the backlog

**Michael's real ask is that this never happens again.** A 257-file backlog is not a screenshot problem, it is the absence of a standing thread to attach to.

<p></p>

**The registry.** Once a thread is confirmed and routed, it gets one line in the session task's `## Threads` block: `T<nn> · <project> · <owner lane> · <destination record + link> · last seen <date>`.

<p></p>

**On every future run, read the registry FIRST.** A new cluster whose correlation lands on a known thread is **attached, not re-derived** — and it inherits that thread's owner and destination immediately. That is the whole mechanism: *the second time a project appears, routing it should cost nothing.*

<p></p>

**The cadence that actually prevents backlogs:** run this weekly, on the last ~7 days only. At that size a pass is a handful of clusters, most attach to known threads, and it takes minutes. **The 257 exists because the first run was also the first five months.**

<p></p>

⚠️ **A thread's owner is a fleet fact and rots like every other one.** Re-resolve the lane from the Agent Index at read time; the registry line records what was true when it was written, not what is true now.

---

## Changelog

- **v1 (2026-08-04)** — Established from three of Michael's asks in one message: a pickup contract (link on every reply, burden on the task), time-agnostic subject threads (because time clustering structurally cannot see a project worked across separate nights), and a thread registry plus weekly cadence so the backlog never rebuilds. Written during the first live run, which is also when the image blocker surfaced.
