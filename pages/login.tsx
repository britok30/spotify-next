import { BuiltInProviderType } from 'next-auth/providers';
import {
    ClientSafeProvider,
    getProviders,
    LiteralUnion,
    signIn,
} from 'next-auth/react';
import Image from 'next/image';

const Login = ({
    providers,
}: {
    providers: Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    >;
}) => {
    return (
        <div className="bg-black min-h-screen w-full overflow-hidden flex items-center justify-center bg-[url('/images/login-hero.jpg')] bg-cover bg-no-repeat bg-opacity-10">
            <div className="flex justify-center items-center flex-col bg-black rounded-lg p-10 w-96">
                <div className="mb-3">
                    <Image
                        src="/images/spotify.png"
                        alt="Spotify"
                        width={50}
                        height={50}
                    />
                </div>

                <p className="text-white text-3xl font-bold mb-6 text-center">
                    Million of songs, free on Spotify
                </p>

                <button className="text-white p-3 bg-[#18D860] hover:bg-[#109643] rounded-full w-52 mb-4 transition ease-in duration-150 hover:scale-105 text-sm">
                    SIGN UP FREE
                </button>

                {Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button
                            className="text-black p-3 bg-white rounded-full w-52 hover:bg-gray-300 transition ease-in duration-150 hover:scale-105 mb-6 text-sm"
                            onClick={() =>
                                signIn(provider.id, { callbackUrl: '/' })
                            }
                        >
                            LOGIN WITH {provider.name.toUpperCase()}
                        </button>
                    </div>
                ))}

                <span className="text-white text-xs cursor-pointer">
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
