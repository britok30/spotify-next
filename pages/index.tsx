import Main from '../components/Main';
import { Sidebar } from '../components/Sidebar';

export default function Home() {
    return (
        <div className="bg-black h-screen overflow-hidden">
            <main className="flex">
                <Sidebar />
                <Main />
            </main>
            <div>{/* player */}</div>
        </div>
    );
}
