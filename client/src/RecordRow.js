import './RecordRow.css'

export default function RecordRow(props) {
  let href = `/record/${props.id}`
  return (
    <div className="row"> 
      <span className="date"> {props.date} </span>
      <a href={href} className="title"> {props.title} </a> 
    </div>
  );
}
