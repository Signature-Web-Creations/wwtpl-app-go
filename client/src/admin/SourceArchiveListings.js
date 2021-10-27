import {useState, useEffect} from 'react'
import {getSourceArchives, addSourceArchive, updateSourceArchive} from '../api'
import EditableNameTable from './EditableNameTable'


export default function SourceArchiveListings(props) {
  const [sourceArchives, setSourceArchives] = useState([]) 

  const handleAdd = (name) => {
    if (name.trim().length === 0) {
      console.log("Name cannot be empty") 
    }

    return addSourceArchive(name).then((data) => {
      if (data.success) {
        console.log(data.success)
        const s = {id: data.id, name: name}
        setSourceArchives(sourceArchives.concat([s]))
        return true
      } else {
        console.log(data.error)
        return false
      }
    }).then(result => result)
  }

  const handleChange = (id, name) => {
    setSourceArchives(sourceArchives.map(s => {
      if (id === s.id) {
        return Object.assign(s, {name})
      } else {
        return s
      }
    }))
  }


  const handleUpdate = (id, name) => {
    return updateSourceArchive(id, name).then((data) => {
      if (data.success) {
        console.log(data.success)
        return true
      } else {
        console.log(data.error)
        return false
      }
    }).then(result => result)
  }

  useEffect(() => {
    getSourceArchives().then((data) => {
      if (data.sourceArchives) {
        setSourceArchives(data.sourceArchives)
      }
    })
  }, [])

  return (
    <EditableNameTable
      title={"Manage Source Archives"}
      rows={sourceArchives}
      handleAdd={handleAdd}
      handleChange={handleChange}
      handleUpdate={handleUpdate} />
    
  )
}
