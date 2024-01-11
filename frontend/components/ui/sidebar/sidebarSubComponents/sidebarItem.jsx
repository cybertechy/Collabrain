import Link from "next/link";
import PropTypes from 'prop-types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SidebarItem = ({ href, icon: Icon, text, isSelected, isExpanded }) => {
  const itemClasses = isSelected ? 'text-primary' : 'text-unselected'; 

  return (
    <Link href={href}>
      <div className={`flex w-64 items-center p-2 my-2 transition-colors duration-200 justify-start cursor-pointer hover:bg-gray-200`}>
        {Icon && <Icon fontSize="medium" className={`mr-2 ${itemClasses}`} />}
        {isExpanded && <span className={`mx-4 transition-all duration-500 ease-in-out text-md font-normal ${itemClasses}`}>{text}</span>}
        {isExpanded && <ChevronRightIcon fontSize="large" className={`ml-auto ${itemClasses}`} />}
      </div>
    </Link>
  );
};

SidebarItem.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  isExpanded: PropTypes.bool
};

SidebarItem.defaultProps = {
  isSelected: false,
  isExpanded: true
};

export default SidebarItem;
