import { getSession, GetSessionParams } from 'next-auth/react';
import Main from '../components/Main';
import Player from '../components/Player';
import { Sidebar } from '../components/Sidebar';

const Home = () => {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <main className="flex">
                <Sidebar />
                <Main />
            </main>
            <div className="sticky bottom-0">
                <Player />
            </div>
        </div>
    );
};

export default Home;

export const getServerSideProps = async (context: GetSessionParams) => {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
};
