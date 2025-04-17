// import { Button } from "@/components/ui/button"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { redirect } from "next/navigation"
// import { FaGithub } from "react-icons/fa"
// import Link from "next/link"

// export default async function SignIn() {
//   const session = await getServerSession(authOptions)

//   if (session) {
//     redirect("/dashboard")
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center">
//       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//         <div className="flex flex-col space-y-2 text-center">
//           <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
//           <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
//         </div>
//         <div className="grid gap-6">
//           <Link href="/api/auth/signin/github" className="w-full">
//             <Button variant="outline" className="w-full">
//               <FaGithub className="mr-2 h-4 w-4" />
//               Sign in with GitHub
//             </Button>
//           </Link>
//         </div>
//         <p className="px-8 text-center text-sm text-muted-foreground">
//           By clicking continue, you agree to our{" "}
//           <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
//             Terms of Service
//           </Link>{" "}
//           and{" "}
//           <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
//             Privacy Policy
//           </Link>
//           .
//         </p>
//       </div>
//     </div>
//   )
// }

"use client"; // Add this to make it a client component

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react"; // Import signIn function
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

// If you need server-side session check, use a separate server component 
// that wraps this client component

export default function SignIn() {
  // Handle GitHub sign-in correctly
  const handleGitHubSignIn = (e) => {
    e.preventDefault();
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        <div className="grid gap-6">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGitHubSignIn}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}