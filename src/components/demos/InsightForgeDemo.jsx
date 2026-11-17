import { useEffect, useMemo, useRef, useState } from 'react';
import { LuPlay, LuCopy, LuCheck, LuTrendingUp, LuTrendingDown, LuTable2, LuChartLine, LuDatabase } from 'react-icons/lu';
import {
  REGIONS, CATEGORIES, generateRawRows, cleanRows, filterRows, monthlySeries, groupTotals, kpis, forecast, backtest, buildSql, formatINR, formatNum,
} from './lib/insightData';

const SERIES = '#818cf8';

function useDataset() {
  return useMemo(() => {
    const raw = generateRawRows();
    return { raw, ...cleanRows(raw) };
  }, []);
}

/* ---------- Line chart: monthly revenue + 3-month forecast ---------- */
function RevenueChart({ series, future }) {
  const wrap = useRef(null);
  const [hover, setHover] = useState(null);
  const [width, setWidth] = useState(640);

  // Draw at the real pixel width so text stays readable on small screens.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !('ResizeObserver' in window)) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = Math.max(280, width);
  const H = W < 480 ? 220 : 260;
  const labelEvery = W < 480 ? 6 : 3;
  const pad = { l: 56, r: 16, t: 16, b: 30 };
  const all = [...series, ...future];
  // Round the axis to a "nice" step (1, 2, 2.5 or 5 × 10^n) so tick labels are clean numbers.
  const peak = Math.max(...all.map((d) => d.revenue));
  const raw = peak / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((v) => v >= raw);
  const max = Math.ceil((peak * 1.04) / step) * step;
  const x = (i) => pad.l + (i * (W - pad.l - pad.r)) / (all.length - 1);
  const y = (v) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const actualPath = series.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.revenue).toFixed(1)}`).join(' ');
  const last = series.length - 1;
  const fcPath = [series[last], ...future].map((d, k) => `${k ? 'L' : 'M'}${x(last + k).toFixed(1)},${y(d.revenue).toFixed(1)}`).join(' ');
  const area = `${actualPath} L${x(last).toFixed(1)},${H - pad.b} L${x(0).toFixed(1)},${H - pad.b} Z`;
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, k) => k * step);

  const onMove = (e) => {
    const rect = wrap.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (all.length - 1));
    setHover(Math.max(0, Math.min(all.length - 1, i)));
  };

  const h = hover != null ? all[hover] : null;
  return (
    <div className="chart-wrap" ref={wrap}>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label="Monthly revenue for 2024 and 2025 with a three-month forecast" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SERIES} stopOpacity="0.28" />
            <stop offset="1" stopColor={SERIES} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="grid-line" />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="axis-text">{formatINR(t)}</text>
          </g>
        ))}
        {all.map((d, i) => (i % labelEvery === 0 ? (
          <text key={d.key} x={x(i)} y={H - 8} textAnchor="middle" className="axis-text">
            {d.label}{d.label === 'Jan' ? ` '${String(d.year).slice(2)}` : ''}
          </text>
        ) : null))}
        <rect x={x(last)} y={pad.t} width={x(all.length - 1) - x(last)} height={H - pad.t - pad.b} className="forecast-zone" />
        <text x={W - pad.r - 4} y={pad.t + 12} textAnchor="end" className="axis-text">Forecast</text>
        <path d={area} fill="url(#rev-area)" />
        <path d={actualPath} fill="none" stroke={SERIES} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={fcPath} fill="none" stroke={SERIES} strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
        {h && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="crosshair" />
            <circle cx={x(hover)} cy={y(h.revenue)} r="5" fill={SERIES} stroke="var(--bg-2)" strokeWidth="2" />
          </g>
        )}
        <rect x={pad.l} y={pad.t} width={W - pad.l - pad.r} height={H - pad.t - pad.b} fill="transparent" />
      </svg>
      {h && (
        <div className="chart-tip" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(h.revenue) / H) * 100}%` }}>
          <p>{h.label} {h.year}{h.forecast ? ' · forecast' : ''}</p>
          <b>{formatINR(h.revenue)}</b>
          {!h.forecast && <span>{formatNum(h.orders)} orders</span>}
        </div>
      )}
    </div>
  );
}

/* ---------- Horizontal bar chart ---------- */
function BarChart({ data }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="hbar-list" aria-label="2025 revenue breakdown">
      {data.map((d) => (
        <li key={d.name} onPointerEnter={() => setHover(d.name)} onPointerLeave={() => setHover(null)} className={hover && hover !== d.name ? 'is-dim' : ''}>
          <span className="hbar-label">{d.name}</span>
          <span className="hbar-track">
            <span className="hbar-fill" style={{ width: `${(d.value / max) * 100}%`, background: SERIES }} />
          </span>
          <span className="hbar-value">{formatINR(d.value)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InsightForgeDemo() {
  const { report, rows } = useDataset();
  const [region, setRegion] = useState('All');
  const [category, setCategory] = useState('All');
  const [dim, setDim] = useState('category');
  const [showTable, setShowTable] = useState(false);
  const [stage, setStage] = useState(report.length); // pipeline steps completed
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const runPipeline = () => {
    clearInterval(timer.current);
    setStage(0);
    timer.current = setInterval(() => {
      setStage((s) => {
        if (s + 1 >= report.length) clearInterval(timer.current);
        return s + 1;
      });
    }, 380);
  };

  const ready = stage >= report.length;
  const filtered = useMemo(() => filterRows(rows, region, category), [rows, region, category]);
  const series = useMemo(() => monthlySeries(filtered), [filtered]);
  const future = useMemo(() => forecast(series), [series]);
  const k = useMemo(() => kpis(series), [series]);
  const bt = useMemo(() => backtest(series), [series]);
  const breakdown = useMemo(() => groupTotals(filtered, dim), [filtered, dim]);
  const sql = buildSql(region, category);
  const fixedSample = useMemo(() => rows.filter((r) => r.fixes?.length).slice(0, 5), [rows]);

  const regionGrowth = useMemo(
    () =>
      REGIONS.map((r) => ({ r, g: kpis(monthlySeries(filterRows(rows, r, category))).yoy }))
        .filter((x) => region === 'All' || x.r === region)
        .sort((a, b) => b.g - a.g),
    [rows, category, region]
  );

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  const Trend = k.yoy >= 0 ? LuTrendingUp : LuTrendingDown;

  return (
    <div className="demo demo-insight">
      <div className="demo-head">
        <div>
          <p className="demo-label">InsightForge · analytics workspace</p>
          <p className="demo-note">Runs in your browser on a generated 2-year retail dataset (4 regions × 5 categories). The cleaning, SQL and forecast logic mirror the Python pipeline.</p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="if-pipeline card-inner">
        <div className="if-pipeline-head">
          <h3><LuDatabase aria-hidden="true" /> Data pipeline</h3>
          <button type="button" className="btn btn-small btn-ghost" onClick={runPipeline} disabled={!ready}>
            <LuPlay aria-hidden="true" /> {ready ? 'Re-run pipeline' : 'Running…'}
          </button>
        </div>
        <ol className="if-steps">
          {report.map((s, i) => (
            <li key={s.step} className={i < stage ? 'is-done' : i === stage ? 'is-active' : ''}>
              <span className="if-step-dot" aria-hidden="true">{i < stage ? '✓' : i + 1}</span>
              <div>
                <p className="if-step-name">{s.step}</p>
                <p className="if-step-detail">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <details className="if-fixed">
          <summary>See sample rows the pipeline fixed</summary>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>id</th><th>month</th><th>region</th><th>category</th><th>fix applied</th></tr>
              </thead>
              <tbody>
                {fixedSample.map((r) => (
                  <tr key={r.id}><td>{r.id}</td><td>{r.month}</td><td>{r.region}</td><td>{r.category}</td><td>{r.fixes.join('; ')}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>

      {/* Filters */}
      <div className="if-filters" role="group" aria-label="Dashboard filters">
        <label>
          Region
          <select value={region} onChange={(e) => setRegion(e.target.value)} disabled={!ready}>
            <option>All</option>
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={!ready}>
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <button type="button" className="btn btn-small btn-ghost" onClick={() => setShowTable((v) => !v)} aria-pressed={showTable}>
          {showTable ? <LuChartLine aria-hidden="true" /> : <LuTable2 aria-hidden="true" />} {showTable ? 'Chart view' : 'Table view'}
        </button>
      </div>

      <div className={`if-dashboard ${ready ? '' : 'is-loading'}`} aria-busy={!ready}>
        <div className="kpi-grid">
          <div className="kpi"><p>Revenue 2025</p><b>{formatINR(k.revenue)}</b></div>
          <div className="kpi"><p>Orders 2025</p><b>{formatNum(k.orders)}</b></div>
          <div className="kpi"><p>Avg order value</p><b>{formatINR(k.aov, false)}</b></div>
          <div className="kpi">
            <p>Growth vs 2024</p>
            <b className="kpi-trend"><Trend aria-hidden="true" /> {k.yoy >= 0 ? '+' : ''}{(k.yoy * 100).toFixed(1)}%</b>
          </div>
        </div>

        <div className="if-charts">
          <div className="card-inner">
            <h4 className="chart-title">Monthly revenue <span>· dashed = 3-month forecast</span></h4>
            {showTable ? (
              <div className="table-scroll tall">
                <table className="data-table">
                  <thead><tr><th>Month</th><th>Revenue</th><th>Orders</th></tr></thead>
                  <tbody>
                    {series.map((s) => <tr key={s.key}><td>{s.label} {s.year}</td><td>{formatINR(s.revenue, false)}</td><td>{s.orders.toLocaleString('en-IN')}</td></tr>)}
                    {future.map((f) => <tr key={f.key}><td>{f.label} {f.year} (forecast)</td><td>{formatINR(f.revenue, false)}</td><td>–</td></tr>)}
                  </tbody>
                </table>
              </div>
            ) : (
              <RevenueChart series={series} future={future} />
            )}
          </div>

          <div className="card-inner">
            <div className="chart-title-row">
              <h4 className="chart-title">2025 revenue by</h4>
              <div className="segmented" role="group" aria-label="Breakdown dimension">
                <button type="button" aria-pressed={dim === 'category'} onClick={() => setDim('category')}>Category</button>
                <button type="button" aria-pressed={dim === 'region'} onClick={() => setDim('region')}>Region</button>
              </div>
            </div>
            <BarChart data={breakdown} />
          </div>
        </div>

        <div className="if-bottom">
          <div className="card-inner if-insights">
            <h4 className="chart-title">Findings for this view</h4>
            <ul className="bolt-list">
              {breakdown[0] && <li><b>{breakdown[0].name}</b> leads 2025 revenue at {formatINR(breakdown[0].value)}.</li>}
              {regionGrowth[0] && <li>Fastest growth: <b>{regionGrowth[0].r}</b> at {(regionGrowth[0].g * 100).toFixed(1)}% year on year.</li>}
              <li>Festive months (Oct–Nov) are the clear peak; the forecast carries that seasonality forward.</li>
              <li>Backtest on the last 3 months: model error {bt.model.toFixed(1)}% vs {bt.naive.toFixed(1)}% for a naive same-month-last-year baseline (MAPE).</li>
            </ul>
          </div>
          <div className="card-inner if-sql">
            <div className="chart-title-row">
              <h4 className="chart-title">Equivalent SQL</h4>
              <button type="button" className="icon-btn" onClick={copySql} aria-label={copied ? 'SQL copied' : 'Copy SQL'}>
                {copied ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
              </button>
            </div>
            <pre className="code-block"><code>{sql}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
