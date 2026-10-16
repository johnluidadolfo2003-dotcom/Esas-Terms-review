# ESAS question review — 16 October 2026

This update reviews the nine requested built-in subjects against **ESAS - 10152026**. It does not change tracking, camera, navigation, quiz interaction, deployment configuration, Chemistry, or Project Management. Runtime custom saves now leave the reviewed source file intact.

51 `.quiz` archives contain 3,020 live entries and 2,502 distinct normalized source stems. Source C/W answer markers were not treated as evidence. The 2,001 existing records in the nine subjects were read, with mathematical/physical reasoning and primary statutory/code/documentation checks for recoverable items.

- 579 questions added, with original file IDs and question numbers.
- 534 retained records corrected (answer, options, conditions, explanation, or subject).
- 139 existing records excluded from play: ambiguous/corrupt/missing-figure/out-of-scope items and duplicates. The original source arrays remain available for audit.
- 991 source stems skipped as duplicates; 932 not imported because of scope or unresolved wording/evidence. These counts describe source stems, not 3,020 individual occurrences.
- 2,725 final built-in records, including the unchanged 284 records outside the requested scope.

| Existing subject | Before | New imports | After corrections and exclusions |
|---|---:|---:|---:|
| Economics | 155 | 28 | 179 |
| Mechanics 1 | 142 | 17 | 144 |
| Mechanics 2 | 51 | 0 | 59 |
| Physics 1 | 94 | 73 | 167 |
| Computer | 245 | 9 | 252 |
| Physics 2 | 455 | 109 | 513 |
| Communication | 435 | 6 | 395 |
| EE Laws | 99 | 325 | 421 |
| PEC | 325 | 12 | 311 |

The final counts also reflect eight dynamics questions moved from Mechanics 1 to Mechanics 2 and one wiring-rule question moved from EE Laws to PEC. No subject is added. Basic fluid, elasticity, and thermal physics were routed to Physics 1/2; specialist machinery, metallurgy, chemistry, management, and OSH material was ignored.

## Representative corrections

- Economics: ROE versus ROI, two-seller duopoly, compound/present-worth factors, amortization, pure obligations, and cash-based payback.
- Mechanics/physics: non-collinear forces in a couple, collision isolation assumptions, moments of inertia, electron magnetic-force direction, resonance conditions, and voltage versus electric-field force.
- Computer: FORTRAN version/syntax assumptions, duplicate DO alternatives, MATLAB case sensitivity and integer operations, and unsupported acronyms.
- Communication: modulation/detection keys, oscillator behavior, waveguide modes, antennas, fibers, and legacy television contexts. Unseen-figure questions are excluded.
- PEC: 2017 unit-load values and metric dimensions, 6 mm box fasteners, 1,800 mm required-wall-receptacle counting threshold, 75 mm non-IC thermal-insulation separation, 135% capacitor-current rule, and removal of the old general panelboard device-count limit. Exceptions are stated when needed.
- EE Laws: historical statute text is dated, and later amendments are distinguished. This is exam study content, not a statement that every historical provision remains the current practice rule.

## Evidence and review trail

`src/data/audit/esasContentAudit.json` contains runtime patches, exclusion reasons, and accepted questions. `docs/esas-drive-review.json` records a decision for every distinct source stem, including provenance and available primary links. Similarity matching only suggested possible duplicates; it was not used to infer answers.

Primary checks include the published PEC 1 (2017) text, Philippine statutes, PRC/DOE/ERC publications, NIST unit definitions, MathWorks documentation, and manufacturer resistor color-code documentation:

- [PEC 1 information and errata publisher](https://www.iiee.org.ph/module?id=56&name=Philippine+Electrical+Code+(PEC1)) and [published 2017 book scan](https://www.slideshare.net/slideshow/philllipine-electrical-code-2017-part-1-pdf/272160640)
- [RA 7920](https://lawphil.net/statutes/repacts/ra1995/ra_7920_1995.html), [RA 7832](https://lawphil.net/statutes/repacts/ra1994/ra_7832_1994.html), [RA 8981](https://lawphil.net/statutes/repacts/ra2000/ra_8981_2000.html), [RA 9136](https://lawphil.net/statutes/repacts/ra2001/ra_9136_2001.html)
- [RA 10912](https://lawphil.net/statutes/repacts/ra2016/ra_10912_2016.html), [RA 11285](https://lawphil.net/statutes/repacts/ra2019/ra_11285_2019.html), [RA 11361](https://lawphil.net/statutes/repacts/ra2019/ra_11361_2019.html), [RA 9513](https://lawphil.net/statutes/repacts/ra2008/ra_9513_2008.html), [RA 11552](https://lawphil.net/statutes/repacts/ra2021/ra_11552_2021.html)
- [DOE power-line IRR](https://doe.gov.ph/circular-no-dc-2020-02-0002)
- [NIST unit conversions](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)
- [MathWorks case sensitivity](https://www.mathworks.com/help/matlab/matlab_prog/case-and-space-sensitivity.html) and [clear](https://www.mathworks.com/help/matlab/ref/clear.html)
- [Vishay resistor colors](https://www.vishay.com/docs/49411/resistor_color_code_calculator.pdf)
- [OpenStax fluid mechanics summary](https://openstax.org/books/university-physics-volume-1/pages/14-summary)

Missing figures and underspecified rules were not reconstructed by guessing. The review is not a guarantee of a perfect bank or an independent professional certification. Excluded questions need their missing diagrams, full installation conditions, or a uniquely defensible set of choices before reinstatement.

## Integration and verification

Corrections run before the existing App question merge, including cached copies carrying a known built-in ID. Stable existing IDs are preserved, old raw snippets are regenerated for corrected records, and duplicates are resolved before and after wording repairs. Imported answer positions are balanced, preserving the correct answer text even when Shuffle is off.

Run `npm run test:questions`, `npm run lint`, `npm run build`, and then `npm run test:server`. The server smoke test verifies both save endpoints, file persistence, app serving, and preservation of the reviewed source. The question checks cover unique IDs/stems/options, valid answer references, every applied patch/exclusion, complete source accounting, preservation of unrelated subjects, selected code corrections, and independent numerical calculations. They validate data integrity and specific regression cases; passing them alone cannot establish every educational answer as correct.

The production build retains the existing large-bundle and JSZip mixed-import warnings. No hosting deployment or real-camera test is claimed by this content-only change. Unrelated locally pasted or imported user questions remain outside the built-in-bank audit; known built-in IDs receive the same corrections/exclusions.
