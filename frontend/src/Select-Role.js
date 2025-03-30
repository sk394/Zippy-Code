import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SelectRolePage() {
    const { user, isLoaded } = useUser();
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && user && user.unsafeMetadata.role) {
            navigate("/");
        }
    }, [isLoaded, user, navigate]);

    if (!isLoaded || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
            className="flex flex-col gap-4">
            <h1>Select Your Role</h1>
            <p>Welcome, {user.emailAddresses[0].emailAddress}!</p>
            <div>
                <label className="label">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="select select-bordered w-full"
                    required
                >
                    <option value="">Select your role</option>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary"
                onClick={() => {
                    user?.update({
                        unsafeMetadata: { role },
                    });
                    navigate("/");
                }}
            >
                Submit
            </button>
        </div>
    );
}