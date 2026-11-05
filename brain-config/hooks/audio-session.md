# Audio session

Use when Michael invokes `/audio-session`, `/audio-session=on`, or asks to work through a session task with spoken replies. `/audio-session=off` ends spoken delivery for this session. `/audio-session voice=<voice>` changes the current voice without changing saved defaults.

Keep the written working record in one session task; deliver brisk conversational audio and navigation back to that task in the invoking conversation. This complements talkback-mode.md, which owns register and compression, not audio routing.

## Start or resume

Resolve the invoked repo-agent normally. Use the supplied session task or locate the current session's task before creating another on the Agent Activity Board. Do not silently adopt a different model session's task. Read its description and current discussion. Keep the task URL as the session return address. Capture enough context for a cold pickup, marking proposals separately from accepted decisions.

Enabling this mode requests routine transcript posting to the chosen task; comply with any platform confirmation requirements. It is not approval for messages to other recipients, destructive operations, or unrelated edits.

## Each substantive reply

1. Refresh task discussion and reconcile new contributions before answering.
2. Compose the useful written answer with evidence, exact technical details, and actionable decisions. Keep it in a peer task comment. Established multi-model collaboration uses its existing contribution thread; an ordinary single-session task uses standalone comments. Do not masquerade as another participant.
3. Generate an audio explanation written for listening, not a verbatim reading of field catalogs or URLs. Default pace: brisk, approximately 195-210 words per minute, intelligibility first. No preambles, padding, or repeated conclusions. Preserve critical uncertainty and safety information. Do not omit requested substance just to hit a duration.
4. Attach/embed the audio with the written task comment, verify the posting receipt, then return the audio and the session-task link in the invoking conversation. A supported navigation button may accompany the link; never claim JavaScript refresh, automatic navigation, or autoplay.
5. If a task post or audio generation fails, state which part failed and provide the available result. Never claim the transcript was saved without a successful receipt. Do not silently fall back to an essay in the invoking conversation.

## Voice selection

Read audio-session-voices.md. Resolve session override, then saved agent entry, then default. Verify the voice is supported by the speech generator available in the current environment. Unsupported choices require a visible fallback, not a fabricated match. A seat change resolves the new seat's voice; a session-wide explicit override remains until cleared.

Voice identity belongs in the registry; procedure stays here. Save permanent agent assignments only when selected or approved. Leave unassigned agents on the fallback instead of inventing permanent personalities. Voice changes affect generated audio only, not any native live-voice feature.

## Scope

This is an on-demand session procedure, not background monitoring, live calling, or an automatic interceptor for every ClickUp conversation. A slash trigger is honored when its instructions are available to the responding session. Do not claim platform-level command registration or automatic playback.

## Checks

- Existing task: reuse it, post one written contribution, return matching audio and task link.
- Agent swap: resolve the new saved voice without copying procedure into its profile.
- Missing voice or audio failure: report the limitation, preserve the written record.
- Off: stop generating audio; retain the task and its history.
