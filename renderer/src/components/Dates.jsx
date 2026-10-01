import Input from './Input.jsx';

export default function Dates({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  return (
    <div className="status_action_row">
      <Input
        id="force_send_start_date"
        className="text_input date_input"
        type="date"
        value={startDate}
        onChange={onStartDateChange}
      />
      <span aria-hidden="true">-</span>
      <Input
        id="force_send_end_date"
        className="text_input date_input"
        type="date"
        value={endDate}
        onChange={onEndDateChange}
      />
    </div>
  );
}
