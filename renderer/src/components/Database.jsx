import Button from './Button.jsx';

export default function Database({
  user = 'root',
  database = 'GERBD',
  system = 'Acesse',
  onEdit,
}) {
  return (
    <article className="card database_card">
      <h2 className="card_title">Bancos de dados</h2>
      <div className="card_content">
        <div className="database_summary">
          <div className="database_summary_header">
            <span className="database_name">Nome Banco</span>
            <Button
              className="icon_button"
              aria-label="Editar banco de dados"
              onClick={onEdit}
            >
              &#9998;
            </Button>
          </div>
          <p>
            <span className="summary_key">User:</span> {user}
          </p>
          <p>
            <span className="summary_key">Banco de dados:</span> {database}
          </p>
          <p>
            <span className="summary_key">Sistema:</span> {system}
          </p>
        </div>
      </div>
    </article>
  );
}
