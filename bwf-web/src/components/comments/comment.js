import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import User from '../user/user';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles( theme => ({
//const useStyles = makeStyles( theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
  },
  dialogBox: {
      marginBottom: '20px;'
  },
  // dialogBody: {
  //     marginBottom: '20px'
  // },
  dialogBody: {
      position: 'relative',
      padding: '5px',
      backgroundColor: theme.colors.bgLighterColor,
      borderRadius: '5px',
      border: `5px solid ${theme.colors.bgLigtherColor}`
  },
  tip: {
      width: '0',
      height: '0',
      position: 'absolute',
      background: 'transparent',
      boder: `10px solid ${theme.colors.bgLighterColor}`,
      top: '5px',
      left: '-25px',
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
  },
  bodyMessage: {
      color: theme.colors.mainAccentColor
  },
  time: {
      float: 'right'
  }
}));

function Comment({comment, user}) {

    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
        <div className={classes.container}>
            <User user={user} />
            <div className={classes.dialogBox}>
                <div className={classes.dialogBody}>
                    <span className={classes.tip}>&nbsp;</span>
                    <div className={classes.bodyMessage}>
                        <span>{comment.description}</span>
                    </div>
                    </div>
                    <Typography className={classes.time}>
                        {comment.time.split('T')[0]} &nbsp;{comment.time.split('T')[1].substring(0, 5)}
                    </Typography>
            </div>
        </div>
        </ThemeProvider>
    );
}

export default Comment;
