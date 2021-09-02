import {useState, useEffect} from 'react';
import RecordTable from './RecordTable';

function App() {

  const [records, setRecords] = useState(null);

  useEffect(() => {
    fetch("/records")
      .then((res) => res.json())
      .then((records) => { 
        console.log(records);
        setRecords(records);
      });
  }, [])


  return (
    <div className="App">
      <RecordTable records={!records ? [] : records}/>
    </div>
  );
}

export default App;
