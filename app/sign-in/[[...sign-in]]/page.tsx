import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import spotify from "@/public/images/spotify.png";

export default function SignInPage() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="flex justify-center items-center flex-col bg-black/80 backdrop-blur-sm rounded-lg p-10 w-full max-w-md mx-4 border border-gray-800">
        {/* Spotify Logo */}
        <div className="mb-6">
          <Image src={spotify} alt="Spotify" width={60} height={60} />
        </div>

        <h1 className="text-white text-2xl font-bold mb-2 text-center">
          Welcome to Spotify Clone
        </h1>

        <p className="text-gray-400 text-sm mb-8 text-center">
          Connect your Spotify account to continue
        </p>

        {/* Clerk Sign In Component with !important styles */}
        <SignIn
          forceRedirectUrl="/"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: "!w-full",
              card: "!bg-transparent !border-none !shadow-none !w-full",
              headerTitle: "!hidden",
              headerSubtitle: "!hidden",
              socialButtonsBlockButton:
                "!bg-[#18D860] hover:!bg-[#109643] !text-white !border-none !font-semibold !transition-all !duration-200 hover:!scale-105",
              socialButtonsBlockButtonText: "!text-white !font-semibold",
              formButtonPrimary:
                "!bg-[#18D860] hover:!bg-[#109643] !text-white !font-semibold",
              footerActionLink: "!text-[#18D860] hover:!text-[#109643]",
              formFieldInput: "!bg-gray-900 !border-gray-700 !text-white",
              formFieldLabel: "!text-gray-300",
              dividerLine: "!bg-gray-600",
              dividerText: "!text-gray-400",
              identityPreviewText: "!text-white",
              identityPreviewEditButton: "!text-[#18D860]",
            },
          }}
        />

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-xs">
            For the best experience, sign in with Spotify
          </p>
        </div>
      </div>
    </div>
  );
}
