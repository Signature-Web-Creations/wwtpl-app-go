function DateRow(props) {
  return (
    <tr>
      <td>
        <strong>Date</strong>
      </td>
      <td>
        <input
          className="uk-input"
          type="date"
          placeholder="Input"
          value={props.date}
        />
      </td>
    </tr>
  )
}

export default DateRow
