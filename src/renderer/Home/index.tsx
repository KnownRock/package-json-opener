import { Box, IconButton, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'renderer/store';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { npm, close, setting } from '../reducers/appSlice';
import PjoTextButton from '../components/PjoTextButton';

export default function Home() {
  const scripts = useSelector((state: RootState) => state.app.scripts);
  const name = useSelector((state: RootState) => state.app.name);
  const version = useSelector((state: RootState) => state.app.version);
  const withoutParams = useSelector(
    (state: RootState) => state.app.withoutParams
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MenuButton = useCallback(
    (props: { script: string }) => {
      const { script } = props;
      return (
        <PjoTextButton text={script} onClick={() => dispatch(npm(script))} />
      );
    },
    [dispatch]
  );

  const Close = useCallback(() => {
    return (
      <IconButton
        sx={{
          opacity: 0.5,
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={() => dispatch(close())}
      >
        <CloseIcon />
      </IconButton>
    );
  }, [dispatch]);

  const Setting = useCallback(() => {
    return (
      <IconButton
        sx={{
          opacity: 0.5,
          '&:hover': {
            opacity: 1,
          },
        }}
        onClick={() => navigate('/settings')}
      >
        <SettingsIcon />
      </IconButton>
    );
  }, [navigate]);

  const ToolBar = useCallback(() => {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Setting />
        <Close />
      </Box>
    );
  }, [Close, Setting]);

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
      <ToolBar />
      <Box>
        <Typography variant="h2">{name}</Typography>
        <Typography variant="h4">{version}</Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {scripts.map((script) => (
          <MenuButton script={`run ${script}`} key={script} />
        ))}

        <Box
          sx={{
            width: '100%',
            marginTop: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {!withoutParams && <MenuButton script="install" />}
        </Box>
      </Box>
    </Box>
  );
}