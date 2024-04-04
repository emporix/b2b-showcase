/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { logout } from '../../redux/slices/authReducer'

import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'context/auth-provider'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AccountMenu(props) {
  const { userTenant } = useAuth()
  const dispatch = useDispatch()
  const logOut = () => {
    dispatch(logout())
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full    text-sm  text-black ">
        <HiOutlineUserCircle size={20} />
        <div className="pl-2">{props.name}</div>
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white  ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href={`/${userTenant}/my-account`}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray' : 'text-black',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  My account
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logOut}
                  className={classNames(
                    active ? 'bg-gray-100 text-gray' : 'text-black',
                    'block w-full text-left px-4 py-2 text-sm'
                  )}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
