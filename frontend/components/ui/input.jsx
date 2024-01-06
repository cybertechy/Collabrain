
const InputField = ({ placeholder }) => {
  return (
    <input 
      type="text" 
      className="w-80 h-10 pl-5 shadow-sm text-black placeholder-gray-800 placeholder-opacity-70 rounded-lg mb-3 palceholder:font-poppins"
      placeholder={placeholder} 
    />
  );
};

export default InputField;
