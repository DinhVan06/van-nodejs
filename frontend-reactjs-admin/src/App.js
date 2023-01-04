import "./App.css";
import numeral from "numeral";
import "numeral/locales/vi";

import List from "./pages";

numeral.locale("vi");
function App() {
  return (
    <div>
      <List />
    </div>
  );
}

export default App;
