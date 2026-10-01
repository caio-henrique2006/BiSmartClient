export default function Configuration() {
  const configurations = [];
  return (
    <article className="card configuration_card">
      <h2 className="card_title">Configurações</h2>
      <div className="card_content configuration_list">
        {configurations.map((configuration) => (
          <label className="checkbox_field" key={configuration.id}>
            <input
              type="checkbox"
              checked={Boolean(configuration.checked)}
              onChange={(event) =>
                onChange?.(configuration.id, event.target.checked)
              }
            />
            <span>{configuration.label}</span>
          </label>
        ))}
      </div>
    </article>
  );
}
