import React, {useState, useEffect} from 'react';
import { getGroups } from '../../services/group-services';
import GroupListItem from './group-list-item'



function GroupList() {

  const [ groups, setGroups] = useState(null);
  const [ loading, setLoading] = useState(false);
  const [ error, setError] = useState(false);

  useEffect(()=>{
    setLoading(true);
    const getData = async () => {
      await getGroups()
      .then( data => {
        setGroups(data);
        setLoading(false);
      }).catch( e =>{
        setError(true);
        setLoading(false);
      })
    }
    getData();
  }, [])

  if(error) return <h1>Error...!!!</h1>
  if(loading) return <h1>Loading...</h1>


  return (
    <div className="App">
        {groups && groups.map(group => {
        return <GroupListItem key={group.id} group={group}/>

        })}
    </div>
  );
}

export default GroupList;
