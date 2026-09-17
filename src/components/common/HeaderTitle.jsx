
import PropTypes from "prop-types";
import { FiChevronRight } from "react-icons/fi";
import { useEffect } from "react";

const HeaderTitle = ({ title, subtitle, buttons = [] }) => {
  useEffect(() => {
    console.log("HeaderTitle rendered with buttons:", buttons);
  }, [buttons]);

  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="flex items-center space-x-2 text-gray-700 font-bold">
          <h2 className="text-2xl font-bold">{title}</h2>
          {buttons.length > 0 && <FiChevronRight />}
        </div>

        {subtitle && (
          <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex space-x-2">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            type={btn.type || "button"}
            onClick={btn.onClick}
            className={`px-4 py-2 rounded text-white font-medium ${
              btn.variant === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

HeaderTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      type: PropTypes.string,
      variant: PropTypes.string,
    })
  ),
};

export default HeaderTitle;

