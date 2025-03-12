'use client'
import React from 'react';
import Hero from '@/app/components/heroSection/hero';
import Header from '../components/heroSection/header';
import Advertisment from '../components/heroSection/advertisment';
import ChatBotInput from '@/app/components/heroSection/chatbotInput'
const FinalPage = () => {
    return (
        <main className="flex flex-col gap-16 items-center justify-items-center min-h-screen p-8 pb-20  sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header/>
            <Hero/>
            <Advertisment/>
            <ChatBotInput/>
        </main>
    
)
}
export default FinalPage;