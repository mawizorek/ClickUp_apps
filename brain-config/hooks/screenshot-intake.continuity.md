# Screenshot Intake · Continuity — pickup, subject threads, session folders, future correlation

**Purpose:** Make a multi-pass screenshot job survivable across sessions, connect clusters that are the same project weeks apart, and stop the backlog from ever rebuilding.

**Steward:** Fleet Felix (inherited). **Established 2026-08-04**, Michael's direction, during the first live run.

---

## 1 · THE PICKUP CONTRACT (Michael, 2026-08-04)

> *"At the end of all your replies, you give me the link to the task that I can open and just say 'pick this up,' and expect the agent to just get it."*

**Every reply during a multi-pass job ends with the session task link.** No exceptions, including replies that are pure conversation. A link Michael has to scroll for is a link he will not use.

<p></p>

**"Pick this up" is a CONTRACT, and the burden is on the parked task, never on the returning agent.** A cold agent opening that task must run without asking a single orienting question. The description carries, at all times:

1. **The runbook paths** — the hook, the report spec, this file, the blocker. Named, not implied.
2. **The full immutable skeleton** — every cluster id, span, count, shape, worked-state. **Never recomputed.**
3. **The exact next move**, by cluster id. A handoff that says *continue* is not a handoff.
4. **Every open ruling Michael owes.** A cold agent must not silently re-decide a parked question.
5. **Any live blocker**, with a pointer.

<p></p>

**Update the task BEFORE the reply, not after.** A parked task one turn behind hands the next agent a stale picture it has no way to detect.

<p></p>

**Bogging down is EXPECTED.** The correct end of a heavy pass: stop on a cluster boundary → update the task → post the link → say plainly that you thinned out. **A session that quietly pushes past capacity produces a worse artifact than one that stops early and says so.**

---

## 2 · SUBJECT THREADS — clustering across time, not just within it

> *"The clumping scheme should perhaps be agnostic or reverse, trying to connect initial patterns."* — Michael

**Time clustering has a structural blind spot: a project worked on three separate nights produces three clusters the skeleton cannot connect.** Time proximity finds a *session*. It cannot find a *project*.

<p></p>

After the time skeleton, run a **second, time-agnostic grouping**: which clusters are about the SAME THING, regardless of when. Signals, strongest first:

1. **Confirmed content** across clusters (blocked until images are readable).
2. **Workspace correlation collision** — two clusters whose date ranges land on the *same task, doc, Decision Log or repo*. **Works with zero images; strongest currently-available signal.**
3. **Rhythm** — same time of day, weekday, burst shape. Weak alone, corroborating in a pile.
4. **File-size regime** — a 2–6 MB cluster among KB shots is a different capture context. Diagnostic, not decisive.

<p></p>

**Threads are `T<nn>`, listed SEPARATELY from clusters.** A cluster belongs to at most one thread; an unthreaded cluster is normal and gets no apology. **Threads never renumber clusters** and never replace the chronological map.

<p></p>

⚠️ **A thread is a HYPOTHESIS until content confirms it.** Label `inferred`, say what would falsify it. A wrong thread routes a whole group to the wrong owner in one motion.

---

## 3 · SESSION FOLDERS — the naming law (Michael, 2026-08-04)

> *"C48_date-with-dashes_content notes. Very briefly... 25 shots! I don't want any spaces in the filenames, so keep it a little more codey."*

### The form

```
C<nn>_YYYY-MM-DD_<n>-shots[_<shape-or-subject>]
```

**Examples, real, from the live backlog:**

```
C37_2026-07-07_7-shots_burst-27sec
C11_2026-06-24_15-shots_session_large-files
C22_2026-06-29_9-shots_overnight
C48_2026-08-03_25-shots_campaign
C01_2026-03-03_1-shot
```

### Rules

- 🚫 **NO SPACES. EVER.** Underscore separates fields; hyphen separates words inside a field. Nothing else.
- **Cluster id FIRST**, zero-padded, always. It is the pointer Michael speaks and types. `C48` beats any description at getting two people to the same place in one syllable.
- **Date is the cluster's START date**, ISO, hyphenated. A cluster crossing midnight files under the date it BEGAN — the session started when it started.
- **Count is literal**: `1-shot` singular, `<n>-shots` plural.
- **The trailing note is OPTIONAL and describes SHAPE, not content** — `burst`, `session`, `overnight`, `campaign`, `large-files`, `burst-27sec`. ⚠️ **It becomes a subject only once content is CONFIRMED.** Never guess a subject into a folder name; the folder is on disk and a wrong name is worse than no name.
- **Two clusters on one date do not collide** — the id disambiguates them. That is a reason the id leads.

### 🔴 The cluster id is now REAL INFRASTRUCTURE

Until now the id was a reporting label. **The moment it is a directory name it is on disk, it is in URLs, and Michael says it out loud.** The immutability rule hardens accordingly:

- **NEVER renumber. NEVER reuse. NEVER close a gap.**
- **A void id stays void.** `C05` does not exist — it was assigned during skeleton construction and dissolved when its only member (`0d879121-…png`, UUID-named, no capture timestamp) was reclassified as a stray. **The correct action is to leave the hole and say so**, not to slide C06 down into it. A renumber would silently break every prior map, comment, and folder path.
- Splitting a cluster later mints a **new** id at the end of the sequence. It never subdivides an existing one.

### What does NOT go in a session folder

**Strays never enter.** They are a routing problem, not a session; they stay loose in the inbox until routed to their real home.

### ⚠️ This does NOT violate the no-subfolders ban

The hook bans **topic** subfolders because filing by topic demands a judgement per item, and that is where inboxes die. **A dated session folder is chronological, needs no judgement, and is derived mechanically from data the file already carries.** Different mechanism, different failure mode. **The ban on topic folders stands.** Clusters-on-disk are the only exception, and only because time already sorted them.

---

## 4 · FUTURE CORRELATION — never rebuild the backlog

**A 257-file backlog is not a screenshot problem, it is the absence of a standing thread to attach to.**

**The registry.** A confirmed, routed thread gets one line in the session task's `## Threads` block: `T<nn> · <project> · <owner lane> · <destination record + link> · last seen <date>`.

<p></p>

**Read the registry FIRST on every future run.** A new cluster whose correlation lands on a known thread is **attached, not re-derived**, inheriting that thread's owner and destination immediately. *The second time a project appears, routing it should cost nothing.*

<p></p>

**The cadence that prevents backlogs: run weekly, on the last ~7 days only.** At that size it is a handful of clusters, most attach to known threads, and it takes minutes. **The 257 exists because the first run was also the first five months.**

<p></p>

⚠️ **A thread's owner is a fleet fact and rots like every other one.** Re-resolve the lane from the Agent Index at read time.

---

## Changelog

- **v2 (2026-08-04)** — **Session folder naming law** (§3), Michael's form: `C<nn>_YYYY-MM-DD_<n>-shots[_shape]`, no spaces ever, id leads because it is the spoken pointer, trailing note describes SHAPE not content until content is confirmed. Records that **cluster ids are now real infrastructure** rather than reporting labels, hardening immutability: never renumber, never reuse, **a void id stays void** — `C05` is the live example, dissolved when its only member became a stray.
- **v1 (2026-08-04)** — Established from three asks in one message: the pickup contract, time-agnostic subject threads, and a thread registry + weekly cadence.
