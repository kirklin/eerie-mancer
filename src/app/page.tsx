"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Howl } from "howler";
import { Pause, Play, Skull, Tent, Trees, Waves } from "lucide-react";

interface SceneData {
  name: string;
  sound: string;
  title: string;
}

export default function Home() {
  const [scene, setScene] = useState<string>("海边");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Howl | null>(null);
  const [playTime, setPlayTime] = useState<number>(0);
  const [title, setTitle] = useState<string>("未知曲目");

  const scenes: SceneData[] = [
    { name: "海边", sound: "/sounds/sea-horror.mp3", title: "海边恐怖音乐" },
    { name: "营地", sound: "/sounds/camp-horror.mp3", title: "营地恐怖音乐" },
    { name: "森林", sound: "/sounds/forest-horror.mp3", title: "森林恐怖音乐" },
  ];

  const sceneIcons: { [key: string]: JSX.Element } = {
    海边: <Waves size={24} />,
    营地: <Tent size={24} />,
    森林: <Trees size={24} />,
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, [sound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const loadAndPlaySound = (sceneData: SceneData) => {
    if (sound) {
      sound.stop();
      sound.unload();
    }

    const newSound = new Howl({
      src: [sceneData.sound],
      loop: true,
      onplay: () => {
        setTitle(sceneData.title);
        setIsPlaying(true);
      },
      onstop: () => {
        setTitle("未知曲目");
        setPlayTime(0);
        setIsPlaying(false);
      },
    });

    setSound(newSound);
    newSound.play();
  };

  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
      } else {
        sound.play();
        setIsPlaying(true);
      }
    }
  };

  const changeScene = (newScene: SceneData) => {
    setScene(newScene.name);
    loadAndPlaySound(newScene);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-[#1a0f1d] to-[#2c1e30] text-[#e0e0e0] p-6">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-[#ff6b6b]">恐怖氛围制造机</h1>
        <h2 className="text-xl text-[#e0e0e0] flex items-center justify-center">
          当前场景:
          {" "}
          <span className="font-semibold text-[#ff6b6b] ml-2 flex items-center">
            {sceneIcons[scene]}
            <span className="ml-1">{scene}</span>
          </span>
        </h2>
      </motion.div>

      <div className="flex flex-col items-center mb-8">
        <motion.div
          className="text-2xl font-bold mb-4 text-[#ff6b6b] flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Skull className="mr-2" />
          {title}
        </motion.div>
        <div className="text-xl text-[#e0e0e0]">{formatTime(playTime)}</div>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="mb-12 rounded-full bg-[#ff6b6b] p-6 shadow-lg transition-colors hover:bg-[#ff4757]"
      >
        {isPlaying
          ? (
              <Pause className="h-12 w-12 text-[#1a0f1d]" />
            )
          : (
              <Play className="h-12 w-12 text-[#1a0f1d]" />
            )}
      </motion.button>

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
            className={`w-24 h-24 rounded-xl flex flex-col items-center justify-center text-sm font-medium shadow-md transition-colors ${
                      scene === scn.name
                          ? "bg-[#ff6b6b] text-[#1a0f1d]"
                          : "backdrop-blur-md bg-white/10 text-[#e0e0e0]"
                  }`}
          >
            {sceneIcons[scn.name]}
            <span className="mt-2">{scn.name}</span>
          </motion.button>
        ))}
      </div>
    </main>
  );
}
