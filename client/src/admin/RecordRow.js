import { Link } from 'react-router-dom'

function RecordRow(props) {
  const handleDeleteRecord = () => {
    // intiate delete record
  }

  const editUrl = `/editrecord/${props.id}`

  let statusClass = ''
  if (props.status === 'published') {
    statusClass = 'uk-label-success'
  } else if (props.status === 'unpublished') {
    statusClass = 'uk-label-warning'
  } else if (props.status === 'deleted') {
    statusClass = 'uk-label-error'
  }

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
        <span className="uk-label {statusClass}">{props.status}</span>
      </td>
    </tr>
  )
}

export default RecordRow
