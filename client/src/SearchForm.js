
export default function SearchForm() {
  return (
      <form className="uk-grid-small uk-margin-top uk-grid">
        <div className="uk-width-2-3@s">
          <input className="uk-input" type="text" placeholder="Search" />
        </div>
        <div className="uk-width-1-3@s">
          <select className="uk-select">
            <option value="">Year</option>
            <option>2012</option>
            <option>2011</option>
            <option>2010</option>
            <option>2009</option>
            <option>2008</option>
          </select>
        </div>
      </form>
  );
}
