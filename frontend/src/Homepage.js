"use client"

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
        color: "#6366f120",
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

  // Compact styles
  const s = {
    canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 },
    page: { fontFamily: "system-ui, sans-serif", color: "#333", lineHeight: 1.6 },
    container: { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" },
    section: { padding: "80px 0", position: "relative" },
    center: { textAlign: "center" },
    flex: { display: "flex" },
    title: { fontSize: "3rem", fontWeight: 700, marginBottom: "20px", color: "#6366f1" },
    subtitle: { fontSize: "2.25rem", fontWeight: 700, marginBottom: "20px" },
    text: { fontSize: "1.125rem", color: "#666", marginBottom: "30px" },
    btn: {
      primary: {
        backgroundColor: "#6366f1",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "6px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
      },
    },
    highlight: { fontWeight: 600, color: "#6366f1" },
    creatorSection: {
      marginTop: "48px",
      paddingTop: "24px",
      borderTop: "1px solid #ddd",
      position: "relative",
    },
    creatorName: {
      fontWeight: 600,
      display: "inline-block",
      position: "relative",
    },
  }

  // Animation helper
  const fadeIn = (delay = 0) => ({
    opacity: 0,
    animation: `fadeIn 0.8s ease forwards ${delay}s`,
    transform: "translateY(20px)",
  })

  const slideInLeft = (delay = 0) => ({
    opacity: 0,
    animation: `slideInLeft 0.8s ease forwards ${delay}s`,
    transform: "translateX(-30px)",
  })

  const slideInRight = (delay = 0) => ({
    opacity: 0,
    animation: `slideInRight 0.8s ease forwards ${delay}s`,
    transform: "translateX(30px)",
  })

  const popIn = (delay = 0) => ({
    opacity: 0,
    animation: `popIn 0.6s ease forwards ${delay}s`,
    transform: "scale(0.8)",
  })

  return (
    <div style={s.page}>
      <canvas ref={canvasRef} style={s.canvas}></canvas>

      {/* Add animation keyframes */}
      <style>
        {`
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
            0% { text-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
            50% { text-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
            100% { text-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          }
          @keyframes colorShift {
            0% { color: #6366f1; }
            33% { color: #8b5cf6; }
            66% { color: #ec4899; }
            100% { color: #6366f1; }
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
            background: linear-gradient(90deg, transparent, #6366f1, transparent);
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Hero Section with Parallel Animations */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{ ...s.center, maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ ...s.title, ...slideInLeft() }}>ZippyCode</h1>
            <p style={{ ...s.text, ...slideInRight(0.2) }}>
              Master Data Structures and Algorithms through practice, collaboration, and real-world coding challenges.
            </p>
            {/* Removed the Get Started and Explore Problems buttons as requested */}
          </div>
        </div>
      </section>

      {/* About Section with Parallel Animations */}
      <section style={{ ...s.section, backgroundColor: "#f9fafb" }}>
        <div style={s.container}>
          <div style={{ ...s.center, maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ ...s.subtitle, ...popIn() }}>About ZippyCode</h2>
            <p style={{ ...s.text, ...fadeIn(0.2) }}>
              ZippyCode is built with the goal of providing students with a platform to practice and excel at coding.
              The platform integrates real-world coding problems, encourages collaborative learning, and includes
              features for both students and teachers.
            </p>
            <p style={{ ...s.text, ...fadeIn(0.4) }}>
              Our platform offers a comprehensive collection of coding problems with test cases, supports multiple
              programming languages, and enables collaborative learning through discussion forums and shared solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action with Enhanced Animations */}
      <section style={s.section}>
        <div style={s.container}>
          <div style={{ ...s.center, maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ ...s.subtitle, ...slideInLeft() }} className="text-white">Ready to start your coding journey?</h2>
            <p style={{ ...s.text, marginBottom: "30px", ...slideInRight(0.2) }}>
              Join other students who are learning DSA with ZippyCode.
            </p>

            {/* Enhanced Creator Section with Attractive Animation */}
            <div style={s.creatorSection} className="text-white">
              <p style={{ ...fadeIn(0.6) }}>
                Created by: <span className="creator-name">Manoj Khatri</span> and{" "}
                <span className="creator-name">Suman Khadka</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Homepage
