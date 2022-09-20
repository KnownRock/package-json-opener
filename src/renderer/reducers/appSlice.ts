import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AppState = {
  scripts: string[];
  name: string;
  version: string;
  withoutParams: boolean;
};

const initialState: AppState = {
  scripts: [],
  name: 'welcome',
  version: '',
  withoutParams: true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    npm: (state, action: PayloadAction<string>) => {
      console.log(`npm ${action.payload}`);

      window.electron.ipcRenderer.sendMessage('execute', [
        `npm ${action.payload}`,
      ]);
    },
    close: () => {
      window.close();
    },
    init: (state, action: PayloadAction<AppState>) => {
      state.scripts = action.payload.scripts;
      state.name = action.payload.name;
      state.version = action.payload.version;
    },
    setting: (state, action: PayloadAction<string>) => {
      console.log('setting');
      window.electron.ipcRenderer.sendMessage('setting', [action.payload]);
    },
  },
});
export const { npm, close, init, setting } = appSlice.actions;
export default appSlice.reducer;
