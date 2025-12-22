import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CardLayout from "../CardLayout";
import Text from '../../../core/utils/Text'
const CustomTab = ({ tabs, baseUrl = "", useRouting = false }) => {
    const navigate = useNavigate();
    const location = useLocation();


    const activeTabIndexFromUrl = () => {
        const path = location.pathname.replace(baseUrl, "");
        const tab = tabs.findIndex((tab) => tab.url === path);
        return tab !== -1 ? tab : 0;
    };

    const [activeTab, setActiveTab] = React.useState(activeTabIndexFromUrl());

    useEffect(() => {
        if (useRouting) {
            setActiveTab(activeTabIndexFromUrl());
        }
    }, [location, useRouting]);

    const handleTabChange = (index) => {
        setActiveTab(index);
        if (useRouting) {
            navigate(`${baseUrl}${tabs[index].url}`);
        }
    };

    return (
        <div className="w-full">

            <CardLayout className="!py-0 !px-0 ">
                <div className="flex gap-2 w-full overflow-x-auto items-center scrollbar-hide">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`p-6 pt-7 text-sm font-medium transition text-gray-900 dark:text-white ${index === 0 ? 'rounded-tr-xl rounded-br-xl' : ''} ${activeTab === index
                                ? "bg-[#E2E2E2] dark:bg-gray-600"
                                : "border-transparent text-gray-500 hover:bg-gray-400/20"
                                }`}
                            onClick={() => handleTabChange(index)}
                        >
                            <Text tid={tab.label} className={`border-b-2  pb-4 whitespace-nowrap ${activeTab === index ? 'border-active' : 'border-transparent'}`} />
                        </button>
                    ))}
                </div>
            </CardLayout>

            <div className="py-6 rounded-lg">
                {tabs[activeTab]?.content}
            </div>
        </div>
    );
};

export default CustomTab;
