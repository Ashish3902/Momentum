// src/pages/Help.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I upload a video?",
      answer:
        "To upload a video, click the '+' button in the header or go to /upload. You can drag and drop your video file or click to browse. Supported formats include MP4, AVI, MOV, WebM, and MKV (max 500MB).",
    },
    {
      question: "How do I create a playlist?",
      answer:
        "Go to your Library page and click 'Create Playlist'. You can then add videos to your playlist by clicking the 'Add to Playlist' button on any video.",
    },
    {
      question: "How do I subscribe to a channel?",
      answer:
        "Visit any user's channel page and click the 'Subscribe' button. You'll be notified when they upload new videos.",
    },
    {
      question: "How do I change my profile settings?",
      answer:
        "Go to Settings by clicking your profile picture → Settings. You can update your profile picture, cover image, bio, and other personal information.",
    },
    {
      question: "What video formats are supported?",
      answer:
        "We support MP4, AVI, MOV, WebM, MKV, WMV, and FLV formats. Maximum file size is 500MB per video.",
    },
    {
      question: "How do I delete a video?",
      answer:
        "Go to Creator Studio, find your video, and click the delete button. This action cannot be undone.",
    },
    {
      question: "Can I make my videos private?",
      answer:
        "Yes! When uploading or editing a video, you can set it as private or unlisted. Private videos are only visible to you.",
    },
    {
      question: "How do comments work?",
      answer:
        "You can comment on any video by typing in the comment box below the video. You can also like, reply to, edit, and delete your own comments.",
    },
  ];

  const contactOptions = [
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@videotube.com",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: PhoneIcon,
      title: "Phone Support",
      description: "Call us for immediate help",
      contact: "+1 (555) 123-4567",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <QuestionMarkCircleIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions or get in touch with our support
            team
          </p>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {option.description}
                </p>
                <p className={`font-medium ${option.color}`}>
                  {option.contact}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Still need help?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our support team is here to help you with any questions or issues
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Help;
