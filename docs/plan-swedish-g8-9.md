# Svenska årskurs 8–9: 24 units

Same typed format as Years 4–6 (`app/src/svenska/unit.ts`, `defineUnit`, `word`): a story with tappable words, 8 new words, one grammar or text point drawn on the whiteboard in about 3 scenes, reading questions, and a `gram(lv, write)` generator. Text types follow Lgr22 for years 7–9 (narrative, factual, argumentative, chronicle, poetry, source criticism, formal and informal language).

**Lengths**
- Year 8: 400–500 words, 7 parts, 9 reading questions (3 inference).
- Year 9: 500–600 words, 8 parts, 9 reading questions (3 inference, 1 about the writer's purpose or the text type).

**Language level**
- Richer vocabulary, longer sentences, some abstract words. `d` (meaning) uses simpler words. English and Arabic help in every `say`.

**Story world:** Björkskolan in Hagaby. Amir and Sara continue from Year 7.
- Year 8: class 8B, teacher Lena.
- Year 9: class 9B, teacher Lena; the year ends with choosing a gymnasium programme.
Yasmin (Amir's little sister), Leo, Elsa, Noah and Ibrahim can appear.

**Reuse:** each story reuses at least 4 words from earlier units of the same year (3 for the second unit), and may reuse earlier years too, without saying so.

**Keys:** must be unique across all years. If a word already exists as a key, add the year number (e.g. `kalla8`). Check with `grep -rn "word(\"KEY\"" app/src/lessons`.

## Year 8

| # | id | Title | Text type | Grammar / text point | New words (key: Swedish) |
|---|---|---|---|---|---|
| 1 | sv8a | Nytt läsår, nya regler | story | subordinate clauses: main clause vs bisats, inte before the verb in a bisats | regel: regel, schema: schema, ansvar: ansvar, frånvaro: frånvaro, förhandla: förhandla, kompromiss: kompromiss, rimlig: rimlig, protestera: protestera |
| 2 | sv8b | Insändaren om busstiderna | letter to the editor (insändare) | argumentative structure: thesis, arguments, counter-argument, conclusion | insandare: insändare, kollektivtrafik: kollektivtrafik, tidtabell: tidtabell, pendla: pendla, kommun: kommun, kritisera: kritisera, beslut8: beslut, missnojd: missnöjd |
| 3 | sv8c | Fejknyheten | factual text plus story frame | source criticism words: avsändare, källa, syfte, aktualitet | kalla8: källa, avsandare: avsändare, syfte: syfte, granska: granska, rykte: rykte, trovardig: trovärdig, sprida: sprida, manipulera: manipulera |
| 4 | sv8d | Novellen: Spegeln | short story (novell) | narrative tools: setting, conflict, turning point, open ending | spegel: spegel, gestalt: gestalt, skymning: skymning, kuslig: kuslig, rysa: rysa, ana: ana, vandpunkt: vändpunkt, tystnad: tystnad |
| 5 | sv8e | Praon på veterinären | report (rapport) | passive with -s (djuren matas, operationen gjordes) | prao: prao, operation: operation, sovra: söva, bedova: bedöva, diagnos: diagnos, assistera: assistera, steril: steril, lugnande: lugnande |
| 6 | sv8f | Formellt eller informellt? | two emails to different readers | formal vs informal register | formell: formell, informell: informell, mottagare: mottagare, ansoka: ansöka, hanvisa: hänvisa, vanligen: vänligen, angelagen: angelägen, bekräfta: bekräfta |
| 7 | sv8g | Krönikan om skärmtid | chronicle (krönika) | irony and exaggeration; the writer's voice | kronika: krönika, skarmtid: skärmtid, beroende: beroende, ironi: ironi, overdriva: överdriva, reflektera: reflektera, vana: vana, flod8: flöde |
| 8 | sv8h | Dikten vid havet | poetry | images: simile (som), metaphor, personification | dikt: dikt, strof: strof, liknelse: liknelse, metafor: metafor, horisont: horisont, brus: brus, glittra: glittra, vemod: vemod |
| 9 | sv8i | Ordet kommer från | factual text about word history | loanwords and word origins (from Latin, French, English, Arabic) | lanord: lånord, ursprung: ursprung, sprakhistoria: språkhistoria, latin: latin, influens: påverkan, forsvenska: försvenska, nybildning: nybildning, dialekt8: dialekt |
| 10 | sv8j | Klassresan och budgeten | story with a debate | conditional: om …, skulle … | budget8: budget, insamling: insamling, sponsor: sponsor, overskott: överskott, underskott: underskott, rösta8: rösta, majoritet: majoritet, prioritera: prioritera |
| 11 | sv8k | Intervjun med farfar | interview | indirect speech (Han sa att han hade …) | intervjua8: intervjua, flykt: flykt, gräns: gräns, uppväxt: uppväxt, minnas: minnas, hemland: hemland, anpassa: anpassa sig, saknad: saknad |
| 12 | sv8l | Debatten om skoluniform | debate | review: linking words of argument (för det första, å ena sidan, sammanfattningsvis) | uniform: uniform, jamlikhet: jämlikhet, identitet: identitet, frihet: frihet, motargument: motargument, sammanfatta: sammanfatta, standpunkt: ståndpunkt, motivera: motivera |

## Year 9

| # | id | Title | Text type | Grammar / text point | New words (key: Swedish) |
|---|---|---|---|---|---|
| 1 | sv9a | Sista året | story | sentence parts: subject, predicate, object, adverbial | gymnasium: gymnasium, program: program, behorighet: behörighet, merit: merit, studievagledare: studievägledare, osaker: osäker, sjalvstandig: självständig, mal9: mål |
| 2 | sv9b | Utredningen: Ska skolan börja senare? | expository text (utredande text) | expository structure: question, both sides, weighing, conclusion | utreda: utreda, dygnsrytm: dygnsrytm, studie: studie, faktor: faktor, paverka: påverka, slutsats: slutsats, jamfora: jämföra, konsekvens: konsekvens |
| 3 | sv9c | Novellen: Tåget | short story | point of view: first person vs third person, inner monologue | perrong: perrong, konduktor: konduktör, frammande: främmande, blick: blick, tveka: tveka, avgang: avgång, ångra: ångra, hopp: hopp |
| 4 | sv9d | Källan i reklamen | factual text about advertising | persuasion: ethos, pathos, logos | reklam: reklam, målgrupp: målgrupp, budskap: budskap, logos: logos, patos: patos, etos: etos, påverkan9: påverka, konsument: konsument |
| 5 | sv9e | Personligt brev till gymnasiet | personal letter of application | formal letter structure and polite phrases | ansokan: ansökan, intresse: intresse, erfarenhet: erfarenhet, egenskap: egenskap, motivation: motivation, utbildning: utbildning, ambitios: ambitiös, referens: referens |
| 6 | sv9f | Dialekter i Sverige | factual text | dialects, standard language and slang | rikssvenska: rikssvenska, uttal: uttal, slang: slang, sociolekt: sociolekt, region: region, variation: variation, fordom: fördom, tonfall: tonfall |
| 7 | sv9g | Klimatdemonstrationen | news report plus interviews | quoting and referring (enligt, uppger, menar) | demonstration: demonstration, utslapp: utsläpp, hallbar: hållbar, krav: krav, politiker: politiker, engagera: engagera sig, uppge: uppge, fossil: fossil |
| 8 | sv9h | Dikten om tiden | poetry | rhythm, rhyme and line breaks; interpreting a poem | rytm: rytm, rim: rim, tolka: tolka, symbol: symbol, evighet: evighet, stunden: stund, flyktig: flyktig, längtan9: längtan |
| 9 | sv9i | Recensionen | review (recension) | evaluative words and nuance (bra, lysande, medioker, svag) | recension: recension, betyg9: omdöme, handling: handling, karaktar: karaktär, spannande: spännande, forutsagbar: förutsägbar, rekommendera: rekommendera, kritik: kritik |
| 10 | sv9j | Debatten om AI i skolan | debate | counter-arguments and refuting them (visserligen … men) | teknik: teknik, fusk: fusk, verktyg9: hjälpmedel, etik: etik, risk: risk, mojlighet: möjlighet, ansvarsfull: ansvarsfull, ersatta: ersätta |
| 11 | sv9k | Novellen: Brevet som aldrig skickades | short story | tense shifts and flashback (pluperfect: hade + supinum) | tillbakablick: tillbakablick, hemlighet: hemlighet, skuld: skuld, försoning: försoning, kuvert9: brevet, darra: darra, bekanna: bekänna, lättnad: lättnad |
| 12 | sv9l | Tal på avslutningen | speech | review: speech techniques (repetition, questions to the audience, the rule of three) | tal: tal, avslutning: avslutning, publik9: åhörare, upprepning: upprepning, tacka: tacka, gemenskap: gemenskap, epok: epok, avsked: avsked |

Files:
- Year 8: units 1–6 in `sv8a.ts`, units 7–12 in `sv8g.ts`.
- Year 9: units 1–6 in `sv9a.ts`, units 7–12 in `sv9g.ts`.
