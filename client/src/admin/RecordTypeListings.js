import {useState, useEffect} from 'react'
import {getRecordTypes, addRecordType, updateRecordType} from '../api'
import EditableNameTable from './EditableNameTable'


export default function RecordTypeListings(props) {
  const [recordTypes, setRecordTypes] = useState([]) 

  const handleAdd = (name) => {
    if (name.trim().length === 0) {
      console.log("Name cannot be empty") 
    }

    return addRecordType(name).then((data) => {
      if (data.success) {
        console.log(data.success)
        const s = {id: data.id, name: name}
        setRecordTypes(recordTypes.concat([s]))
        return true
      } else {
        console.log(data.error)
        return false
      }
    }).then(result => result)
  }

  const handleChange = (id, name) => {
    setRecordTypes(recordTypes.map(s => {
      if (id === s.id) {
        return Object.assign(s, {name})
      } else {
        return s
      }
    }))
  }


  const handleUpdate = (id, name) => {
    return updateRecordType(id, name).then((data) => {
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
    getRecordTypes().then((data) => {
      if (data.recordTypes) {
        setRecordTypes(data.recordTypes)
      }
    })
  }, [])

  return (
    <EditableNameTable
      title={"Manage Record Types"}
      rows={recordTypes}
      handleAdd={handleAdd}
      handleChange={handleChange}
      handleUpdate={handleUpdate} />
  )
}
