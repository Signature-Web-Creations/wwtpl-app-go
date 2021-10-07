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
  return <label className="uk-form-danger"> *{props.error} </label>
}

function RecordForm(props) {
  let { id } = useParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [origin, setOrigin] = useState('')
  const [author, setAuthor] = useState('')

  const [recordType, setRecordType] = useState('')
  const [sourceArchive, setSourceArchive] = useState('')
  const [collections, setCollections] = useState([])
  const [recordStatus, setRecordStatus] = useState('')

  const newRecord = id === undefined

  const [message, setMessage] = useState({
    message: null,
    type: null,
  })

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
    title: null,
    date: null,
    recordType: null,
    sourceArchive: null,
    collections: null,
  })

  // Creates a helper function to clear validation errors
  // I am using a closure here because if I mispelled a field
  // name I want it to throw an error right away. Using
  // something lke
  const clearValidationError = (fieldName) => {
    if (validationErrors[fieldName] === undefined) {
      throw new Error(
        `Cannot create helper function for unknown field: ${fieldName}`,
      )
    }
    return () => {
      if (validationErrors[fieldName]) {
        let errors = {}
        errors[fieldName] = null
        setValidationErrors(Object.assign(validationErrors, errors))
      }
    }
  }

  const clearTitleError = clearValidationError('title')
  const clearDateError = clearValidationError('date')
  const clearRecordTypeError = clearValidationError('recordType')
  const clearSourceArchiveError = clearValidationError('sourceArchive')
  const clearCollectionsError = clearValidationError('collections')

  // Returns an error message if date field has an error
  // or returns false if it is valid
  const validateDate = () => {
    if (blank(date)) {
      return 'Date is required.'
    }

    if (date.trim().match(/^\d{4}$/)) {
      let year = parseInt(date)
      let currentYear = new Date().getFullYear()
      if (year < 1800 || year > currentYear) {
        return `Year has to be between 1800 and ${currentYear}`
      }
      return false
    }

    if (date.trim().match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const m = moment(date.trim(), 'MM/DD/YYYY')
      if (m.isValid()) {
        return 'Date is not valid'
      }
      return false
    }

    return 'Date format is either YYYY or MM/DD/YYYY'
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

    errors.date = validateDate()
    valid = valid && errors.date === false

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

    console.log('Validation errors: ', errors)
    setValidationErrors(Object.assign(validationErrors, errors))
    console.log(validationErrors)
    return valid
  }

  useEffect(() => {
    if (!newRecord) {
      // Populate form fields with record
      getRecordByID(id).then((data) => {
        if (data.record) {
          const r = data.record
          setTitle(r.title)
          setContent(r.content)
          setDate(r.date)
          setOrigin(r.origin)
          setAuthor(r.author)
          setRecordType(r.recordType)
          setSourceArchive(r.sourceArchive)
          setRecordStatus(r.recordStatus)

          let c = []
          r.collections.split(';').forEach((col) => {
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
      setCollections(collections.filter((i) => i !== id))
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

  const handleSubmit = (str) => {
    if (validateForm()) {
      const record = {
        title: title.trim(),
        content: content.trim(),
        date: date.trim(),
        origin: origin.trim(),
        author: author.trim(),
        recordType: parseIntOrError(recordType),
        sourceArchive: parseIntOrError(sourceArchive),
        collections: collections.map(parseIntOrError),
        recordStatus: str && str === 'publish' ? 'publish' : recordStatus,
      }

      let request

      if (newRecord) {
        request = saveRecord(record)
      } else {
        request = saveRecord(Object.assign(record, { id }))
      }

      request.then((data) => {
        if (data.error) {
          setMessage({ message: data.error, type: 'error' })
        } else {
          clearForm()
          setMessage({ message: data.success, type: 'success' })
        }
      })
    } else {
      setMessage({
        message: 'Please fill out required fields correctly',
        type: 'error',
      })
    }
  }

  const header = newRecord ? 'New Record' : 'Edit Record'

  return (
    <form
      className="uk-form-horizontal uk-margin-large uk-margin-top"
      onSubmit={handleSubmit}
    >
      {message.message && (
        <MessageBox
          onChange={() => {
            setMessage({
              message: null,
              type: null,
            })
          }}
          message={message.message}
          type={message.type}
        />
      )}
      {recordStatus === 'unpublished' && (
        <MessageBox
          message="The record has been unpublished while in edit mode!"
          type="warning"
        />
      )}
      <h1> {header} </h1>

      <div className="uk-margin">
        <label className="uk-form-label"> Title </label>
        <div className="uk-form-controls">
          <input
            className={
              'uk-form-width-large uk-input ' +
              (validationErrors.title && 'uk-form-danger')
            }
            type="text"
            value={title}
            onChange={(e) => {
              clearTitleError()
              setTitle(e.target.value)
            }}
          />
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Content </label>
        <div className="uk-form-controls">
          <textarea
            className="uk-form-width-large uk-textarea"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
          />
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Date </label>
        <div className="uk-form-controls">
          <input
            className={
              'uk-form-width-large uk-input ' +
              (validationErrors.date && 'uk-form-danger')
            }
            type="date"
            value={date}
            onChange={(e) => {
              clearDateError()
              setDate(e.target.value)
            }}
          />
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Origin </label>
        <div className="uk-form-controls">
          <input
            className="uk-form-width-large uk-input"
            type="text"
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value)
            }}
          />
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Author </label>
        <div className="uk-form-controls">
          <input
            className="uk-form-width-large uk-input"
            type="text"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value)
            }}
          />
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Record Type </label>
        <div className="uk-form-controls">
          <select
            className={
              'uk-form-width-large uk-select ' +
              (validationErrors.recordType && 'uk-form-danger')
            }
            value={recordType}
            onChange={(e) => {
              clearRecordTypeError()
              setRecordType(e.target.value)
            }}
          >
            <option value=""> No Record Type </option>
            {props.recordTypes.map(({ id, name }) => (
              <option key={id} value={name}>
                {' '}
                {name}{' '}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Source Archive </label>
        <div className="uk-form-controls">
          <select
            className={
              'uk-form-width-large uk-select ' +
              (validationErrors.sourceArchive && 'uk-form-danger')
            }
            value={sourceArchive}
            onChange={(e) => {
              clearSourceArchiveError()
              setSourceArchive(e.target.value)
            }}
          >
            <option value=""> No Source Archive </option>
            {props.sourceArchives.map(({ id, name }) => (
              <option key={id} value={name}>
                {' '}
                {name}{' '}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="uk-margin">
        <label className="uk-form-label"> Collections </label>
        <div className="uk-form-controls uk-form-controls-text">
          <div>
            {validationErrors.collections && (
              <ValidationError error={validationErrors.collections} />
            )}
          </div>

          <div className="uk-grid-small uk-child-width-1-2 uk-grid">
            {props.collections.map(({ id, name }) => {
              return (
                <label key={id}>
                  <input
                    className="uk-checkbox"
                    type="checkbox"
                    key={id}
                    name="collections"
                    value={id}
                    checked={collections.includes(id)}
                    onChange={() => {
                      clearCollectionsError()
                      handleCollection(id)
                    }}
                  />
                  &nbsp;&nbsp; {name}
                </label>
              )
            })}
          </div>
        </div>
      </div>

      <div className="uk-form-width-large">
        <input
          className="uk-button uk-button-default uk-margin-top uk-margin-right"
          onClick={handleSubmit}
          type="button"
          value="Save"
        />
        <input
          className="uk-button uk-button-primary uk-margin-top"
          onClick={handleSubmit('publish')}
          type="button"
          value="Save &amp; Publish"
        />
      </div>
    </form>
  )
}

export default RecordForm
