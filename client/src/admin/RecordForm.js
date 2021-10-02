import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// import { getPublicRecordByID } from '../api'


import MessageBox from '../MessageBox'

function RecordForm(props) {
  let { id } = useParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [origin, setOrigin] = useState('')
  const [author, setAuthor] = useState('')

  const [recordType, setRecordType] = useState('');
  const [sourceArchive, setSourceArchive] = useState(''); 
  const [collections, setCollections] = useState([])

  const newRecord = id === undefined

  const [message, setMessage] = useState(null)


  useEffect(() => {
    if (!newRecord) {
      // Populate form fields with record
    }
  }, [newRecord, id])

  const handleCollection = (id) => {
    if (collections.includes(id)) {
      setCollections(collections.filter(i => i != id))
    } else {
      setCollections(collections.concat(id))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const recordData = {
      title,
      content, 
      date, 
      origin,
      author,
      recordType, 
      sourceArchive,
      collections 
    }

    console.log(recordData)
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
        <label className="uk-form-label"> Title </label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value) } } />
      </div> 

      <div> 
        <label className="uk-form-label"> Content </label>
        <textarea 
          className="uk-form-width-large uk-textarea"
          value={content}
          onChange={(e) => { setContent(e.target.value) } } />
      </div> 

      <div> 
        <label className="uk-form-label"> Date </label>
        <input 
          className="uk-form-width-large uk-input"
          type="text"
          value={date}
          onChange={(e) => { setDate(e.target.value) } } />
      </div> 


      <div> 
        <label className="uk-form-label"> Origin </label>
        <input 
          className="uk-form-width-large uk-input"
          type="text" 
          value={origin}
          onChange={(e) => { setOrigin(e.target.value) } } />
      </div> 

      <div> 
        <label className="uk-form-label"> Author </label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          value={author} 
          onChange={(e) => { setAuthor(e.target.value) } } />
      </div> 

      <div> 
        <label className="uk-form-label"> Record Type </label>
        <select 
          className="uk-select uk-form-width-large" 
          value={recordType}
          onChange={(e) => {setRecordType(e.target.value)}}>
          <option value=''> No Record Type </option> 
          { props.recordTypes.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
        </select>
      </div> 

      <div> 
        <label className="uk-form-label"> Source Archive </label>
        <select
          className="uk-select uk-form-width-large"
          value={sourceArchive}
          onChange={(e) => {setSourceArchive(e.target.value)}}>
          <option value=''> No Source Archive </option> 
          { props.sourceArchives.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
        </select>
      </div> 

      <div> 
        <label className="uk-form-label"> Collections </label>
        {props.collections.map(({id, name}) => {
          return (
            <label className="uk-form-label" key={id} >
              <input 
                className="uk-checkbox"
                type="checkbox"
                key={id}
                value={id}
                checked={collections.includes(id)}
                onChange={() => {handleCollection(id)}} />
            &nbsp;&nbsp;  { name } 
            </label>
          )
        })}
      </div>

      

      <input
        className="uk-button uk-button-primary uk-margin-top"
        type="submit"
        value="Add Record"
      />
    </form>
    ) } 

export default RecordForm;
