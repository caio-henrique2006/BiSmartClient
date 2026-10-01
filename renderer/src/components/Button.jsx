export default function Button({
  children,
  className = 'action_button',
  ...props
}) {
  return (
    <button className={className} type="button" {...props}>
      {children}
    </button>
  );
}
