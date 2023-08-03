import React, {useEffect, useState} from 'react';
import Comment from '../comments/comment';
import { useAuth } from '../../hooks/useAuth';
import { postComment } from '../../services/group-services';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

// const useStyles = makeStyles( theme => ({
//   empty: {
//     fontSize: '18px',
//   }
// }));

function Comments({group}) {
  const [ newComment, setNewComment ] = useState('');
  const { authData } = useAuth();

  const getUser = userId => {
      return group.members.find(member => member.user.id === userId).user;
  }

  const sendComment = () => {
    // console.log(authData.token, newComment, group.id, authData.user.id);
    postComment(authData.token, newComment, group.id, authData.user.id)
    .then( resp => {
      setNewComment('')
      group.comments.unshift(resp);
    })
  }


  return (
    <div className="header">
      <hr/>
      <h1>Comments:</h1>
      <TextField
          label="New comment"
          multiline
          // fullwidth
          rows={2}
          variant="outlined" 
          value={newComment}
          onChange={ e => setNewComment(e.target.value)}
        />
          <Button 
          onClick={() => sendComment()} 
          disabled={!newComment} 
          variant='contained' 
          color="primary"
        >
          Send comment
        </Button>
        <br /><br />
        {group.comments.map(comment => {
          return <Comment key = {comment.id} comment={comment} user = {getUser(comment.user)}/>
        })}
    </div>
  );
}

export default Comments;