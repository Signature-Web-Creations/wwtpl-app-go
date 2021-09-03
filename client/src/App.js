import {useState, useEffect} from 'react';
import { BrowserRouter, Route } from 'react-router-dom'; 

import RecordTable from './RecordTable';
import RecordDetail from './RecordDetail';

function App() {
  const [records, setRecords] = useState(null);

  useEffect(() => {
    fetch("/records")
      .then((res) => res.json())
      .then((records) => { 
        setRecords(records);
      });
  }, [])


  return (
      <BrowserRouter>
        <div className="App">
          <Route path="/record/:id" render={props => {
            const id = props.match.params.id;
            return <RecordDetail id={id} />
          }} />

          <Route path="/" exact render={() => <RecordTable records={!records ? [] : records} /> } />
    
        </div>
      </BrowserRouter>
  );
}

export default App;
