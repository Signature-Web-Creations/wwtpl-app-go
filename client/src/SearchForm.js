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
      </form>
  );
}
