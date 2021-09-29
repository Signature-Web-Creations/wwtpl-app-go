import { Link } from 'react-router-dom'

function EditFieldType(props) {
  const handleDeleteFieldOption = () => {
    // intiate delete record
  }

  const handleEditFieldOption = () => {
    // edit the name of field option
  }

  return (
    <tr>
      <td>
        <Link
          onClick={handleEditFieldOption}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="file-edit"
        ></Link>
      </td>
      <td>
        <Link
          onClick={handleDeleteFieldOption}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="trash"
        ></Link>
      </td>
      <td>{props.name}</td>
    </tr>
  )
}

export default EditFieldType
