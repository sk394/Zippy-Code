import React, { useState, useEffect } from "react";
import { SignInButton, useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import OtpInput from "./components/otp-input";

function LoginForm() {
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      document.getElementById('my_modal_3')?.showModal();
    }
  }, [isLoaded]);

  // Handle email, password, and role submission (first step of sign-up)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@uakron.edu")) {
      setError("Only @uakron.edu emails are allowed");
      return;
    }

    try {
      setSubmitting(true);
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err) {
      console.error("Sign-up error:", err);
      const errorMessage = err.errors?.[0]?.message || "Failed to initiate sign-up";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle email verification and role assignment (second step)
  const handleVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signUp.attemptEmailAddressVerification({ code });

    } catch (err) {
      console.error("Verification error:", err);
      const errorMessage = err.errors?.[0]?.message || err.message || "Invalid code";
      setError(errorMessage);
    } finally {
      navigate("/select-role");
    }
  };

  const handleClose = () => {
    document.getElementById('my_modal_3').close();
    navigate('/');
  };

  // Show loading state if not loaded yet
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Login to access</h3>
        <div className="modal-action">
          {!verifying ? (
            <form className="space-y-4 w-full" onSubmit={handleSignUp}>
              <div className="modal-top">
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={handleClose}
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 ">
                <div className="flex flex-col justify-between">
                  <label className="label">Email</label>
                  <label className="label">Password</label>
                </div>
                <div className="flex flex-col space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    pattern="^[a-zA-Z0-9._%+-]+@uakron\.edu$"
                    placeholder="Enter your @uakron.edu email"
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                {!submitting ? "Sign Up" : "Submitting ..."}
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <div className=" flex flex-row space-x-1 items-center">
                <p>Already have an account?</p>
                <SignInButton className="btn btn-link" />
              </div>
            </form>)
            : (
              <form
                className="card shadow-md bg-base-200"
                onSubmit={handleVerification}
              >
                <div className="card-body items-stretch text-center">
                  <div className="my-2">
                    <h2 className="text-xl"> One-Time Password</h2>
                    <p className="text-sm text-base-content/80">Check your email for a verification code.</p>
                  </div>
                  <OtpInput
                    value={code}
                    onChange={(val) => {
                      setCode(val);
                    }}
                  />
                  <button className="btn btn-primary mt-2" type="submit">
                    Verify OTP
                  </button>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
              </form>
            )}
        </div>
      </div>
    </dialog>
  );
}

export default LoginForm;
