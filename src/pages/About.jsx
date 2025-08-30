// src/pages/About.jsx - Premium Animated About Page
import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaGithub,
  FaWhatsapp,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaCode,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaAws,
  FaDocker,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiGraphql,
} from "react-icons/si";
import {
  SparklesIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

const About = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  const titles = [
    "Full Stack Developer",
    "React Specialist",
    "Node.js Expert",
    "Database Architect",
    "Problem Solver",
  ];

  const skills = [
    {
      name: "JavaScript",
      icon: SiJavascript,
      color: "from-yellow-400 to-yellow-600",
      level: 95,
    },
    {
      name: "React.js",
      icon: FaReact,
      color: "from-blue-400 to-cyan-500",
      level: 92,
    },
    {
      name: "Node.js",
      icon: FaNodeJs,
      color: "from-green-400 to-green-600",
      level: 90,
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      color: "from-blue-500 to-blue-700",
      level: 85,
    },
    {
      name: "MongoDB",
      icon: SiMongodb,
      color: "from-green-500 to-green-700",
      level: 88,
    },
    {
      name: "Express.js",
      icon: SiExpress,
      color: "from-gray-600 to-gray-800",
      level: 87,
    },
    {
      name: "GraphQL",
      icon: SiGraphql,
      color: "from-pink-500 to-purple-600",
      level: 80,
    },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      color: "from-teal-400 to-blue-500",
      level: 93,
    },
    {
      name: "AWS",
      icon: FaAws,
      color: "from-orange-400 to-yellow-500",
      level: 75,
    },
    {
      name: "Docker",
      icon: FaDocker,
      color: "from-blue-500 to-blue-700",
      level: 78,
    },
  ];

  const achievements = [
    { number: "50+", label: "Projects Completed", icon: CodeBracketIcon },
    { number: "2+", label: "Years Experience", icon: SparklesIcon },
    { number: "100%", label: "Client Satisfaction", icon: HeartIcon },
    { number: "24/7", label: "Available to Code", icon: RocketLaunchIcon },
  ];

  // Typing effect
  useEffect(() => {
    const currentTitle = titles[currentSkillIndex];
    let i = 0;
    const timer = setInterval(() => {
      if (i < currentTitle.length) {
        setTypedText(currentTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentSkillIndex((prev) => (prev + 1) % titles.length);
          setTypedText("");
        }, 2000);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentSkillIndex, titles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              className="relative inline-block mb-8"
            >
              {/* Profile Image with Glowing Border */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-75"
                />
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src="/api/placeholder/192/192"
                    alt="Ashish - Full Stack Developer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <FaCode className="text-white text-xl" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
            >
              Hi, I'm Ashish! 👋
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6 h-12"
            >
              I'm a{" "}
              <span className="text-blue-600 dark:text-blue-400">
                {typedText}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-blue-600"
              >
                |
              </motion.span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Passionate software engineer and hardcore coder who builds always
              new, innovative solutions. I love crafting scalable web
              applications and solving complex problems with elegant code. ✨
            </motion.p>
          </motion.div>

          {/* Achievement Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.8,
                    type: "spring",
                  }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <achievement.icon className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {achievement.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              🚀 Technical Arsenal
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${skill.color}`}
                      >
                        <skill.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {skill.level}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{
                        delay: index * 0.1 + 0.5,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                    >
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute right-0 top-0 w-2 h-full bg-white/30 rounded-full"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* About Me Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white"
            >
              💫 About Me
            </motion.h2>

            <div className="max-w-4xl mx-auto text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                I'm a passionate <strong>hardcore coder</strong> and{" "}
                <strong>engineer</strong> who loves building new things always!
                🔥 My journey in software development started with curiosity and
                evolved into a full-blown passion for creating innovative,
                scalable solutions.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                I specialize in <strong>full-stack development</strong> with
                expertise in modern JavaScript frameworks, particularly React.js
                and Node.js. I enjoy architecting robust backend systems,
                crafting intuitive user interfaces, and everything in between.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                When I'm not coding, you'll find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community. I believe in continuous learning and
                staying updated with the latest industry trends.
              </motion.p>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white"
            >
              🤝 Let's Connect!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              Ready to collaborate on something amazing? I'm always excited to
              work on innovative projects and connect with fellow developers!
            </motion.p>

            <div className="flex justify-center flex-wrap gap-6">
              {[
                {
                  icon: FaPhone,
                  label: "Phone",
                  href: "tel:+919549433902",
                  color: "from-green-400 to-green-600",
                  text: "+91 9549433902",
                },
                {
                  icon: FaWhatsapp,
                  label: "WhatsApp",
                  href: "https://wa.me/919549433902",
                  color: "from-green-500 to-green-700",
                  text: "WhatsApp",
                },
                {
                  icon: FaGithub,
                  label: "GitHub",
                  href: "https://github.com/Ashish3902",
                  color: "from-gray-700 to-gray-900",
                  text: "GitHub",
                },
                {
                  icon: FaTwitter,
                  label: "Twitter",
                  href: "https://x.com/asloq3902",
                  color: "from-blue-400 to-blue-600",
                  text: "Twitter",
                },
                {
                  icon: FaEnvelope,
                  label: "Email",
                  href: "mailto:asmuna9173@gmail.com",
                  color: "from-red-400 to-red-600",
                  text: "Email",
                },
              ].map((contact, index) => (
                <motion.a
                  key={index}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 50, rotate: -180 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative inline-flex items-center px-8 py-4 bg-gradient-to-r ${contact.color} text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300`}
                >
                  <contact.icon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  <span className="hidden sm:inline">{contact.text}</span>
                  <span className="sm:hidden">{contact.label}</span>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8, type: "spring" }}
              className="mt-12"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1 rounded-2xl"
              >
                <div className="bg-white dark:bg-gray-900 px-8 py-4 rounded-2xl">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Let's Build Something Amazing Together! 🚀
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
