import Output from './Output.jsx';
import Button from './Button.jsx';

export default function Action({ label, buttonLabel }) {
  return (
    <div className="test_item">
      <span className="field_label">{label}</span>
      <Output />
      <Button>{buttonLabel}</Button>
    </div>
  );
}
