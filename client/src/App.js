import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import { RequireUser } from './routes/privateRoutes';
import Main from './pages/Main/Main';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={
          <RequireUser>
            <Main />
          </RequireUser>
        }
        />
        <Route path="/login" element={< Login />} />
      </Routes>
    </div>
  );
}

export default App;