function RecordTypeRow(props) {
  const handleSelect = (event) => {
    // add each option to the list
  }

  const isSelected = (name) => {
    if (props.type === name) {
      return true
    } else {
      return false
    }
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
            <option key={id} value={id} selected={isSelected(name)}>
              {name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  )
}

export default RecordTypeRow
