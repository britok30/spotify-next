import Head from 'next/head';
import { Sidebar } from '../components/Sidebar';

export default function Home() {
    return (
        <div className="">
            <Head>
                <title>Spotify.js</title>
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <h1>Spotify</h1>

            <main className="flex">
                <Sidebar />
                {/* center */}
            </main>
            <div>{/* player */}</div>
        </div>
    );
}
