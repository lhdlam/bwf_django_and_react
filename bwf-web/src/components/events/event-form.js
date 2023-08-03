import { useLocation, Link } from 'react-router-dom';
import { CssTextField } from '../layout/elements'
import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {NotificationManager} from 'react-notifications';
import { DateTime } from 'luxon';
import { createEvent } from '../../services/event-services';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export default function EventForm(){


  const {authData} = useAuth();
  const {state} = useLocation();
  const {group} = state;
  const [team1, setTeam1] = useState();
  const [team2, setTeam2] = useState();
  const [time, setTime] = useState();


  const handleSubmit = async e => {
    e.preventDefault();
    console.log(team1, team2, time)
    const format = "yyyy-MM-dd'T'HH:mm";
    const utcTime = DateTime.fromFormat(time, format).toUTC().toFormat(format);
    const dataToSend = {team1, team2, 'time':utcTime, 'group':group.id};
    const eventData = await createEvent(authData.token, dataToSend);
    if(eventData){
      NotificationManager.success("Event created")
    }else{
      NotificationManager.error("Error creating event. Please try again later!")
    }
  }

  return(
    <div>
    <Link to={`/details/${group.id}`}><KeyboardBackspaceIcon/></Link>
    <h3>New Event for the group {group.name} </h3>
    <form onSubmit={handleSubmit}>
    <CssTextField label="Team 1" onChange={e => setTeam1(e.target.value)}/>
    <CssTextField label="Team 2" onChange={e => setTeam2(e.target.value)}/>
    <br/><br/>
    <CssTextField 
      label="Date and time or event"
      type="datetime-local"
      sx={{ width: 250 }}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={e => setTime(e.target.value)}
    />
    <br/><br/>
    <Button type='submit' variant="contained" color="primary">Create Event</Button>
    </form>
    </div>
  )
}