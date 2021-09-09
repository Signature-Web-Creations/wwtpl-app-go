import {useState, useEffect} from 'react';
import { BrowserRouter, Route} from 'react-router-dom'; 

import Header from './Header';
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
            <RecordDetail records={records} />
          </Route> 

          <Route exact path="/"> 
            <Header text={"History List"} />
            <RecordTable records={!records ? [] : records} />
          </Route>

        </div>
      </BrowserRouter>
  );
}

export default App;
