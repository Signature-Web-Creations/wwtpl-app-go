import {useState, useEffect} from 'react'
import {getCollections, addCollection, updateCollection} from '../api'
import EditableNameTable from './EditableNameTable'


export default function CollectionListings(props) {
  const [collections, setCollections] = useState([]) 

  const handleAdd = (name) => {
    if (name.trim().length === 0) {
      console.log("Name cannot be empty") 
    }

    return addCollection(name).then((data) => {
      if (data.success) {
        console.log(data.success)
        const s = {id: data.id, name: name}
        setCollections(collections.concat([s]))
        return true
      } else {
        console.log(data.error)
        return false
      }
    }).then(result => result)
  }

  const handleChange = (id, name) => {
    setCollections(collections.map(s => {
      if (id === s.id) {
        return Object.assign(s, {name})
      } else {
        return s
      }
    }))
  }


  const handleUpdate = (id, name) => {
    return updateCollection(id, name).then((data) => {
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
    getCollections().then((data) => {
      if (data.collections) {
        setCollections(data.collections)
      }
    })
  }, [])

  return (
    <EditableNameTable
      title={"Manage Collections"}
      rows={collections}
      handleAdd={handleAdd}
      handleChange={handleChange}
      handleUpdate={handleUpdate} />
  )
}
