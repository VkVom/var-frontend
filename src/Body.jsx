import React, { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
// Main App component that encapsulates the entire application.
// All components and logic are kept within this single file as per the design requirements.
export default function App() {

  // State for theme management (false = light mode, true = dark mode)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State to track if the GSAP library and its plugins are loaded
  const [gsapReady, setGsapReady] = useState(false);

  // Typing effect state and logic for the main heading
  const words = ["minimal", "major", "dynamic", "creative"];
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formStatus, setFormStatus] = useState(null);

  // Function to toggle between dark and light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- UPDATED: Function to handle form submission to the new backend ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('sending');
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // This URL points to the backend server you will create.
const response = await fetch(`${API_URL}/api/send`, {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus('success');
        form.reset();
        setTimeout(() => setFormStatus(null), 5000);
      } else {
        console.error('Submission failed:', result.message);
        setFormStatus('error');
        setTimeout(() => setFormStatus(null), 5000);
      }
    } catch (err) {
      console.error('An error occurred:', err);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 5000);
    }
  };


  // Effect to dynamically load GSAP and its plugins
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"
    ];
    let loadedScripts = 0;

    scripts.forEach(src => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Load in order
      script.onload = () => {
        loadedScripts++;
        if (loadedScripts === scripts.length) {
          window.gsap.registerPlugin(window.ScrollTrigger, window.ScrollToPlugin);
          setGsapReady(true);
        }
      };
      document.body.appendChild(script);
    });
  }, []);

  // GSAP animations for background tabs and scroll-based effects
  useEffect(() => {
    if (gsapReady) {
      // Floating background tabs animation
      window.gsap.to(".bg-tab", {
        y: "random(-50, 50)", x: "random(-50, 50)", rotation: "random(-5, 5)",
        ease: "power1.inOut", duration: "random(15, 25)", stagger: 0.5,
        repeat: -1, yoyo: true, yoyoEase: true,
      });

      // Scroll-triggered animations within the main window
      const scrollContainer = ".scroll-container";
      
      // Animate main heading
      window.gsap.from(".main-heading-anim", {
        scrollTrigger: { scroller: scrollContainer, trigger: ".main-heading-anim", start: "top 80%" },
        scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.7)"
      });
      
      // Animate challenge box
      window.gsap.from(".challenge-box-anim", {
        scrollTrigger: { scroller: scrollContainer, trigger: ".challenge-box-anim", start: "top 85%" },
        x: -100, opacity: 0, duration: 1, ease: "power3.out"
      });

    }
  }, [gsapReady]);
  
  // Main heading typing animation
  useEffect(() => {
    const fullWord = words[wordIndex];
    let timeoutId;
    if (isDeleting) {
      timeoutId = setTimeout(() => setText(fullWord.substring(0, text.length - 1)), 75);
    } else {
      timeoutId = setTimeout(() => setText(fullWord.substring(0, text.length + 1)), 150);
    }
    if (!isDeleting && text === fullWord) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }
    return () => clearTimeout(timeoutId);
  }, [text, isDeleting, wordIndex, words]);
  
  // GSAP smooth scroll for navigation
  const handleNavClick = (e) => {
    e.preventDefault();
    if (gsapReady) {
      window.gsap.to(".scroll-container", {
        duration: 1.5,
        scrollTo: { y: e.target.hash, offsetY: 50 },
        ease: "power3.inOut"
      });
    }
  };


  // --- Animated Window Components ---

    const AnimatedPaint = () => {
        const canvasRef = useRef(null);
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const colors = ['#e91e63', '#2196f3', '#4caf50', '#ffc107', '#9c27b0'];
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            const interval = setInterval(() => {
                const nextX = Math.random() * canvas.width;
                const nextY = Math.random() * canvas.height;
                ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nextX, nextY);
                ctx.stroke();
                x = nextX;
                y = nextY;
            }, 500);
            return () => clearInterval(interval);
        }, []);
        return <canvas ref={canvasRef} className="w-full h-full bg-white rounded-b-sm" />;
    };

    const AnimatedTextEditor = () => {
        const lines = ["// Initializing portfolio...", "const name = 'VAR';", "const skills = ['React', 'GSAP', 'Tailwind'];", "function createAwesomeSite() {", "  return 'Done!';", "}"];
        const [currentLine, setCurrentLine] = useState("");
        const [lineIndex, setLineIndex] = useState(0);
        useEffect(() => {
            if (lineIndex >= lines.length) {
                setTimeout(() => setLineIndex(0), 3000); // loop
                return;
            };
            const timeout = setTimeout(() => {
                setCurrentLine(lines[lineIndex].substring(0, currentLine.length + 1));
                if (currentLine.length === lines[lineIndex].length) {
                    setLineIndex(lineIndex + 1);
                    setCurrentLine("");
                }
            }, 100);
            return () => clearTimeout(timeout);
        }, [currentLine, lineIndex, lines]);

        return (
            <div className="bg-gray-900 text-lime-400 h-full p-2 font-mono text-xs overflow-hidden rounded-b-sm">
                {lines.slice(0, lineIndex).map((line, i) => <div key={i}>{line}</div>)}
                <div>{currentLine}<span className="animate-blink border-r-2 border-lime-400"></span></div>
            </div>
        );
    };

    const AnimatedTerminal = () => {
        const [output, setOutput] = useState([]);
        const commands = ["ls -a", "Portfolio/", "README.md", "npm start", "Compiling...", "Done."];
        useEffect(() => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < commands.length) {
                    setOutput(prev => [...prev, commands[i]]);
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }, []);
        return (
            <div className="bg-black text-green-500 h-full p-2 font-mono text-xs overflow-y-auto rounded-b-sm">
                {output.map((line, i) => <p key={i}>{'>'} {line}</p>)}
                <div className="animate-blink h-3 w-1.5 bg-green-500"></div>
            </div>
        );
    };

    const AnimatedClock = () => {
        const [time, setTime] = useState(new Date());
        useEffect(() => {
            const timer = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);
        return (
            <div className="bg-gray-900 text-cyan-400 h-full p-2 font-pixel text-2xl flex items-center justify-center rounded-b-sm">
                {time.toLocaleTimeString()}
            </div>
        )
    };

  // --- FULLY FUNCTIONAL CALCULATOR COMPONENT (RE-STYLED TO FIT) ---
  const AnimatedCalculator = () => {
    const [input, setInput] = useState('0');
    const [firstOperand, setFirstOperand] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const handleDigit = (digit) => {
      if (waitingForSecondOperand) {
        setInput(digit);
        setWaitingForSecondOperand(false);
      } else {
        setInput(input.length > 12 ? input : (input === '0' ? digit : input + digit));
      }
    };

    const handleOperator = (nextOperator) => {
      const inputValue = parseFloat(input);
      if (operator && waitingForSecondOperand) {
        setOperator(nextOperator);
        return;
      }
      if (firstOperand === null) {
        setFirstOperand(inputValue);
      } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        setInput(String(result).slice(0, 12));
        setFirstOperand(result);
      }
      setWaitingForSecondOperand(true);
      setOperator(nextOperator);
    };

    const calculate = (first, second, op) => {
      switch (op) {
        case '+': return first + second;
        case '-': return first - second;
        case 'x': return first * second;
        case '/': return second === 0 ? 'Error' : first / second;
        default: return second;
      }
    };

    const handleEquals = () => {
      const inputValue = parseFloat(input);
      if (operator && firstOperand !== null) {
        const result = calculate(firstOperand, inputValue, operator);
        setInput(String(result).slice(0, 12));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
      }
    };
    
    const handleClear = () => {
      setInput('0');
      setFirstOperand(null);
      setOperator(null);
      setWaitingForSecondOperand(false);
    };

    const handleClick = (value) => {
      if (input === 'Error') handleClear();
      if (/\d/.test(value)) handleDigit(value);
      else if (['+', '-', 'x', '/'].includes(value)) handleOperator(value);
      else if (value === '=') handleEquals();
      else if (value === 'C') handleClear();
    };

    return (
      <div className="bg-gray-800 h-full p-1 flex flex-col justify-between font-pixel rounded-b-sm">
        <div className="bg-gray-600 text-white w-full text-right p-1 text-lg mb-1 rounded-sm break-all">
          {input}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {['7','8','9','/','4','5','6','x','1','2','3','-','C','0','=','+'].map(btn => (
            <button key={btn} onClick={() => handleClick(btn)} className="bg-gray-500 text-white h-7 flex items-center justify-center border border-black shadow-[2px_2px_0px_#000] text-xs active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-transform duration-100">
              {btn}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
    const StaticComponent = ({bgColor, children}) => <div className={`${bgColor} h-full p-2 rounded-b-sm`}>{children}</div>;


  const backgroundTabs = [
    { title: 'Project.doc', component: <StaticComponent bgColor="bg-blue-200" />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.625 1.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75V6.75a.75.75 0 01.75-.75H5.25v-3.75zM12 2.25a.75.75 0 01.75-.75h5.625c.355 0 .69.182.872.482L22.5 6.75a.75.75 0 01-.722 1.258h-3.375a.75.75 0 01-.75-.75V6.75a.75.75 0 00-.75-.75h-5.625a.75.75 0 01-.75-.75V2.25zM12 9a.75.75 0 01.75-.75h5.625a.75.75 0 01.75.75v3h-7.125a.75.75 0 01-.75-.75v-2.25zM12 13.5a.75.75 0 01.75-.75h5.625a.75.75 0 01.75.75v3h-7.125a.75.75 0 01-.75-.75v-2.25zM12 18a.75.75 0 01.75-.75h5.625a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-6.75a.75.75 0 01-.75-.75v-.75z" clipRule="evenodd" /></svg>, top: '10%', left: '5%', rotate: '-8deg' },
    { title: 'CALCULATOR.exe', component: <AnimatedCalculator />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" /></svg>, top: '15%', right: '2%', rotate: '5deg' },
    { title: 'README.md', component: <AnimatedTextEditor />, svg: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" /><path d="M8 12H16V14H8V12Z" /><path d="M8 16H16V18H8V16Z" /></svg>, bottom: '10%', left: '20%', rotate: '3deg' },
    { title: 'CLIENTS.csv', component: <StaticComponent bgColor="bg-green-200" />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 4a8 8 0 110 16 8 8 0 010-16zm-1 3h2v2h-2zm0 4h2v6h-2z" /></svg>, bottom: '5%', right: '5%', rotate: '15deg' },
    { title: 'PAINT.exe', component: <AnimatedPaint />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM6.5 12C5.67 12 5 11.33 5 10.5C5 9.67 5.67 9 6.5 9C7.33 9 8 9.67 8 10.5C8 11.33 7.33 12 6.5 12ZM9.5 8C8.67 8 8 7.33 8 6.5C8 5.67 8.67 5 9.5 5C10.33 5 11 5.67 11 6.5C11 7.33 10.33 8 9.5 8ZM14.5 8C13.67 8 13 7.33 13 6.5C13 5.67 13.67 5 14.5 5C15.33 5 16 5.67 16 6.5C16 7.33 15.33 8 14.5 8ZM17.5 12C16.67 12 16 11.33 16 10.5C16 9.67 16.67 9 17.5 9C18.33 9 19 9.67 19 10.5C19 11.33 18.33 12 17.5 12Z" /></svg>, top: '45%', left: '10%', rotate: '-12deg' },
    { title: 'TERMINAL.exe', component: <AnimatedTerminal />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 8L11 13L6 18V8Z" /><path d="M12 18H18V16H12V18Z" /></svg>, bottom: '2%', right: '25%', rotate: '-5deg' },
    { title: 'CLOCK.exe', component: <AnimatedClock />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 4a8 8 0 110 16 8 8 0 010-16z" /><path fillRule="evenodd" d="M12.5 7.5a.5.5 0 01-1 0v4.5a.5.5 0 011 0V7.5zM12 11.5a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" clipRule="evenodd" /></svg>, top: '50%', right: '15%', rotate: '10deg' },
    { title: 'NOTES.txt', component: <StaticComponent bgColor="bg-yellow-200" />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 21h-18a2 2 0 01-2-2v-16a2 2 0 012-2h18a2 2 0 012 2v16a2 2 0 01-2 2zM12 6h4v2h-4v-2zM8 6h2v2h-2v-2zM8 10h8v2h-8v-2zM8 14h8v2h-8v-2z" /></svg>, top: '5%', left: '30%', rotate: '4deg' },
    { title: 'MUSIC.mp3', component: <StaticComponent bgColor="bg-red-300" />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4V7h4V3h-6z" /></svg>, bottom: '25%', left: '2%', rotate: '8deg' },
    { title: 'PHOTOS.jpg', component: <StaticComponent bgColor="bg-purple-300" />, svg: <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>, top: '65%', left: '25%', rotate: '-3deg' },
];


  const themeClasses = {
    container: isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-black",
    backgroundTab: isDarkMode ? `bg-gray-900/50 backdrop-blur-md border-gray-700 shadow-[4px_4px_0px_#4b5563]` : `bg-white/50 backdrop-blur-sm border-black shadow-[4px_4px_0px_#000]`,
    window: isDarkMode ? "bg-gray-900/40 border-gray-700 shadow-[8px_8px_0px_#4b5563]" : "bg-gray-100/40 border-black shadow-[8px_8px_0px_#000]",
    titleBar: isDarkMode ? "bg-blue-800 border-gray-700" : "bg-blue-700 border-black",
    titleBarButton: isDarkMode ? "bg-gray-700 border-gray-600 shadow-[2px_2px_0px_#4b5563] text-gray-200" : "bg-gray-200 border-black shadow-[2px_2px_0px_#000] text-black",
    navLink: isDarkMode ? "text-gray-300 hover:text-blue-500" : "text-gray-800 hover:text-blue-700",
    formContainer: isDarkMode ? "bg-gray-700/80 border-gray-600 shadow-[6px_6px_0px_#4b5563]" : "bg-gray-300/80 border-black shadow-[6px_6px_0px_#000]",
    formInput: isDarkMode ? "bg-gray-800 text-gray-200 border-gray-600 focus:bg-gray-900 focus:border-blue-500" : "bg-gray-50 text-gray-800 border-gray-800 focus:bg-white focus:border-blue-600",
    footer: isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-300 border-black",
    button: isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200 shadow-[4px_4px_0px_#4b5563] hover:shadow-none active:shadow-none" : "bg-gray-300 border-black text-gray-800 shadow-[4px_4px_0px_black] hover:shadow-none active:shadow-none",
    typingCursor: isDarkMode ? "border-gray-200" : "border-black",
  };

  return (
    <div className={`flex justify-center items-center min-h-screen p-4 font-mono relative overflow-hidden transition-colors duration-500 ${themeClasses.container}`}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        @keyframes bounce-rotate { 0%, 100% {transform: rotate(0deg);} 25% {transform: rotate(-5deg);} 50% {transform: rotate(5deg);} 75% {transform: rotate(-2deg);} }
        .var-bounce:hover { animation: bounce-rotate 0.6s ease-in-out; }
        @keyframes blink { 50% { border-color: transparent; } }
        .animate-blink { animation: blink 1s step-end infinite; }
        .glass-morphism { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .scroll-container { overflow-y: auto; scrollbar-width: thin; scrollbar-color: ${isDarkMode ? '#4b5563 #374151' : '#a0aec0 #d1d5db'}; }
        .scroll-container::-webkit-scrollbar { width: 12px; }
        .scroll-container::-webkit-scrollbar-track { background: ${isDarkMode ? '#374151' : '#d1d5db'}; }
        .scroll-container::-webkit-scrollbar-thumb { background-color: ${isDarkMode ? '#4b5563' : '#a0aec0'}; border-radius: 6px; border: 3px solid ${isDarkMode ? '#374151' : '#d1d5db'}; }`}
      </style>

      {backgroundTabs.map((tab, index) => (
        <div key={index} className={`hidden lg:block absolute p-1 border-2 rounded-sm z-10 transition-all duration-300 w-64 bg-tab ${themeClasses.backgroundTab}`}
          style={{ top: tab.top, left: tab.left, right: tab.right, bottom: tab.bottom, transform: `rotate(${tab.rotate})` }}>
          <div className={`flex items-center justify-between p-1 border-b-2 cursor-move ${themeClasses.titleBar}`}>
            <span className="text-white font-bold tracking-wider text-xs pl-1 flex items-center gap-1.5 font-pixel">{tab.svg}{tab.title}</span>
            <div className="flex gap-0.5">
               <button className={`h-4 w-4 border-2 flex justify-center items-center text-xs font-bold ${themeClasses.titleBarButton} shadow-none`}>☐</button>
               <button className={`h-4 w-4 border-2 flex justify-center items-center text-xs font-bold ${themeClasses.titleBarButton} shadow-none`}>X</button>
            </div>
          </div>
          {tab.component && <div className="w-full h-40 mt-1">{tab.component}</div>}
        </div>
      ))}
      
      <div className={`w-full max-w-4xl border-4 rounded-sm overflow-hidden flex flex-col min-h-[600px] h-[90vh] relative z-20 transition-all duration-500 ${themeClasses.window} glass-morphism`}>
        <div className={`flex items-center justify-between p-1 border-b-4 cursor-move ${themeClasses.titleBar}`}>
          <span className="text-white font-bold tracking-wider text-xl pl-2 font-pixel">VAR.exe</span>
          <div className="flex gap-1">
            <button className={`h-5 w-5 border-2 flex justify-center items-center text-sm font-bold transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 ${themeClasses.titleBarButton}`}>☐</button>
            <button className={`h-5 w-5 border-2 flex justify-center items-center text-sm font-bold transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-100 ${themeClasses.titleBarButton}`}>X</button>
          </div>
        </div>
        
        <div className="p-6 md:p-8 flex-grow scroll-container">
          <header className='flex justify-between items-center mb-16'>
            <h1 className='text-3xl font-bold transition-all duration-300 transform hover:scale-110 var-bounce font-pixel'>VAR.</h1>
            <div className='flex items-center gap-4 md:gap-6 text-lg'>
              <a href="#contact" onClick={handleNavClick} className={`font-mono transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${themeClasses.navLink}`}>Contact</a>
              <button onClick={toggleTheme} title="Toggle Theme" className={`relative p-2 border-2 font-bold transition-all duration-300 text-base uppercase transform hover:translate-x-1 hover:translate-y-1 active:translate-x-1 active:translate-y-1 ${themeClasses.button}`}>
                {isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              </button>
            </div>
          </header>
          
          <main className='main-heading-anim font-pixel font-bold flex flex-col items-center justify-center text-2xl sm:text-3xl md:text-4xl text-center mb-16 h-32'>
            <h2 className="leading-tight">Ready to take on your</h2>
            <h2 className="leading-tight h-16">
              <span className='text-rose-500'>{text}</span>
              <span className={`animate-blink border-r-4 ${themeClasses.typingCursor}`}></span> Website?
            </h2>
          </main>
          
          <div className="flex justify-center mb-20 text-center challenge-box-anim">
            <p className={`text-lg md:text-xl font-pixel font-bold p-4 md:p-6 border-4 ${themeClasses.formContainer}`}>
              We are ready to take on your <span className="text-lime-500">challenge!</span>
            </p>
          </div>

          <section id="contact" className="flex flex-col items-center mb-10">
            <h3 className='text-xl sm:text-2xl font-pixel'>Ready to get started?</h3>
            <div className="flex justify-center items-center mt-8 w-full">
              {/* UPDATED: Removed action and method from form tag */}
              <form onSubmit={handleSubmit} className={`flex flex-col p-6 md:p-8 w-full max-w-md border-4 ${themeClasses.formContainer}`}>
                <p className={`text-center text-sm mb-6 font-mono`}>Fill out the form below. We will email you back ASAP!</p>
                <label htmlFor="name" className={`font-semibold mb-2 text-base font-mono`}>Name</label>
                <input id="name" type="text" name="name" placeholder="John Doe" required className={`w-full p-2 mb-4 border-2 text-base font-mono focus:outline-none transition-all duration-300 ${themeClasses.formInput}`} />
                <label htmlFor="email" className={`font-semibold mb-2 text-base font-mono`}>Email</label>
                {/* Changed name to "email" for consistency */}
                <input id="email" type="email" name="email" placeholder="john@example.com" required className={`w-full p-2 mb-4 border-2 text-base font-mono focus:outline-none transition-all duration-300 ${themeClasses.formInput}`} />
                <label htmlFor="message" className={`font-semibold mb-2 text-base font-mono`}>Project Details</label>
                <textarea id="message" name="message" placeholder="Tell us about your project!" rows="4" required className={`w-full p-2 mb-6 border-2 text-base font-mono focus:outline-none transition-all duration-300 ${themeClasses.formInput}`}></textarea>
                <button type="submit" disabled={formStatus === 'sending'} className={`relative px-6 py-3 border-2 font-bold text-lg uppercase transform hover:translate-x-1 hover:translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses.button}`}>
                  {formStatus === 'sending' ? 'Sending...' : 'Submit Request'}
                </button>
                {formStatus === 'success' && <p className="text-green-500 text-center mt-4 text-sm font-mono">Thank you! Your request has been sent.</p>}
                {formStatus === 'error' && <p className="text-red-500 text-center mt-4 text-sm font-mono">Something went wrong. Please try again.</p>}
              </form>
            </div>
          </section>
        </div>

        <footer className={`flex justify-center items-center p-3 text-sm sm:text-base font-pixel border-t-4 ${themeClasses.footer}`}>
          ©{new Date().getFullYear()} Var India, Inc. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}

