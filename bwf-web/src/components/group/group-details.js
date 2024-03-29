import React, {useState, useEffect} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useFetchGroup} from '../../hooks/fetch-group'
import { makeStyles } from '@mui/styles';
import  User  from '../user/user';
import { Button } from '@mui/material';
import { joinGroup, leaveGroup } from '../../services/group-services';
import { useAuth } from '../../hooks/useAuth';
import Comments from '../comments/comments';
import EventList from '../events/event-list';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


const useStyles = makeStyles( theme => ({
  dateTime: {
    fontSize: '18px',
    marginRight: '3px',
    marginTop: '10px',
    color: theme.colors.mainAccentColor
  },
  memberContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 5fr 1fr',
    alignItems: 'center'
  },
  gold: {
    color: "gold",
  },
  silver: {
    color: "silver",
  },
  bronze: {
    color: "bronze",
  },

}));

function GroupDetails() {

  const classes = useStyles();
  const { authData} = useAuth();
  const { id } = useParams();
  const [ data, loading, error] = useFetchGroup(id);
  const [group, setGroup] = useState(null);
  const [ isGroup, setInGroup ] = useState(false);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const history = useNavigate();


  useEffect(()=>{
    if(data?.members){

      data.members.sort((a, b) => b.points - a.points);

      const availableTrophies = ['gold', 'silver', 'bronze'];
      let currentTrophy = 0;
      data.members.map((m, index) => {
          if (index === 0) {
              m.trophy = availableTrophies[currentTrophy];
          } else {
              if (m.points !== data.members[index - 1].points) {
                  currentTrophy++;
              }

              if (currentTrophy < availableTrophies.length) {
                  m.trophy = availableTrophies[currentTrophy];
              }
          }

      })

      if(authData?.user) {
        setInGroup(!!data.members.find( member => member.user.id === authData.user.id));
        setIsAdmin(data.members.find( member => member.user.id === authData.user.id)?.admin);
      }
    }
    setGroup(data);
  }, [data, authData])
  const joinHere = () => {
      joinGroup({user: authData.user.id, group: group.id}).then(
        res => {console.log(res)}
      )
  }
  const leaveHere = () => {
      leaveGroup({user: authData.user.id, group: group.id}).then(
        res => { console.log(res)}
    )
  }

  const addEvent = () =>{
    history('/event-form', {state: {group}});
  }

  if(error) return <h1>Error...!!!</h1>
  if(loading) return <h1>Loading...</h1>

  return (
    <div>
        <Link to={'/'}><KeyboardBackspaceIcon/></Link>
        {group && 
        <React.Fragment>
            <h1> {group.name} {group.location} </h1> 
            <h2> {group.description} </h2> 

            {isGroup ?
              <Button onClick={() => leaveHere()} variant="contained" color="primary">Leave Group</Button>
            :
              <Button onClick={() => joinHere()} variant="contained" color="primary">Join Group</Button>
            }
            {isAdmin &&
              <Button onClick={() => addEvent()} variant="contained" color="primary">Add new event</Button>
            }


            <EventList events ={group.events}/>

            <br/>
            <h3>Members:</h3>
              { group.members.map ( member => {
                return <div key = {member.id} className={classes.memberContainer}>
                  <User key = {member.id} user = {member.user}/>
                  <p><EmojiEventsIcon className={`${classes[member.trophy]}`}/></p>
                  <p key = {member.id}>{member.points}pts</p>
            </div>
              })}
          <Comments group={group} />
        </React.Fragment>
        }

    </div>
  );
}

export default GroupDetails;
