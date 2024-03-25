"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false }); 
import smallLoader from "_public/assets/json/smallLoaderLottie.json";
import {

  fetchSharedContentMaps, fetchSharedDocuments
} from "../../utils/sharedFiles";
import DashboardInfoBar from "_components/ui/dashboardComponents/dashboardInfoBar";
import DashboardProjectButton from "_components/ui/dashboardComponents/dashboardProjectButton";
import ContextMenu from "_components/ui/contextMenu/contextMenu";
import Template from "@/components/ui/template/template";
const  LoaderComponent = dynamic(() => import('@/components/ui/loader/loaderComponent'), { ssr: false });
import { useAuthState } from "_firebase/firebase"; // Adjust based on actual path to useAuthState
import { useTTS } from "@/app/utils/tts/TTSContext";
import "@/app/utils/i18n"
import { useTranslation } from 'next-i18next';


export default function SharedWithMe() {
  const { t } = useTranslation('shared');
  const { speak, stop, isTTSEnabled } = useTTS();
  const [user, loading] = useAuthState();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState("LOGGING_IN");
  const [projects, setProjects] = useState([]);
  const [sharedContentMaps, setSharedContentMaps] = useState([]);
  const [isSharedContentMapsLoading, setSharedContentMapsLoading] = useState(true);
  const [isProjectsLoading, setProjectsLoading] = useState(true);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [projectChanges, setProjectChanges] = useState(0);
  const [sortCriteria, setSortCriteria] = useState({ sortName: false, sortDate: false, isAscending: true });
  const searchParams = useSearchParams();
  const router = useRouter();
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  const handleCloseContextMenu = () => {
    setContextMenuVisible(false);
  };

  useEffect(() => {
    if (!loading && user) {
      setLoadingState("");
      setIsLoading(false);
    } 
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setLoadingState("FETCHING_SHARED_CONTENT");
      setProjectsLoading(true);
      setSharedContentMapsLoading(true);
      setProjectsLoading(false);
      fetchSharedContentMaps(user.uid).then((contentMaps) => {
        setProjects(contentMaps);
        setSharedContentMaps(contentMaps);
        setSharedContentMapsLoading(false);
        
      });
      setIsLoading(false);
        setLoadingState("");
    }
  }, [user, projectChanges]);

  const handleSort = (newSortCriteria) => {
    setSortCriteria(newSortCriteria);
  };

  const sortedProjects = useMemo(() => projects.sort((a, b) => {2
    if (sortCriteria.sortName) {
      return sortCriteria.isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortCriteria.sortDate) {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return sortCriteria.isAscending ? dateA - dateB : dateB - dateA;
    }
    return 0;
  }), [projects, sortCriteria]);

  return (
    <div>
      <LoaderComponent
        isLoading={isLoading || isProjectsLoading || isSharedContentMapsLoading}
        loadingState={loadingState}
      />

      <DashboardInfoBar
        currentPath={searchParams.get("path") ? "Shared with Me" + searchParams.get("path") : "Shared with Me"}
        onSort={handleSort}
        sortCriteria={sortCriteria}
      />

      {/* Main Content area */}
      <div className="flex-grow p-4 flex flex-col" onContextMenu={handleContextMenu}>
        <ContextMenu
          className="context-menu"
          xPos={contextMenuPosition.x}
          yPos={contextMenuPosition.y}
          isVisible={contextMenuVisible}
          onClose={handleCloseContextMenu}
          menuOptions={[]}
        />

        {isProjectsLoading || isSharedContentMapsLoading ? (
          <Lottie animationData={smallLoader} play loop style={{ width: 100, height: 100 }} />
        ) : (
          <div>
            <p className="text-2xl text-left text-primary ml-4 mb-4"
            onMouseEnter={() => isTTSEnabled && speak("Shared projects")} onMouseLeave={stop}>{t('shrd_projects')}</p>
            <div className="flex flex-wrap gap-4 ml-4 justify-start">
              {sortedProjects.length > 0 ? sortedProjects.map((project) => (
                <DashboardProjectButton
                  key={project.id}
                  id={project.id}
                  title={project.name}
                  project = {project}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                  type={
                    project.type === "document"
                        ? "Document"
                        : "Content Map"
                }
                OnClick={() => { setIsLoading(true); setLoadingState("FETCHING_FILES"); }}
                />
              )) : (
                <div className="text-primary font-poppins text-xl italic" 
                onMouseEnter={() => isTTSEnabled && speak("No shared projects available.")}
                onMouseLeave={stop}>
                  {t('no_projects')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
