// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  HeartIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const About = () => {
  const contactInfo = [
    {
      icon: EnvelopeIcon,
      label: "Email",
      value: "asmuna9173@gmail.com",
      href: "mailto:ashishsharma.dev@gmail.com",
      color: "text-blue-600",
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: "9549433902",
      href: "tel:+919876543210",
      color: "text-green-600",
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: "Jaipur, India",
      color: "text-red-600",
    },
    {
      icon: GlobeAltIcon,
      label: "Website",
      value: "www.ashishsharma.dev",
      href: "https://www.ashishsharma.dev",
      color: "text-purple-600",
    },
  ];

  const socialLinks = [
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/ashishsharma",
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/Ashish3902",
      color: "text-gray-800 dark:text-white hover:text-gray-600",
    },
    {
      icon: FaTwitter,
      label: "Twitter",
      href: "https://twitter.com/ashishsharma",
      color: "text-blue-400 hover:text-blue-500",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "https://instagram.com/ashishsharma",
      color: "text-pink-600 hover:text-pink-700",
    },
    {
      icon: FaYoutube,
      label: "YouTube",
      href: "https://youtube.com/@ashishsharma",
      color: "text-red-600 hover:text-red-700",
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      href: "https://wa.me/9549433902",
      color: "text-green-600 hover:text-green-700",
    },
  ];

  const skills = [
    { icon: CodeBracketIcon, name: "Full Stack Development", level: 95 },
    { icon: ComputerDesktopIcon, name: "Frontend Development", level: 98 },
    { icon: DevicePhoneMobileIcon, name: "Mobile Development", level: 88 },
    { icon: GlobeAltIcon, name: "Backend Development", level: 92 },
  ];

  const technologies = [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "React Native",
    "Vue.js",
    "Python",
    "GraphQL",
    "Redis",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <img
              src="C:\Users\asmun\OneDrive\文档\Fun\f\public\ashishim.jpg"
              alt="Ashish Sharma"
              className="w-32 h-32 rounded-full mx-auto shadow-xl border-4 border-white dark:border-gray-700"
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ashish Sharma
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 mb-6">
            Full Stack Developer & Tech Entrepreneur
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Passionate developer with 5+ years of experience in building
            scalable web and mobile applications. Specialized in modern
            JavaScript frameworks, cloud technologies, and creating exceptional
            user experiences.
          </p>
        </motion.div>

        {/* About Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Professional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <BriefcaseIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Professional Experience
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Senior Full Stack Developer
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-3">
                  Tech Innovations Inc. • 2021 - Present
                </p>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>
                    • Led development of 10+ high-traffic web applications
                  </li>
                  <li>
                    • Architected scalable microservices using Node.js and AWS
                  </li>
                  <li>
                    • Mentored junior developers and conducted code reviews
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Frontend Developer
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-3">
                  Digital Solutions Ltd. • 2019 - 2021
                </p>
                <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Built responsive React applications for 50+ clients</li>
                  <li>• Improved application performance by 40% on average</li>
                  <li>• Implemented modern UI/UX design principles</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <EnvelopeIcon className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Info
              </h2>
            </div>

            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index} className="flex items-center">
                    <Icon
                      className={`w-5 h-5 ${contact.color} mr-3 flex-shrink-0`}
                    />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.label}
                      </p>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white">
                          {contact.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center mb-6">
            <AcademicCapIcon className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skills & Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Technologies I Work With
            </h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center mb-6">
            <HeartIcon className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Let's Connect
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            I'm always open to discussing new opportunities, collaborating on
            exciting projects, or just having a chat about technology and
            innovation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-all duration-300 ${social.color}`}
                >
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {social.label}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
