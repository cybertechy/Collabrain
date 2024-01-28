import MessageBox from "../chat/messageBox";
import Toolbar from '@mui/material/Toolbar';
import MessageItem from "../chat/messageItem";
import ShortTextIcon from '@mui/icons-material/ShortText';

export default function ChatWindow({ messages, sendPersonalMsg, userInfo, title }) {
    return (
        <div className="flex flex-col flex-grow relative">
                    <div className="flex items-center justify-between bg-gray-100 w-full mb-3 h-min">
                        <Toolbar sx={{ backgroundColor: 'whitesmoke' }}>
                            <h1 className='text-xl font-semibold text-primary items-center justify-center flex-row'>{<ShortTextIcon style={{ color: '#972FFF', opacity: '0.7' }} fontSize="large" />} General</h1>
                        </Toolbar>
                    </div>
                    <div className="flex">
                        <div className="p-5 h-5/6 scrollbar-thin scrollbar-thumb-primary text-black overflow-y-scroll">
                            {messages}
                        </div>

                        <div className="absolute z-10 inset-x-0 bottom-5 mx-5 text-white">
                            <MessageBox callback={sendPersonalMsg} />
                        </div>
                    </div>
                </div>
    );
}
