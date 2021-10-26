import { useParams } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { getPublicRecordByID } from './api';

const getValueOrDefault = (value, defaultValue) => {
  if (value) {
    return value
  } else {
    return defaultValue;
  }
}

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

function PdfRow(props) {
  return (
    <tr>
      <td><strong> Document </strong></td>
      <td>
        <embed src={`/media/${props.src}`} type="application/pdf" width="100%" height="600px" />
      </td>
    </tr>
  )
}

function ImageRow(props) {
  return (
    <tr>
      <td><strong>Image</strong></td>
      <td><img alt={props.alt} src={`/media/${props.src}`} /></td>
    </tr>
  )
}

function FileAttachmentRow(props) {
  if (props.attachmentType === null) {
    return null;
  } else if (props.attachmentType === 'document') {
    return <PdfRow src={props.fileName} />
  } else if (props.attachmentType === 'image') {
    return <ImageRow alt={props.title} src={props.fileName} />
  } else {
    return null;
  }
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
     <td>{getValueOrDefault(props.origin, "Origin Unknown")}</td>
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
      <td>{getValueOrDefault(props.author, "Unknown")}</td>
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
      <td>{getValueOrDefault(props.recordType.name, "Unknown")}</td>
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
      <td>{getValueOrDefault(props.sourceArchive.name, "Unknown")}</td>
    </tr>
  );
}

function getCollectionArray(collections){
  if (collections) {
    return collections.split(';');
  } else {
    return [];
  }
}

function CollectionRow(props) {
  let collections = getCollectionArray(props.collections)

  const collectionLabel = (collection) => {
    return (
      <span key={collection} className="uk-label"> {collection} </span>
    )
  }
  
  if (collections.length === 0) {
    collections.push('Collection Unknown');
  }

  return (
    <tr>
      <td>
        <strong>
          Collection
        </strong>
      </td>
      <td> 
        {collections.map(collectionLabel)}
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
        <FileAttachmentRow title={record.title} attachmentType={record.attachmentType} fileName={record.fileName} />
        <ContentRow content={record.content} />
        <DateRow date={record.date} />
        <OriginRow origin={record.origin} />
        <AuthorRow author={record.author} />
        <RecordTypeRow recordType={record.recordType} />
        <SourceArchiveRow sourceArchive={record.sourceArchive} />
        <CollectionRow collections={record.collections} />
      </tbody>
    </table>
  );
}
  

function RecordDetail(props) {
  let {id} = useParams();

  const [record, setRecord] = useState(null)

  useEffect(() => {
    getPublicRecordByID(id).then(setRecord)
  }, [id])

  if (!record) {
    return <Loading />
  } else {
    return <Detail record={record} />
  }
}

export default RecordDetail; 
