function RecordTypeRow(props) {
  const handleSelect = (event) => {
    // add each option to the list
  }

  return (
    <tr>
      <td>
        <strong>Type</strong>
      </td>
      <td>
        <select className="uk-select" onChange={handleSelect}>
          <option value=""> Select One </option>
          {props.recordTypes.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  )
}

export default RecordTypeRow
