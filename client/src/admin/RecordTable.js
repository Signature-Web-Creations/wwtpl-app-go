import RecordRow from './RecordRow'

function NoResultsPage() {
  return <h1> Your search did not return any results. </h1>
}

function AdminListings(props) {
  return (
    <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
      <thead>
        <tr>
          <th className="uk-table-small"></th>
          {props.user !== undefined && props.user.role === 'admin' && (
            <th className="uk-table-small"></th>
          )}
          <th className="uk-width-small">Date</th>
          <th>Title</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.records.map(({ id, date, title, recordStatus, deleted }) => (
          <RecordRow
            id={id}
            key={id}
            date={date}
            title={title}
            status={recordStatus}
            deleted={deleted}
            onDelete={() => {props.onDelete(id)}}
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
    return <AdminListings records={props.records} onDelete={props.onDelete}/>
  }
}
