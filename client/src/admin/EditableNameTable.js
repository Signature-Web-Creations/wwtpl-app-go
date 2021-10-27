import {useState} from 'react'

// Each row has a single column name. 
// You can click on the edit button to 
// edit the name on the row and click
// save to save changes to the database.
// Only one row can be edited at a time
function Row(props) {
  const {name, editable} = props

  return (
    <tr>
      <td>
      {editable ? 
        <input
          type="text"
          value={name}
          onChange={props.onChange}
        /> :
          <> {name} </>
      }
      </td>
     
      <td>
      {editable ? 
        <button 
          onClick={props.onClickSave}
        >
          Save
        </button> :
        <button
          onClick={props.onClickEdit}
        >
          Edit
        </button>
      } 
      </td>
    </tr>
  )
}

// Props:
// - handleAdd: function that is used to add data to the table
//   Called when you click the add button. 
//   Given the name being added as an argument
// - handleUpdate: function that is used to update a row in the table
//   Called when you click save on a row that you were edititng
//   Given the id and the name of the row you were editing
// - handleChange: function that is called when you edit data on a row
//   Given to the id and the name of the row you were editing
// - rows: List of rows to display. Expects the list to be nonempty
export default function EditableNameTable(props) {
  // The top row. Used to add new entries to the table
  const [name, setName] = useState('')

  // The id of the row currently being edited
  const [editId, setEditId] = useState(-1)

  return (
    <div>
      <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
        <thead>
          <tr>
            <th className="uk-table-large">Name</th>
            <th className="uk-table-small"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input 
                type="text" 
                value={name}
                onChange={(e) => 
                    setName(e.target.value)
                }
              />
            </td>
            <td>
              <button
                onClick={() => {
                  if(props.handleAdd(name)) {
                    setName('')
                  }
              }}>
                Add
              </button>
            </td>
          </tr>
          {props.rows.map(({id, name}) => (
            <Row
              id={id}
              key={id}
              name={name}
              editable={id === editId}
              onChange={(e) => { 
                props.handleChange(id, e.target.value)
              }}
              onClickSave={() => {
                if (props.handleUpdate(id, name)) {
                  setEditId(-1)
                }
              }}
              onClickEdit={() => setEditId(id)} 
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
