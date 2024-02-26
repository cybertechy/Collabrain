// LoadingStates.js
import defaultAnimation from '../../../public/assets/json/defaultLoaderLottie.json'; 
import loadingFiles from '../../../public/assets/json/loaderFilesLottie.json';
import loadingFolders from '../../../public/assets/json/loaderFoldersLottie.json';
import fetchMessages from '../../../public/assets/json/fetchMessagesLottie.json';
const LoadingStates = {
  DEFAULT: { message: "Loading...", animation: defaultAnimation },
  LOGGING_IN: { message: "Trying to sign in...", animation: defaultAnimation },
  FETCHING_FILES: { message: "Fetching files...", animation: loadingFiles },
  FETCHING_FOLDERS: { message: "Fetching folders...", animation: loadingFolders },
  FETCHING_MESSAGES: { message: "Fetching messages...", animation: fetchMessages },
  
};

export default LoadingStates;
