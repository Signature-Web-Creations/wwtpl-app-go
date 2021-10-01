import {Link} from 'react-router-dom'
import {getUsers, disableUser} from '../api'
import {useState, useEffect} from 'react'

function UserRow(props) {

  const {id, firstName, lastName, username, role} = props

  const deleteUser = function (e){
    e.preventDefault();
    const userId = parseInt(id) 
    if (isNaN(userId)) {
      console.log('Id was not a number') 
    }
    disableUser(id).then(response => {
      if (response.error) {
        console.log(response.error)
      } else {
        console.log(response.success)
      }
    })
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
          onClick={deleteUser}
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
    getUsers().then((data) => {
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
