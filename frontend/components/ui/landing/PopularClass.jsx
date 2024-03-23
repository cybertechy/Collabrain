import React from "react";
import Image from "next/image";
import messagingImg from "@/public/assets/images/messaging.png";
import ContentMapsSvg from "@/public/assets/svg/contentmaps.svg";
import documentsImg from "@/public/assets/images/documents.webp";

const PopularClass = () => {
  const service = [
    {
      img: "/assets/messaging.png",
      title: "Direct Messages",
      sub: "Engage in conversations with other users through direct messaging, allowing seamless one-on-one communication and file sharing within the platform.",

    },
    {
      img: "/assets/contentmaps.svg",
      title: "Experience Content Maps",
      sub: "At CodeSync, we came up with the term content map, which is defined by 'a canvas where users can create diagrams, add notes and annotate'. Enhance your creativity flow by putting together different pictures, drawings or text notes, and invite your friends to work on your ideas together!",

    },
    {
      img: "/assets/documents.webp",
      title: "Create and Edit Documents",
      sub: "Foster productivity by creating and editing documents collaboratively within the platform, promoting seamless teamwork and document version control for better experience.",

    },
  ];
  return (
    <div className="container mx-auto h-64 md:h-screen py-10">

      <p className="text-lg text-primary font-bold">Why choose Collabrain?</p>
      <p className="text-3xl font-semibold  py-3">Exclusive Features</p>
      <p className="text-gray-500 text-base py-3">
        Collabrain was designed with user satisfaction as the primary aim. The application has a range of features to cater to your needs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-12 py-10">

        <div className="px-6 py-4  rounded-xl bg-gray-50  border border-gray-200 hover:bg-primary group ">
          <Image className="w-full" src={messagingImg} alt="services" />
          <div className="flex justify-between items-center mt-4">
            <p className="text-2xl group-hover:text-white font-semibold line-clamp-1"> Direct Messages</p>
          </div>

          <p className="text-base group-hover:text-white pr-6 py-2"> Engage in conversations with other users through direct messaging, allowing seamless one-on-one communication and file sharing within the platform. </p>
        </div>

        <div className="px-6 py-4  rounded-xl bg-gray-50  border border-gray-200 hover:bg-primary group ">
          <ContentMapsSvg className="w-full" />
          <div className="flex justify-between items-center  mt-4">
            <p className="text-2xl group-hover:text-white font-semibold line-clamp-1">  Experience Content Maps </p>
          </div>

          <p className="text-base group-hover:text-white pr-6 py-2"> At CodeSync, we came up with the term content map, which is defined by 'a canvas where users can create diagrams, add notes and annotate'. Enhance your creativity flow by putting together different pictures, drawings or text notes, and invite your friends to work on your ideas together! </p>
        </div>

        <div className="px-6 py-4  rounded-xl bg-gray-50  border border-gray-200 hover:bg-primary group ">
          <Image className="w-full" src={documentsImg} alt="services" />
          <div className="flex justify-between items-center  mt-4">
            <p className="text-2xl group-hover:text-white font-semibold line-clamp-1"> Create and Edit Documents</p>
          </div>

          <p className="text-base group-hover:text-white pr-6 py-2"> Foster productivity by creating and editing documents collaboratively within the platform, promoting seamless teamwork and document version control for better experience. </p>
        </div>

      </div>

    </div>
  );
};

export default PopularClass;
