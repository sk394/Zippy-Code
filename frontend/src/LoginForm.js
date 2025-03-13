import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  // State for each field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [studentId, setStudentId] = useState(''); 

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@uakron\.edu$/;
     if (!emailRegex.test(email)) {
       alert("Email must end with @uakron.edu");
       return;
     }
    alert(`Name: ${name}, Email: ${email}, Role: ${role}, Student ID: ${studentId}`);
    // Close the dialog after successful submission
    document.getElementById('my_modal_3').close();
    navigate("/questions");
  };

  const handleClose = () => {
    document.getElementById('my_modal_3').close();
    navigate('/');
  }

  // Open modal when the page loads
  useEffect(() => {
    document.getElementById('my_modal_3').showModal();
  }, []);

  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Login to access</h3>
        <div className="modal-action">
          <form className="space-y-4 w-full" onSubmit={handleSubmit}>
            <div className="modal-top">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleClose}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-100 justify-between">
                <label className="label">Name</label>
                <label className="label">Student ID</label>
                <label className="label">Email</label>
                <label className="label">Role</label>
              </div>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="email"
                  placeholder="test@uakron.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full validator"
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@uakron\.edu$"
                  title="Email must end with @uakron.edu"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full mt-4">
              Submit
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default LoginForm;
