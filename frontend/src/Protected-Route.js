import React from "react";
import { useUser, RedirectToSignUp } from "@clerk/clerk-react";

function ProtectedRoute({ children, isProfessor = false }) {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <RedirectToSignUp />;
    }

    if (!user.primaryEmailAddress.emailAddress.endsWith("@uakron.edu")) {
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