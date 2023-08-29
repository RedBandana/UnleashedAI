import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login/Login';
import PrivacyPolicy from './pages/Policies/PrivacyPolicy/PrivacyPolicy';
import TermsOfUse from './pages/Policies/TermsOfUse/TermsOfUse';
import NotFound from './pages/NotFound/NotFound';
import { RequireUser } from './routes/privateRoutes';
import Main from './pages/Main/Main';
import Home from './pages/Home/Home';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path='/chat' element={
          <RequireUser>
            <Main />
          </RequireUser>
        } />
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;