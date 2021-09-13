
export default function LoginForm(props) {
  return (
    <form method="POST" action="/login">
      <p>{props.error}</p>
      <label> Username </label>
      <input type="text" name="username" /> 
      <label> Password </label>
      <input type="text" name="password" />
      <input type="submit" value="login" /> 
    </form>
  );
}
