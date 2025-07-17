import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import spotify from "@/public/images/spotify.png";

export default function SignUpPage() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="flex justify-center items-center flex-col bg-black/80 backdrop-blur-sm rounded-lg p-10 w-full max-w-md mx-4 border border-gray-800">
        {/* Spotify Logo */}
        <div className="mb-6">
          <Image src={spotify} alt="Spotify" width={60} height={60} />
        </div>

        <h1 className="text-white text-2xl font-bold mb-2 text-center">
          Join Spotify Clone
        </h1>

        <p className="text-gray-400 text-sm mb-8 text-center">
          Create your account to get started
        </p>

        {/* Clerk Sign Up Component */}
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent border-none shadow-none w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-white hover:bg-gray-100 text-black border-none font-semibold",
              formButtonPrimary:
                "bg-[#18D860] hover:bg-[#109643] text-white font-semibold",
              footerActionLink: "text-[#18D860] hover:text-[#109643]",
              formFieldInput: "bg-gray-900 border-gray-700 text-white",
              formFieldLabel: "text-gray-300",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
            },
          }}
        />
      </div>
    </div>
  );
}
