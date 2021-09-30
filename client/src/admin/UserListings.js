import {Link} from 'react-router-dom'
import {getUsers} from '../api'
import {useState, useEffect} from 'react'

function UserRow(props) {
  const {id, firstName, lastName, username, role} = props

  const deleteUser = function (){
  }

  return (
    <tr>
      <td> 
        <Link
          to={`/editUser/${id}`}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="file-edit"
        ></Link>
      </td>
      <td>
        <Link
          onClick={() => deleteUser(id)}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="trash"
        ></Link>
      </td> 
      <td>{lastName}</td>
      <td>{firstName}</td>
      <td>{username}</td>
      <td>{role}</td>
    </tr>
  )
}

export default function UserListings(props) {
  const [users, setUsers] = useState([]) 

  useEffect(() => {
    const users = getUsers().then((data) => {
      if (data.users) {
        setUsers(data.users)
      }
    })
  }, [])

  return (
    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
      <thead>
        <tr>
          <th className="uk-table-small"></th>
          <th className="uk-table-small"></th>
          <th className="uk-width-small">Last Name</th>
          <th>First Name</th>
          <th>Username</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({id, firstName, lastName, username, role}) => (
          <UserRow
            id={id}
            firstName={firstName}
            lastName={lastName}
            username={username}
            role={role}
          />
        ))}
      </tbody>
    </table>
  )
}
