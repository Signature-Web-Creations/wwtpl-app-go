import { Link } from 'react-router-dom'

function RecordRow(props) {
  const handleDeleteRecord = () => {
    // intiate delete record
  }

  const editUrl = `/editrecord/${props.id}`

  let statusClass = 'uk-label'
  statusClass = props.status === 'published' && 'uk-label uk-label-success'
  statusClass = props.status === 'unpublished' && 'uk-label uk-label-warning'
  statusClass = props.status === 'deleted' && 'uk-label uk-label-error'

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
        <span className={statusClass}>{props.status}</span>
      </td>
    </tr>
  )
}

export default RecordRow
