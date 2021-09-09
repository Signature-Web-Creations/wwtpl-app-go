import { useParams } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { getRecordByID } from './api';

function Loading() {
  return <h1> Loading </h1> 
}

function TitleRow(props) {
  return (
    <tr>
      <td className="uk-width-medium"><strong>Title</strong></td>
      <td>{props.title}</td>
    </tr>
  )
}

function FileAttachmentRow(props) {
  if (props.fileAttachment === null) {
    return null;
  }
  return null;
}

function ContentRow(props) {
  const text = props.content === "" ? "No content" : props.content; 
  return (
    <tr>
      <td>
        <strong>
          Text
        </strong>
      </td>
      <td> {text} </td>
    </tr>
  );
}

const formatDate = (date) => {
  // Converts date with format yyyy-mm-dd to mm/dd/yyyy
  // If it cannot convert, then just returns the given date

  const re = /(\d{4})-(\d{2})-(\d{2})/;
  const matches = date.match(re); 
  if (matches !== null) {
    const year = matches[1];
    const month = matches[2];
    const day = matches[3];
  
    return `${month}/${day}/${year}`;
  } else {
    return date;
  }
}

function DateRow(props) {
  return (
    <tr>
      <td>
        <strong>
          Date
        </strong>
      </td>
      <td>{props.date === "" ? "Date unknown" : formatDate(props.date)} </td>
    </tr>
  );
}

function OriginRow(props) {
  return (
    <tr>
     <td>
      <strong>
        Origin
      </strong>
     </td>
     <td>Warren County Centennial</td>
    </tr>
  )
}

function AuthorRow(props) {
  return (
    <tr>
      <td>
        <strong>
          Author
        </strong>
      </td>
      <td>Name of the Author</td>
    </tr>
  );
}

function RecordTypeRow(props) {
  return (
    <tr>
      <td>
        <strong>
          Type
        </strong>
      </td>
      <td>Photograph</td>
    </tr>
  );
}

function SourceArchiveRow(props) {
  return (
    <tr>
      <td>
        <strong>
          Source Archive
        </strong>
      </td>
      <td>Williamsport-Washington Township Public Library</td>
    </tr>
  );
}

function CollectionRow(props) {
  return (
    <tr>
      <td>
        <strong>
          Collection
        </strong>
      </td>
      <td>
        <span class="uk-label">
          Williamsport-Washington Township Public Library
        </span>
        <span class="uk-label">
          Warren County Schools
        </span>
        <span class="uk-label">
          West Lebanon Public Library
        </span>
      </td>
    </tr>
  );
}

function Detail(props) {
  const record = props.record;
  return (
    <table className="uk-table uk-table-small uk-table-divider uk-margin-medium">
      <tbody>
        <TitleRow title={record.title} />
        <FileAttachmentRow attachmentType={record.attachmentType} attachmentName={record.attachmentName} />
        <ContentRow content={record.content} />
        <DateRow date={record.date} />
        <OriginRow origin={record.origin} />
        <AuthorRow author={record.author} />
        <RecordTypeRow recordType={record.recordType} />
        <SourceArchiveRow sourceArchive={record.sourceArchive} />
        <CollectionRow colletions={record.collections} />
      </tbody>
    </table>
  );
}
  

function RecordDetail(props) {
  let {id} = useParams();

  const [record, setRecord] = useState(null)

  useEffect(() => {
    getRecordByID(id).then(setRecord)
  }, [id])

  if (!record) {
    return <Loading />
  } else {
    return <Detail record={record} />
  }
}

export default RecordDetail; 
