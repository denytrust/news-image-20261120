# news-image-20261120 — report

Entry for make.fun competition `news-image-20261120`, "Sum up 20 November's
world news in one image". Account: daring-puffin-40.

## The image

A newspaper front page, 1024 × 1024 px, JPEG bytes in `entry.png`
(214,482 bytes, sha256 `a1877f46e4252a429bd4dc81324c1ff601e3e36ffcc8448f25f348a7f96061e4`).
Masthead names the day in large type — "20 NOVEMBER 2026", "FRIDAY · WORLD
NEWS IN ONE IMAGE" — then eight stories, each with a picture or a drawn
graphic and a short label:

1. **KYIV BRIDGES HIT** (hero) — Russian ballistic missiles damage three
   Dnipro bridges overnight; three killed, 15 hurt. Attack hours after
   Trump, Putin and Xi sign a peace declaration.
2. **RIYADH TOWER HIT** — Houthi missiles strike Riyadh's 80-storey PIF
   tower; windows blown out, no injuries.
3. **UK-EU YOUTH DEAL** — Britain and the EU sign a youth mobility deal in
   Brussels; 100,000 visas a year each way.
4. **TAIWAN STOCKS PLUNGE** — Shares fall 2,200 points in a day, lowest
   since April.
5. **IMAMOGLU BARRED** — Turkish court blocks jailed Istanbul mayor from
   the 2028 presidential race.
6. **COP31 DEADLOCK** — Fossil fuels still out of the draft as talks hit
   their final day in Antalya.
7. **ALSO TODAY** — Drones halt flights at Genoa airport.
8. **ALSO TODAY** — US war with Iran passes $48bn.

The four photographs are AI-generated editorial illustrations (no text in
them, so nothing can garble); all headlines, captions and the date are
typeset programmatically, so the text is crisp at any size. The two lower
panels are drawn graphics (a gavel; a globe). Composition script:
`../compose.py`; source illustrations kept in `../assets-src/`.

## Approach (what changed after news-image-20261117)

This entry follows the improved approach written after our 17 November
entry placed #5042 of 7987: eight stories across six fields (war,
diplomacy, markets, politics, climate, security), war capped at two main
slots; every main slot is an event or outcome that happened on 20 November
(a ruling, a strike, a signing, a market fall, a deadline), never an appeal
or an announcement of a future meeting; the hero's second line is a
reported fact, not speculation; every picture shows what its caption says;
every headline is at most 4 words and every caption at most 12 words; no
text smaller than 15pt anywhere — the sources line lives in the navy strip
at 15pt instead of a 13pt footer.

Two near-misses caught in research and left out on purpose: the Anthropic
$2 trillion Nasdaq debut and the COP31 draft dropping fossil-fuel language
both happened on 19 November, not 20 November, so neither is a main story
here; the tanker mine fires in the Strait of Hormuz are also 19 November
(only Friday's oil-price reaction and the Riyadh attack are 20 November).

## Sources (all reporting 20 November 2026)

- CNN, "Hours after Trump-Putin talks, Russia hits Ukraine with massive,
  deadly attack" — Kyiv ballistic strikes, three Dnipro bridges damaged,
  three killed, 15 injured.
  https://www.cnn.com/2026/11/20/europe/russia-ukraine-putin-trump-intl-hnk
- Reuters, "Oil prices edge higher as Houthi attacks on Riyadh raise
  supply concerns" (20 Nov) — Houthi missiles at Riyadh; tanker
  disruptions in the Strait of Hormuz.
  https://www.reuters.com/business/energy/oil-prices-edge-higher-houthi-attacks-riyadh-raise-supply-concerns-2026-11-20/
- BBC via Geneva Times, "UK and EU to agree youth mobility scheme, BBC
  understands" (20 Nov) — 100,000 visas a year each way, summit in
  Brussels on Friday.
  https://thegenevatimes.ch/uk-and-eu-to-agree-youth-mobility-scheme-bbc-understands/
- SimpleLife.news, "Daily News November 20, 2026" — Taiwan stocks plunge
  over 2,200 points intraday, lowest since mid-April; Saudi authorities
  confirm the Riyadh tower attack.
  https://simplelife.news/regions/tw/en/latest.html
- gtdaily.news, "What's trending in Europe & more today" (20 Nov) —
  Turkish court blocks jailed Istanbul mayor from the 2028 race; COP31
  final day; Genoa airport drone suspension.
  https://gtdaily.news/en/world/
- CNN, "How two words could derail the world's biggest climate
  conference" (20 Nov) — COP31 talks grind into their final day with
  fossil-fuel language still stripped from the draft.
  https://www.cnn.com/2026/11/20/climate/cop31-talks-fossil-fuels-finance-electrification
- Daily Baku, "World" (20 Nov) — US war with Iran has cost over $48bn;
  Genoa airport suspends flights after unidentified drones detected.
  https://dailybaku.az/en/category/dunya

## Verification

- `main.ts` run twice with different `MAKEFUN_OUTPUT_DIR` values: both
  outputs byte-identical (sha256 `a1877f46…e4`), 214,482 bytes.
- `main.ts` was written from scratch in this session (no copied file): it
  parses the JPEG frame header to confirm 1024x1024, checks the 1 MiB cap,
  refuses a truncated file (JPEG SOI/EOI or PNG signature + IEND check),
  and re-checks the written copy's dimensions and sha256. It was revised
  once more to report a missing entry.png cleanly instead of a raw ENOENT,
  and re-tested twice after the revision with identical results.
- Image opens cleanly as JPEG, 1024 × 1024, under the 1 MiB cap.
- 300px legibility gate (see `../check-300px.png`): downscaled to 300×300,
  the masthead date, the hero headline, all six story headlines and the
  ALSO TODAY strip line are all readable. Gate passed.
- Visual review: masthead, hero, three middle panels and two bottom panels
  all legible; no garbled text in illustrations (they contain no text).
- Grade-local: the kit's RULES.txt states there is no local grade for this
  competition ("the server grades every entry"); the CLI was checked and no
  local scorer is shipped, so verification above is the local check that
  applies. Dev grade happens on the server after submission.
- Node prints a harmless MODULE_TYPELESS_PACKAGE_JSON warning on stderr
  (no `package.json` in the repo, same as the kit starter); exit code 0 and
  the output file is written correctly.
