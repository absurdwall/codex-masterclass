# Personal cloud skills

This is your exported set of 32 portable skills. Exact instructions and resources are embedded in `install-cloud-skills.sh`; skill names alone cannot recreate your customized versions.

## Use in future environments

Paste the complete contents of `install-cloud-skills.sh` into the environment Install script after repository setup. It installs into the current cloud user’s `~/.agents/skills`, so tasks starting at `/workspace` also discover the skills. No uploaded archive or network access is needed. Preserve the rest of each project’s dependency setup.

Alternatively, store this script once in a private setup repository that future environments check out. Then run `bash /workspace/<setup-repository>/install-cloud-skills.sh --target /workspace/<project>/.agents/skills`. No repository has been created or published by this task.

For tasks using this saved environment, publish or republish the prepared environment; the installed folders and saved installer can then be reused. This does not automatically change other environment configurations.

Start a new task after republishing to refresh skill discovery. User-level discovery from `/workspace` was verified through a fresh Codex app-server skills/list request. Invoke `$implement-spec` with a spec/ticket pointer; slash-menu availability depends on the client. File installation does not establish issue/PR authorization, subagent execution, or full workflow readiness.

The original 29 optional skills and desktop-only references are excluded from this default installer. No tracked application file is modified. Conflicting skill folders are preserved and reported rather than overwritten.

## Included skills

- `ask-matt`
- `code-review`
- `codebase-design`
- `diagnosing-bugs`
- `domain-modeling`
- `find-skills`
- `grill-me`
- `grill-with-docs`
- `grilling`
- `handoff`
- `implement`
- `implement-spec`
- `improve-codebase-architecture`
- `prototype`
- `research`
- `resolving-merge-conflicts`
- `setup-matt-pocock-skills`
- `show-me`
- `tdd`
- `teach`
- `to-questionnaire`
- `to-spec`
- `to-tickets`
- `triage`
- `wait-what`
- `wayfinder`
- `wizard`
- `writing-for-agents`
- `review-agent`
- `skill-creator`
- `skill-installer`
- `pdf`
