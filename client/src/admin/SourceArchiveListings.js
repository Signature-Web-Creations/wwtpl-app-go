
import {Link} from 'react-router-dom'
import {getSourceArchives} from '../api'
import {useState, useEffect} from 'react'
import {UrlFor} from '../routes.js'

function SourceArchiveRow(props) {

  const {id, name} = props

  return (
    <tr>
      <td> 
        <Link
          to={`/editSourceArchive/${id}`}
          className="uk-icon-link uk-margin-small-right"
          uk-icon="file-edit"
        ></Link>
      </td>
      <td>{name}</td>
    </tr>
  )
}

export default function SourceArchiveListings(props) {
  const [sourceArchives, setSourceArchives] = useState([]) 

  useEffect(() => {
    getSourceArchives().then((data) => {
      if (data.sourceArchives) {
        setSourceArchives(data.sourceArchives)
      }
    })
  }, [])

  return (
    <div>
      <Link
        to={UrlFor('addSourceArchive')}
        className="uk-button uk-button-primary uk-margin-right"
      >
        {' '}
        Add New Source Archive{' '}
      </Link>


      <table className="uk-table uk-table-middle uk-table-divider uk-table-hover uk-margin-medium">
        <thead>
          <tr>
            <th className="uk-table-small"></th>
            <th className="uk-table-small"></th>
            <th className="uk-width-small">Name</th>
          </tr>
        </thead>
        <tbody>
          {sourceArchives.map(({id, name}) => (
            <SourceArchiveRow
              id={id}
              name={name}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
