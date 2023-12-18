import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import ChatPage from './pages/chat/ChatPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
