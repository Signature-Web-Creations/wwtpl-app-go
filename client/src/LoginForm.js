import {useState} from 'react';
import {login} from './api';

async function handleLoginResult(response, onError){
  // can we get the cookie that was set by the header 

  const loginResult = await response.json()
  if (!loginResult.succeeded) {
    onError(loginResult.errorMessage)
  } else {
    console.log('login result: ', loginResult)
  }
}

export default function LoginForm(props) {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("") 
  const [error, setError] = useState(null)

  const changeUsername = (event) => {
    setError(null)
    setUsername(event.target.value)
  }

  const changePassword = (event) => {
    setError(null)
    setPassword(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = login(username, password)
    result.then(result => {
      handleLoginResult(result, setError)
    })
  }

  return (
    <form class="uk-form-stacked" method="POST" action="/login" onSubmit={handleSubmit}>

      <p>{error}</p>
      <div>
        <label class="uk-form-label"> Username </label>
        <input class="uk-form-width-large uk-input" type="text" name="username"
               onChange={changeUsername} value={username} /> 
      </div>
      <div>
        <label class="uk-form-label"> Password </label>
        <input class="uk-form-width-large uk-input" type="text" name="password"
               onChange={changePassword} value={password} />
      </div>
      <input class="uk-button uk-button-primary" type="submit" value="login" /> 
    </form>
  );
}
