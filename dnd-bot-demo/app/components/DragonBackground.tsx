import { motion } from 'framer-motion';

export default function DragonBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pt-24">
      <svg
        className="w-full h-full opacity-20"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Ancient stone archway */}
        <motion.path
          d="M300,200 Q500,100 700,200 Q800,250 800,400 L800,700 Q500,800 200,700 L200,400 Q200,250 300,200"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="4"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            filter: ["drop-shadow(0 0 4px #a855f7)", "drop-shadow(0 0 12px #a855f7)", "drop-shadow(0 0 4px #a855f7)"]
          }}
          transition={{ 
            duration: 3,
            ease: "easeInOut",
          }}
        />

        {/* Mystical runes */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            cx={350 + i * 50}
            cy={250}
            r="5"
            fill="rgba(168, 85, 247, 0.6)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
              filter: ["drop-shadow(0 0 2px #a855f7)", "drop-shadow(0 0 8px #a855f7)", "drop-shadow(0 0 2px #a855f7)"]
            }}
            transition={{ 
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}

        {/* Portal energy */}
        <motion.path
          d="M300,400 C400,450 600,450 700,400 C600,500 400,500 300,400"
          stroke="rgba(168, 85, 247, 0.3)"
          strokeWidth="2"
          fill="rgba(168, 85, 247, 0.1)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            opacity: [0.3, 0.6, 0.3],
            filter: ["drop-shadow(0 0 4px #a855f7)", "drop-shadow(0 0 12px #a855f7)", "drop-shadow(0 0 4px #a855f7)"]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Floating magical particles */}
        {[...Array(12)].map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            cx={400 + Math.random() * 200}
            cy={400 + Math.random() * 200}
            r="2"
            fill="rgba(168, 85, 247, 0.8)"
            initial={{ y: 0, opacity: 0 }}
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
              filter: ["drop-shadow(0 0 2px #a855f7)", "drop-shadow(0 0 8px #a855f7)", "drop-shadow(0 0 2px #a855f7)"]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}

        {/* Ancient stone texture details */}
        <motion.path
          d="M250,300 Q300,320 350,300 M450,250 Q500,270 550,250 M650,300 Q700,320 750,300"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </svg>
    </div>
  );
}