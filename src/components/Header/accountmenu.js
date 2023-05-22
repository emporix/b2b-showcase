import {useEffect, useRef, useState} from 'react';
import { NavLink } from "react-router-dom";
import { HiOutlineUserCircle, HiChevronDown } from "react-icons/hi";
import { useAuth } from 'context/auth-provider'

export default function AccountMenu(props) {
  const { userTenant, logout } = useAuth()

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuRef.current]);

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-center w-full text-sm text-white focus:outline-none"
            >
                <HiOutlineUserCircle size={20} />
                <div className="pl-2">{props.name}</div>
                <HiChevronDown size={20} className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </button>

                <div className={`${isOpen ? " opacity-100" : "invisible opacity-0"} origin-top-right absolute bg-g right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-black ring-opacity-5 focus:outline-none transition-opacity duration-600`}>
                    <div className="py-1">
                        <NavLink
                            to={`/${userTenant}/my-account`}
                            className={({ isActive }) =>
                                `${isActive ? 'bg-gray-100 text-darkGray' : 'text-black'} hover:text-darkGray block px-4 py-2 text-sm`
                            }
                        >
                            My account
                        </NavLink>
                        <button
                            onClick={logout}
                            className='text-black hover:text-darkGray bg-white block w-full text-left px-4 py-2 text-sm'
                        >
                            Sign out
                        </button>
                    </div>
                </div>

        </div>
    );
}