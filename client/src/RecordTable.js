import RecordRow from './RecordRow'; 

export default function RecordTable(props) {
  return (
    <div class="records"> 
      {props.records.map(({date, title}) => <RecordRow date={date} title={title} />)}
    </div>
  );
}
