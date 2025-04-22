import { useEffect, useRef } from "react"

const Homepage = () => {
  const canvasRef = useRef(null)

  // Particle animation setup
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const particles = []
    let animationFrameId

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: "#ffffff10",
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()

        // Update position
        p.x += p.speedX
        p.y += p.speedY

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="App">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      
      <main>
        {/* About Section */}
        <section className="about-section">
          <div className="container">
            <h2 className="section-title">About ZippyCode</h2>
            <p className="section-text">
              ZippyCode is built with the goal of providing students with a platform to practice and excel at coding.
              The platform integrates real-world coding problems, encourages collaborative learning, and includes
              features for both students and teachers.
            </p>
            <p className="section-text">
              Our platform offers a comprehensive collection of coding problems with test cases, supports multiple
              programming languages, and enables collaborative learning through discussion forums and shared solutions.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="features-content">
              <h2 className="section-title">Key Features</h2>
              <ul className="feature-list">
                <li className="feature-item">Problem Repository: A collection of coding problems with test cases.</li>
                <li className="feature-item">
                  Collaborative Learning: Students can discuss problems and share solutions.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="container">
            <h2 className="section-title">Ready to start your coding journey?</h2>
            <p className="section-text">Join other students who are learning DSA with ZippyCode.</p>
            <div className="creator-section">
              <p>
                Created by: <span className="creator-name">Manoj Khatri</span> and{" "}
                <span className="creator-name">Suman Khadka</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* CSS Styles */}
      <style jsx>{`
        /* Global Styles */
        .App {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #ffffff;
          line-height: 1.6;
          background-color: #1a1a1a;
          overflow-x: hidden;
        }

        .background-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          padding: 80px 40px;
          background: linear-gradient(135deg, #262626 0%, #1a1a1a 100%);
          overflow: hidden;
        }

        .hero-section:after {
          content: '';
          position: absolute;
          bottom: -50px;
          left: 0;
          width: 100%;
          height: 100px;
          background: #1a1a1a;
          transform: skewY(-2deg);
          z-index: 1;
        }

        .hero-content {
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-text {
          flex: 1;
          max-width: 600px;
        }

        .hero-title {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          color: white;
          animation: fadeIn 0.8s ease forwards;
        }

        .hero-description {
          font-size: 18px;
          color: #b3b3b3;
          margin-bottom: 30px;
          animation: fadeIn 0.8s ease forwards 0.2s;
          opacity: 0;
        }

        .cta-button {
          background-color: #ffa116;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeIn 0.8s ease forwards 0.4s;
          opacity: 0;
        }

        .cta-button:hover {
          background-color: #ff8c00;
        }

        .hero-image {
          flex: 1;
          display: flex;
          justify-content: center;
          animation: slideInRight 0.8s ease forwards 0.2s;
          opacity: 0;
          transform: translateX(30px);
        }

        .code-card {
          width: 300px;
          height: 200px;
          background-color: #2d2d2d;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .code-card-header {
          background-color: #1e1e1e;
          padding: 8px;
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .red { background-color: #ff5f56; }
        .yellow { background-color: #ffbd2e; }
        .green { background-color: #27c93f; }

        .code-card-content {
          padding: 16px;
        }

        .code-line {
          height: 10px;
          background-color: #3a3a3a;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .code-line:nth-child(odd) {
          width: 100%;
        }

        .code-line:nth-child(even) {
          width: 70%;
        }

        /* About Section */
        .about-section {
          padding: 80px 40px;
          position: relative;
          z-index: 2;
          background-color: #1a1a1a;
        }

        /* Features Section */
        .features-section {
          padding: 80px 40px;
          background-color: #262626;
          position: relative;
        }

        .features-section:before {
          content: '';
          position: absolute;
          top: -50px;
          left: 0;
          width: 100%;
          height: 100px;
          background: #262626;
          transform: skewY(-2deg);
          z-index: 1;
        }

        .features-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
          color: white;
          text-align: center;
        }

        .section-text {
          font-size: 18px;
          color: #b3b3b3;
          margin-bottom: 30px;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .feature-list {
          list-style-type: none;
          padding: 0;
          margin: 40px 0;
        }

        .feature-item {
          padding: 16px;
          background-color: #333333;
          border-radius: 8px;
          margin-bottom: 16px;
          transition: transform 0.3s ease;
        }

        .feature-item:hover {
          transform: translateY(-5px);
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 40px;
          background-color: #1a1a1a;
          text-align: center;
        }

        .creator-section {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid #333;
          position: relative;
        }

        .creator-name {
          display: inline-block;
          font-weight: 600;
          position: relative;
          animation: colorShift 8s infinite, glow 3s infinite;
          padding: 0 5px;
        }

        .creator-name:after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          bottom: -2px;
          left: 0;
          background: linear-gradient(90deg, transparent, #ffa116, transparent);
          animation: float 3s ease-in-out infinite;
        }

        /* Animations */
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 5px rgba(255, 161, 22, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 161, 22, 0.8); }
          100% { text-shadow: 0 0 5px rgba(255, 161, 22, 0.5); }
        }

        @keyframes colorShift {
          0% { color: #ffa116; }
          33% { color: #ff8c00; }
          66% { color: #ffbd2e; }
          100% { color: #ffa116; }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }

          .hero-text {
            margin-bottom: 20px;
          }

          .hero-title {
            font-size: 36px;
          }

          .section-title {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  )
}

export default Homepage
