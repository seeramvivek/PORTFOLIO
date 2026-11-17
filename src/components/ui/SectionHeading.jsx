export default function SectionHeading({ index, eyebrow, title, intro, align = 'left', id }) {
  return (
    <header className={`section-heading align-${align}`} data-reveal>
      <p className="eyebrow">
        {index && <span className="eyebrow-index">{index}</span>}
        {eyebrow}
      </p>
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
}
