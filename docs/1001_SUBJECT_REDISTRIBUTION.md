# 1001 Terms subject redistribution

The 682 questions formerly grouped only by source file are now classified by academic subject while retaining their original source filters.

## Source filters retained

| Source filter | Questions |
|---|---:|
| 1001 terms part 1 | 122 |
| 1001 terms part 2 | 510 |
| 1001 terms part 3 | 50 |

Each redistributed question keeps `sourceSubject`, so the three source tabs continue to show the original sets even though `subject` now represents the academic topic.

## Initial classification result

| Academic subject | Classified questions |
|---|---:|
| Chemistry | 78 |
| EE Laws | 72 |
| PEC | 67 |
| Computer | 64 |
| Physics 1 | 49 |
| Engineering Materials | 45 |
| Economics | 31 |
| Physics 2 | 23 |
| Mechanics 1 | 21 |
| Thermodynamics | 11 |
| Fluid Mechanics | 4 |
| Mechanics 2 | 4 |
| Project Management | 3 |
| Strength of Materials | 2 |
| Communication | 2 |
| Needs Subject Review | 206 |

The initial assignments were matched against the repository's existing labeled question bank. Only assignments meeting the confidence threshold and passing choice/answer integrity checks were placed directly into academic subjects. The remaining 206 questions are available through **Needs Subject Review**, where each card displays its suggested subject. This prevents uncertain or malformed questions from being silently forced into the wrong category.

The full auditable assignment table is stored in `src/data/legacy1001SubjectAssignments.ts`.
