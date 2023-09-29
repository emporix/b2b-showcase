import React from 'react';

const Subscribe = () => {
    return (
        <div className="subscribe my-3">
            <div>
                <div
                    className="pt-12 md:pt-24 w-2/3 max-w-[600px] font-semibold text-[32px] leading-[44px] md:text-[32px] md:leading-[48px] mx-auto">
                    Abonnieren Sie unseren Newsletter und erhalten sie die neuesten Nachrichten und Angebote
                </div>

                <div className="mt-3">
                    <form className="mb-3">
                        <label>Vorname:
                            <input type="text"/>
                        </label>
                    </form>
                    <form>
                        <label>E-Mail:
                            <input type="text"/>
                        </label>
                    </form>
                </div>

                <button
                    className="px-6 py-3.5 font-semibold bg-primary text-white rounded mt-6 md:mt-12  h-12 md:px-[55px] md:w-[240px] text-center font-inter text-[12px] leading-[24px]">JETZT
                    ABONNIEREN
                </button>
            </div>
        </div>
    );
}

export default Subscribe;
