# Plans

Working documents written while shaping and implementing a change: design
notes from the `brainstorming` skill (`docs/plans/specs/`) and step-by-step
implementation plans from the `writing-plans` skill (`docs/plans/`).

| Kind | Path | Written by |
|---|---|---|
| Design note | `docs/plans/specs/YYYY-MM-DD-<topic>-design.md` | `brainstorming` skill |
| Implementation plan | `docs/plans/YYYY-MM-DD-<feature-name>.md` | `writing-plans` skill |

Rules:

- A plan lives on the feature branch and reaches `dev` with its pull request,
  so the reviewer can compare the plan with the result.
- Plans are not documentation of the product: the docs gate in CI ignores this
  folder. Update `docs/features/` or `docs/architecture/` as well.
- Write plans in English. Link the issue they belong to at the top.
