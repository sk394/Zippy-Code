import React, { useState } from 'react';

function LoginForm() {
  // State for each field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [studentId, setStudentId] = useState(''); // State for student ID
  const [emailError, setEmailError] = useState('');

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Name: ${name}, Email: ${email}, Role: ${role}, Student ID: ${studentId}`);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle email change
  const handleEmailChange = (event) => {
    const email = event.target.value;
    setEmail(email);
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="login-form">
      {/* The button to open the modal */}
      <label htmlFor="my_modal_7" className="btn">Open The Form</label>

      {/* Modal structure with DaisyUI */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-4">Please Enter Your Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left side labels */}
              <div className="flex flex-col space-y-100 justify-between">
                <label className="label">Name</label>
                <label className="label">Student ID</label>
                <label className="label">Email</label>
                <label className="label">Role</label>
              </div>

              {/* Right side inputs */}
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  className="input input-bordered w-full"
                  required
                />
                {emailError && <p className="text-red-500">{emailError}</p>}
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
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Submit
            </button>
          </form>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
      </div>
    </div>
  );
}

export default LoginForm;
