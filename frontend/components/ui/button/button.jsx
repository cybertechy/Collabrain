

const Button = ({ text,withShadow = false, onClick }) => (
    <button
        className={`bg-primary hover:bg-tertiary px-20 py-2 rounded-3xl font-poppins uppercase text-md my-4 w-full text-basicallylight font-bold ${
            withShadow ? "shadow-primary drop-shadow-md" : ""
        }`}
        onClick={onClick}
    >
        {text}
    </button>
);


export default Button;
