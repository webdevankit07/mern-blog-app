import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import store, { persistor } from './store/Store.ts';
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './components/ThemeProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <PersistGate persistor={persistor}>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </PersistGate>
);
