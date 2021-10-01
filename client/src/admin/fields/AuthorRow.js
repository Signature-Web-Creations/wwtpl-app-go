function AuthorRow(props) {
  return (
    <tr>
      <td>
        <strong>Author</strong>
      </td>
      <td>
        <input
          className="uk-input"
          type="text"
          placeholder="Author"
          value={props.author}
        />
      </td>
    </tr>
  )
}

export default AuthorRow
