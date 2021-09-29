import { useState } from 'react'
import { useAuth } from './auth.js'
import { Redirect } from 'react-router-dom'

export default function LoginForm(props) {
  const auth = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    auth.signin(username, password, () => setError)
  }

  const handleCloseErrorBox = () => {
    setError(null)
  }

  function ErrorBox() {
    return (
      <div uk-alert="true" className="uk-alert-danger">
        <span
          className="uk-alert-close"
          uk-close="true"
          onClick={handleCloseErrorBox}
        ></span>
        <p>{error}</p>
      </div>
    )
  }

  console.log(auth.user)
  if (auth.user) {
    return <Redirect to="/" />
  }

  return (
    <form
      className="uk-form-stacked uk-form-width-large uk-margin-top"
      onSubmit={handleSubmit}
    >
      {error && <ErrorBox />}

      <div>
        <label className="uk-form-label"> Username </label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          name="username"
          onChange={changeUsername}
          value={username}
        />
      </div>
      <div>
        <label className="uk-form-label"> Password </label>
        <input
          className="uk-form-width-large uk-input"
          type="password"
          name="password"
          onChange={changePassword}
          value={password}
        />
      </div>
      <input
        className="uk-button uk-button-primary uk-margin-top"
        type="submit"
        value="login"
      />
    </form>
  )
}
