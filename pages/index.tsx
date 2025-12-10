import { useEffect, useState } from "react";
import SignupFormDemo from "@/components/signup-form-demo";

export default function Home() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
          body: JSON.stringify({
            query: `
              query Me {
                me {
                  id
                  email
                  firstName
                  lastName
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.data?.me) {
          // User is authenticated, redirect to dashboard
          window.location.href = "http://localhost:3000";
          return;
        } else {
          // No valid authentication - clear localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('user_data');
        }
      } catch (error) {
        // Not authenticated or error - clear localStorage and show signup form
        console.log("Not authenticated, showing signup form");
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-black dark:to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-black dark:to-black flex items-center justify-center p-4">
      <SignupFormDemo />
    </div>
  );
}

