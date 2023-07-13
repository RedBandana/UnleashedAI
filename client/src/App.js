import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Chat from './pages/Chat/Chat';
import { RequireUser } from './routes/privateRoutes';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          <RequireUser>
            <Chat />
          </RequireUser>
        }
        />
        <Route path="/login" element={< Login />} />
      </Routes>
    </div>
  );
}

export default App;