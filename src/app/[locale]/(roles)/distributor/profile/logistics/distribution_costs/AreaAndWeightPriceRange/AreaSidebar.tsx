import React from 'react';

interface SidebarProps {
    items: string[];
    onItemClick: (item: string) => void;
}

const AreaSidebar: React.FC<SidebarProps> = ({ items, onItemClick }) => {
    return (
        <div>
            {items.map((item, index) => (
                <div key={index} onClick={() => onItemClick(item)}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default AreaSidebar;
