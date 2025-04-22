import React from "react";
import { useUser, RedirectToSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children, isProfessor = false }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const naviagate = useNavigate();

    const redirect = (path) => {
        naviagate(path, { replace: true });
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        redirect("/login");
    }

    if (!user?.primaryEmailAddress?.emailAddress?.endsWith("@uakron.edu")) {
        return (
            <div className="flex flex-col items-center justify-center mt-4">
                <h1 className="text-lg text-warning">Access Denied !!</h1>
                <p>Only University of Akron students/professors can access this page.</p>
            </div>
        );
    }

    if (isProfessor && user.unsafeMetadata?.role !== "professor") {
        return (
            <div className="flex flex-col items-center justify-center mt-4">
                <h1 className="text-lg text-warning">Access Denied !!</h1>
                <p>Only professors can access this page.</p>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;