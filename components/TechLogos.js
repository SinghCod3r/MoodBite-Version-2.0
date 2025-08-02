// components/TechLogos.js

// A simple container for our logos
const Icon = ({ children }) => <div className="w-12 h-12 rounded-lg bg-white/90 text-black flex items-center justify-center">{children}</div>;

export const NextjsLogo = () => <Icon><svg className="w-8 h-8" fill="none" viewBox="0 0 121 118"><path fill="#000" d="M120.5 118V0L45.5 73.5V118h75Z M0 0v118h43.5V44L0 0Z"></path></svg></Icon>;
export const GeminiLogo = () => <Icon><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.082 13.918L10 16.5l-1.082-2.582L6.336 13l2.582-1.082L10 9.336l1.082 2.582L13.664 13l-2.582 1.082zm6.664.5L16.5 11.836l-1.246-2.582L12.672 10.5l2.582 1.246L16.5 14.33l1.246-2.584L20.328 10.5l-2.582-1.246zM12 2a10 10 0 100 20 10 10 0 000-20z"></path></svg></Icon>;
export const HuggingFaceLogo = () => <Icon><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.25 15.6a.75.75 0 00.55-1.3l-3.32-2.8V7.5a.75.75 0 00-1.5 0v3.38l-2.1-1.78a.75.75 0 00-.96 1.14L15.3 12l-2.38 2.02a.75.75 0 00.96 1.14l2.1-1.78v3.38a.75.75 0 001.5 0V13.5l3.32-2.8a.75.75 0 00.55 1.3zM8.33 12l2.38-2.02a.75.75 0 00-.96-1.14L7.65 10.62V7.5a.75.75 0 00-1.5 0v3.38L3.77 8.08a.75.75 0 00-.96 1.14L5.19 12l-2.38 2.02a.75.75 0 00.96 1.14l2.1-1.78v3.38a.75.75 0 001.5 0v-3.38l2.38 2.02a.75.75 0 00.96-1.14L8.33 12z"></path></svg></Icon>;
export const PexelsLogo = () => <Icon><svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm6 6v10h10V9H9z"></path></svg></Icon>;