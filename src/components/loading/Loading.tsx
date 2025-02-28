import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p
          className="mt-4 text-lg font-semibold tracking-wider"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
