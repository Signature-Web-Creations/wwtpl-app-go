import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRecordByID, saveRecord, updateRecord, changeRecordStatus } from '../api'

import MessageBox from '../MessageBox'

// Record Status 
const IN_PROGRESS = 1
const PENDING_APPROVAL = 2
const PUBLISHED = 3
const UNPUBLISHED = 4

// Returns true if string is blank
function blank(s) {
  return s.trim().length === 0
}

function ValidationError(props) {
  return <label className="uk-form-danger"> *{props.error} </label>
}

function FileInput(props) {
  return (
    <div className="uk-form-controls">
      <input
        type="file"
        name="file"
        accept=".jpg, .jpeg, .png, .pdf"
        onChange={props.onChange}
      />
    </div>
  )
}

function FileView(props) {
  let embed = null;
  if (props.attachmentType === "image") {
    embed = <img alt="file attachment" src={`/media/${props.fileName}`} />
  } else if (props.attachmentType === "document") {
    embed = <embed src={`/media/${props.fileName}`} type="application/pdf" width="100%" height="600px" />
  }
  return (
    embed
  )
}
  
function RecordForm(props) {
  let { id } = useParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [attachmentType, setAttachmentType] = useState(null) 
  const [shouldKeepFile, setShouldKeepFile] = useState(false)
  const [hasFile, setHasFile] = useState(null) 

  const [date, setDate] = useState('')
  const [origin, setOrigin] = useState('')
  const [author, setAuthor] = useState('')

  const [recordType, setRecordType] = useState('')
  const [sourceArchive, setSourceArchive] = useState('')
  const [collections, setCollections] = useState([])
  const [recordStatus, setRecordStatus] = useState(null)

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
    return null
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
    valid = valid && errors.date === null

    if (recordType === "") {
      errors.recordType = 'You need to select a record type'
      valid = false
    }

    if (sourceArchive === "") {
      errors.sourceArchive = 'You need to select a source archive'
      valid = false
    }

    if (collections.length === 0) {
      errors.collections = 'You need to select at least one collection'
    }

    setValidationErrors(Object.assign(validationErrors, errors))
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

          // Some records did not have a record type
          // this if keeps them from crashing the site
          if (r.recordType !== null) {
            setRecordType(r.recordType.id)
          }
          
          if (r.attachmentType !== null) {
            setAttachmentType(r.attachmentType)
            setFileName(r.fileName)
            setShouldKeepFile(true)
            setHasFile(true)
          }


          // Some records did not have a source archive
          // this if keeps them from crashing the site
          if (r.sourceArchive !== null) {
            setSourceArchive(r.sourceArchive.id)
          }

          if (r.recordStatus.id === PUBLISHED) {
            changeRecordStatus(id, UNPUBLISHED)
            setRecordStatus(UNPUBLISHED)
          } else {
            setRecordStatus(r.recordStatus.id)
          }

          let c = []
          // Some of the older entries do not have belong to 
          // any collections. Viewing them will break the 
          // app.
          if (r.collections !== null) {
            r.collections.split(';').forEach((col) => {
              if (props.collectionToId[col]) {
                c.push(props.collectionToId[col])
              }
            })
            setCollections(c)
          }
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

  const handleSubmit = (recordStatusId) => {
    if (validateForm()) {
      const formData = {
        title: title.trim(),
        content: content.trim(),
        file: file,
        date: date.trim(),
        origin: origin.trim(),
        author: author.trim(),
        recordType: parseIntOrError(recordType),
        sourceArchive: parseIntOrError(sourceArchive),
        collections: collections.map(parseIntOrError),
        recordStatus: recordStatusId === null ? IN_PROGRESS : recordStatusId,
        shouldKeepFile: shouldKeepFile,
      }

      if (newRecord) {
        saveRecord(formData).then((data) => {
          if (data.error) {
            setMessage({ message: data.error, type: 'error' })
          } else {
            clearForm()
            setMessage({ message: data.success, type: 'success' })
          }
        })
      } else {
        updateRecord(parseIntOrError(id), formData).then((data) => {
          if (data.error) {
            setMessage({message: data.error, type: 'error' })
          } else {
            setMessage({ message: data.success, type: 'success' })
          }
        })
      }

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
      encType="multipart/form-data"
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
        <label htmlFor="file" className="uk-form-label"> File </label>
        { shouldKeepFile ? 
            <FileView 
              fileName = {fileName}
              attachmentType = {attachmentType}
            /> : 

            <FileInput 
              fileName={fileName} 
              attachmentType={attachmentType}
              onChange={(e) => {
                setFile(e.target.files[0])
              }}
            />
        }
        { hasFile && 
          <div>
            <button
              onClick={(e) => {
                e.preventDefault()
                setShouldKeepFile(!shouldKeepFile)
              }}
            >
              {shouldKeepFile ? "Remove File" : "Undo"}
            </button>
          </div>
        }
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
              <option key={id} value={id}>
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
              <option key={id} value={id}>
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
          onClick={() => {handleSubmit(recordStatus)}}
          type="button"
          value="Save"
        />
        {(!newRecord && recordStatus !== IN_PROGRESS) && (
          <input
            className="uk-button uk-button-primary uk-margin-top"
            onClick={() => {
              handleSubmit(PUBLISHED)
            }}
            type="button"
            value="Save &amp; Publish"
          />
        )}
        {(newRecord || recordStatus === IN_PROGRESS) && (
          <input
            className="uk-button uk-button-primary uk-margin-top"
            onClick={() => {
              handleSubmit(PENDING_APPROVAL)
            }}
            type="button"
            value="Submit for Approval"
          />
        )}
      </div>
    </form>
  )
}

export default RecordForm
