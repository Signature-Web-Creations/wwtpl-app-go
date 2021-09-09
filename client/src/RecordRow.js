export default function RecordRow(props) {
  let href = `/record/${props.id}`
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>
        <a className="uk-button uk-button-primary" type="button"> View </a>
      </td>
    </tr>
  );
}
