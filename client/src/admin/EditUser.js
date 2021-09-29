import { useState } from 'react'
import { Link } from 'react-router-dom'

function EditUser() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleCloseErrorBox = () => {
    setError(null)
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

  function ErrorBox() {
    return (
      <div uk-alert={true} className="uk-alert-danger">
        <Link
          className="uk-alert-close"
          uk-close={true}
          onClick={handleCloseErrorBox}
        ></Link>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <form
      className="uk-form-stacked uk-form-width-large uk-margin-top"
      onSubmit={handleSubmit}
    >
      {error && <ErrorBox />}

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

export default EditUser
