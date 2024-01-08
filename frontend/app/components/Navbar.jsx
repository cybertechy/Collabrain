import search from '../assets/pics/search.png';
import Leaderboard from './Leaderboard'
import leaderboard from '../assets/pics/leaderboard.png';
import Notifications from './Notif'
import notif from '../assets/pics/notif.png';
import Settings from './Settings'
import settings from '../assets/pics/settings.png';
import Profile from './Profile'
import profile from '../assets/pics/user.png';
import { useState } from 'react';

export default function Navbar() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // api call
    console.log("Searching for:", query);
  }
  const handleKeyPress = (e) => {
  if (e.keyCode === 13) {
    handleSearch();
  }
}
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleImageClick = (componentSelected) => {
    setSelectedComponent(componentSelected === selectedComponent ? null : componentSelected);
  };

  const handleClose = () => {
    setSelectedComponent(null);
  };

  return (
    <div className="topnavbar">
      <div className="searchbar">
        <img
        src={search}
        alt="Search"
        className="search-icon"
        onClick={handleSearch}
        />
        <input
        type="text"
        placeholder="Search Collabrain"
        value={query}
        onKeyUp={handleKeyPress}
        onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className='images'>
        <img
        src={leaderboard}
        alt="Leaderboard"
        className={selectedComponent === 'leaderboard' ? 'selected' : ''}
        onClick={() => handleImageClick('leaderboard')}
        />
        <img
        src={notif}
        alt="Notifications"
        className={selectedComponent === 'notifications' ? 'selected' : ''}
        onClick={() => handleImageClick('notifications')}
        />
        <img
        src={settings}
        alt="Settings"
        className={selectedComponent === 'settings' ? 'selected' : ''}
        onClick={() => handleImageClick('settings')}
        />
        <img
        src={profile}
        alt="Profile"
        className={selectedComponent === 'profile' ? 'selected' : ''}
        onClick={() => handleImageClick('profile')}
        />
      </div>
      <div className='rendered-component'>
        {selectedComponent === 'leaderboard' && <Leaderboard onClose={handleClose}/>}
        {selectedComponent === 'notifications' && <Notifications onClose={handleClose}/>}
        {selectedComponent === 'settings' && <Settings onClose={handleClose}/>}
        {selectedComponent === 'profile' && <Profile onClose={handleClose}/>}
      </div>
    </div>
    )
  }

