import { Link } from 'react-router-dom'
import { UrlFor } from '../routes.js'
import { useAuth } from '../auth.js'

function RecordRow(props) {
  const auth = useAuth()
  const handleDeleteRecord = () => {
    // intiate delete record
  }

  const handleStatusColor = (status) => {
    if (status === 'unpublished') {
      return 'uk-label uk-label-warning'
    } else if (status === 'deleted') {
      return 'uk-label uk-label-error'
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
            onClick={handleDeleteRecord}
            className="uk-icon-link uk-margin-small-right"
            uk-icon="trash"
          ></button>
        </td>
      )}
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>
        <span className={handleStatusColor(props.status.name)}>{props.status.name}</span>
      </td>
    </tr>
  )
}

export default RecordRow
