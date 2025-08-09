// HowItWorks.jsx
import { FaUserPlus, FaTrash, FaMapMarkerAlt, FaCheckCircle, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-3xl" />,
      title: "User Registration",
      description: "Community members sign up through the mobile app to start reporting waste.",
    },
    {
      icon: <FaTrash className="text-3xl" />,
      title: "Report Waste",
      description: "Users upload a photo of the waste, add location via map, and submit the report.",
    },
    {
      icon: <FaCheckCircle className="text-3xl" />,
      title: "Admin Review",
      description: "Admins review submitted reports, verify them, and schedule a cleanup date.",
    },
    {
      icon: <FaHandsHelping className="text-3xl" />,
      title: "Volunteer Cleanup",
      description: "Volunteers are notified and join the cleanup effort at the scheduled time.",
    },
    {
      icon: <FaMapMarkerAlt className="text-3xl" />,
      title: "Thank You & Feedback",
      description: "Volunteers receive a thank-you message. Cleanups are documented and shared.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="bg-gray-100 py-16 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          How <span className="text-green-600">It Works</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-12"
        >
          Our process empowers communities to take action through coordinated efforts and technology.
        </motion.p>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="mb-4 text-green-500 animate-[bounce_3s_ease-in-out_infinite] group-hover:animate-none">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;