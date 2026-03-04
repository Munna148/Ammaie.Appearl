import { useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export function ProfileAvatar({ size = "lg", editable = true, onUpload }) {
  const { user } = useAuth();
  const inputRef = useRef(null);

  const sizeClass = size === "lg" ? "h-24 w-24 sm:h-28 sm:w-28" : "h-12 w-12";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpload?.(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`relative ${sizeClass} shrink-0`}
    >
      <div
        className={`${sizeClass} overflow-hidden rounded-full border-2 border-rose-200 bg-rose-100 dark:border-gray-600 dark:bg-gray-700`}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl text-rose-600 dark:text-rose-400 sm:text-4xl">
            {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?"}
          </span>
        )}
      </div>
      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow transition hover:bg-rose-600 dark:bg-rose-600"
            aria-label="Upload photo"
          >
            📷
          </button>
        </>
      )}
    </motion.div>
  );
}
