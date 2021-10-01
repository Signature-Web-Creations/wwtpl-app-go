import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicRecordByID } from '../api'

import TitleRow from './fields/TitleRow'
import FileAttachmentRow from './fields/FileAttachmentRow'
import AttachmentTypeRow from './fields/AttachmentTypeRow'
import ContentRow from './fields/ContentRow'
import DateRow from './fields/DateRow'
import OriginRow from './fields/OriginRow'
import AuthorRow from './fields/AuthorRow'
import RecordIdRow from './fields/RecordIdRow'
import RecordTypeRow from './fields/RecordTypeRow'
import SourceArchiveRow from './fields/SourceArchiveRow'
import DateEnteredRow from './fields/DateEnteredRow'
import CollectionRow from './fields/CollectionRow'
import MessageBox from '../MessageBox'

function EditRecord(props) {
  let { id } = useParams()

  const [record, setRecord] = useState(null)
  const [message, setMessage] = useState(null)

  function Loading() {
    return <h1> Loading </h1>
  }

  useEffect(() => {
    getPublicRecordByID(id).then(setRecord)
  }, [id])

  if (!record) {
    return <Loading />
  } else {
    const handleSubmit = (event) => {
      event.preventDefault()
      // submit form
    }

    const handleCloseBox = (message) => {
      setMessage(message)
    }
    // const handleMessageType = () => {}
    // const han

    return (
      <form className="uk-form-stacked uk-margin-top" onSubmit={handleSubmit}>
        {message && (
          <MessageBox
            onChange={handleCloseBox}
            message={message}
            type="error"
          />
        )}

        <table className="uk-table uk-table-small uk-table-divider uk-margin-medium">
          <tbody>
            <TitleRow title={record.title} />
            <FileAttachmentRow />
            <AttachmentTypeRow />
            <ContentRow content={record.content} />
            <DateRow date={record.date} />
            <OriginRow origin={record.origin} />
            <AuthorRow author={record.author} />
            <RecordIdRow id={record.id} />
            <RecordTypeRow
              recordTypes={props.recordTypes}
              type={record.recordType}
            />
            <SourceArchiveRow
              sourceArchives={props.sourceArchives}
              source={record.sourceArchive}
            />
            <DateEnteredRow />
            <CollectionRow collections={props.collections} />
          </tbody>
        </table>

        <input
          className="uk-button uk-button-primary uk-margin-top"
          type="submit"
          value="Add Record"
        />
      </form>
    )
  }
}

export default EditRecord
