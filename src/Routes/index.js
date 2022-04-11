import { Routes, Route, BrowserRouter } from 'react-router-dom';
import MainPage from './MainPage';
import AutoRefetching from './Auto-refetching';
export const routes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/autorefetching" element={<AutoRefetching />} />
      </Routes>
    </BrowserRouter>
  );
};
