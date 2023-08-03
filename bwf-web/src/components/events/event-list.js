import React from "react";
import { DateTime } from 'luxon';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { makeStyles } from '@mui/styles';
import { Link, useNavigate} from 'react-router-dom';



const useStyles = makeStyles( theme => ({
  dateTime: {
    fontSize: '18px',
    marginRight: '3px',
    marginTop: '10px',
    color: theme.colors.mainAccentColor
  },
  memberContainer: {
    display: 'grid',
    gridTemplateColumns: '100px auto'
  }

}));

export default function EventList({events}){
  const classes = useStyles();
  const history = useNavigate();
  const openEvent = eventId => {
    history(`/event/${eventId}`);
  }


  return (
    <React.Fragment>
    <h3>Events:</h3>
      { events && events.map( event => {
        const format = "yyyy-MM-dd'T'HH:mm:ss'Z'";
        const evtTime = DateTime.fromFormat(event.time, format)
        
        return <div key={event.id} onClick={()=> openEvent(event.id)}> 
        <p key={event.id}>{event.team1} VS {event.team2}
          &nbsp; : &nbsp;
          <CalendarMonthIcon className={classes.dateTime}/>{evtTime.toSQLDate()} 
          <AccessTimeIcon className={classes.dateTime}/>{evtTime.toFormat('HH:mm')}
        </p>
        </div>
      })}
    </React.Fragment>
  )
}

