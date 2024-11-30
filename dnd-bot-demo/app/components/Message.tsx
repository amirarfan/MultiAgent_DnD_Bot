import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MessageProps {
  content: string | ReactNode;
  isBot: boolean;
  delay?: number;
  reactions?: string[];
  timestamp?: string;
}

export default function Message({ content, isBot, delay = 0, reactions = [], timestamp }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isBot ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group relative"
    >
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`relative max-w-[80%] rounded-lg p-4 ${
          isBot 
            ? 'bg-[#2B2D31] text-white hover:bg-[#2F3136]' 
            : 'bg-[#4752C4] text-white hover:bg-[#4752C4]/90'
        } transition-colors duration-200`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isBot ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {isBot ? '🤖' : '👤'}
            </div>
            <div>
              <span className={`text-sm font-semibold ${
                isBot ? 'text-green-400' : 'text-blue-300'
              }`}>
                {isBot ? 'D&D AI Master' : 'Player'}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {timestamp || new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="mt-2 text-sm leading-relaxed">
            {content}
          </div>

          {reactions.length > 0 && (
            <div className="absolute -bottom-3 left-4 flex space-x-1">
              {reactions.map((reaction, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.5 + (index * 0.1) }}
                  className="flex items-center space-x-1 bg-[#2B2D31] rounded-full px-2 py-1 shadow-lg"
                >
                  <span className="text-sm">{reaction}</span>
                  <span className="text-xs text-gray-400">1</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reaction Hover Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#2B2D31] rounded-lg px-2 py-1 mr-2 cursor-pointer hidden group-hover:block"
      >
        <span className="text-xs text-gray-400">Add Reaction</span>
      </motion.div>
    </motion.div>
  );
}