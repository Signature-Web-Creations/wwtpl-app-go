import { Link } from 'react-router-dom'

function RecordRow(props) {
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

  const editUrl = `/editrecord/${props.id}`

  return (
    <tr>
      <td>
        <Link
          to={editUrl}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="file-edit"
        ></Link>
      </td>
      <td>
        <Link
          onClick={handleDeleteRecord}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="trash"
        ></Link>
      </td>
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>
        <span className={handleStatusColor(props.status)}>{props.status}</span>
      </td>
    </tr>
  )
}

export default RecordRow
