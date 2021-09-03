import './RecordRow.css'

export default function RecordRow(props) {
  return (
    <div className="row"> 
      <span className="date"> {props.date} </span>
      <a href="#" className="title"> {props.title} </a> 
    </div>
  );
}
