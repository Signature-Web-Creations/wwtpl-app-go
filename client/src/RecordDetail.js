import {useState, useEffect} from 'react'; 

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
  const id = props.id;
  const [record, setRecord] = useState(null); 
  
  useEffect(() => {
    fetch(`/records/${id}`)
      .then((res) => res.json())
      .then((data) => setRecord(data))
  }); 

  if (record === null) {
    return <Loading />
  } else {
    return <Detail record={record} />
  }
}

export default RecordDetail; 
