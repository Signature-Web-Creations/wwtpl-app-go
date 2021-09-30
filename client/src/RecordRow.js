import { Link } from 'react-router-dom'
import { UrlFor } from './routes'

export default function RecordRow(props) {
  // let href = `/record/${props.id}`
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>{props.type}</td>
      <td>
        <Link
          to={UrlFor('viewRecord', { id: props.id })}
          className="uk-button uk-button-primary"
        >
          {' '}
          View{' '}
        </Link>
      </td>
    </tr>
  )
}
