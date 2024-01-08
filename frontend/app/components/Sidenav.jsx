import { useNavigate } from 'react-router-dom';
import Logo from '../assets/pics/collabrain.png';
import Plus from '../assets/pics/plus.png';
import FolderPic from '../assets/pics/folder.png';
import FolderSelectedPic from '../assets/pics/folder-s.png';
import SharedPic from '../assets/pics/2-ppl.png';
import RecentPic from '../assets/pics/clock.png';
import StarredPic from '../assets/pics/star.png';
import GroupPic from '../assets/pics/group.png';
import MsgPic from '../assets/pics/msg.png';
import CallPic from '../assets/pics/call.png';
import SharedSelectedPic from '../assets/pics/2-ppl-s.png';
import RecentSelectedPic from '../assets/pics/clock-s.png';
import StarredSelectedPic from '../assets/pics/star-s.png';
import GroupSelectedPic from '../assets/pics/group-s.png';
import MsgSelectedPic from '../assets/pics/msg-s.png';
import CallSelectedPic from '../assets/pics/call-s.png';
import NavLink from './SidenavLinks';

export default function SideNav({ isOpen, onToggle }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/mybrain');
  };

  return (
    <nav class={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div class={`toggler ${isOpen ? 'open' : 'closed'}`}onClick={onToggle}>
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <div class="header">
          <div class="brand" onClick={handleLogoClick}><img src={Logo} alt='Collabrain'/>
            <p>Collabrain</p>
          </div>
        </div>
        <div className='long-line'/>
        <div className="createbutton">
          <p>New Project</p>
          <img
            src={Plus}
            alt="New Project"
          />
        </div>
        <NavLink to="/mybrain" text="My Brain" imgSrc={FolderPic} selectedImgSrc={FolderSelectedPic} />
        <NavLink to="/shared-with-me" text="Shared With Me" imgSrc={SharedPic} selectedImgSrc={SharedSelectedPic} />
        <NavLink to="/recents" text="Recent" imgSrc={RecentPic} selectedImgSrc={RecentSelectedPic} />
        <NavLink to="/starred" text="Starred" imgSrc={StarredPic} selectedImgSrc={StarredSelectedPic} />
        <div className='divider'/>
        <NavLink to="/teams" text="Teams" imgSrc={GroupPic} selectedImgSrc={GroupSelectedPic} />
        <NavLink to="/messages" text="Messages" imgSrc={MsgPic} selectedImgSrc={MsgSelectedPic} />
        <NavLink to="/calls" text="Calls" imgSrc={CallPic} selectedImgSrc={CallSelectedPic} />
        <div className='divider'/>
        </nav>
  );
}