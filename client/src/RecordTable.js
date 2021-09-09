import RecordRow from './RecordRow'; 

export default function RecordTable(props) {
  return (
    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
      <thead>
        <tr>
          <th className="uk-width-small">Date</th>
          <th>Title</th>
          <th className="uk-table-shrink"></th>
        </tr>
      </thead>
      <tbody>
        { props.records.map(({id, date, title}) => <RecordRow id={id} key={id} date={date} title={title} />)} 
      </tbody>
    </table>
  );
}
