"use client"

import { FC } from "react"
import { useUserData } from "@/hooks/useUserData"

const MenuButton: FC = () => {
  const { user, setUser } = useUserData()

  const toggleNav = () => {
    setUser({
      ...user,
      states: {
        ...user.states,
        isNav: !user.states.isNav,
      },
    })
  }

  return (
    <button
      onClick={(toggleNav)}
      className="absolute top-4 left-4 z-50 p-2 bg-white text-gray-800 font-bold rounded-md shadow-lg hover:bg-amber-400 hover:text-white transition-colors duration-300 group"
    >
      <div className="w-8 h-[26px] relative">
        <span
          className={`block absolute h-0.5 w-full bg-gray-800 transform transition duration-300 ease-in-out group-hover:bg-white ${
            user.states.isNav ? "rotate-45 top-3" : "top-1"
          }`}
        ></span>
        <span
          className={`block absolute h-0.5 w-full bg-gray-800 transform transition duration-300 ease-in-out group-hover:bg-white ${
            user.states.isNav ? "opacity-0" : "top-3"
          }`}
        ></span>
        <span
          className={`block absolute h-0.5 w-full bg-gray-800 transform transition duration-300 ease-in-out group-hover:bg-white ${
            user.states.isNav ? "-rotate-45 top-3" : "top-5"
          }`}
        ></span>
      </div>
    </button>
  )
}

export default MenuButton