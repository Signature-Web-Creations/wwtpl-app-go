function SourceArchiveRow(props) {
  const handleSelect = (event) => {
    // add each option to the list
  }

  return (
    <tr>
      <td>
        <strong>Source Archive</strong>
      </td>
      <td>
        <select className="uk-select" onChange={handleSelect}>
          <option value=""> Select One </option>
          {props.sourceArchives.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </td>
    </tr>
  )
}

export default SourceArchiveRow
