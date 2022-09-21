import { Box, Button, IconButton, Typography } from '@mui/material';
import PjoTextButton from 'renderer/components/PjoTextButton';
import LeftIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'renderer/store';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { setting } from '../reducers/appSlice';

export default function Setting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const jsonOpener = useSelector((state: RootState) => state.app.jsonOpener);
  const cmdExecuteTemplate = useSelector(
    (state: RootState) => state.app.cmdExecuteTemplate
  );

  const [cmdExecuteTemplateState, setCmdExecuteTemplateState] =
    useState(cmdExecuteTemplate);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.5,
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={() => navigate('/')}
      >
        <LeftIcon />
      </IconButton>
      <Box>
        <Typography variant="h2">Setting</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography variant="h5">JSON opener</Typography>
        <TextField
          sx={{
            width: '80%',
          }}
          disabled
          value={jsonOpener}
        />
        <Button
          onClick={() => {
            dispatch(
              setting({
                type: 'json-opener',
                value: '',
              })
            );
          }}
        >
          change
        </Button>
        <Typography variant="h5">Cmd Execute Template</Typography>
        <TextField
          sx={{
            width: '80%',
          }}
          value={cmdExecuteTemplateState}
          onChange={(e) => {
            setCmdExecuteTemplateState(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            dispatch(
              setting({
                type: 'cmd-execute-template',
                value: cmdExecuteTemplateState,
              })
            );
          }}
        >
          change
        </Button>
      </Box>
    </Box>
  );
}
