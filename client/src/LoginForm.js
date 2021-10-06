import { useState } from 'react'
import { useAuth } from './auth.js'
import { Redirect } from 'react-router-dom'

import MessageBox from './MessageBox.js'

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
    auth.signin(username, password, (value) => setError(value))
  }

  const handleCloseBox = () => {
    setError(null)
  }

  if (auth.user) {
    return <Redirect to="/dashboard" />
  }

  return (
    <form
      className="uk-form-stacked uk-form-width-large uk-margin-top"
      onSubmit={handleSubmit}
    >
      {error && (
        <MessageBox onClick={handleCloseBox} message={error} type="error" />
      )}

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
