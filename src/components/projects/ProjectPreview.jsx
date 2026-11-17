// Decorative mini interfaces used as project thumbnails (pure HTML/CSS, no images to load).
import { generateRawRows, cleanRows, monthlySeries, kpis, formatINR, formatNum } from '../demos/lib/insightData';

// Thumbnail figures come from the same dataset the InsightForge preview uses.
const insightKpis = (() => {
  const series = monthlySeries(cleanRows(generateRawRows()).rows);
  const k = kpis(series);
  const max = Math.max(...series.slice(12).map((s) => s.revenue));
  return { ...k, bars: series.slice(12).map((s) => Math.round((s.revenue / max) * 100)) };
})();

function SprintMindPreview() {
  const cols = [
    { name: 'To do', cards: [['Design login flow', 'UI'], ['Rate-limit auth API', 'API']] },
    { name: 'In progress', cards: [['Socket presence', 'RT'], ['AI subtask prompt', 'AI']] },
    { name: 'Done', cards: [['JWT refresh rotation', 'API']] },
  ];
  return (
    <div className="pv pv-sprint">
      <div className="pv-topbar">
        <span className="pv-title">Sprint 12 · Web app</span>
        <span className="pv-avatars"><i>RA</i><i>AK</i><i>SV</i></span>
      </div>
      <div className="pv-board">
        {cols.map((c) => (
          <div key={c.name} className="pv-col">
            <p>{c.name}</p>
            {c.cards.map(([t, tag]) => (
              <div key={t} className={`pv-card tag-${tag}`}>
                <span>{t}</span>
                <em>{tag}</em>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pv-ai">✦ AI: 4 subtasks suggested for “Socket presence”</div>
    </div>
  );
}

function InsightPreview() {
  const { bars, revenue, orders, yoy } = insightKpis;
  return (
    <div className="pv pv-insight">
      <div className="pv-kpis">
        <div><p>Revenue</p><b>{formatINR(revenue)}</b></div>
        <div><p>Orders</p><b>{formatNum(orders)}</b></div>
        <div><p>YoY</p><b className="up">+{(yoy * 100).toFixed(1)}%</b></div>
      </div>
      <div className="pv-chart">
        {bars.map((h, i) => (
          <span key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="pv-pipeline">
        <span>ingest</span><span>clean</span><span>load</span><span>model</span>
      </div>
    </div>
  );
}

function QualityPreview() {
  const lines = [
    ['pass', 'test_login_valid_credentials'],
    ['pass', 'test_cart_subtotal'],
    ['fail', 'test_free_shipping_at_999'],
    ['pass', 'test_coupon_save10_min_order'],
    ['pass', 'test_api_orders_schema'],
  ];
  return (
    <div className="pv pv-quality">
      <div className="pv-term-bar">pytest -m regression</div>
      <div className="pv-term">
        {lines.map(([s, n]) => (
          <p key={n} className={`pv-line is-${s}`}>
            <b>{s === 'pass' ? 'PASSED' : 'FAILED'}</b> {n}
          </p>
        ))}
      </div>
      <div className="pv-stages">
        <span className="ok">build</span><span className="ok">api</span><span className="bad">e2e</span><span>merge</span>
      </div>
    </div>
  );
}

export default function ProjectPreview({ slug }) {
  return (
    <div className="project-preview" aria-hidden="true">
      {slug === 'sprintmind' && <SprintMindPreview />}
      {slug === 'insightforge' && <InsightPreview />}
      {slug === 'qualitygate' && <QualityPreview />}
    </div>
  );
}
