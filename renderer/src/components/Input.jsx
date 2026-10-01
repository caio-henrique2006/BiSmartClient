export default function Input({ label, id, ...props }) {
  return (
    <div className="input_container">
      {label && (
        <label className="field_label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className="text_input" {...props} />
    </div>
  );
}
