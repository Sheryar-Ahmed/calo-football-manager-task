import { motion } from "framer-motion";

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-white">
      <div className="text-center space-y-6">
        {/* Spinning football */}
        <motion.img
          src="/football.svg"
          alt="Football"
          className="w-24 h-24 mx-auto"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 2,
          }}
        />

        {/* Glowing Text */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 via-yellow-300 to-green-500 text-transparent bg-clip-text animate-pulse">
          Loading Fantasy Manager...
        </h1>

        {/* Optional subtle tagline */}
        <p className="text-sm text-gray-400">Get ready to manage your dream team ⚽</p>
      </div>
    </div>
  );
};

export default SplashScreen;
