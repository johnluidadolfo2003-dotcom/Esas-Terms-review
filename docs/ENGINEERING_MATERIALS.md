# Engineering Materials under ESAS

The Engineering Materials subject contains 193 distinct reviewed questions from the two user-supplied references:

| Reference | Source entries | Section used |
| --- | ---: | --- |
| ESAS - Engineering Materials.quiz | 150 | Complete quiz |
| ONLINE_FINAL_ESAS-3 discussion PDF | 50 | Engineering Materials only, pages 2–4, items 1–50 |

All 200 source occurrences are mapped in `engineering-materials-import.json`. Seven duplicate reviewed stems point to their canonical question instead of creating another card. Similar concepts with different stems remain available as separate practice questions. Physics or chemistry concepts present in the supplied Materials quiz remain in that imported set; the PDF's separate Strength of Materials and Fluid Mechanics sections were not imported.

The question module uses stable source-based IDs, source filenames, original question numbers, explanations, and corrected export text. Correct-option positions are distributed across A–D without changing the intended answer. The source quiz serializes its correct option first; importing that order directly would make every quiz answer A.

Wording and options were clarified where necessary to produce one defensible answer. Examples include ductility rather than malleability for wire drawing; annealing rather than nitriding as the exception to surface hardening; proportional limit for the linear range of Hooke's law; and lead as a copper machinability addition. Corrupted or false-premise items were rewritten around their identifiable concept. Each reviewed quiz item retains its original stem, choices, key index, and correction reason in the manifest. PDF items retain page and question-number provenance and a reason when their premise or alternatives were corrected. The manifest also links the technical references used for key corrections.

Integration includes the subject type, ESAS list, sidebar, paste/import selector, explicit-title detection, built-in bank and score grouping. The existing fixed board-exam quota configuration is unchanged.

## Validation

- `npm run test:materials`: verifies source coverage, valid answers, unique stems, provenance, category detection, import parsing, and high-risk corrected keys.
- `npm run lint`: type checking.
- `npm run build`: production client/server build.
- `npm run test:questions`: the existing suite has a pre-existing failure for duplicate option text in `esas-1001-p1-062`. The same failure was reproduced using the unchanged main-branch question bank; this import does not alter that record.
