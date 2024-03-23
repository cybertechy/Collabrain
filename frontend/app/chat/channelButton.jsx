import { Hash } from 'lucide-react';
const ChannelButton = ({ channel, isSelected, onSelect , channelId}) => {
    const handleClick = () => {
        onSelect(channel.name);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex font-sans  items-center w-full px-4 py-2 text-left text-lg rounded-lg ${
                isSelected ? 'bg-primary text-white' : 'text-black'
            } hover:bg-gray-500 hover:text-white transition-colors duration-150`}
        >
            <Hash size={24} strokeWidth={2} className="text-white mr-2" />{channel.name}
        </button>
    );
};
export default ChannelButton;