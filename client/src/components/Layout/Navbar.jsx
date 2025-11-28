import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
    const [currentPath, setCurrentPath] = useState('/');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    // ---------------- ICONS ----------------
    const HomeIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" /></svg>);
    const HealthIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.3M14.25 3.104c.251.023.501.05.75.082" /></svg>);
    const StethoscopeIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 0 0-1.022-.547l-2.387-.477a6 6 0 0 0-3.86.517l-.318.158a6 6 0 0 1-3.86.517L6.05 15.21a2 2 0 0 0-1.806.547" /></svg>);
    const CalculatorIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008z" /></svg>);
    const UserGroupIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479" /></svg>);
    const BodyIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0" /></svg>);
    const CloudIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5" /></svg>);
    const ShieldIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75V15" /></svg>);
    const QuestionMarkIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h9" /></svg>);

    const ChevronDownIcon = ({ isOpen }) => (
        <svg className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );

    // ---------------- LINKS ----------------
    const linkGroups = {
        tools: {
            title: "Tools & Calculators",
            icon: CalculatorIcon,
            links: [
                { href: '/symptom-checker', label: 'Symptom Checker', icon: <StethoscopeIcon /> },
                { href: '/wellness-hub', label: 'Wellness Hub', icon: <CalculatorIcon /> },
                { href: '/human-body-explorer', label: 'Body Explorer', icon: <BodyIcon /> },
                { href: '/air-quality-forecaster', label: 'Air Quality', icon: <CloudIcon /> },
                { href: '/doctor-recommender', label: 'Find Doctors', icon: <UserGroupIcon /> },
            ]
        },
        safety: {
            title: "Safety & Guides",
            icon: ShieldIcon,
            links: [
                { href: '/emer-pro', label: 'Emergency Protocols', icon: <ShieldIcon /> },
               { href: '/myth-busters', label: 'Myth Busters', icon: <QuestionMarkIcon /> },

                { href: '/literacy', label: 'Health Literacy', icon: <QuestionMarkIcon /> },
            ]
        }
    };

    // ---------------- COMPONENTS ----------------
    const NavLink = ({ href, children, isCurrent, onClick }) => (
        <a
            href={href}
            onClick={onClick}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isCurrent ? 'bg-green-100 text-green-800' : 'text-slate-600 hover:bg-green-50 hover:text-green-700'}`}
        >
            <span className="flex items-center">{children}</span>
        </a>
    );

    const DropdownMenu = ({ title, category, icon: Icon, links }) => {
        const isOpen = activeDropdown === category;

        return (
            <div className="relative h-full"
                onMouseEnter={() => setActiveDropdown(category)}
                onMouseLeave={() => setActiveDropdown(null)}
            >
                <button className={`inline-flex items-center px-3 py-2 rounded-lg text-sm ${isOpen ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-green-50'}`}>
                    <Icon /> {title} <ChevronDownIcon isOpen={isOpen} />
                </button>

                {isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-60 bg-white border rounded-xl shadow-xl p-2 z-50">
                        {links.map(link => (
                            <NavLink key={link.href} href={link.href} onClick={() => setActiveDropdown(null)}>
                                {link.icon} {link.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const MobileAccordion = ({ title, category, icon: Icon, links }) => {
        const isOpen = activeMobileDropdown === category;

        return (
            <div className="w-full">
                <button
                    onClick={() => setActiveMobileDropdown(isOpen ? null : category)}
                    className={`flex justify-between w-full px-3 py-2 rounded-lg text-sm ${isOpen ? 'bg-green-100 text-green-700' : 'text-slate-700 hover:bg-green-50'}`}
                >
                    <span className="flex items-center"><Icon /> {title}</span>
                    <ChevronDownIcon isOpen={isOpen} />
                </button>

                <div className={`transition-all overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 py-2 space-y-1 border-l">
                        {links.map(link => (
                            <NavLink key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}>
                                {link.icon} {link.label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // ---------------- RENDER ----------------
    return (
        <header className="sticky top-0 z-50 bg-white backdrop-blur border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <a href="/" className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl font-bold">Health ChatPal</span>
                            <span className="text-xs text-slate-500 block -mt-1">AI Health Assistant</span>
                        </div>
                    </a>

                    {/* DESKTOP MENU */}
                    <nav className="hidden lg:flex items-center space-x-2 h-full">
                        <NavLink href="/" isCurrent={currentPath === '/'}>
                            <HomeIcon /> Home
                        </NavLink>

                        <NavLink href="/hub" isCurrent={currentPath === '/hub'}>
                            <HealthIcon /> Health Hub
                        </NavLink>

                        <DropdownMenu {...linkGroups.tools} category="tools" />
                        <DropdownMenu {...linkGroups.safety} category="safety" />
                    </nav>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white shadow-xl border-t">
                    <div className="py-4 px-4 space-y-1">
                        <NavLink href="/" isCurrent={currentPath === '/'} onClick={() => setIsMenuOpen(false)}>
                            <HomeIcon /> Home
                        </NavLink>

                        <NavLink href="/hub" isCurrent={currentPath === '/hub'} onClick={() => setIsMenuOpen(false)}>
                            <HealthIcon /> Health Hub
                        </NavLink>

                        <MobileAccordion {...linkGroups.tools} category="tools" />
                        <MobileAccordion {...linkGroups.safety} category="safety" />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
