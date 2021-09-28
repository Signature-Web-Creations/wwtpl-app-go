import {Link} from 'react-router-dom'

export default function RecordRow(props) {
  let href = `/record/${props.id}`
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>
        <Link to={href} className="uk-button uk-button-primary"> View </Link>
      </td>
    </tr>
  );
}
