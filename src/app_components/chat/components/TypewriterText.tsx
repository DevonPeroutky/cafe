import React, {useEffect, useState} from "react";

export const TypewriterText: React.FC<{text: string}> = ({ text }) => {
  console.log(`TEXT: `, text)
  const streamingData = text;
  const [displayedText, setDisplayedText] = useState('');
  let index = 0;

  // Effect to implement the typewriter effect
  useEffect(() => {
    const delay = 50;  // Adjust the delay between characters

    if (streamingData === '') {
      return;
    }

    const typewriterInterval = setInterval(() => {
      setDisplayedText(_ => {
        if (index === streamingData.length) {
          clearInterval(typewriterInterval);
        }
        index += 1;
        return streamingData.substring(0, index);
      });
    }, delay);

    return () => {
      clearInterval(typewriterInterval);
    };
  }, [streamingData]);  // Run this effect whenever streamingData changes


  return (
      <p>{displayedText}</p>
  );
}