"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

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
    const [greeting, setGreeting] = useState("Hello, Vansh!");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * greetings.length);
        setGreeting(greetings[randomIndex].replace("{name}", "Vansh"));
    }, []);
    
    const Sectionsdata=[
        {
            title:"Report Generation",
            description:"Generate detailed reports from your data with just a few clicks using our AI-powered tools.",
        },
        {
            title:"Build Your Projects",
            description:"Easily create and manage your projects with intelligent assistance and organization features.",
        },
        {
            title:"Organize your Data",
            description:"Keep your data structured and accessible with our advanced organization tools.",
        }
    ]
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1>MIND MESH</h1>
            <h1 className="text-5xl">{greeting}</h1>
            <div className="flex flex-row justify-center items-center mt-8 gap-4">
                {Sectionsdata.map((section, idx)=>(
                    <Card key={idx} className="p-4 hover:z-10 hover:shadow-2xl w-80 justify-center items-center shadow-lg border-slate-200">
                        <h2 className="text-xl justify-center  font-bold mb-2">{section.title}</h2>
                        <p className="text-gray-600">{section.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    )
}
export default LandingPage;