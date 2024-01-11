import React from 'react';

const Subscribe = () => {
    return (
        <div className="subscribe p-4 flex flex-col justify-center items-center gap-12">
                <div
                    className="teaser__headline w-1/2 text-white">
                    Abonnieren Sie unseren Newsletter und erhalten sie die neuesten Nachrichten und Angebote
                </div>

                <form className="w-fit grid grid-cols-2 grid-rows-2 gap-y-6">
                    <label className='mr-2 justify-self-start self-center'>Vorname:</label>
                    <input className="p-2 rounded-md" type="text"/>
                    <label className='mr-2 justify-self-start self-center'>E-Mail:</label>
                    <input className="p-2 rounded-md" type="text"/>
                </form>

                <button
                    className="px-10 py-3.5 font-semibold bg-primary text-white border-[3px] border-black rounded-lg text-center font-inter text-[14px]">JETZT
                    ABONNIEREN
                </button>
            </div>
        
    );
}

export default Subscribe;
