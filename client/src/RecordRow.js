export default function RecordRow(props) {
  let href = `/record/${props.id}`
  return (
    <tr>
      <td>{props.date}</td>
      <td>{props.title}</td>
      <td>
        <a href={href} className="uk-button uk-button-primary"> View </a>
      </td>
    </tr>
  );
}
