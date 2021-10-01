function RecordIdRow(props) {
  return (
    <tr>
      <td>
        <strong>Record ID</strong>
      </td>
      <td>
        <input
          className="uk-input"
          type="text"
          disabled={true}
          placeholder="Record ID"
          value={props.id}
        />
      </td>
    </tr>
  )
}

export default RecordIdRow
