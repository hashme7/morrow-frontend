import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router } from "react-router-dom";
import { store, persistor } from "./store/store";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
      </PersistGate>
    </Provider>
  );
};

export default App;
