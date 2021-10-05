import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecordByID, saveRecord } from '../api'
import moment from 'moment'

import MessageBox from '../MessageBox'


// Returns true if string is blank
function blank(s) {
  return s.trim().length === 0
}

function ValidationError(props) {
  if (!props.error) {
    return null
  }
  return (<p> {props.error} </p>)
}

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

  const clearForm = () => {
    setTitle('')
    setContent('')
    setDate('')
    setOrigin('')
    setAuthor('')
    setRecordType('')
    setSourceArchive('')
    setCollections([])
  }

  // Form Validation
  const [validationErrors, setValidationErrors] = useState({
    title: false, 
    date: false, 
    recordType: false,
    sourceArchive: false,
    collections: false,
  })


  // Creates a helper function to clear validation errors
  // I am using a closure here because if I mispelled a field
  // name I want it to throw an error right away. Using 
  // something lke
  const clearValidationError = (fieldName) => {
    if (validationErrors[fieldName] === undefined) {
      throw new Error(`Cannot create helper function for unknown field: ${fieldName}`)
    }
    return () => {
      if (validationErrors[fieldName]) {
        let errors = {}
        errors[fieldName] = false
        setValidationErrors(Object.assign(validationErrors, errors))
      }
    }
  }

  const clearTitleError = clearValidationError("title")
  const clearDateError = clearValidationError("date")
  const clearRecordTypeError = clearValidationError("recordType")
  const clearSourceArchiveError = clearValidationError("sourceArchive")
  const clearCollectionsError = clearValidationError("collections")

  // Returns [moment, true] if date format is valid
  // i.e yyyy or mm/dd/yyyy 
  const validDateFormat = (date) => {
    let m = moment(date, "MM/DD/YYYY", true)
    return true
  }

  // Returns true if date represents a valid 
  // date
  const validDate = (date) => {
    return true
  }

  // Validates all of the fields on the form. 
  // Returns true if there are no errors and it is ok to submit 
  const validateForm = () => {
    let valid = true
    let errors = {}

    if (blank(title)) {
      errors.title = 'Title is required'
      valid = false
    }

    if (blank(date)) {
      errors.date = 'Date is required.'
      valid = false
    } else if (!validDateFormat(date)) {
      errors.date = 'Date either needs to be a year (yyyy) or month day and year (mm/dd/yyyy)'
      valid = false
    } else if (!validDate(date)) {
      errors.date = 'Date is invalid'
      valid = false
    }

    if (blank(recordType)) {
      errors.recordType = 'You need to select a record type'
      valid = false
    }

    if (blank(sourceArchive)) {
      errors.sourceArchive = 'You need to select a source archive'
      valid = false
    }

    if (collections.length === 0) {
      errors.collections = 'You need to select at least one collection'
    }

    setValidationErrors(Object.assign(validationErrors, errors))
    return valid
  }

  const newRecord = id === undefined

  const [message, setMessage] = useState(null)

  const createSuccessMessage = (message) => {
    setMessage({message, type:"success"})
  }

  const createErrorMessage = (message) => {
    setMessage({message, type:"error"}) 
  }


  useEffect(() => {
    if (!newRecord) {
      // Populate form fields with record
      getRecordByID(id).then(data => {
        if (data.record) {
          const r = data.record
          setTitle(r.title)
          setContent(r.content)
          setDate(r.date)
          setOrigin(r.origin)
          setAuthor(r.author)
          setRecordType(r.recordType)
          setSourceArchive(r.sourceArchive)

          let c = []
          r.collections.split(';').forEach(col => {
            if (props.collectionToId[col]) {
              c.push(props.collectionToId[col])
            }
          })
          setCollections(c)
        }
      })
    }
  }, [newRecord, id, props.collectionToId])

  const handleCollection = (id) => {
    if (collections.includes(id)) {
      setCollections(collections.filter(i => i !== id))
    } else {
      setCollections(collections.concat(id))
    }
  }

  const parseIntOrError = (str) => {
    const n = parseInt(str)
    if (isNaN(n)) {
      throw new Error(`Couldn't parse int on string: ${str}`)
    }
    return n
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (validateForm()) {
      const record = {
        title,
        content, 
        date, 
        origin,
        author,
        recordType: parseIntOrError(recordType), 
        recordType: parseIntOrError(sourceArchive),
        collections: collections.map(parseIntOrError)
      }

      let request;

      if (newRecord) {
        request = saveRecord(record)
      } else {
        request = saveRecord(Object.assign(record, {id}))
      }

      request.then(data => {
        if (data.error) {
          createErrorMessage(data.error)
        } else {
          clearForm()
          createSuccessMessage(data.success)
        }
      })
    }
    
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
          message={message.message}
          type={message.type}
        />
      )}
      <h1> {header} </h1> 

      <div> 
        <ValidationError error={validationErrors.title} />
        <label className="uk-form-label"> Title </label>
        <input
          className="uk-form-width-large uk-input"
          type="text"
          value={title}
          onChange={(e) => { 
            clearTitleError()
            setTitle(e.target.value)
          }} />
      </div> 

      <div> 
        <label className="uk-form-label"> Content </label>
        <textarea 
          className="uk-form-width-large uk-textarea"
          value={content}
          onChange={(e) => { setContent(e.target.value) } } />
      </div> 

      <div> 
        <ValidationError error={validationErrors.date} />
        <label className="uk-form-label"> Date </label>
        <input 
          className="uk-form-width-large uk-input"
          type="text"
          value={date}
          onChange={(e) => { 
            clearDateError()
            setDate(e.target.value)
          }} />
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
        <ValidationError error={validationErrors.recordType} />
        <label className="uk-form-label"> Record Type </label>
        <select 
          className="uk-select uk-form-width-large" 
          value={recordType}
          onChange={(e) => {
            clearRecordTypeError()
            setRecordType(e.target.value)
          }}>
          <option value=''> No Record Type </option> 
          { props.recordTypes.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
        </select>
      </div> 

      <div> 
        <ValidationError error={validationErrors.sourceArchive} />
        <label className="uk-form-label"> Source Archive </label>
        <select
          className="uk-select uk-form-width-large"
          value={sourceArchive}
          onChange={(e) => {
            clearSourceArchiveError()
            setSourceArchive(e.target.value)}
          }>
          <option value=''> No Source Archive </option> 
          { props.sourceArchives.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
        </select>
      </div> 

      <div> 
        <ValidationError error={validationErrors.collections} />
        <label className="uk-form-label"> Collections </label>
        {props.collections.map(({id, name}) => {
          return (
            <label className="uk-form-label" key={id} >
              <input 
                className="uk-checkbox"
                type="checkbox"
                key={id}
                name="collections"
                value={id}
                checked={collections.includes(id)}
                onChange={() => {
                  clearCollectionsError()
                  handleCollection(id)}
                } />
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
