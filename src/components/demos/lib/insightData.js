// Sample retail dataset + the same cleaning, aggregation and forecasting steps the
// Python pipeline performs, re-implemented in JavaScript so they run in the browser.
// The data is generated from a fixed seed, so every visitor sees identical numbers.

export const REGIONS = ['North', 'South', 'East', 'West'];
export const CATEGORIES = ['Electronics', 'Grocery', 'Apparel', 'Home', 'Beauty'];
export const MONTHS = Array.from({ length: 24 }, (_, i) => {
  const d = new Date(2024, i, 1);
  return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleString('en-US', { month: 'short' }), year: d.getFullYear(), m: d.getMonth() };
});

// mulberry32: tiny deterministic PRNG
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE = { Electronics: 1450000, Grocery: 980000, Apparel: 720000, Home: 560000, Beauty: 390000 }; // ₹ per region-month
const AOV = { Electronics: 6200, Grocery: 850, Apparel: 1900, Home: 2600, Beauty: 1100 };
const REGION_FACTOR = { North: 1.08, South: 1.15, East: 0.86, West: 1.0 };
const REGION_TREND = { North: 0.006, South: 0.011, East: 0.002, West: 0.007 }; // monthly growth
// Festive season (Oct–Nov) peaks, a post-festive dip, and a smaller spring bump.
const SEASON = [0.92, 0.88, 0.97, 1.0, 1.02, 0.96, 0.94, 0.98, 1.03, 1.22, 1.31, 1.05];

// Messy "raw" export rows, as they might arrive from regional stores.
export function generateRawRows() {
  const rand = rng(20251117);
  const rows = [];
  let id = 1;
  REGIONS.forEach((region) => {
    CATEGORIES.forEach((category) => {
      MONTHS.forEach((mo, i) => {
        const noise = 0.9 + rand() * 0.2;
        const revenue = BASE[category] * REGION_FACTOR[region] * SEASON[mo.m] * (1 + REGION_TREND[region]) ** i * noise;
        const orders = Math.round((revenue / AOV[category]) * (0.94 + rand() * 0.12));
        rows.push({ id: id++, month: mo.key, region, category, revenue: Math.round(revenue), orders });
      });
    });
  });

  // Inject realistic data-quality problems.
  const pick = () => rows[Math.floor(rand() * rows.length)];
  const labelVariants = { North: ['north', 'N. Region'], South: ['south', 'SOUTH '], East: ['east', 'E. Region'], West: ['west', 'WEST '] };
  for (let k = 0; k < 18; k += 1) {
    const r = pick();
    const canon = REGIONS.find((x) => x.toLowerCase() === String(r.region).trim().toLowerCase()) || CANON[String(r.region).trim().toLowerCase()];
    r.region = labelVariants[canon][k % 2];
  }
  for (let k = 0; k < 9; k += 1) pick().revenue = null; // missing values
  for (let k = 0; k < 5; k += 1) {
    const r = pick();
    r.orders = -Math.abs(r.orders); // impossible negatives
  }
  for (let k = 0; k < 4; k += 1) {
    const r = pick();
    if (r.revenue) r.revenue *= 9; // keying errors
  }
  const dupes = [];
  for (let k = 0; k < 12; k += 1) dupes.push({ ...pick() });
  return [...rows, ...dupes];
}

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const quantile = (arr, q) => {
  const s = [...arr].sort((a, b) => a - b);
  const pos = (s.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return s[lo] + (s[hi] - s[lo]) * (pos - lo);
};

const CANON = { north: 'North', 'n. region': 'North', south: 'South', east: 'East', 'e. region': 'East', west: 'West' };

// The cleaning pipeline. Returns clean rows plus a step-by-step quality report.
export function cleanRows(raw) {
  const report = [];
  let rows = raw.map((r) => ({ ...r }));
  report.push({ step: 'Ingest', detail: `${rows.length} rows read from 4 regional exports`, count: rows.length });

  let relabeled = 0;
  rows.forEach((r) => {
    const key = String(r.region).trim().toLowerCase();
    const canon = CANON[key] || REGIONS.find((x) => x.toLowerCase() === key);
    if (canon && canon !== r.region) {
      r.fixes = [...(r.fixes || []), `region "${String(r.region).trim()}" → ${canon}`];
      r.region = canon;
      relabeled += 1;
    }
  });
  report.push({ step: 'Standardise labels', detail: `${relabeled} inconsistent region names mapped to canonical values`, count: relabeled });

  const seen = new Set();
  const before = rows.length;
  rows = rows.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
  report.push({ step: 'Remove duplicates', detail: `${before - rows.length} duplicate rows dropped (same record id)`, count: before - rows.length });

  let imputed = 0;
  const groups = {};
  rows.forEach((r) => {
    if (r.revenue != null) (groups[`${r.region}|${r.category}`] ||= []).push(r.revenue);
  });
  rows.forEach((r) => {
    if (r.revenue == null) {
      r.revenue = Math.round(median(groups[`${r.region}|${r.category}`]));
      r.fixes = [...(r.fixes || []), 'missing revenue imputed'];
      imputed += 1;
    }
  });
  report.push({ step: 'Impute missing', detail: `${imputed} missing revenue values filled with the region × category median`, count: imputed });

  let negatives = 0;
  rows.forEach((r) => {
    if (r.orders < 0) {
      r.fixes = [...(r.fixes || []), `orders ${r.orders} → ${Math.abs(r.orders)}`];
      r.orders = Math.abs(r.orders);
      negatives += 1;
    }
  });
  report.push({ step: 'Fix invalid values', detail: `${negatives} negative order counts sign-corrected and flagged for review`, count: negatives });

  let capped = 0;
  CATEGORIES.forEach((cat) => {
    const vals = rows.filter((r) => r.category === cat).map((r) => r.revenue);
    const q1 = quantile(vals, 0.25);
    const q3 = quantile(vals, 0.75);
    const upper = q3 + 3 * (q3 - q1);
    rows.forEach((r) => {
      if (r.category === cat && r.revenue > upper) {
        r.fixes = [...(r.fixes || []), `outlier ${formatINR(r.revenue)} replaced`];
        r.revenue = Math.round(median(vals));
        capped += 1;
      }
    });
  });
  report.push({ step: 'Handle outliers', detail: `${capped} extreme values (beyond Q3 + 3×IQR) replaced with the category median`, count: capped });
  report.push({ step: 'Load warehouse', detail: `${rows.length} clean rows upserted into fact_sales`, count: rows.length });
  return { rows, report };
}

export function filterRows(rows, region, category) {
  return rows.filter((r) => (region === 'All' || r.region === region) && (category === 'All' || r.category === category));
}

export function monthlySeries(rows) {
  const byMonth = Object.fromEntries(MONTHS.map((m) => [m.key, { revenue: 0, orders: 0 }]));
  rows.forEach((r) => {
    byMonth[r.month].revenue += r.revenue;
    byMonth[r.month].orders += r.orders;
  });
  return MONTHS.map((m) => ({ ...m, ...byMonth[m.key] }));
}

export function groupTotals(rows, key, year = 2025) {
  const totals = {};
  rows.filter((r) => r.month.startsWith(String(year))).forEach((r) => {
    totals[r[key]] = (totals[r[key]] || 0) + r.revenue;
  });
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function kpis(series) {
  const y24 = series.filter((s) => s.year === 2024);
  const y25 = series.filter((s) => s.year === 2025);
  const sum = (arr, k) => arr.reduce((t, x) => t + x[k], 0);
  const revenue = sum(y25, 'revenue');
  const orders = sum(y25, 'orders');
  const prev = sum(y24, 'revenue');
  return { revenue, orders, aov: orders ? revenue / orders : 0, yoy: prev ? (revenue - prev) / prev : 0 };
}

// Linear trend × multiplicative seasonal index (classical decomposition).
export function fitSeasonalTrend(values) {
  const n = values.length;
  const xs = values.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  xs.forEach((x, i) => {
    num += (x - meanX) * (values[i] - meanY);
    den += (x - meanX) ** 2;
  });
  const slope = num / den;
  const intercept = meanY - slope * meanX;
  const ratios = Array.from({ length: 12 }, () => []);
  values.forEach((v, i) => ratios[i % 12].push(v / (intercept + slope * i)));
  const season = ratios.map((r) => (r.length ? r.reduce((a, b) => a + b, 0) / r.length : 1));
  const norm = season.reduce((a, b) => a + b, 0) / 12;
  const index = season.map((s) => s / norm);
  return (i) => (intercept + slope * i) * index[i % 12];
}

export function forecast(series, horizon = 3) {
  const values = series.map((s) => s.revenue);
  const model = fitSeasonalTrend(values);
  return Array.from({ length: horizon }, (_, k) => {
    const i = values.length + k;
    const d = new Date(2024, i, 1);
    return { key: `f${k}`, label: d.toLocaleString('en-US', { month: 'short' }), year: d.getFullYear(), revenue: model(i), forecast: true };
  });
}

// Hold out the last `h` months, fit on the rest, and compare against a naive seasonal baseline.
export function backtest(series, h = 3) {
  const values = series.map((s) => s.revenue);
  const train = values.slice(0, values.length - h);
  const test = values.slice(values.length - h);
  const model = fitSeasonalTrend(train);
  const mape = (pred) => (pred.reduce((t, p, k) => t + Math.abs((test[k] - p) / test[k]), 0) / h) * 100;
  const modelPred = test.map((_, k) => model(train.length + k));
  const naivePred = test.map((_, k) => values[values.length - h + k - 12]);
  return { model: mape(modelPred), naive: mape(naivePred) };
}

export function buildSql(region, category) {
  const where = [];
  if (region !== 'All') where.push(`s.region = '${region}'`);
  if (category !== 'All') where.push(`p.category = '${category}'`);
  return [
    'SELECT d.year_month,',
    '       SUM(f.revenue) AS revenue,',
    '       SUM(f.orders)  AS orders',
    'FROM fact_sales f',
    'JOIN dim_date    d ON d.date_key    = f.date_key',
    'JOIN dim_store   s ON s.store_key   = f.store_key',
    'JOIN dim_product p ON p.product_key = f.product_key',
    where.length ? `WHERE ${where.join('\n  AND ')}` : null,
    'GROUP BY d.year_month',
    'ORDER BY d.year_month;',
  ]
    .filter(Boolean)
    .join('\n');
}

export const formatINR = (n, compact = true) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 2 : 0 }).format(n);

export const formatNum = (n) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
