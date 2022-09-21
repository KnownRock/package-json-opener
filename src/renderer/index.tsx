import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { init, initSettings } from './reducers/appSlice';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;

// container.style['-webkit-app-region'] = 'drag';

const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.on('package-json-info', (arg) => {
  store.dispatch(
    init(
      arg as {
        scripts: string[];
        name: string;
        version: string;
        withoutParams: boolean;
      }
    )
  );
});

window.electron.ipcRenderer.on('settings', (arg) => {
  store.dispatch(
    initSettings(
      arg as {
        'json-opener': string;
        'cmd-execute-template': string;
      }
    )
  );
});

window.electron.ipcRenderer.sendMessage('settings', ['get']);

window.electron.ipcRenderer.sendMessage('package-json-info', ['get']);

window.electron.ipcRenderer.on('message', (arg) => {
  console.log(arg);
});
