import Link from "next/link";
import PropTypes from 'prop-types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
const SidebarItem = ({ href, icon: Icon, text, isSelected }) => {
  const itemClasses = isSelected? 'text-primary' : 'text-unselected'; 

  // Since Next.js 14, you can spread the props directly onto Link
  return (
    <Link href={href}>
      <div className={`flex w-64 items-center p-2 my-2 transition-colors duration-200 justify-start cursor-pointer `}>
        {Icon && <Icon fontSize = "medium" className={` mr-2  ${itemClasses}`} />}
        <span className={`mx-4 text-md font-normal ${itemClasses}`}>{text}</span>
        <ChevronRightIcon fontSize = "large" className={` ml-auto ${itemClasses}`} />
      </div>
    </Link>
  );
};

SidebarItem.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool
};

SidebarItem.defaultProps = {
  isSelected: false
};

export default SidebarItem;
