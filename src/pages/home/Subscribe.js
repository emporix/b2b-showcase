import React from 'react';

const Subscribe = () => {
    return (
        <div className="subscribe px-4 py-12 sm:px-8 flex flex-col justify-center items-center gap-8 md:gap-12">
                <div
                    className="teaser__headline w-full md:w-3/4 lg:w-1/2 text-white">
                    Abonnieren Sie unseren Newsletter und erhalten sie die neuesten Nachrichten und Angebote
                </div>

                <form className="w-fit md:w-1/2 xl:w-1/3 grid grid-cols-2 grid-rows-2 gap-y-6 md:gap-y-4">
                    <label className='mr-2 justify-self-start self-center'>Vorname:</label>
                    <input className="p-2 rounded-md border-[3px] border-black" type="text"/>
                    <label className='mr-2 justify-self-start self-center'>E-Mail:</label>
                    <input className="p-2 rounded-md border-[3px] border-black" type="text"/>
                </form>

                <button
                    className="px-10 py-3.5 font-semibold bg-primary text-white border-[3px] border-black rounded-xl text-center font-inter text-[14px]">JETZT
                    ABONNIEREN
                </button>
            </div>
        
    );
}

export default Subscribe;
