import { useState } from 'react';
import Configuration from './components/Configuration.jsx';
import Database from './components/Database.jsx';
import Login from './components/Login.jsx';
import Output from './components/Output.jsx';
import Test from './components/Test.jsx';
import ForceSend from './components/ForceSend.jsx';

export default function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <main className="app_shell">
      <header className="app_header">
        <img src="/images/logo.png" alt="Smart programas para empresas" />
      </header>

      <section
        className="settings_stack"
        aria-label="Configurações do aplicativo"
      >
        <Login />
        <Database />

        <article className="card tests_card">
          <h2 className="card_title">Ações</h2>
          <div className="card_content tests_content">
            <Test label="Testar conexão com o servidor" buttonLabel="Testar" />
            <Test
              label="Testar conexão com o banco de dados"
              buttonLabel="Testar"
            />
            <ForceSend />
          </div>
        </article>

        <Configuration />
      </section>

      <section className="status_section" aria-labelledby="status_title">
        <h2 id="status_title" className="card_title">
          Status
        </h2>
        <div className="status_content">
          <Output className="status_log" />
        </div>
      </section>
    </main>
  );
}
