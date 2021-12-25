import { BuiltInProviderType } from 'next-auth/providers';
import {
    ClientSafeProvider,
    getProviders,
    LiteralUnion,
    signIn,
} from 'next-auth/react';
import Image from 'next/image';
import spotify from '../public/images/spotify.png';
import login from '../public/images/login-hero.jpg';

const Login = ({
    providers,
}: {
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    >;
}) => {
    return (
        <div className="bg-black min-h-screen w-full overflow-hidden flex items-center justify-center bg-cover bg-no-repeat">
            <div className="fixed h-screen w-screen overflow-hidden opacity-30">
                <Image
                    src={login}
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    placeholder="blur"
                />
            </div>

            <div className="flex justify-center items-center flex-col bg-black rounded-lg p-10 w-3/4 md:w-1/2 lg:w-96 z-10">
                <div className="mb-3">
                    <Image src={spotify} alt="Spotify" width={50} height={50} />
                </div>

                <p className="text-white text-3xl font-bold mb-6 text-center">
                    Millions of songs, free on Spotify
                </p>

                <button className="text-white p-3 bg-[#18D860] hover:bg-[#109643] rounded-full w-full mb-4 transition ease-in duration-150 hover:scale-105 text-sm">
                    SIGN UP FREE
                </button>

                {Object.values(providers).map(
                    (provider: ClientSafeProvider) => (
                        <button
                            key={provider.name}
                            className="text-black p-3 bg-white rounded-full w-full hover:bg-gray-300 transition ease-in duration-150 hover:scale-105 mb-6 text-sm"
                            onClick={() =>
                                signIn(provider.id, { callbackUrl: '/' })
                            }
                        >
                            LOGIN WITH {provider.name.toUpperCase()}
                        </button>
                    )
                )}

                <span className="text-white text-xs cursor-pointer hover:underline">
                    SETTINGS
                </span>
            </div>
        </div>
    );
};

export default Login;

export const getServerSideProps = async () => {
    const providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > = await getProviders();

    return {
        props: {
            providers,
        },
    };
};
