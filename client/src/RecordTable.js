import RecordRow from './RecordRow'; 

export default function RecordTable(props) {
  return (
    <div className="records"> 
      <div className="row"> 
        <span> Date </span>
        <span> Title </span>
      </div>
      {props.records.map(({id, date, title}) => <RecordRow id={id} key={id} date={date} title={title} />)}
    </div>
  );
}
