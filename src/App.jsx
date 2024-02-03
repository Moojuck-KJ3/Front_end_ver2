import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux_states/store";

function App() {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
}

export default App;
