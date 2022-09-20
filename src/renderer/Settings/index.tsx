import { Box, Button, IconButton, Typography } from '@mui/material';
import PjoTextButton from 'renderer/components/PjoTextButton';
import LeftIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setting } from '../reducers/appSlice';

export default function Setting() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        }}
      >
        <PjoTextButton
          text="default json opener"
          onClick={() => {
            dispatch(setting('default-json-opener'));
          }}
        />
        <PjoTextButton
          text="default cmd executor"
          onClick={() => {
            dispatch(setting('default-cmd-executor'));
          }}
        />
      </Box>
    </Box>
  );
}
