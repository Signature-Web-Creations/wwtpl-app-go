import RecordRow from './RecordRow'; 

export default function RecordTable(props) {
  return (
    <div className="records"> 
      <div className="row"> 
        <span> Date </span>
        <span> Title </span>
      </div>
      {props.records.map(({date, title}) => <RecordRow date={date} title={title} />)}
    </div>
  );
}
