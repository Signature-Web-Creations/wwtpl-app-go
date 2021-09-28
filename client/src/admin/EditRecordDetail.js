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

function EditRecord() {
  return (
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
        <RecordTypeRow />
        <SourceArchiveRow />
        <DateEnteredRow />
        <CollectionRow />
      </tbody>
    </table>
  )
}

export default EditRecord
