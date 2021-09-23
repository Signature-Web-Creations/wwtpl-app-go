import {useState} from 'react';
import {login} from './api';
import {Redirect} from 'react-router-dom'; 


export default function LoginForm(props) {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("") 
  const [error, setError] = useState(null)
  const [redirect, setRedirect] = useState(false)

  const changeUsername = (event) => {
    setError(null)
    setUsername(event.target.value)
  }

  const changePassword = (event) => {
    setError(null)
    setPassword(event.target.value)
  }

  async function handleLoginResult(response){
    const loginResult = await response.json()
    if (loginResult.error) {
      setError(loginResult.error)
    } 

    if (loginResult.success) {
      setRedirect(true)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = login(username, password)
    result.then(result => {
      handleLoginResult(result)
    })
  }

  if (redirect) {
    console.log("Should be redirecting");
    return <Redirect to="/dashboard" />
  }
  
  return (
    <form className="uk-form-stacked" onSubmit={handleSubmit}>

      <p>{error}</p>
      <div>
        <label className="uk-form-label"> Username </label>
        <input className="uk-form-width-large uk-input" type="text" name="username"
               onChange={changeUsername} value={username} /> 
      </div>
      <div>
        <label className="uk-form-label"> Password </label>
        <input className="uk-form-width-large uk-input" type="password" name="password"
               onChange={changePassword} value={password} />
      </div>
      <input className="uk-button uk-button-primary" type="submit" value="login" /> 
    </form>
  );
}
