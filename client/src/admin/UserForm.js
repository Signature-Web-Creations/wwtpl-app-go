import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createUser, getUserRoles } from '../api.js'

import MessageBox from './MessageBox.js'

// capitalize a string
function capitalize(s) {
  if (s.length > 0) {
    return s[0].toUpperCase() + s.slice(1)
  }
  return s
}

function UserForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Every role defaults to being an editor. 1 means editor
  const [roleId, setRoleId] = useState(1)

  const [roles, setRoles] = useState([])

  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const clearForm = () => {
    setFirstName('')
    setLastName('')
    setUsername('')
    setPassword('')
    setRoleId(1)
  }

  useEffect(() => {
    getUserRoles().then((data) => {
      if (data.roles) {
        setRoles(data.roles)
      }
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const userData = { firstName, lastName, username, password, roleId }
    createUser(userData).then((res) => {
      if (res.success) {
        setMessage(res.success)
        clearForm()
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

  const changeRole = (event) => {
    const roleId = parseInt(event.target.value)
    if (isNaN(roleId)) {
      setRoleId(1)
    } else {
      setRoleId(roleId)
    }
  }

  return (
    <form
      className="uk-form-stacked uk-form-width-large uk-margin-top"
      onSubmit={handleSubmit}
    >
      {message && (
        <MessageBox
          onClick={() => {
            setMessage(null)
          }}
          message={message}
          type="success"
        />
      )}
      {error && (
        <MessageBox
          onClick={() => {
            setError(null)
          }}
          message={error}
          type="error"
        />
      )}

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
      <div>
        <label className="uk-form-label uk-margin-top">Role</label>
        <select value={roleId} onChange={changeRole}>
          {roles.length !== 0 &&
            roles.map(({ id, name }) => (
              <option value={id} key={id}>
                {' '}
                {capitalize(name)}{' '}
              </option>
            ))}
        </select>
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
