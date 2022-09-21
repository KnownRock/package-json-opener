import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  scripts: string[];
  name: string;
  version: string;
  withoutParams: boolean;

  cmdExecuteTemplate: string;
  jsonOpener: string;
};

const initialState: AppState = {
  scripts: [],
  name: 'welcome',
  version: '',
  withoutParams: true,

  cmdExecuteTemplate: 'start cmd.exe @cmd /k {pjocmd}',
  jsonOpener: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    npm: (state, action: PayloadAction<string>) => {
      console.log(`npm ${action.payload}`);

      window.electron.ipcRenderer.sendMessage('execute', [`${action.payload}`]);
    },
    close: () => {
      window.close();
    },
    init: (
      state,
      action: PayloadAction<{
        name: string;
        version: string;
        scripts: string[];
        withoutParams: boolean;
      }>
    ) => {
      state.scripts = action.payload.scripts;
      state.name = action.payload.name;
      state.version = action.payload.version;
      state.withoutParams = action.payload.withoutParams;
    },
    setting: (
      state,
      action: PayloadAction<{
        type: 'cmd-execute-template' | 'json-opener';
        value: string;
      }>
    ) => {
      // console.log('setting');
      window.electron.ipcRenderer.sendMessage('set-setting', [action.payload]);
    },
    initSettings: (
      state,
      action: PayloadAction<{
        'cmd-execute-template': string;
        'json-opener': string;
      }>
    ) => {
      if (action.payload['cmd-execute-template']) {
        state.cmdExecuteTemplate = action.payload['cmd-execute-template'];
      }
      state.jsonOpener = action.payload['json-opener'];
    },
  },
});
export const { npm, close, init, setting, initSettings } = appSlice.actions;
export default appSlice.reducer;
