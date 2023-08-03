import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { register } from '../../services/user-services';
import EmailIcon from '@mui/icons-material/Email';
import { auth } from '../../services/user-services';
import { useAuth } from '../../hooks/useAuth';


function Register() {

    const { setAuth} = useAuth();
    const history = useNavigate();
    const [ username, setUsername] = useState('');
    const [ password, setPassword] = useState('');
    const [ password2, setPassword2] = useState('');
    const [ email, setEmail] = useState('');


    const passMatch = () => {
      return password === password2;
    }


    const handleSubmit = async e =>{
        e.preventDefault();
        if(passMatch()){
          const regData = await register({username, email, password, profile: {is_premiun: false}})
          if(regData){
            const data = await auth({username, password});
            setAuth(data)
            history('/account')
          }
        } else{
          console.log('Pass dont match')
        }
      }

    return (
      <div>
          <Link to={'/'}>Back</Link>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="username" label="Username" variant="standard" onChange={e => setUsername(e.target.value)}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="password" label="Password" variant="standard" type='password' onChange={e => setPassword(e.target.value)}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="password2" label="Repeat password" variant="standard" type='password' onChange={e => setPassword2(e.target.value)}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="email" label="Email" variant="standard" type='text' onChange={e => setEmail(e.target.value)}/>
            </Box>
              <Button color="primary" variant="contained" type='submit' >Login</Button>
              <br/>
          </form> 
      </div>
    );
}

export default Register;
