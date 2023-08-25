import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import PrivacyPolicy from './pages/Policies/PrivacyPolicy/PrivacyPolicy';
import TermsOfUse from './pages/Policies/TermsOfUse/TermsOfUse';
import NotFound from './pages/NotFound/NotFound';
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
        <Route path="/policies/privacy-policy" element={< PrivacyPolicy />} />
        <Route path="/policies/terms-of-use" element={< TermsOfUse />} />
        <Route path="/*" element={< NotFound />} />
      </Routes>
    </div>
  );
}

export default App;