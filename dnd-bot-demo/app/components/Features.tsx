import { motion } from 'framer-motion';
import { 
  FireIcon, 
  SpeakerWaveIcon, 
  CommandLineIcon,
  UserGroupIcon,
  CpuChipIcon,
  ChatBubbleBottomCenterTextIcon,
  CogIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/solid';

export default function Features() {
  const features = [
    {
      icon: <CpuChipIcon className="h-8 w-8 text-purple-500" />,
      title: "Multi-Agent System",
      description: "Powered by OpenAI's Swarm framework for intelligent agent coordination. Each specialized AI agent handles specific aspects of your adventure, from combat to exploration."
    },
    {
      icon: <FireIcon className="h-8 w-8 text-red-500" />,
      title: "Image Generation",
      description: "React with 🔥 to generate stunning visuals of scenes, characters, and locations using DALL-E. Bring your imagination to life instantly!"
    },
    {
      icon: <SpeakerWaveIcon className="h-8 w-8 text-blue-500" />,
      title: "Real-Time Voice",
      description: "Add 🔊 to any message for dramatic narration using OpenAI's real-time text-to-speech. Experience cinematic storytelling with dynamic voice acting."
    },
    {
      icon: <Square3Stack3DIcon className="h-8 w-8 text-green-500" />,
      title: "Smart Dice Rolling",
      description: "Integrated dice rolling system with automatic skill checks, saving throws, and combat calculations. Supports all standard D&D dice and modifiers."
    },
    {
      icon: <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-yellow-500" />,
      title: "Dynamic Storytelling",
      description: "Advanced language models create rich, contextual narratives that adapt to your choices. Every decision shapes your unique adventure. And Guess What? You can continue your story even if the bot restarts! Because we use Azure Cosmos DB to store your campaign progress."
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-indigo-500" />,
      title: "Party Management",
      description: "Tracks character stats, inventory, and party composition. Remembers your adventures and maintains continuity across sessions."
    },
    {
      icon: <CommandLineIcon className="h-8 w-8 text-pink-500" />,
      title: "Function Calling",
      description: "Sophisticated backend integration handles complex game mechanics, from trap detection to combat encounters, seamlessly and naturally."
    },
    {
      icon: <CogIcon className="h-8 w-8 text-orange-500" />,
      title: "Customizable Experience",
      description: "Adapt difficulty, narrative style, and game rules to your preferences. Create house rules and custom campaigns with ease."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 * index }}
          className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            {feature.icon}
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="col-span-full mt-8 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20"
      >
        <p className="text-center text-purple-200 text-sm">
          Powered by OpenAI&apos;s GPT-4 and advanced AI technologies for the most immersive D&D experience yet.
        </p>
      </motion.div>
    </div>
  );
}
