import PropTypes from "prop-types";
import { Tooltip } from '@mui/material';
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';

const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary", // Corrected spelling from 'teritary' to 'tertiary'
};

const SidebarButtonIcon = ({
    text,
    color,
    withShadow = false,
    Icon,
    onClick,
    isExpanded,
}) => {

    const { t } = useTranslation('sidebar');
    const { speak, stop, isTTSEnabled } = useTTS();

    const handleHover = () => {
        if (isTTSEnabled) {
            if (text === t('new_project')) {
                speak("New Project button"); 
            }
            if (text === t('new_team')) {
                speak("New Team button"); 
            }
            if (text === t('teams_disc')) {
                speak("Discover Teams button"); 
            }
        }
    };

    const handleLeave = () => {
        stop();
    };

    return (
        <Tooltip
            title={text}
            enterDelay={1000}
            leaveDelay={200}
        >
            <button
                className={`${
                    colorClasses[color]
                } px-4 py-4 h-13  rounded-custom font-poppins text-md my-4 text-basicallylight font-medium flex items-center justify-center transition-all duration-500 ease-in-out hover:bg-tertiary ${
                    withShadow ? "shadow-gray-400 shadow-custom" : ""
                }`}
                onClick={onClick}
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
            >
                <span
                    className="flex-grow text-center overflow-hidden font-bold text-basicallylight"
                    style={{
                        maxWidth: isExpanded ? "100%" : "0",
                        fontSize: isExpanded ? "1rem" : "0",
                        transition:
                            "max-width 0.5s ease-in-out, opacity 0.5s ease-in-out 0.5s", // Added opacity transition
                        opacity: isExpanded ? 1 : 0, // Control opacity based on isExpanded
                    }}
                >
                    {isExpanded ? text : ""}
                </span>
                {Icon && (
                    <Icon className="py-4 ml-2 transition-all  duration-445 ease-in-out " />
                )}
            </button>
        </Tooltip>
    );
};

SidebarButtonIcon.propTypes = {
    text: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    withShadow: PropTypes.bool,
    Icon: PropTypes.elementType,
    onClick: PropTypes.func,
    isExpanded: PropTypes.bool,
};

export default SidebarButtonIcon;
