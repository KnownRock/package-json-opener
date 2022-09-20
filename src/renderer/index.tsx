import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { init } from './reducers/appSlice';

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
window.electron.ipcRenderer.once('package-json-info', (arg) => {
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
  // dis  init(arg as string[]);
});
window.electron.ipcRenderer.sendMessage('package-json-info', ['get']);

window.electron.ipcRenderer.on('message', (arg) => {
  console.log(arg);
});
