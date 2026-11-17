import { useEffect, useRef, useState } from 'react';
import { LuPlus, LuSparkles, LuChevronLeft, LuChevronRight, LuRadio, LuUsers, LuListChecks, LuLoaderCircle, LuTrash2 } from 'react-icons/lu';

const COLUMNS = [
  { id: 'todo', name: 'To do' },
  { id: 'doing', name: 'In progress' },
  { id: 'done', name: 'Done' },
];
const ORDER = COLUMNS.map((c) => c.id);

const TEAM = {
  you: { name: 'You', initials: 'SV', color: '#5eead4' },
  riya: { name: 'Riya', initials: 'RA', color: '#f9a8d4' },
  arjun: { name: 'Arjun', initials: 'AK', color: '#fcd34d' },
};

const SEED = [
  { id: 1, title: 'Design the login page', tag: 'UI', col: 'todo', owner: 'riya', subtasks: [] },
  { id: 2, title: 'Add rate limiting to the auth API', tag: 'API', col: 'todo', owner: 'arjun', subtasks: [] },
  { id: 3, title: 'Show who is online on the board', tag: 'Realtime', col: 'doing', owner: 'you', subtasks: [] },
  { id: 4, title: 'Write tests for task permissions', tag: 'Testing', col: 'doing', owner: 'arjun', subtasks: [] },
  { id: 5, title: 'Set up refresh-token rotation', tag: 'API', col: 'done', owner: 'you', subtasks: [] },
];

// Stand-in for the Python AI service: same output shape (a JSON list of subtasks), generated from rules.
const PLAYBOOK = [
  { match: /login|sign ?in|auth|password|token/i, steps: ['Define validation rules and error messages', 'Build the form component with accessible labels', 'Wire it to POST /api/v1/auth/login', 'Handle 401 and lockout responses', 'Add tests for success and failure paths'] },
  { match: /api|endpoint|rate|limit|route/i, steps: ['Agree on the request and response contract', 'Implement the Express route and validation middleware', 'Return consistent error objects', 'Add integration tests for edge cases', 'Document the endpoint in the API reference'] },
  { match: /online|presence|realtime|socket|live/i, steps: ['Emit presence:join and presence:leave on connect/disconnect', 'Track active users per workspace room', 'Render avatars in the board header', 'Debounce updates to avoid flicker', 'Test with two browser sessions'] },
  { match: /test|qa|bug|permission/i, steps: ['List roles and the actions each may perform', 'Write a test matrix of allowed and denied cases', 'Automate API tests for each role', 'Add a regression test for every bug found', 'Run the suite in CI on every pull request'] },
  { match: /design|page|ui|screen|layout/i, steps: ['Sketch the layout for mobile and desktop', 'Build reusable components', 'Check colour contrast and keyboard navigation', 'Connect to the API with loading and error states', 'Review with the team and polish'] },
];
const GENERIC = ['Clarify the acceptance criteria', 'Break the work into small pull requests', 'Implement the core change', 'Add tests and update documentation', 'Demo it to the team for feedback'];

const suggest = (title) => (PLAYBOOK.find((p) => p.match.test(title))?.steps || GENERIC).slice(0, 4);

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

function Avatar({ who, small }) {
  const m = TEAM[who];
  return (
    <span className={`avatar ${small ? 'is-small' : ''}`} style={{ '--c': m.color }} title={m.name} aria-label={m.name}>
      {m.initials}
    </span>
  );
}

export default function SprintMindDemo() {
  const [tasks, setTasks] = useState(SEED);
  const [events, setEvents] = useState([{ t: now(), who: 'you', type: 'board:joined', text: 'You joined the Sprint 12 board' }]);
  const [selected, setSelected] = useState(3);
  const [draft, setDraft] = useState('');
  const [live, setLive] = useState(true);
  const [ai, setAi] = useState({ loading: false, taskId: null });
  const [dragId, setDragId] = useState(null);
  const nextId = useRef(SEED.length + 1);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const log = (who, type, text) => setEvents((ev) => [{ t: now(), who, type, text }, ...ev].slice(0, 30));

  const move = (id, col, who = 'you') => {
    const task = tasksRef.current.find((t) => t.id === id);
    if (!task || task.col === col) return;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, col } : t)));
    const colName = COLUMNS.find((c) => c.id === col).name;
    log(who, 'task:moved', `${TEAM[who].name} moved “${task.title}” to ${colName}`);
  };

  const shift = (id, dir) => {
    const task = tasks.find((t) => t.id === id);
    const i = ORDER.indexOf(task.col) + dir;
    if (i >= 0 && i < ORDER.length) move(id, ORDER[i]);
  };

  const addTask = (e) => {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    const id = nextId.current++;
    setTasks((ts) => [...ts, { id, title: title.slice(0, 80), tag: 'New', col: 'todo', owner: 'you', subtasks: [] }]);
    setSelected(id);
    setDraft('');
    log('you', 'task:created', `You created “${title.slice(0, 80)}”`);
  };

  const removeTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((ts) => ts.filter((t) => t.id !== id));
    if (selected === id) setSelected(null);
    log('you', 'task:deleted', `You deleted “${task.title}”`);
  };

  const breakDown = () => {
    const task = tasks.find((t) => t.id === selected);
    if (!task || ai.loading) return;
    setAi({ loading: true, taskId: task.id });
    log('you', 'ai:requested', `AI breakdown requested for “${task.title}”`);
    const steps = suggest(task.title);
    setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, subtasks: [] } : t)));
    steps.forEach((s, k) => {
      setTimeout(() => {
        setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, subtasks: [...t.subtasks, { text: s, done: false }] } : t)));
        if (k === steps.length - 1) {
          setAi({ loading: false, taskId: null });
          log('you', 'ai:completed', `${steps.length} subtasks added to “${task.title}”`);
        }
      }, 450 + k * 380);
    });
  };

  const toggleSub = (taskId, idx) => {
    setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, subtasks: t.subtasks.map((s, i) => (i === idx ? { ...s, done: !s.done } : s)) } : t)));
  };

  // Simulated teammates broadcasting events, as the Socket.IO room would.
  useEffect(() => {
    if (!live) return undefined;
    const timer = setInterval(() => {
      const mates = ['riya', 'arjun'];
      const who = mates[Math.floor(Math.random() * mates.length)];
      const open = tasksRef.current.filter((t) => t.col !== 'done');
      if (!open.length) return;
      const task = open[Math.floor(Math.random() * open.length)];
      if (Math.random() < 0.55) {
        const next = ORDER[ORDER.indexOf(task.col) + 1];
        move(task.id, next, who);
      } else {
        const notes = ['left a comment', 'updated the description', 'added a checklist item', 'attached a screenshot'];
        log(who, 'comment:added', `${TEAM[who].name} ${notes[Math.floor(Math.random() * notes.length)]} on “${task.title}”`);
      }
    }, 4200);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);

  const sel = tasks.find((t) => t.id === selected);
  const doneCount = tasks.filter((t) => t.col === 'done').length;

  return (
    <div className="demo demo-sprint">
      <div className="demo-head">
        <div>
          <p className="demo-label">SprintMind · Sprint 12 board</p>
          <p className="demo-note">Runs in your browser. Teammate activity and AI responses are simulated locally to show the real-time and AI flows; nothing is sent to a server.</p>
        </div>
        <div className="sm-presence">
          <LuUsers aria-hidden="true" />
          <span className="avatar-stack">
            <Avatar who="you" small />
            {live && <Avatar who="riya" small />}
            {live && <Avatar who="arjun" small />}
          </span>
          <label className="switch">
            <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} />
            <span className="switch-track" aria-hidden="true" />
            Live teammates
          </label>
        </div>
      </div>

      <form className="sm-add" onSubmit={addTask}>
        <label htmlFor="sm-new" className="sr-only">New task title</label>
        <input id="sm-new" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task, e.g. “Build password reset API”" maxLength={80} />
        <button type="submit" className="btn btn-primary btn-small" disabled={!draft.trim()}>
          <LuPlus aria-hidden="true" /> Add
        </button>
      </form>

      <div className="sm-layout">
        <div className="sm-board">
          {COLUMNS.map((col, ci) => {
            const items = tasks.filter((t) => t.col === col.id);
            return (
              <section
                key={col.id}
                className={`sm-col ${dragId ? 'is-droppable' : ''}`}
                aria-label={`${col.name}, ${items.length} tasks`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) move(dragId, col.id);
                  setDragId(null);
                }}
              >
                <h4>{col.name} <span>{items.length}</span></h4>
                <ul>
                  {items.map((t) => (
                    <li
                      key={t.id}
                      className={`sm-card ${selected === t.id ? 'is-selected' : ''}`}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => setDragId(null)}
                    >
                      <button type="button" className="sm-card-main" onClick={() => setSelected(t.id)} aria-pressed={selected === t.id}>
                        <span className={`sm-tag tag-${t.tag.toLowerCase()}`}>{t.tag}</span>
                        <span className="sm-card-title">{t.title}</span>
                        {t.subtasks.length > 0 && (
                          <span className="sm-progress">
                            <LuListChecks aria-hidden="true" /> {t.subtasks.filter((s) => s.done).length}/{t.subtasks.length}
                          </span>
                        )}
                      </button>
                      <div className="sm-card-foot">
                        <Avatar who={t.owner} small />
                        <span className="sm-moves">
                          <button type="button" onClick={() => shift(t.id, -1)} disabled={ci === 0} aria-label={`Move “${t.title}” left`}><LuChevronLeft aria-hidden="true" /></button>
                          <button type="button" onClick={() => shift(t.id, 1)} disabled={ci === COLUMNS.length - 1} aria-label={`Move “${t.title}” right`}><LuChevronRight aria-hidden="true" /></button>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <aside className="sm-side">
          <div className="card-inner sm-detail">
            {sel ? (
              <>
                <div className="sm-detail-head">
                  <span className={`sm-tag tag-${sel.tag.toLowerCase()}`}>{sel.tag}</span>
                  <button type="button" className="icon-btn" onClick={() => removeTask(sel.id)} aria-label={`Delete “${sel.title}”`}>
                    <LuTrash2 aria-hidden="true" />
                  </button>
                </div>
                <h4>{sel.title}</h4>
                <button type="button" className="btn btn-small btn-ai" onClick={breakDown} disabled={ai.loading}>
                  {ai.loading ? <LuLoaderCircle className="spin" aria-hidden="true" /> : <LuSparkles aria-hidden="true" />}
                  {ai.loading ? 'Thinking…' : 'Break down with AI'}
                </button>
                {sel.subtasks.length > 0 ? (
                  <ul className="sm-subtasks" aria-live="polite">
                    {sel.subtasks.map((s, i) => (
                      <li key={s.text}>
                        <label>
                          <input type="checkbox" checked={s.done} onChange={() => toggleSub(sel.id, i)} />
                          <span>{s.text}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sm-empty">No subtasks yet. Let the AI suggest a checklist.</p>
                )}
              </>
            ) : (
              <p className="sm-empty">Select a task to see details and AI tools.</p>
            )}
          </div>

          <div className="card-inner sm-feed">
            <h4 className="chart-title"><LuRadio aria-hidden="true" /> Socket events <span>· {doneCount}/{tasks.length} done</span></h4>
            <ol>
              {events.map((e, i) => (
                <li key={`${e.t}-${i}-${e.type}`}>
                  <Avatar who={e.who} small />
                  <div>
                    <p>{e.text}</p>
                    <code>{e.type} · {e.t}</code>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
