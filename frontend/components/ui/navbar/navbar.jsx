import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchBar from './navbarSubComponents/NavbarSearchbar'; // Import the SearchBar component

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-purple-600 p-4 flex items-center justify-between">

      <div className="flex-grow flex justify-center items-center mx-4">
        <SearchBar /> {/* Use the SearchBar component */}
      </div>
      <div className="flex items-center space-x-10"> {/* Adjusted spacing between icons */}
        <EmojiEventsIcon className = "cursor-pointer" style={{ color: 'white' }} />
        <NotificationsNoneIcon className = "cursor-pointer" style={{ color: 'white' }} />
        <AccountCircleIcon className = "cursor-pointer" style={{ color: 'white' }} />
        <SettingsIcon className = "cursor-pointer" style={{ color: 'white' }} />
      </div>
    </nav>
  );
};

export default Navbar;
