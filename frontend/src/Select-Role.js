import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "./hooks/use-mutation";

export default function SelectRolePage() {
    const { user, isLoaded } = useUser();
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const [createUser, { isLoading, error, data: result }] = useMutation("users");

    useEffect(() => {
        if (isLoaded && user && user.unsafeMetadata.role) {
            navigate("/");
        }
    }, [isLoaded, user, navigate]);

    if (!isLoaded || !user) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleRoleSubmission = async (e) => {
        e.preventDefault();
        if (!role) {
            alert("Please select a role.");
            return;
        }

        try {
            await user?.update({
                unsafeMetadata: { role },
            });
            if (user) {
                await createUser({
                    id: user.id,
                    userName: user.emailAddresses[0].emailAddress.split("@")[0],
                    score: 0
                });
            } else {
                console.error("Cannot create user: user object is null or undefined");
            }
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            navigate("/");
        }
    };

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
                onClick={handleRoleSubmission}
            >
                Submit
            </button>
        </div>
    );
}