import React from 'react';
import {makeStyles} from "@mui/styles";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import { useNavigate} from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  container: {
      cursor: "pointer",
      textAlign: "left",
      border: "2px solid #ffff",
      borderRadius: "1rem",
      padding: "0 1rem",
      display: "grid",
      gridTemplateColumns: "5fr auto",
      marginBottom: "1rem",
  },
  name: {
      color: theme.palette.primary.main
  },
}))
;

function GroupListItem({group}) {

  const classes = useStyles();
  const history = useNavigate();

  const groupClicked = groupId => {
    history(`details/${groupId}`)
  }
  return (
    <div>
        {group && 
        <div className={classes.container} onClick={()=> groupClicked(group.id)}>
            <h3> <span className={classes.name}>{group.name}</span>: <LocationOnIcon/> {group.location}</h3>
          <h3>
            <GroupIcon/>{group.num_members}
          </h3>
          <p>{group.description}</p>
          </div>
        }
      </div>
  );
}

export default GroupListItem;
