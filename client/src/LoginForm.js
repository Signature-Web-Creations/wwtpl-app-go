
export default function LoginForm(props) {
  return (
    <form class="uk-form-stacked" method="POST" action="/login">
      <p>{props.error}</p>
      <div>
        <label class="uk-form-label"> Username </label>
        <input class="uk-form-width-large uk-input" type="text" name="username" /> 
      </div>
      <div>
        <label class="uk-form-label"> Password </label>
        <input class="uk-form-width-large uk-input" type="text" name="password" />
      </div>
      <input class="uk-button uk-button-primary" type="submit" value="login" /> 
    </form>
  );
}
