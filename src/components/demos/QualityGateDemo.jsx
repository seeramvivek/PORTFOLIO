import { useEffect, useMemo, useRef, useState } from 'react';
import { LuPlay, LuRotateCcw, LuCircleCheck, LuCircleX, LuCircle, LuLoaderCircle, LuGitBranch, LuBug, LuShieldCheck, LuShieldAlert } from 'react-icons/lu';
import { createShopLite } from './lib/shoplite';
import { TESTS, runTest } from './lib/qualityTests';

const BUILDS = [
  { id: 'main', label: 'main', note: 'reviewed baseline' },
  { id: 'feature/checkout-refactor', label: 'feature/checkout-refactor', note: 'open pull request' },
];

const STAGES = ['Checkout', 'Install', 'Lint', 'Test suite', 'Report', 'Merge gate'];

const CODE = {
  pytest: `# tests/e2e/test_checkout.py
import pytest
from pages.cart_page import CartPage

@pytest.mark.regression
@pytest.mark.parametrize("amount, expected_shipping", [
    (998, "₹49"),   # just below the threshold
    (999, "₹0"),    # exactly at the threshold
])
def test_free_shipping_boundary(page, seeded_product, amount, expected_shipping):
    cart = CartPage(page)
    cart.open()
    cart.add_product(seeded_product(price=amount))
    assert cart.shipping_text() == expected_shipping`,
  api: `# tests/api/test_orders_api.py
import pytest

@pytest.mark.api
def test_create_order_persists_row(api_client, auth_token, db):
    res = api_client.post("/api/orders",
                          json={"items": [{"sku": "SKU-101", "qty": 2}]},
                          headers={"Authorization": f"Bearer {auth_token}"})
    assert res.status_code == 201
    order_id = res.json()["id"]

    row = db.fetch_one(
        "SELECT status, total FROM orders WHERE id = %s", (order_id,))
    assert row["status"] == "PLACED"
    assert row["total"] == res.json()["total"]`,
  java: `// src/test/java/smoke/LoginSmokeTest.java
class LoginSmokeTest extends BaseTest {

    @Test
    @DisplayName("Valid user lands on the products page")
    void validLoginShowsProducts() {
        driver.get(baseUrl + "/login");
        driver.findElement(By.id("email")).sendKeys("asha@example.com");
        driver.findElement(By.id("password")).sendKeys("Secret123");
        driver.findElement(By.cssSelector("button[type=submit]")).click();

        wait.until(ExpectedConditions.urlContains("/products"));
        assertTrue(driver.findElement(By.id("product-grid")).isDisplayed());
    }
}`,
};

function StatusIcon({ status }) {
  if (status === 'passed') return <LuCircleCheck className="st-pass" aria-label="Passed" />;
  if (status === 'failed') return <LuCircleX className="st-fail" aria-label="Failed" />;
  if (status === 'running') return <LuLoaderCircle className="spin st-run" aria-label="Running" />;
  return <LuCircle className="st-idle" aria-label="Not run" />;
}

export default function QualityGateDemo() {
  const [build, setBuild] = useState('feature/checkout-refactor');
  const [results, setResults] = useState({});
  const [cursor, setCursor] = useState(-1); // index of the running test, -1 = idle
  const [tab, setTab] = useState('pytest');
  const timer = useRef(null);
  const shop = useMemo(() => createShopLite(build), [build]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const reset = () => {
    clearTimeout(timer.current);
    setResults({});
    setCursor(-1);
  };

  const changeBuild = (id) => {
    reset();
    setBuild(id);
  };

  const run = () => {
    reset();
    let i = 0;
    const step = () => {
      if (i >= TESTS.length) {
        setCursor(-1);
        return;
      }
      setCursor(i);
      const test = TESTS[i];
      timer.current = setTimeout(() => {
        const r = runTest(test, shop);
        setResults((prev) => ({ ...prev, [test.id]: r }));
        i += 1;
        step();
      }, 170);
    };
    step();
  };

  const running = cursor >= 0;
  const done = !running && Object.keys(results).length === TESTS.length;
  const failed = TESTS.filter((t) => results[t.id]?.status === 'failed');
  const passed = TESTS.filter((t) => results[t.id]?.status === 'passed');
  const progress = (Object.keys(results).length / TESTS.length) * 100;

  const stageState = (i) => {
    if (!running && !done) return 'idle';
    if (i < 3) return 'ok';
    if (i === 3) return running ? 'run' : failed.length ? 'fail' : 'ok';
    if (!done) return 'idle';
    if (i === 4) return 'ok';
    return failed.length ? 'fail' : 'ok';
  };

  return (
    <div className="demo demo-quality">
      <div className="demo-head">
        <div>
          <p className="demo-label">QualityGate · test runner</p>
          <p className="demo-note">These 14 test cases really execute in your browser against ShopLite&apos;s pricing and login rules. Pick a branch and run the suite.</p>
        </div>
      </div>

      <div className="qg-toolbar">
        <div className="qg-branches" role="radiogroup" aria-label="Branch under test">
          {BUILDS.map((b) => (
            <button key={b.id} type="button" role="radio" aria-checked={build === b.id} className={build === b.id ? 'is-active' : ''} onClick={() => changeBuild(b.id)} disabled={running}>
              <LuGitBranch aria-hidden="true" />
              <span>{b.label}</span>
              <em>{b.note}</em>
            </button>
          ))}
        </div>
        <div className="qg-run">
          <button type="button" className="btn btn-primary btn-small" onClick={run} disabled={running}>
            {running ? <LuLoaderCircle className="spin" aria-hidden="true" /> : <LuPlay aria-hidden="true" />} {running ? 'Running…' : 'Run test suite'}
          </button>
          <button type="button" className="icon-btn" onClick={reset} disabled={running} aria-label="Reset results">
            <LuRotateCcw aria-hidden="true" />
          </button>
        </div>
      </div>

      <ol className="qg-stages" aria-label="CI pipeline">
        {STAGES.map((s, i) => {
          const st = stageState(i);
          return (
            <li key={s} className={`stage is-${st}`}>
              <span className="stage-dot" aria-hidden="true" />
              {s}
              <span className="sr-only"> ({st === 'ok' ? 'passed' : st === 'fail' ? 'failed' : st === 'run' ? 'running' : 'pending'})</span>
            </li>
          );
        })}
      </ol>

      <div className="qg-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>

      <div className="qg-grid">
        <div className="card-inner qg-results">
          <div className="qg-summary" aria-live="polite">
            <span className="sum-pass"><LuCircleCheck aria-hidden="true" /> {passed.length} passed</span>
            <span className="sum-fail"><LuCircleX aria-hidden="true" /> {failed.length} failed</span>
            <span className="sum-total">{TESTS.length} total</span>
          </div>
          <div className="table-scroll">
            <table className="data-table qg-table">
              <thead>
                <tr><th scope="col"><span className="sr-only">Status</span></th><th scope="col">ID</th><th scope="col">Test case</th><th scope="col">Technique</th></tr>
              </thead>
              <tbody>
                {TESTS.map((t, i) => {
                  const r = results[t.id];
                  const status = cursor === i ? 'running' : r?.status;
                  return (
                    <tr key={t.id} className={status === 'failed' ? 'row-fail' : ''}>
                      <td><StatusIcon status={status} /></td>
                      <td className="mono">{t.id}</td>
                      <td>
                        {t.title}
                        <span className={`tech-tag qg-tech-inline t-${t.technique.toLowerCase()}`}>{t.technique}</span>
                        {r?.status === 'failed' && <p className="qg-msg">{r.message}</p>}
                      </td>
                      <td><span className={`tech-tag t-${t.technique.toLowerCase()}`}>{t.technique}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="qg-side">
          <div className={`card-inner qg-gate ${done ? (failed.length ? 'is-blocked' : 'is-open') : ''}`}>
            {done ? (
              failed.length ? (
                <>
                  <LuShieldAlert aria-hidden="true" />
                  <div><h4>Merge blocked</h4><p>{failed.length} regression{failed.length > 1 ? 's' : ''} found. Bug reports were drafted below.</p></div>
                </>
              ) : (
                <>
                  <LuShieldCheck aria-hidden="true" />
                  <div><h4>Ready to merge</h4><p>All {TESTS.length} checks passed on <code>{build}</code>.</p></div>
                </>
              )
            ) : (
              <>
                <LuShieldCheck aria-hidden="true" />
                <div><h4>Quality gate</h4><p>Run the suite to decide whether <code>{build}</code> can merge.</p></div>
              </>
            )}
          </div>

          {failed.length > 0 && (
            <div className="qg-bugs">
              <h4 className="chart-title"><LuBug aria-hidden="true" /> Drafted bug reports</h4>
              {failed.map((t, n) => {
                const r = results[t.id];
                return (
                  <article key={t.id} className="bug-card">
                    <header>
                      <span className="mono">BUG-{String(101 + n)}</span>
                      <span className={`sev sev-${t.severity.toLowerCase()}`}>{t.severity}</span>
                    </header>
                    <h5>{t.bug || `${t.title}: check failed`}</h5>
                    <ol>
                      {t.steps.map((s) => <li key={s}>{s}</li>)}
                    </ol>
                    <dl>
                      <div><dt>Expected</dt><dd>{r.expected}</dd></div>
                      <div><dt>Actual</dt><dd>{r.actual}</dd></div>
                    </dl>
                    <p className="bug-foot">Found by {t.id} ({t.technique.toLowerCase()}) on <code>{build}</code></p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card-inner qg-code">
        <div className="chart-title-row">
          <h4 className="chart-title">From the framework</h4>
          <div className="segmented" role="tablist" aria-label="Framework code samples">
            <button type="button" role="tab" aria-selected={tab === 'pytest'} aria-pressed={tab === 'pytest'} onClick={() => setTab('pytest')}>Playwright + Pytest</button>
            <button type="button" role="tab" aria-selected={tab === 'api'} aria-pressed={tab === 'api'} onClick={() => setTab('api')}>API + SQL</button>
            <button type="button" role="tab" aria-selected={tab === 'java'} aria-pressed={tab === 'java'} onClick={() => setTab('java')}>Selenium · Java</button>
          </div>
        </div>
        <pre className="code-block" role="tabpanel"><code>{CODE[tab]}</code></pre>
      </div>
    </div>
  );
}
