import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createUser, getUserRoles } from '../api.js'

function UserForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    const userData = {firstName, lastName, username, password}
    createUser(userData).then((res) => {
      if (res.success) {
        setMessage(res.success)
      } else {
        setError(res.error)
      }
    })
  }

  const changeFirstName = (event) => {
    setFirstName(event.target.value)
  }

  const changeLastName = (event) => {
    setLastName(event.target.value)
    setUsername(
      firstName.charAt(0).toLowerCase() + event.target.value.toLowerCase(),
    )
  }

  const changeUsername = (event) => {
    setUsername(event.target.value)
  }

  const changePassword = (event) => {
    setPassword(event.target.value)
  }

  function SuccessBox(props) {
    return (
      <div uk-alert={true} className="uk-alert-success">
        <Link
          className="uk-alert-close"
          uk-close={true}
          onClick={() => {
            setMessage(null)
          }}
        ></Link>
        <p>{props.message}</p>
      </div>
    )
  }

  function ErrorBox(props) {
    return (
      <div uk-alert={true} className="uk-alert-danger">
        <Link
          className="uk-alert-close"
          uk-close={true}
          onClick={() => {
            setError(null)
          }}
        ></Link>
        <p>{props.message}</p>
      </div>
    )
  }

  return (
    <form
      className="uk-form-stacked uk-form-width-large uk-margin-top"
      onSubmit={handleSubmit}
    >
      {message && <SuccessBox message={message}/>}
      {error && <ErrorBox message={error}/>}

      <div>
        <label className="uk-form-label uk-margin-top">First Name</label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          name="firstName"
          onChange={changeFirstName}
          value={firstName}
        />
      </div>
      <div>
        <label className="uk-form-label uk-margin-top">Last Name</label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          name="lastName"
          onChange={changeLastName}
          value={lastName}
        />
      </div>
      <div>
        <label className="uk-form-label uk-margin-top">Username</label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          name="username"
          onChange={changeUsername}
          value={username}
        />
      </div>
      <div>
        <label className="uk-form-label uk-margin-top">Password</label>
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
        value="Create User"
      />
    </form>
  )
}

export default UserForm
