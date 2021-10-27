import { Link } from 'react-router-dom'
import { getUsers, disableUser, enableUser } from '../api'
import { useState, useEffect } from 'react'
import { UrlFor } from '../routes.js'

function UserRow(props) {
  const { id, firstName, lastName, username, role, active } = props

  const handleStatusColor = (active) => {
    if (!active) {
      return 'uk-label uk-label-warning'
    } else {
      return 'uk-label uk-label-success'
    }
  }

  return (
    <tr>
      <td>
        <Link
          to={UrlFor('editUser', { id })}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="file-edit"
        ></Link>
      </td>
      <td>
        <button
          onClick={props.changeStatus}
          className="uk-icon-link uk-margin-small-right"
          uk-icon={active ? 'trash' : 'refresh'}
        ></button>
      </td>
      <td>{lastName}</td>
      <td>{firstName}</td>
      <td>{username}</td>
      <td>{role}</td>
      <td>
        <span className={handleStatusColor(active)}>
          {active ? 'Active' : 'Inactive'}
        </span>
      </td>
    </tr>
  )
}

export default function UserListings(props) {
  const [users, setUsers] = useState([])

  const toggleStatus = (userId) => {
    let active = true
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        user.active = !user.active
        active = !user.active
        return user
      } else {
        return user
      }
    })
    if (active) {
      disableUser(userId)
    } else {
      enableUser(userId)
    }
    setUsers(updatedUsers)
  }

  useEffect(() => {
    getUsers().then((data) => {
      if (data.users) {
        setUsers(data.users)
      }
    })
  }, [])

  return (
    <div>
      <Link
        to={UrlFor('addUser')}
        className="uk-button uk-button-primary uk-margin-right"
      >
        {' '}
        Add New User{' '}
      </Link>

      <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
        <thead>
          <tr>
            <th className="uk-table-small"></th>
            <th className="uk-table-small"></th>
            <th className="uk-width-small">Last Name</th>
            <th>First Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, firstName, lastName, username, role, active }) => (
            <UserRow
              id={id}
              firstName={firstName}
              lastName={lastName}
              username={username}
              role={role}
              active={active}
              changeStatus={() => {
                toggleStatus(id)
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
