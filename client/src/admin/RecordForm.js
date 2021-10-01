import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import { getPublicRecordByID } from '../api'

import MessageBox from '../MessageBox'

function RecordForm(props) {
  let { id } = useParams()

  const [title, setTitle] = useState('')

  const newRecord = id === undefined

  const [message, setMessage] = useState(null)


  useEffect(() => {
    if (!newRecord) {
      // Populate form fields with record
    }
  }, [newRecord, id])

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleCloseBox = (message) => {
    setMessage(message)
  }

  const header = newRecord ? "New Record" : "Edit Record"

  return (
    <form className="uk-form-stacked uk-margin-top" onSubmit={handleSubmit}>
      {message && (
        <MessageBox
          onChange={handleCloseBox}
          message={message}
          type="error"
        />
      )}
      <h1> {header} </h1> 

      <div> 
        <label> Title </label>
        <input type="text" value={title} onChange={setTitle} />
      </div> 

      <input
        className="uk-button uk-button-primary uk-margin-top"
        type="submit"
        value="Add Record"
      />
    </form>
    )
}


export default RecordForm;
