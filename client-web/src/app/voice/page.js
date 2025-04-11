"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Globe, Layers, Zap, ArrowRight, Menu, X, CuboidIcon as Cube } from "lucide-react"
import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black overflow-hidden">
      {/* 3D Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,0,255,0.15),transparent_70%)]"></div>
        <div className="grid-background"></div>
      </div>

      {/* Floating 3D Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute cube-3d"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cube className="h-8 w-8 text-fuchsia-500" />
              <span className="text-white font-bold text-xl">DIMENSION</span>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
              </Button>
            </div>

            <nav
              className={`${menuOpen ? "flex" : "hidden"} md:flex absolute md:relative top-full left-0 right-0 md:top-auto md:left-auto md:right-auto flex-col md:flex-row items-center gap-6 bg-black/80 md:bg-transparent p-6 md:p-0`}
            >
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                Showcase
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">
                About
              </Link>
              <Button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white border-0">
                Get Started
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <span className="px-4 py-2 rounded-full bg-white/10 text-fuchsia-400 text-sm font-medium">
                    NEXT GENERATION PLATFORM
                  </span>
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-7xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Enter the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                    Dimension
                  </span>{" "}
                  of Digital Experience
                </motion.h1>

                <motion.p
                  className="text-xl text-white/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Break free from the constraints of traditional design. Our platform brings your ideas to life in a
                  stunning 3D digital environment.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl">
                    Start Creating
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white bg-black hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
                  >
                    Watch Demo
                  </Button>
                </motion.div>
              </div>

              <div className="lg:w-1/2">
                <motion.div
                  className="perspective-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <div
                    className="cube-wrapper"
                    style={{
                      transform: `rotateX(${scrollY * 0.05}deg) rotateY(${scrollY * 0.05}deg)`,
                    }}
                  >
                    <div className="cube">
                      <div className="cube-face front"></div>
                      <div className="cube-face back"></div>
                      <div className="cube-face right"></div>
                      <div className="cube-face left"></div>
                      <div className="cube-face top"></div>
                      <div className="cube-face bottom"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Cutting-Edge <span className="text-fuchsia-500">Features</span>
              </motion.h2>
              <motion.p
                className="text-xl text-white/70 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Discover what makes our platform revolutionary
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="feature-card-inner">
                    <div className="feature-card-front">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center mb-6">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </div>
                    <div className="feature-card-back">
                      <p className="text-white/90 mb-6">{feature.details}</p>
                      <Button className="bg-white text-purple-900 hover:bg-white/90">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900/20 to-purple-900/20 z-0"></div>
          <div className="container mx-auto relative z-10">
            <div className="bg-gradient-to-r from-black/40 to-purple-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="lg:w-2/3">
                  <motion.h2
                    className="text-3xl md:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    Ready to Transform Your Digital Presence?
                  </motion.h2>
                  <motion.p
                    className="text-xl text-white/70"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    Join thousands of creators who have already elevated their online experience with our platform.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button className="bg-white hover:bg-white/90 text-purple-900 text-lg px-8 py-6 rounded-xl">
                    Get Started Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10 backdrop-blur-md bg-black/20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-6 md:mb-0">
                <Cube className="h-8 w-8 text-fuchsia-500" />
                <span className="text-white font-bold text-xl">DIMENSION</span>
              </div>

              <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Showcase
                </Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>

              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
              © {new Date().getFullYear()} Dimension. All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollY > 100 ? 0 : 1 }}
        >
          <span className="text-white/60 text-sm mb-2">Scroll to Explore</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown className="text-white/60" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    title: "Immersive Experiences",
    description: "Create stunning 3D experiences that captivate your audience",
    details:
      "Our platform enables you to build fully immersive digital environments with realistic physics, lighting, and interactions.",
    icon: <Layers className="h-8 w-8 text-white" />,
  },
  {
    title: "Global Reach",
    description: "Connect with audiences worldwide through our platform",
    details:
      "Leverage our global CDN to deliver lightning-fast experiences to users anywhere in the world with minimal latency.",
    icon: <Globe className="h-8 w-8 text-white" />,
  },
  {
    title: "Lightning Performance",
    description: "Optimized for speed and responsiveness across all devices",
    details:
      "Our platform is built on cutting-edge technology that ensures smooth performance even on complex 3D scenes and interactions.",
    icon: <Zap className="h-8 w-8 text-white" />,
  },
  {
    title: "Intuitive Creation",
    description: "No coding required - build with our visual editor",
    details: "Our drag-and-drop interface makes it easy to create complex 3D scenes without any programming knowledge.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    ),
  },
  {
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time",
    details:
      "Multiple team members can work on the same project simultaneously with our real-time collaboration tools.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    title: "Analytics & Insights",
    description: "Understand how users interact with your creations",
    details: "Gain valuable insights into user behavior with our comprehensive analytics dashboard.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <path d="M3 3v18h18"></path>
        <path d="m19 9-5 5-4-4-3 3"></path>
      </svg>
    ),
  },
]
