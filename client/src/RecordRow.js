

export default function RecordRow(props) {
  return (
    <div class="row"> 
      <span class="date"> {props.date} </span>
      <span class="title"> {props.title} </span> 
    </div>
  );
}
