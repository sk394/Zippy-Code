import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const canvasRef = useRef(null);

  // Particle animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: "#ffffff10",
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="App relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0"></canvas>
      <div className="z-10 w-full max-w-6xl mx-auto pt-8 px-4">
        <img
          src="/zippycode.png"
          alt="ZippyCode - Coding Education Platform"
          className="w-full h-auto rounded-lg shadow-2xl mb-12 border border-gray-700"
        />
      </div>
      <main className="z-10 py-16 px-4">
        {/* About Section */}
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">About ZippyCode</h2>
            <p className="text-lg mb-4 leading-relaxed">
              ZippyCode is built with the goal of providing students with a platform to practice and excel at coding.
              The platform integrates real-world coding problems, encourages collaborative learning, and includes
              features for both students and teachers.
            </p>
            <p className="text-lg leading-relaxed">
              Our platform offers a comprehensive collection of coding problems with test cases, supports multiple
              programming languages, and enables collaborative learning through discussion forums and shared solutions.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-gray-700">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-cyan-400">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 text-xl">•</span>
                  <span className="text-lg"><span className="font-semibold text-cyan-300">Problem Repository:</span> A collection of coding problems with test cases.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-cyan-400 text-xl">•</span>
                  <span className="text-lg"><span className="font-semibold text-cyan-300">Collaborative Learning:</span> Students can discuss problems and share solutions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-cyan-900/70 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-cyan-800 text-center">
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">Ready to start your coding journey?</h2>
            <p className="text-xl mb-8">Join other students who are learning DSA with ZippyCode.</p>
            <Link to="/questions">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg mb-8">
                Get Started
              </button>
            </Link>
            <div className="mt-6 pt-6 border-t border-cyan-800">
              <p className="text-cyan-300">
                Created by: <span className="font-semibold text-white creator-name">Manoj Khatri</span> and{" "}
                <span className="font-semibold text-white creator-name">Suman Khadka</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
