import { useState } from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { LuMail, LuMapPin, LuCopy, LuCheck, LuSend, LuLoaderCircle, LuCircleCheck, LuTriangleAlert } from 'react-icons/lu';
import SectionHeading from '../ui/SectionHeading.jsx';
import { profile } from '../../data/profile';

const FORMSPREE = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY = { name: '', email: '', subject: '', message: '', 'bot-field': '' };

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (values.subject.length > 120) errors.subject = 'Keep the subject under 120 characters.';
  const msg = values.message.trim();
  if (msg.length < 10) errors.message = 'Your message should be at least 10 characters.';
  else if (msg.length > 2000) errors.message = 'Please keep your message under 2000 characters.';
  return errors;
}

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

// Sends to Formspree when VITE_FORMSPREE_ENDPOINT is set; otherwise posts to Netlify Forms
// via the static skeleton file public/__forms.html.
async function sendMessage(values) {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim() || 'Portfolio enquiry',
    message: values.message.trim(),
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = FORMSPREE
      ? await fetch(FORMSPREE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      : await fetch('/__forms.html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({ 'form-name': 'contact', 'bot-field': values['bot-field'], ...payload }),
          signal: controller.signal,
        });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  } finally {
    clearTimeout(timer);
  }
}

function Field({ id, label, error, children, hint }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [copied, setCopied] = useState(false);

  const update = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(validate(next));
  };

  const blur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(validate(values));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(found).length) {
      document.getElementById(`cf-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (values['bot-field']) {
      setStatus('success'); // quietly ignore bots
      return;
    }
    setStatus('sending');
    try {
      await sendMessage(values);
      setStatus('success');
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      console.warn('Contact form error:', err.message);
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const describedBy = (name) => (errors[name] && touched[name] ? `cf-${name}-error` : undefined);

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          index="04"
          eyebrow="Contact"
          id="contact-title"
          title="Let's build something together"
          intro="I'm looking for roles in software development, data and quality engineering. If you have an opportunity or a question about my work, I'd be glad to hear from you."
        />

        <div className="contact-grid">
          <div className="contact-cards" data-reveal>
            <div className="card contact-card">
              <span className="icon-tile"><LuMail aria-hidden="true" /></span>
              <div>
                <p className="contact-label">Email</p>
                <a href={`mailto:${profile.email}`} className="contact-value">{profile.email}</a>
              </div>
              <button type="button" className="icon-btn" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'}>
                {copied ? <LuCheck aria-hidden="true" /> : <LuCopy aria-hidden="true" />}
              </button>
            </div>
            <a className="card contact-card is-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <span className="icon-tile"><FaLinkedinIn aria-hidden="true" /></span>
              <div>
                <p className="contact-label">LinkedIn</p>
                <p className="contact-value">vivek-seeram</p>
              </div>
            </a>
            <a className="card contact-card is-link" href={profile.github} target="_blank" rel="noopener noreferrer">
              <span className="icon-tile"><FaGithub aria-hidden="true" /></span>
              <div>
                <p className="contact-label">GitHub</p>
                <p className="contact-value">seeramvivek</p>
              </div>
            </a>
            <div className="card contact-card">
              <span className="icon-tile"><LuMapPin aria-hidden="true" /></span>
              <div>
                <p className="contact-label">Location</p>
                <p className="contact-value">{profile.location}</p>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</p>
          </div>

          <div className="card form-card" data-reveal style={{ '--delay': '120ms' }}>
            {status === 'success' ? (
              <div className="form-success" role="status">
                <LuCircleCheck aria-hidden="true" />
                <h3>Message sent</h3>
                <p>Thanks for reaching out. I&apos;ll reply to your email as soon as I can.</p>
                <button type="button" className="btn btn-ghost" onClick={() => setStatus('idle')}>
                  Send another message
                </button>
              </div>
            ) : (
              <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} noValidate>
                <input type="hidden" name="form-name" value="contact" />
                <p className="honeypot" aria-hidden="true">
                  <label>
                    Leave this empty
                    <input name="bot-field" tabIndex={-1} autoComplete="off" value={values['bot-field']} onChange={update} />
                  </label>
                </p>

                <div className="field-row">
                  <Field id="cf-name" label="Name" error={touched.name && errors.name}>
                    <input id="cf-name" name="name" autoComplete="name" value={values.name} onChange={update} onBlur={blur} aria-invalid={Boolean(touched.name && errors.name)} aria-describedby={describedBy('name')} required />
                  </Field>
                  <Field id="cf-email" label="Email" error={touched.email && errors.email}>
                    <input id="cf-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update} onBlur={blur} aria-invalid={Boolean(touched.email && errors.email)} aria-describedby={describedBy('email')} required />
                  </Field>
                </div>
                <Field id="cf-subject" label="Subject (optional)" error={touched.subject && errors.subject}>
                  <input id="cf-subject" name="subject" value={values.subject} onChange={update} onBlur={blur} aria-invalid={Boolean(touched.subject && errors.subject)} aria-describedby={describedBy('subject')} />
                </Field>
                <Field id="cf-message" label="Message" error={touched.message && errors.message} hint={`${values.message.trim().length}/2000`}>
                  <textarea id="cf-message" name="message" rows={6} value={values.message} onChange={update} onBlur={blur} aria-invalid={Boolean(touched.message && errors.message)} aria-describedby={describedBy('message')} required />
                </Field>

                {status === 'error' && (
                  <div className="form-alert" role="alert">
                    <LuTriangleAlert aria-hidden="true" />
                    <p>
                      Your message couldn&apos;t be sent right now. Please try again, or email me directly at{' '}
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                    </p>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <LuLoaderCircle className="spin" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <LuSend aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
