import SearchForm from './SearchForm'; 

export default function Header(props) {
   return (
    <div className="uk-margin-top">
     <h1 className="uk-text-lead"> {props.text} </h1>
     <SearchForm />
    </div>
   )
}
