import Button from './Button.jsx';
import Input from './Input.jsx';

export default function Login({ onSubmit }) {
  return (
    <article className="card login_card">
      <h1 className="card_title">Login BISmart</h1>
      <div className="card_content">
        <Input id="login_email_input" label="Email" type="email" />
        <Input id="login_password_input" label="Senha" type="password" />
        <Button onClick={onSubmit}>Salvar</Button>
      </div>
    </article>
  );
}
