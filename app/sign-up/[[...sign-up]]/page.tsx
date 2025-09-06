import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import spotify from "@/public/images/spotify.png";

export default function SignUpPage() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-2 sm:p-4">
      <div className="flex justify-center items-center flex-col bg-black/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-10 w-full max-w-md mx-auto border border-gray-800">
        {/* Spotify Logo */}
        <div className="mb-4 sm:mb-6">
          <Image 
            src={spotify} 
            alt="Spotify" 
            width={60} 
            height={60}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px]" 
          />
        </div>

        <h1 className="text-white text-xl sm:text-2xl font-bold mb-2 text-center">
          Join Spotify Clone
        </h1>

        <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 text-center px-4">
          Create your account to get started
        </p>

        {/* Clerk Sign Up Component */}
        <div className="w-full flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "!w-full !flex !justify-center",
                card: "!bg-transparent !border-none !shadow-none !w-full !max-w-sm !mx-auto !px-0",
                headerTitle: "!hidden",
                headerSubtitle: "!hidden",
                socialButtonsBlockButton:
                  "!bg-white hover:!bg-gray-100 !text-black !border-none !font-semibold !text-sm sm:!text-base",
                formButtonPrimary:
                  "!bg-[#18D860] hover:!bg-[#109643] !text-white !font-semibold !text-sm sm:!text-base",
                footerActionLink: "!text-[#18D860] hover:!text-[#109643] !text-xs sm:!text-sm",
                formFieldInput: "!bg-gray-900 !border-gray-700 !text-white !text-sm sm:!text-base",
                formFieldLabel: "!text-gray-300 !text-xs sm:!text-sm",
                dividerLine: "!bg-gray-600",
                dividerText: "!text-gray-400 !text-xs sm:!text-sm",
                identityPreviewText: "!text-white !text-sm",
                identityPreviewEditButton: "!text-[#18D860] !text-xs sm:!text-sm",
                footer: "!text-xs sm:!text-sm !flex !justify-center",
                footerActionText: "!text-xs sm:!text-sm !text-center",
                footerAction: "!justify-center",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
