import SearchIcon from "@mui/icons-material/Search";

const SearchBar = () => {
    return (
        <div className="relative w-1/2">
            {" "}
            {/* Adjust this to control the width of the search bar */}
            <input
                type="search"
                className="w-full bg-basicallylight text-primary placeholder-primary p-2 pl-10 rounded-full focus:outline-none  focus:border-secondary"
                placeholder="Search Collabrain"
            />
            <SearchIcon
                className="text-primary"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.5rem",
                    transform: "translateY(-50%)",
                }}
            />
        </div>
    );
};

export default SearchBar;
