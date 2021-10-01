function TitleRow(props) {
  return (
    <tr>
      <td className="uk-width-medium">
        <strong>Title</strong>
      </td>
      <td>
        <input
          className="uk-input"
          type="text"
          placeholder="Title"
          value={props.title}
        />
      </td>
    </tr>
  )
}

export default TitleRow
