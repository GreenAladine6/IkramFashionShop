export function Heading({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return <div className="section-heading">{eyebrow && <div className="eyebrow">{eyebrow}</div>}<div className="display-title" role="heading" aria-level={2}>{title}</div>{text && <p>{text}</p>}</div>;
}
