import './SearchForm.css'

export default function SearchForm(props) {
  return (
    <form className="uk-grid-small uk-margin-top" onSubmit={props.onSubmit}>
        <div className="searchBar">
          <input className="uk-input searchInput" type="text" placeholder="Search" onChange={props.onChange} />
          <select className="uk-select yearSelect">
            <option value="">Year</option>
            <option>2012</option>
            <option>2011</option>
            <option>2010</option>
            <option>2009</option>
            <option>2008</option>
          </select>
          <input className="uk-button uk-button-primary searchButton" type="submit" value="search" /> 
        </div>
      </form>
  );
}
