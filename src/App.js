import "./App.css";
import { Spotify } from "./pages"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'

library.add(faLink);

function App() {
  return (
    <div>
      <Spotify />
    </div>
  );
}

export default App;