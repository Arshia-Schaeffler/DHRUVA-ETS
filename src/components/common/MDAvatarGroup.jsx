import React from "react";
import PropTypes from "prop-types";

const MDAvatarGroup = ({ avatars, max = 4, size = "small" }) => {
  const avatarSizes = {
    small: "w-5 h-5 text-xs",
    medium: "w-8 h-8 text-sm",
    large: "w-10 h-10 text-base",
  };

  const displayAvatars = avatars?.slice(0, max);
  const remainingCount = avatars?.length > max ? avatars.length - max : 0;

  return (
    <div className="flex -space-x-2">
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          title={avatar.name || avatar.alt || "Avatar"}
          className={`rounded-full border-2 border-white dark:border-gray-800 bg-gray-300 flex items-center justify-center overflow-hidden ${avatarSizes[size]}`}
        >
          {avatar.src ? (
            <img
              src={avatar.src}
              alt={avatar.alt || avatar.name || "Avatar"}
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <span className="text-white font-medium">
              {avatar.name ? avatar.name[0].toUpperCase() : "?"}
            </span>
          )}
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={`bg-gray-400 text-white flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800 ${avatarSizes[size]}`}
          title={`${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

MDAvatarGroup.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      alt: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  max: PropTypes.number,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default MDAvatarGroup;
