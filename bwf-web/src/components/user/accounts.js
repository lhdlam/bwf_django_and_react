import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { uploadAvatar } from '../../services/user-services';
import Box from '@mui/material/Box';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { changePass } from '../../services/user-services';
import {NotificationManager} from 'react-notifications';

function Accounts() {

    const { authData } = useAuth();
    const [image, setImange] = useState();
    const [ oldPassword, setOldPassword] = useState('');
    const [ password, setPassword] = useState('');
    const [ password2, setPassword2] = useState('');

    const passMatch = () => {
      return password === password2;
    }


    const uploadFile = async e =>{
        e.preventDefault();
        const uploadData = new FormData();
        uploadData.append('image', image, image.name);
        const uploaded = await uploadAvatar(authData.user.profile.id, uploadData)

        if (uploaded){
          NotificationManager.success("Image uploaded")
        } else{
          NotificationManager.error("Error. Image was no uploaded")
        }
      }

    const submitChangePass = async e =>{
      e.preventDefault();
      if(passMatch()){
        const passData = await changePass(
          { old_password: oldPassword, new_password: password}, 
          authData.user.id,
          authData.token
          )
        if(passData){
          NotificationManager.success("Password have been changed")
        }
      } else{
        NotificationManager.warning("Password don't match")
      }
      }


    return (
      <div>
          <Link to={'/'}>Back</Link>
          <h1>Change your picture</h1>
          <form onSubmit={uploadFile}>
            <label>
              <p>Upload your avatar</p>
              <TextField type='file' onChange={e => setImange(e.target.files[0])}/>
            </label>
            <Button type='submit' variant='contained' color='primary'>Upload file</Button>
          </form>
          <br/>
          <h1>Change your password</h1>
          <form onSubmit={submitChangePass}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="old_password" label="Old Password" variant="standard" type='password' onChange={e => setOldPassword(e.target.value)}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="password" label="New Password" variant="standard" type='password' onChange={e => setPassword(e.target.value)}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField id="password2" label="Repeat password" variant="standard" type='password' onChange={e => setPassword2(e.target.value)}/>
            </Box>
            <br/>
            <Button type='submit' variant='contained' color='primary'>Change password</Button>
          </form>
      </div>
    );
}

export default Accounts;
