function ContentRow(props) {
  return (
    <tr>
      <td>
        <strong>Content</strong>
      </td>
      <td>
        <textarea
          className="uk-textarea"
          rows="5"
          placeholder="Description"
          value={props.content}
        ></textarea>
      </td>
    </tr>
  )
}

export default ContentRow
