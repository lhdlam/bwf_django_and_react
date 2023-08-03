import React, { useState, useEffect } from "react";
import { DateTime } from 'luxon';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { makeStyles } from '@mui/styles';
import { Link, useParams } from "react-router-dom";
import { useFetchEvent } from "../../hooks/fetch-event";
import { useAuth } from '../../hooks/useAuth'
import User from "../user/user";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { placeBet, setResults } from "../../services/event-services";
import {NotificationManager} from 'react-notifications';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const useStyles = makeStyles( theme => ({
  back: {
    float: "left",
    clear: "both"
  },
  container: {
    textAlign: "center",
  },
  dateTime: {
    fontSize: '18px',
    marginRight: '3px',
    marginLeft: '3px',
    marginTop: '10px',
    color: theme.palette.secondary.main,
  },
  bets: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    margin: '5px 0 0 0',
  },
  accent: {
    color: theme.palette.primary.main,
    fontSize: "30px"

  },
  numberField: {
    width: "120px",
  }
}));

export default function Event({}){

  const { authData} = useAuth();
  const classes = useStyles();
  const {id} = useParams();
  const [data, loading, error ] = useFetchEvent(authData.token, id);
  const [ event, setEvent] = useState(null);
  const [ evtTime, setEvtTime] = useState(null);
  const [score1, setScore1 ] = useState(null);
  const [score2, setScore2 ] = useState(null);
  const [isFuture, setIsFuture] = useState(null);
  const [timeDiff, setTimeDiff] = useState(null);


  useEffect(()=>{
    setEvent(data);
    if(data?.time) {
      const format = "yyyy-MM-dd'T'HH:mm:ss'Z'";
      const eventTime = DateTime.fromFormat(data.time, format);
      setEvtTime(eventTime);
      const now = DateTime.now();
      setIsFuture(eventTime > now);
      setTimeDiff(eventTime.toRelative());
    }

  }, [data])

  const sendBet = async () => {
    const bet = await placeBet(authData.token, {score1, score2, 'event': event.id});
    if(bet){
      if(bet.new){
        event.bets.push(bet.result);
      } else{
        const myBetIndex = event.bets.findIndex(oldBet => oldBet.user.id === bet.result.user.id);
        event.bets[myBetIndex] = bet.result;
      }
      NotificationManager.success(bet.message)


    }
    setScore1('');
    setScore2('');
  }

  const setScores = async () => {
    const eventData = await setResults(authData.token, {score1, score2, 'event': event.id});

    if (eventData) {
        setEvent(eventData)
        NotificationManager.success("Scores has been set");
    } else {
      NotificationManager.error("Scores could not be set");

    }
    setScore1('');
    setScore2('');
}

  if(error) return <h1>Error...!!!</h1>
  if(loading) return <h1>Loading...</h1>
  

  return (
    <div className={classes.container}>
    { event && 
    <div>
      <Link to={`/details/${event.group}`} className={classes.back}><KeyboardBackspaceIcon/></Link>
      <h3>{event.team1} <span className={classes.accent}>VS</span>  {event.team2} </h3>
      { event.score1 >=0 && event.score2>=0 && <h2>{event.score1} : {event.score2} </h2>}
      
        <h2>
        <CalendarMonthIcon className={classes.dateTime}/>{evtTime.toSQLDate()} 
        <AccessTimeIcon className={classes.dateTime}/>{evtTime.toFormat('HH:mm')}
        </h2>
        <h2>{timeDiff}</h2>
        {isFuture &&
        <h3>Number of people aready bet: {event.num_bets} </h3>
        }
        <hr/>
        <br/>
        {event && event.bets && event.bets.map(bet => {
          return <div key={bet.id} className={classes.bets}> 
          <User user={bet.user}/>
          <h4>{bet.score1}:{bet.score2}</h4>
          <h4>{bet.points}pts</h4>
          </div>
        })}
        <hr/>
        <br/>
        {isFuture ? 
        <div>
          <TextField label="Score 1" type="number" className={classes.numberField}
            onChange={e => setScore1(e.target.value)} 
            />
            <span className={classes.accent}>&nbsp; : &nbsp; </span>
            <TextField label="Score 2" type="number" className={classes.numberField}
            onChange={e => setScore2(e.target.value)} 
            />
            <br/><br/>
            <Button variant="contained" color="primary" 
              onClick={()=> sendBet()} disabled={!score1 || !score2}> Place bet</Button> 
        </div>

      :
      event.is_admin ?
      <div>
      <TextField label="Score 1" type="number" className={classes.numberField}
        onChange={e => setScore1(e.target.value)} 
        />
        <span className={classes.accent}>&nbsp; :&nbsp; </span>
        <TextField label="Score 2" type="number" className={classes.numberField}
        onChange={e => setScore2(e.target.value)} 
        />
        <br/><br/>
          <Button variant="contained" color="primary" 
          onClick={()=> setScores()} disabled={!score1 || !score2}> Set Score</Button> 
        </div>  : null
        }

    </div>

    }
  </div>
  )
}

