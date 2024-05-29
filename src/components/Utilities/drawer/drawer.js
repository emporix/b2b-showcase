import React, { useContext } from 'react'
import LayoutContext from '../../../pages/context'

const Drawer = ({ children }) => {
  const { showCart, setShowCart } = useContext(LayoutContext)

  return (
    <div
      className={
        'fixed overflow-hidden z-50 bg-black bg-opacity-50 inset-0 transform ease-in-out ' +
        (showCart
          ? 'transition-opacity opacity-100 duration-500 translate-x-0'
          : 'transition-all delay-500 opacity-0 translate-x-full  ')
      }
    >
      <section
        className={
          'max-w-full sm:max-w-[492px] min-w-full xs:min-w-[492px] right-0 absolute bg-bgGradient h-full shadow-2xl delay-400 duration-500 ease-in-out transition-all transform ' +
          (showCart ? ' translate-x-0 ' : ' translate-x-full ')
        }
      >
        <article className="relative p-8 flex flex-col space-y-6 overflow-y-auto h-full">
          {children}
        </article>
      </section>
      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          setShowCart(false)
        }}
      ></section>
    </div>
  )
}

export default Drawer
