import { Link } from 'react-router-dom'
import { UrlFor } from '../routes.js'
import { useAuth } from '../auth.js'

function RecordRow(props) {
  const auth = useAuth()

  const handleStatusColor = (status) => {
    if (status === 'unpublished') {
      return 'uk-label uk-label-warning'
    } else if (status === 'deleted') {
      return 'uk-label uk-label-danger'
    } else if (status === "pending_approval") {
      return 'uk-label'
    } else {
      return 'uk-label uk-label-success'
    }
  }

  const editUrl = UrlFor('editRecord', { id: props.id })

  return (
    <tr>
      <td>
        <Link
          to={editUrl}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="file-edit"
        ></Link>
      </td>
      {auth.user.role === 'admin' && (
        <td>
          <button
            onClick={props.onDelete}
            className="uk-icon-link uk-margin-small-right"
            uk-icon={props.deleted ? "refresh" : "trash"}
          ></button>
        </td>
      )}
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>
        {props.deleted 
          ? <span className={handleStatusColor("deleted")}> Deleted </span>
          : <span className={handleStatusColor(props.status.name)}>{props.status.name}</span>
        }
      </td>
    </tr>
  )
}

export default RecordRow
