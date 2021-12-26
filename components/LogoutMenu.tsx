import React, { forwardRef } from 'react';
import { signOut } from 'next-auth/react';

const LogoutMenu = forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div
            ref={ref}
            className="w-44 mt-5 rounded-lg bg-black text-gray-500 shadow-2xl"
        >
            <div className="pl-3 py-2 rounded-lg hover:cursor-pointer hover:text-white hover:bg-gray-900 transition duration-150 ease-in text-sm">
                Account
            </div>
            <div className="pl-3 py-2 rounded-lg hover:cursor-pointer hover:text-white hover:bg-gray-900 transition duration-150 ease-in text-sm">
                Profile
            </div>
            <div className="pl-3 py-2 rounded-lg hover:cursor-pointer hover:text-white hover:bg-gray-900 transition duration-150 ease-in text-sm">
                Private session
            </div>
            <div className="pl-3 py-2 rounded-lg hover:cursor-pointer hover:text-white hover:bg-gray-900 transition duration-150 ease-in text-sm">
                Settings
            </div>
            <hr className="my-2" />
            <div className="pl-3 py-2 rounded-lg hover:cursor-pointer hover:text-white hover:bg-gray-900 transition duration-150 ease-in text-sm">
                Update Spotify
            </div>
            <div
                className="pl-3 py-2 rounded-lg hover:cursor-pointer  hover:text-white hover:bg-gray-900 transition duration-150 ease-in text-sm"
                onClick={() => signOut()}
            >
                Logout
            </div>
        </div>
    );
});
export default LogoutMenu;
