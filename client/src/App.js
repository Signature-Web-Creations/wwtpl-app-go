import {useState, useEffect} from 'react';
import { BrowserRouter, Route} from 'react-router-dom'; 

import Header from './Header';
import SearchForm from './SearchForm'; 
import RecordTable from './RecordTable';
import RecordDetail from './RecordDetail';

import {getRecords} from './api';


function App() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    getRecords().then(setRecords)
  }, [])


  return (
      <BrowserRouter>
        <div className="uk-marign-top">
          <Route path="/record/:id">
            <Header>
               <h1 className="uk-text-lead"> History Record </h1>
            </Header>

            <RecordDetail records={records} />
          </Route> 

          <Route exact path="/"> 
            <Header>
               <h1 className="uk-text-lead"> History Listing </h1>
               <SearchForm />
            </Header>
            <RecordTable records={!records ? [] : records} />
          </Route>

        </div>
      </BrowserRouter>
  );
}

export default App;
