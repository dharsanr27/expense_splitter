// // import { useTheme } from "./ThemeContext"; // adjust path
// // import "./Navbar.css";
// // import { useState } from "react";

// // const SunIcon = () => (
// //   <svg
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //   >
// //     <circle cx="12" cy="12" r="4.5" />
// //     <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
// //   </svg>
// // );

// // const MoonIcon = () => (
// //   <svg
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
// //   </svg>
// // );

// // const Navbar = () => {
// //   const { theme, toggleTheme } = useTheme();
// //   const [isOpen, setIsOpen]=useState(false);

// //   return (
// //     <nav className="gm-navbar ">
      
// //       <button
// //   className="md:hidden"
// //   onClick={() => setIsOpen(!isOpen)}
// // >
// //   ☰
// // </button>
// // {isOpen && (
// //   <div className="flex flex-col gap-4 bg-white p-4">
// //     <a href="/">Home</a>
// //     <a href="/about">About</a>
// //     <a href="/contact">Contact</a>
// //   </div>
// // )}
// // <span className="gm-navbar-brand">Expense-Split</span>
// //       <button
// //         type="button"
// //         className="gm-theme-toggle"
// //         onClick={toggleTheme}
// //         aria-label={
// //           theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
// //         }
// //       >
// //         {theme === "dark" ? <SunIcon /> : <MoonIcon />}
// //       </button>
// //     </nav>
// //   );
// // };

// // export default Navbar;


// //NEW -VERSION

// import { useState } from "react";
// import { useTheme } from "./ThemeContext";
// import {  useNavigate } from 'react-router-dom';
// import { supabase } from "@/lib/supabase";

// const SunIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     className="w-5 h-5"
//   >
//     <circle cx="12" cy="12" r="4.5" />
//     <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
//   </svg>
// );

// const MoonIcon = () => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="w-5 h-5"
//   >
//     <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
//   </svg>
// );

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [isOpen, setIsOpen] = useState(false);
//   const[err,setErr] = useState("")

//   const handleLogout= async () =>{
//     const {error} = await supabase.auth.signOut();
//     console.log(error);
//     if(error){
//          setErr(`${error.message}`)
//     }
//     else{
      
//       navigate('/');
//       setIsOpen(false);
      
//     }
//   }
  

//   return (
//     <>
//       {/* Navbar */}
//       <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-[var(--surface)] border-b border-[var(--border)]">
        
//         {/* Hamburger */}
//         <button
//           type="button"
//           onClick={() => setIsOpen(true)}
//           className=" text-[var(--ink)] text-2xl cursor-pointer"
//           aria-label="Open menu" 
//         >
//           ☰
//         </button>

//         {/* Logo */}
//         <span className="font-bold text-lg text-[var(--ink)]">
//           Expense-Split
//         </span>

//         {/* Theme toggle */}
//         <button
//           type="button"
//           onClick={toggleTheme}
//           className="text-[var(--ink)] p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
//           aria-label={
//             theme === "dark"
//               ? "Switch to light mode"
//               : "Switch to dark mode"
//           }
//         >
//           {theme === "dark" ? <SunIcon /> : <MoonIcon />}
//         </button>
//       </nav>

//       {/* Mobile menu */}
//       {isOpen && (
//         <>
//           {/* Blur + dark overlay */}
//           <div
//             className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
//             onClick={() => setIsOpen(false)}
//           />

//           {/* Side drawer */}
//           <aside className="fixed top-0 left-0 z-[70] h-screen w-3/4 max-w-sm bg-[var(--surface)] shadow-2xl p-6 flex flex-col">
            
//             {/* Close button */}
//             <button
//               type="button"
//               onClick={() => setIsOpen(false)}
//               className="ml-auto block text-2xl text-[var(--ink)] cursor-pointer"
//               aria-label="Close menu"
//             >
//               ✕
//             </button>

//             {/* Links */}
//             <div className="flex flex-col gap-6 mt-12">
//               <a
//                 href="/"
//                 onClick={() => setIsOpen(false)}
//                 className="text-lg text-[var(--ink)]"
//               >
//                 Home
//               </a>
             
//             </div>
//              <button type="button" onClick={handleLogout} className="mt-auto self-start cursor-pointer  text-[var(--ink)]">
//               Logout
//              </button>
            
             
            
//           </aside>
//         </>
//       )}
//     </>
//   );
// };

// export default Navbar;




//-New version -2,made it into three dots
import { useState } from "react";
import { useTheme } from "./ThemeContext";
import {  useNavigate } from 'react-router-dom';
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    className="w-5 h-5"
  >
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DotsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

const Navbar = () => {
  const {session}=useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const[err,setErr] = useState("")

  const handleLogout= async () =>{
    const {error} = await supabase.auth.signOut();
    console.log(error);
    if(error){
         setErr(`${error.message}`)
    }
    else{
      
      navigate('/');
      setIsOpen(false);
      
    }
  }
  

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5 bg-[var(--surface)] border-b border-[var(--border)]">
        
        {/* Three-dot menu */}
        {session ? (
            <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-[var(--ink)] p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            aria-label="Open menu"
          >
            <DotsIcon />
          </button>

          {isOpen && (
            <>
              {/* Click-outside overlay */}
              <div
                className="fixed inset-0 z-[60]"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <div className="absolute left-0 top-full mt-2 z-[70] min-w-[140px] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg py-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer flex items-center gap-2"
                >
                  <LogoutIcon/>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
        ):(<div className="w-8" />)
        }
      

        {/* Logo */}
        <span className="font-bold text-lg text-[var(--ink)]">
          Expense-Split
        </span>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="text-[var(--ink)] p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </>
  );
};

export default Navbar;