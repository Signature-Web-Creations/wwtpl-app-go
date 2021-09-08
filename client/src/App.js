import {useState, useEffect} from 'react';
import { BrowserRouter, Route} from 'react-router-dom'; 

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
        <div className="App">
          <Route path="/record/:id">
            <RecordDetail records={records} />
          </Route> 

          <Route exact path="/"> 
            <RecordTable records={!records ? [] : records} />
          </Route>

        </div>
      </BrowserRouter>
  );
}

export default App;
