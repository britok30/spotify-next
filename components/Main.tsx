import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { colors } from '../lib/colors';

const Main = () => {
    const { data: session } = useSession();
    const [color, setColor] = useState<string[] | null>(null);

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, []);

    return (
        <div className="flex-grow text-white">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 transition duration-150 ease-in cursor-pointer rounded-full p-1 pr-2">
                    {session?.user.image ? (
                        <img
                            className="rounded-full w-10 h-10"
                            src={session?.user.image}
                            alt="profile image"
                        />
                    ) : (
                        <div className="rounded-full w-10 h-10 bg-black"></div>
                    )}

                    <h2>{session?.user.name ? session.user.name : 'User'}</h2>
                    <ChevronDownIcon className="w-5 h-5" />
                </div>
            </header>

            <section
                className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 w-full`}
            >
                <h1>Hello</h1>
            </section>
        </div>
    );
};

export default Main;
