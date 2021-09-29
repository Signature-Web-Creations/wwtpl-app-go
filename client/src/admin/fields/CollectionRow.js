function CollectionRow(props) {
  const handleCheckbox = (event) => {
    // add each option to the list
  }

  return (
    <tr>
      <td>
        <strong>Collection</strong>
      </td>
      <td>
        {props.collections.map(({ id, name }) => (
          <>
            <label>
              <input
                class="uk-checkbox"
                type="checkbox"
                onChange={handleCheckbox(id)}
              />
              &nbsp;&nbsp; {name}
            </label>
            <br />
          </>
        ))}
      </td>
    </tr>
  )
}

export default CollectionRow
