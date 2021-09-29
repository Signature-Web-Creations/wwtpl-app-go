import { useState } from 'react'
import { Link } from 'react-router-dom'

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

function EditRecord(props) {
  const [error, setError] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    // submit form
  }

  const handleCloseErrorBox = () => {
    setError(null)
  }

  function ErrorBox() {
    return (
      <div uk-alert="true" className="uk-alert-danger">
        <Link
          className="uk-alert-close"
          uk-close="true"
          onClick={handleCloseErrorBox}
        ></Link>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <form className="uk-form-stacked uk-margin-top" onSubmit={handleSubmit}>
      {error && <ErrorBox />}

      <table class="uk-table uk-table-small uk-table-divider uk-margin-medium">
        <tbody>
          <TitleRow />
          <FileAttachmentRow />
          <AttachmentTypeRow />
          <ContentRow />
          <DateRow />
          <OriginRow />
          <AuthorRow />
          <RecordIdRow />
          <RecordTypeRow recordTypes={props.recordTypes} />
          <SourceArchiveRow sourceArchives={props.sourceArchives} />
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

export default EditRecord
