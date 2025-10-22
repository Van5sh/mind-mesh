"use client"

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const greetings = [
    "Hello, {name}! Hope you're having an amazing day!",
    "Hi there, {name}! Great to see you!",
    "Hey, {name}! How's everything going?",
    "Good day, {name}! Wishing you all the best!",
    "Hello, {name}! Ready to tackle something new today?",
    "Looks like you are ready for a productive day, {name}!",
    "Hi, {name}! Hope your day is going smoothly!",
    "Hey there, {name}! Let's make today awesome!",
    "Greetings, {name}! Wishing you a productive day!",
    "Hello, {name}! How are you feeling today?",
    "Hi, {name}! Excited to connect with you!"
];

const LandingPage = () => {
    const router = useRouter();
    const [greeting, setGreeting] = useState(() => {
        const randomIndex = Math.floor(Math.random() * greetings.length);
        return greetings[randomIndex].replace("{name}", "Vansh");
    });
    
    const Sectionsdata=[
        {
            title:"Build Your Projects",
            description:"Easily create and manage your projects with intelligent assistance and organization features.",
            link:"project"
        },
        {
            title:"Report Generation",
            description:"Generate detailed reports from your data with just a few clicks using our AI-powered tools.",
            link:"report"
        },
        {
            title:"Organize your Data",
            description:"Keep your data structured and accessible with our advanced organization tools.",
            link:"filesystem"
        }
    ]
    return (
        <div 
            className="flex flex-col justify-center items-center min-h-screen p-8"
            style={{
                background: 'linear-gradient(135deg, #0F192B 0%, #182842 50%, #1F3557 100%)'
            }}
        >
            <div className="text-center mb-12">
                <h1 
                    className="text-6xl font-bold mb-4 bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(135deg, #40A2E3, #2ED8C3)',
                        textShadow: '0 0 40px rgba(64, 162, 227, 0.3)'
                    }}
                >
                    MIND MESH
                </h1>
                <h2 
                    className="text-3xl font-semibold"
                    style={{ color: '#F4F8FC' }}
                    suppressHydrationWarning
                >
                    {greeting}
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {Sectionsdata.map((section, idx)=>(
                    <Card
                        key={idx}
                        className="p-6 transition-all duration-300 cursor-pointer flex flex-col group relative overflow-hidden"
                        style={{
                            backgroundColor: '#182842',
                            borderColor: '#253651',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                        }}
                        onClick={()=>router.push(`/${section.link}`)}
                    >
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(64,162,227,0.15), rgba(46,216,195,0.15))',
                            }}
                        />
                        
                        <div className="relative z-10">
                            <h3 
                                className="text-2xl font-bold mb-3 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300"
                                style={{
                                    color: '#F4F8FC',
                                }}
                            >
                                {section.title}
                            </h3>
                            <p 
                                className="leading-relaxed"
                                style={{ color: '#A9B4C7' }}
                            >
                                {section.description}
                            </p>
                        </div>
                        <div 
                            className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                            style={{
                                background: 'linear-gradient(90deg, #40A2E3, #2ED8C3)'
                            }}
                        />
                    </Card>
                ))}
            </div>
        </div>
    )
}
export default LandingPage;