import React, { useState, useEffect } from 'react';

const Hero = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);
    const [showCursor, setShowCursor] = useState(true);

    const messages = [
        { text: "hello there", emoji: "👋" },
        { text: "AI That Reads the Fine Print for You.", emoji: "🤖" },
        { text: "Never Miss a Hidden Clause Again.", emoji: "🔍" },
        { text: "Your Contracts, Simplified & Secured.", emoji: "🔒" },
        { text: "Time-Saving & Accurate.", emoji: "✨" },
        { text: "Legal Jargon Simplified", emoji: "📌" },
        { text: "See AI in Action.", emoji: "⚡" }
    ];

    useEffect(() => {
        const handleTyping = () => {
            const currentMessage = messages[messageIndex].text;
            if (isDeleting) {
                setDisplayedText(currentMessage.substring(0, displayedText.length - 1));
                setTypingSpeed(50);
            } else {
                setDisplayedText(currentMessage.substring(0, displayedText.length + 1));
                setTypingSpeed(150);
            }

            if (!isDeleting && displayedText === currentMessage) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
            }
        };

        const typingInterval = setInterval(handleTyping, typingSpeed);
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => {
            clearInterval(typingInterval);
            clearInterval(cursorInterval);
        };
    }, [displayedText, isDeleting, messageIndex, typingSpeed, messages]);

    return (
        <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-row w-auto gap-3 rounded-xl px-4 py-2 border border-neutral-800">
                <div className="w-auto py-1 px-[6px] rounded-full bg-neutral-800">{messages[messageIndex].emoji}</div>
                <h1 className="mt-1">{displayedText}{showCursor && '|'}</h1>
            </div>
            <h1 className="w-[800px] text-[40px] text-center">Your AI-Powered Legal Insights, Instantly Contracts Made Simple with AI</h1>
            <h3 className="w-[900px] text-[18px] text-center text-neutral-500">Reviewing contracts manually is slow, risky, and inefficient. Our AI changes that. It scans documents instantly, highlights critical terms, detects hidden risks, and translates legalese into plain language. Whether you’re a freelancer, startup, or enterprise, gain full contract clarity with one simple upload. Analyze for free, but please buy me a coffee!</h3>
            <div className='flex flex-row gap-4 mt-7'>
                <div className='w-auto px-4 py-2 border border-neutral-600 rounded-xl bg-neutral-600 text-white'>Try a Sample Analysis</div>
                <div className='w-auto px-4 py-2 border border-neutral-800 rounded-xl bg-neutral-800 text-white'>Upload Your Contract</div>
                
            </div>
        </div>
    );
};

export default Hero;