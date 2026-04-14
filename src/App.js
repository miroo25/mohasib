import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Articles from '../pages/Articles';
import ArticleDetail from '../pages/ArticleDetail';
import Jobs from '../pages/Jobs';
import JobDetail from '../pages/JobDetail';
import Softwares from '../pages/Softwares';
import Login from '../pages/Login';
import Admin from '../pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/softwares" element={<Softwares />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
