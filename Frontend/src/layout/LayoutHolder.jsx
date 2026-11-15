
import React from 'react';
import { Outlet } from 'react-router';

const LayoutHolder = () => {
    return (
        <div className="min-h-screen bg-base-200">
            <Outlet />
        </div>
    );
};

export default LayoutHolder;
