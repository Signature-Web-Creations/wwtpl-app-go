import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { createUser, updateUser, getUser, getUserRoles } from '../api.js'

import MessageBox from '../MessageBox.js'

// capitalize a string
function capitalize(s) {
  if (s.length > 0) {
    return s[0].toUpperCase() + s.slice(1)
  }
  return s
}

const EDITOR = 1
const PUBLISHER = 2
const ADMIN = 3

function ToggleButton(props) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        props.toggle(!props.on)    
      }}
    >
      {props.on ? props.onText : props.offText}
    </button>
  )
}

function UserForm() {

  const { id } = useParams() 
  const isNewUser = id === undefined 
  console.log("Id is:", id)
  console.log("Is New Record", isNewUser)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [disableUsername, setDisableUsername] = useState(false)
  const [disablePassword, setDisablePassword] = useState(false)

  const [roleId, setRoleId] = useState(EDITOR)

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
    if (!isNewUser) {
      console.log("Getting data for user: ", id)
      getUser(id).then((data) => {
        if (data.user) {
          console.log("Got user data")
          setFirstName(data.user.firstName)
          setLastName(data.user.lastName)
          setUsername(data.user.username)

          if (data.user.role === "editor") {
            setRoleId(EDITOR)
          } else if (data.user.role === "publisher") {
            setRoleId(PUBLISHER)
          } else if (data.user.role === "admin") {
            setRoleId(ADMIN)
          }

          setDisableUsername(true)
          setDisablePassword(true) 
        }
      })
    }
    getUserRoles().then((data) => {
      if (data.roles) {
        setRoles(data.roles)
      }
    })
  }, [id, isNewUser])

  const handleSubmit = (event) => {
    event.preventDefault()
    const userData = { firstName, lastName, username, password, roleId }
    if (isNewUser) {
      createUser(userData).then((res) => {
        if (res.success) {
          setMessage(res.success)
          clearForm()
        } else {
          setError(res.error)
        }
      })
    } else {
      const userData = { firstName, lastName, roleId } 
      if (!disableUsername) {
        userData['username'] = username
      } 
     
      // Assuming that if they are changing password 
      // something is there. A better solution would be
      // to have validation. Can be changed later
      if (!disablePassword && password.length !== 0) {
        userData['password'] = password
      }

      updateUser(id, userData).then((res) => {
        if (res.success) {
          setMessage(res.success)
        } else {
          setError(res.error)
        }
      })
    }
  }

  const changeFirstName = (event) => {
    setFirstName(event.target.value)
  }

  const changeLastName = (event) => {
    setLastName(event.target.value)
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
          disabled={disableUsername}
        />
        {isNewUser === false && 
          <ToggleButton 
            offText="lock username"
            onText="change username"
            on={disableUsername} 
            toggle={setDisableUsername} 
          />
        }
      </div>
      <div>
        <label className="uk-form-label uk-margin-top">Password</label>
        <input
          className="uk-form-width-large uk-input"
          type="password"
          name="password"
          onChange={changePassword}
          value={password}
          disabled={disablePassword}
        />
        {isNewUser === false && 
          <ToggleButton 
            offText="lock password"
            onText="change password"
            on={disablePassword} 
            toggle={setDisablePassword} 
          />
        }
      </div>
      <div>
        <label className="uk-form-label uk-margin-top">Role</label>
        <select className="uk-select" value={roleId} onChange={changeRole}>
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
        value={isNewUser ? "Create User" : "Update User"}
      />
    </form>
  )
}

export default UserForm
