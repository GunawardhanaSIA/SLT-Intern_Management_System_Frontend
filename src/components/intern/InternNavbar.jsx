import React from 'react'
import { FaUser } from "react-icons/fa";

const InternNavbar = ({title}) => {
  return (
    <div className="navbar bg-base-100 pt-1">
      <div className="flex-1">
        <a className="btn btn-ghost text-2xl text-zinc-600">{title}</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end flex gap-2 items-center">
          <button className="btn btn-ghost btn-circle flex items-center">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-zinc-600" 
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-success indicator-item"></span> 
            </div>
          </button>
          <div tabIndex={0}>
            <div className="w-8 rounded-full">
              <FaUser className='w-5 h-5 text-zinc-600'/>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}


export default InternNavbar