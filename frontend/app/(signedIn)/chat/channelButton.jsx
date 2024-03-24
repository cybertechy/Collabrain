import { Hash } from 'lucide-react';
const ChannelButton = ({ channel, isSelected, onSelect , channelId}) => {
    const handleClick = () => {
        onSelect(channel.name);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex font-sans  items-center w-full px-4 py-2 text-left text-lg rounded-lg ${
                isSelected ? 'bg-primary text-white' : 'text-primary border-2 border-primary'
            } hover:bg-gray-500 hover:text-white transition-colors duration-150`}
        >
            <Hash size={24} strokeWidth={2} className='mr-2' sx={{
          color: isSelected ? 'white' : '#30475E',
          '&:hover': {
            color: 'white', // This sets the text color to white on hover
          },
          ...(isSelected && {
            color: 'white', // If selected, text color is white
            // Additional styles for selected state here, if any
          })
        }} />{channel.name}
        </button>
    );
};
export default ChannelButton;