import {getSourceArchives, addSourceArchive, updateSourceArchive} from '../api'
import {useState, useEffect} from 'react'

function SourceArchiveRow(props) {
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

export default function SourceArchiveListings(props) {
  const [sourceArchives, setSourceArchives] = useState([]) 
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(-1) 

  const changeName = (id, name) => {
    setSourceArchives(sourceArchives.map(s => {
      if (id === s.id) {
        return Object.assign(s, {name})
      } else {
        return s
      }
    }))
  }

  const handleAdd = () => {
    if (name.trim().length === 0) {
      console.log("Name cannot be empty") 
    }

    addSourceArchive(name).then((data) => {
      if (data.success) {
        console.log(data.success)
        const s = {id: data.id, name: name}
        setSourceArchives(sourceArchives.concat([s]))
        setName('')
      } else {
        console.log(data.error)
      }
    })
  }

  const handleUpdate = (id, name) => {
    updateSourceArchive(id, name).then((data) => {
      if (data.success) {
        console.log(data.success)
        setEditId(-1)
      } else {
        console.log(data.error)
      }
    })
  }

  useEffect(() => {
    getSourceArchives().then((data) => {
      if (data.sourceArchives) {
        setSourceArchives(data.sourceArchives)
      }
    })
  }, [])

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
                onClick={handleAdd}>Add </button>
            </td>
          </tr>
          {sourceArchives.map(({id, name}) => (
            <SourceArchiveRow
              id={id}
              key={id}
              name={name}
              editable={id === editId}
              onChange={(e) => { 
                changeName(id, e.target.value)
              }}
              onClickSave={() => handleUpdate(id, name)}
              onClickEdit={() => setEditId(id)} 
            />
          ))}
        </tbody>
      </table>
      {sourceArchives.length === 0 && 
        <p> There are no source archives </p>
      }
    </div>
  )
}
