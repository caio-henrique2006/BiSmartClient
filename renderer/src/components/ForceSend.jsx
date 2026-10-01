import { useState } from 'react';
import Dates from './Dates.jsx';
import Output from './Output.jsx';
import Button from './Button.jsx';

export default function ForceSend() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  return (
    <div className="test_item">
      <label className="field_label" htmlFor="force_send_start_date">
        Forçar envio de dados
      </label>
      <Dates
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(event) => setStartDate(event.target.value)}
        onEndDateChange={(event) => setEndDate(event.target.value)}
      />
      <Output />
      <Button>Enviar</Button>
    </div>
  );
}
