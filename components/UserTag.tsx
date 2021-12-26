import { ChevronDownIcon } from '@heroicons/react/outline';
import { Session } from 'next-auth';
import React from 'react';

const UserTag = ({
    session,
    setIsComponentVisible,
}: {
    session: Session;
    setIsComponentVisible: (value: boolean) => void;
}) => {
    return (
        <div
            className="w-44 flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 transition duration-150 ease-in cursor-pointer rounded-full p-1 pr-2"
            onClick={() => setIsComponentVisible(true)}
        >
            <img
                className="rounded-full w-10 h-10"
                src={session?.user.image}
                alt="profile image"
            />

            <h2 className="text-sm">{session?.user.name}</h2>
            <ChevronDownIcon className="w-3 h-3" />
        </div>
    );
};

export default UserTag;
