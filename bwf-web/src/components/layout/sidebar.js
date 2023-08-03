import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { auth } from '../../services/user-services';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate} from 'react-router-dom';
import  User  from '../user/user';


function Sidebar() {

  const [ username, setUsername] = useState('');
  const [ password, setPassword] = useState('');
  const {authData, setAuth} = useAuth();
  // const history = useHistory();
  const history = useNavigate();

  const handleSubmit = async e =>{
    e.preventDefault();
    const data = await auth({username, password});
    setAuth(data)
  }
  const logout = () =>{
    setAuth(null)
  }

  const account = () =>{
    history('/account');
  }
  return (
    <div className="sidebar">
      {!authData ? 
      <>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="username" label="Username" variant="standard"  onChange={e => setUsername(e.target.value)}/>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="password" label="Password" variant="standard" type='password' autoComplete='current-password' onChange={e => setPassword(e.target.value)}/>
          </Box>
            <Button color="primary" variant="contained" type='submit' >Login</Button>
            <br/>
        </form> 
        <Link to = {'/register'}>Register here if you don't hace an account yet</Link>
      </>
      :
      <div>
        <User user={authData.user}/>
        <br/>
        <br/>
        <Button color="primary" variant="contained" onClick={()=>logout()} >Logout</Button>
        <Button color="primary" variant="contained" onClick={()=>account()} >My Account</Button>
      
      </div>
      }     
    </div>

  );
}

export default Sidebar;
