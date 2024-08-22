"use client";
import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Howl } from "howler";
import { Pause, Play, Skull, Tent, Trees, Waves } from "lucide-react";

interface SceneData {
  name: string;
  sound: string;
  title: string;
  backgroundImage: string;
}

export default function Home() {
  const [currentScene, setCurrentScene] = useState<SceneData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [playTime, setPlayTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scenes: SceneData[] = [
    {
      name: "海边",
      sound: "https://silge-test.oss-rg-china-mainland.aliyuncs.com/vibes/sea/1.mp3",
      title: "海边恐怖音乐",
      backgroundImage: "https://images.unsplash.com/photo-1503925802536-c9451dcd87b5?q=80&w=1740&auto=format&fit=crop"
    },
    {
      name: "营地",
      sound: "https://silge-test.oss-rg-china-mainland.aliyuncs.com/vibes/camp/1.mp3",
      title: "营地恐怖音乐",
      backgroundImage: "https://images.unsplash.com/photo-1664548726625-59094a8b72f4?q=80&w=1588&auto=format&fit=crop"
    },
    {
      name: "森林",
      sound: "https://silge-test.oss-rg-china-mainland.aliyuncs.com/vibes/forest/1.mp3",
      title: "森林恐怖音乐",
      backgroundImage: "https://images.unsplash.com/photo-1509401238785-48c8e54d23f8?q=80&w=1887&auto=format&fit=crop"
    }
  ];

  const sceneIcons: { [key: string]: JSX.Element } = {
    海边: <Waves size={24} />,
    营地: <Tent size={24} />,
    森林: <Trees size={24} />,
  };

  useEffect(() => {
    setCurrentScene(scenes[1]);
    return () => {
      if (sound) {
        sound.unload();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentScene) {
      loadSound(currentScene);
    }
  }, [currentScene]);

  const loadSound = (sceneData: SceneData) => {
    if (sound) {
      sound.stop();
      sound.unload();
    }

    const newSound = new Howl({
      src: [sceneData.sound],
      loop: true,
      preload: true,
      onplay: () => {
        setIsPlaying(true);
        startTimer();
      },
      onpause: () => {
        setIsPlaying(false);
        stopTimer();
      },
      onstop: () => {
        setIsPlaying(false);
        setPlayTime(0);
        stopTimer();
      },
    });

    setSound(newSound);
  };

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };

  const changeScene = (newScene: SceneData) => {
    setCurrentScene(newScene);
    setPlayTime(0);
  };

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPlayTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
      <main
          className="flex flex-col items-center justify-between min-h-screen bg-cover bg-center text-white p-6 relative overflow-hidden"
          style={{ backgroundImage: `url(${currentScene?.backgroundImage || ''})` }}
      >
        <AnimatePresence>
          {isPlaying && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10"
              />
          )}
        </AnimatePresence>

        <motion.div
            className="text-center mb-8 z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-red-500">恐怖氛围制造机</h1>
          <h2 className="text-xl text-white flex items-center justify-center">
            当前场景:
            {" "}
            <span className="font-semibold text-red-500 ml-2 flex items-center">
            {currentScene && sceneIcons[currentScene.name]}
              <span className="ml-1">{currentScene?.name}</span>
          </span>
          </h2>
        </motion.div>

        <div className="flex-grow flex flex-col items-center justify-center z-20">
          <motion.div
              className="text-2xl font-bold mb-4 text-red-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
          >
            <Skull className="mr-2" />
            {currentScene?.title || "未知曲目"}
          </motion.div>
          <div className="text-xl text-white mb-4">{formatTime(playTime)}</div>
          <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="rounded-full p-6 backdrop-blur-md bg-none shadow-lg transition-all hover:bg-white/20"
          >
            {isPlaying
                ? <Pause className="h-12 w-12 text-white" />
                : <Play className="h-12 w-12 text-white" />}
          </motion.button>
        </div>

        <motion.div
            className="w-full max-w-md z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-around w-full">
            {scenes.map((scn, index) => (
                <motion.button
                    key={scn.name}
                    onClick={() => changeScene(scn)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-xs font-medium shadow-md transition-colors ${
                        currentScene?.name === scn.name
                            ? "bg-red-500 text-white"
                            : "backdrop-blur-md bg-white/10 text-white"
                    }`}
                >
                  {sceneIcons[scn.name]}
                  <span className="mt-1">{scn.name}</span>
                </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
  );
}
