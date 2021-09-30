import RecordRow from './RecordRow'

function NoResultsPage() {
  return <h1> Your search did not return any results. </h1>
}

function PublicListings(props) {
  return (
    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
      <thead>
        <tr>
          <th className="uk-width-small">Date</th>
          <th>Title</th>
          <th>Type</th>
          <th className="uk-table-shrink"></th>
        </tr>
      </thead>
      <tbody>
        {props.records.map(({ id, date, title, recordType }) => (
          <RecordRow
            id={id}
            key={id}
            date={date}
            title={title}
            type={recordType}
          />
        ))}
      </tbody>
    </table>
  )
}

export default function RecordTable(props) {
  if (props.records === null) {
    if (props.searched) {
      return <NoResultsPage />
    } else {
      return null
    }
  } else {
    return <PublicListings records={props.records} />
  }
}
