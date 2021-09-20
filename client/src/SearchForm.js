import './SearchForm.css'

export default function SearchForm(props) {
  return (
    <form className="uk-grid-small uk-margin-top" onSubmit={props.onSubmit}>
        <div className="searchBar">
          <input className="uk-input searchInput" type="text" placeholder="Search" onChange={props.changeQuery} />
          <select className="uk-select yearSelect" onChange={props.changeYear}>
            <option value="">Year</option>
            { props.years.map(year => <option key={year} value={year}> {year} </option>)}
          </select>
          <input className="uk-button uk-button-primary searchButton" type="submit" value="search" /> 
        </div>
        <div className="advancedSearchOptions"> 
          <select className="uk-select" onChange={props.changeRecordType}>
            <option value=""> Type </option>
            { props.recordTypes.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
          </select>
          <select className="uk-select" onChange={props.changeSourceArchive}>
            <option value=""> Source Archive </option>
            { props.sourceArchives.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
          </select>
          <select className="uk-select" onChange={props.changeCollection}>
            <option value=""> Collection </option>
            { props.collections.map(({id, name}) => <option key={id} value={id}> {name} </option>) }
          </select>
        </div>
      </form>
  );
}
