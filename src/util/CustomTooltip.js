// CustomTooltip.js
import React from 'react';
import './CustomTooltip.css';

function CustomTooltip({ content, children, className }) {
    return (
        <div className={className ? `custom-tooltip ${className}` : "custom-tooltip"}>
            {children}
            <span className="custom-tooltip-content">{content}</span>
        </div>
    );
}


export default CustomTooltip;
