import { useParams } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { getRecordByID } from './api';

function Loading() {
  return <h1> Loading </h1> 
}

function Detail(props) {
  const record = props.record;
  return (
    <div>
      <h1> {record.title} </h1> 
      <p> {record.content} </p>
    </div>
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
