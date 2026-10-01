export default function Output({ children, className = 'status_output' }) {
  return (
    <output className={className} aria-live="polite">
      {children}
    </output>
  );
}
