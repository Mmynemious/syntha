// Published Turkish national/regional prevalence figures for the comorbidity
// flags syntha models, used to give generated batches a real-world reference
// line instead of just "statistically similar to the training cohort."
//
// Every rate here is tied to a specific paper — deliberately not a single
// "the" national average, since methodology and year both move these
// numbers meaningfully (e.g. hypertension estimates range ~18-30% across
// recent Turkish surveys). Conditions without a clean general-population
// match (hyperlipidemia's closest source measures "any lipid abnormality",
// ~80% — not comparable to a clinical diagnosis flag; thyroid disease only
// had a regional, not national, study; depression/anxiety phenotypes vary
// too much across studies to pick one figure) are deliberately omitted
// rather than forcing a number that isn't a fair comparison.

export interface NationalReference {
  /** Matches a binary column name in the bundled copula model. */
  column: string;
  label: string;
  rate: number;
  source: string;
  sourceUrl: string;
  year: number;
  note?: string;
}

export const NATIONAL_REFERENCES: NationalReference[] = [
  {
    column: "Hipertansiyon",
    label: "Hypertension",
    rate: 0.184,
    source: "National survey analysis, Türkiye, 2008–2022",
    sourceUrl: "https://onlinelibrary.wiley.com/doi/10.1155/ijhy/6660660",
    year: 2022,
    note: "Most recent of several national surveys; earlier ones (PatenT/PatenT2, MoH 2018) report 24–30%.",
  },
  {
    column: "DM_Tum",
    label: "Diabetes",
    rate: 0.165,
    source: "TURDEP-II",
    sourceUrl: "https://link.springer.com/article/10.1007/s10654-013-9771-5",
    year: 2010,
    note: "The standard Turkish diabetes epidemiology study.",
  },
  {
    column: "Astim",
    label: "Asthma",
    rate: 0.045,
    source: "GARD Türkiye",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5906263/",
    year: 2013,
    note: "Doctor-diagnosed rate (self-reported asthma runs higher, ~9.8%, in a 2019 survey).",
  },
  {
    column: "COPD",
    label: "COPD",
    rate: 0.084,
    source: "BOLD-Adana study",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3844139/",
    year: 2013,
    note: "Diagnosed rate — spirometry-confirmed true prevalence in the same study was 19.1%, a large underdiagnosis gap.",
  },
  {
    column: "Iskemik_Kalp",
    label: "Ischemic heart disease",
    rate: 0.054,
    source: "National coronary heart disease survey, Türkiye",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/8407004/",
    year: 1993,
    note: "5.8% men / 5.0% women, age-adjusted; averaged here.",
  },
];

/**
 * Wilson score interval — a 95% CI for a sample proportion that stays valid
 * at small n or p near 0/1 (unlike the normal approximation).
 */
export function wilsonInterval(successes: number, n: number): { lo: number; hi: number } {
  if (n === 0) return { lo: 0, hi: 0 };
  const z = 1.96;
  const phat = successes / n;
  const denom = 1 + (z * z) / n;
  const center = phat + (z * z) / (2 * n);
  const margin = z * Math.sqrt((phat * (1 - phat)) / n + (z * z) / (4 * n * n));
  return {
    lo: Math.max(0, (center - margin) / denom),
    hi: Math.min(1, (center + margin) / denom),
  };
}
