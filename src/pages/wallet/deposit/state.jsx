import { RiCloseCircleFill } from "react-icons/ri";
import { TbCircleCheckFilled, TbInfoCircleFilled } from "react-icons/tb";

export const statuses = {
    REJECTED: ({ className = "", size, hideText, hideIcon, ...rest }) => (
        <div {...rest} className={"text-red-600 " + className}>
            {!hideIcon && <RiCloseCircleFill size={size} className="inline" />}  {!hideText && "رد شده"}
        </div>
    ),
    PENDING: ({ className = "", size, hideText, hideIcon, ...rest }) => (
        <div {...rest} className={"text-warn " + className}>
            {!hideIcon && <TbInfoCircleFilled size={size} className="inline" />} {!hideText && "در انتظار تایید"}
        </div>
    ),
    ACCEPTED: ({ className = "", size, hideText, hideIcon, ...rest }) => (
        <div {...rest} className={"text-[#20B65C] " + className}>
            {!hideIcon && <TbCircleCheckFilled size={size} className="inline" />} {!hideText && "موفق"}
        </div>
    ),
};

const Unknown = ({ className = "", ...rest }) => (
    <div {...rest} className={"text-gray-500 " + className}>—</div>
);

export const Status = ({ state, className = "", ...rest }) => {
    if (!state) return null;
    const key = String(state).toUpperCase();
    const Component = statuses[key] || Unknown;
    return <Component className={className}  {...rest} />;
};