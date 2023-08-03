import React from 'react';
import { Routes, Route} from 'react-router-dom';
import GroupList from '../group/group-list'
import GroupDetails from '../group/group-details';
import { useAuth } from '../../hooks/useAuth';
import  Register  from '../user/register';
import Accounts from '../user/accounts';
import Event from '../events/event';
import EventForm from '../events/event-form';


function Main() {

  const { authData } = useAuth();

  return (
    <div className='main'>
      {/* {authData && <h3>{authData.user.username}</h3>} */}
      <Routes>
        <Route path="/" element={<GroupList/>}/>
        <Route path="/details/:id" element={<GroupDetails />} />
        <Route path="/event/:id" element={<Event />} />
        <Route path="/event-form" element={<EventForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Accounts />} />
      </Routes>
    </div>
  );
}

export default Main;
