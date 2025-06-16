"use client";

import { FC } from "react";

interface MapModalProps {
  link: string;
  onClose: () => void;
}

const MapModal: FC<MapModalProps> = ({ link, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl relative">
        <button
          className="absolute top-2 right-2 text-black text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <iframe
          src={link}
          title="Map"
          className="w-full h-[500px] border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default MapModal;