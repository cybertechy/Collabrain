import MessageBox from "../chat/messageBox";
import Toolbar from '@mui/material/Toolbar';
import MessageItem from "../chat/messageItem";
import ShortTextIcon from '@mui/icons-material/ShortText';

export default function ChatWindow({ messages, sendPersonalMsg, userInfo, title }) {
    return (
        <div className="relative h-full w-full bg-white overflow-y-auto">
            <Toolbar sx={{ backgroundColor: 'whitesmoke', boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)' }}>
                <h1 className='text-xl font-semibold text-primary items-center justify-center flex-row'>{<ShortTextIcon style={{ color: '#972FFF', opacity: '0.7' }} fontSize="large" />} {title}</h1>
            </Toolbar>

            <div className="p-5 h-5/6 scrollbar-thin scrollbar-thumb-primary text-black overflow-y-scroll">
                {messages}
            </div>

            <div className="absolute z-10 inset-x-0 bottom-5 mx-5 text-white">
                <MessageBox callback={sendPersonalMsg} />
            </div>
        </div>
    );
}
