import React, { createContext, useContext, useState } from 'react'
import { LuMenu } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const SidebarContext = createContext()

export default function AdminSidebar({children}) {
    const [expanded, setExpanded] = useState(true)

  return (
    <aside className='h-screen'>
        <nav className='h-full flex flex-col border-r border-zinc-200 shadow-sm '>
            <div className='px-4 pt-2 pb-10 flex justify-between items-center'>
                <img 
                    src="/logo.png" 
                    className={`overflow-hidden transition-all ${expanded ? "w-36": "w-0 pb-12"}`} 
                    alt="logo" />
                <button 
                    onClick={() => setExpanded(curr => !curr)} 
                    className='p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100'>
                        <LuMenu className='text-xl text-zinc-600'/>
                </button>
            </div>

            <SidebarContext.Provider value={{expanded}}>
                <ul className='flex-1 px-3'>{children}</ul>
            </SidebarContext.Provider>

            <div className='border-t border-zinc-200 flex p-3'>
                <FaUserAlt className='w-10 h-10 rounded-lg p-1.5 border-1.5 text-zinc-600'/>
                <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3": "w-0"}`}>
                    <div className='leading-4'>
                        <h4 className='font-semibold text-zinc-600'>Admin</h4>
                        <span className='text-xs text-zinc-600'>admin@gmail.com</span>
                    </div>
                    <FiLogOut className='text-2xl text-zinc-600'/>
                </div>
            </div>
        </nav>
    </aside>
  )
}

export function AdminSidebarItem({icon, text, active, alert}) {
    const {expanded} = useContext(SidebarContext)
    return (
        <li
            className={`
                relative flex items-center py-2 px-3 my-3
                font-medium rounded-md cursor-pointer
                transition-colors group
                ${
                    active
                        ? "bg-[#f0f7fd] text-blue"
                        : "hover:text-blue text-zinc-600"
                }
            `}
        >
            {icon}
            <span className={`overflow-hidden whitespace-nowrap transition-all ${expanded ? "w-52 ml-3": "w-0"}`}>{text}</span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-green ${expanded ? "" : "top-2"}`}/>
            )}

            {!expanded && (
                <div
                    className={`
                        absolute left-full rounded-md px-2 py-1 ml-6
                        bg-[#f0f7fd] text-blue text-sm
                        invisible opacity-20 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                        whitespace-nowrap
                    `}
                >
                    {text}
                </div>
            )}
        </li>
    )
}
