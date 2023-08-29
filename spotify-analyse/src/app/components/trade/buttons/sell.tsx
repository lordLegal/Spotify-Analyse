"use client";
import { use, useState } from 'react';
import { VscChromeMinimize, VscChromeClose } from "react-icons/vsc";
import { sellHandler } from '../action/tradehandler';

export default function Sell(params: any) {

    let max = params.max;
    const coins = params.coins;
    const artist = params.artist;
    const user = params.user;
    console.log(max);

    if (isNaN(max)) {
        max = 0;
    }

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="text-center">
                <button onClick={handleOpenModal} className="bg-green-700 text-white p-4 rounded-full hover:bg-green-800">
                    <VscChromeMinimize className="fas fa-user stroke-2"></VscChromeMinimize>
                </button>
                <p className="text-white mt-2">Sell</p>
            </div>

            {isOpen && (
                <div>
                    <div
                        className="bg-black opacity-50 fixed inset-0"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 ">

                        <div className="bg-zinc-900 p-8 rounded-lg shadow-lg w-1/3 relative"> {/* Add relative positioning here */}
                            <button
                                onClick={handleCloseModal}
                                className="bg-green-800 text-white p-2 rounded-full hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-green-800 absolute top-4 right-4"
                            >
                                <VscChromeClose className="fas fa-times"></VscChromeClose>
                            </button>
                            <h2 className="text-2xl mb-4 text-green-500 font-bold">You want to Sell?!</h2>
                            <h3 className="mb-4 ">How much?</h3>
                            <p className="mb-4">You can Sell a maximum of {max} coins!</p>
                            <form action={sellHandler}>
                                <input type="hidden" name="artist_id" value={artist} />
                                <input type="hidden" name="user_id" value={user} />
                                <div className="mb-4">
                                    <input title='coins' type="hidden" name="coins" required
                                        value={max as string} className="mt-1 p-2 w-full border rounded-md text-black"></input>
                                </div>

                                <button type="submit" className="bg-zinc-800 border-2 border-zinc-800 hover:border-zinc-900 text-white font-bold py-2 px-4 rounded mb-5">Sell all you can!</button>
                            </form>
                            <form action={sellHandler}>
                                <input type="hidden" name="artist_id" value={artist} />
                                <input type="hidden" name="user_id" value={user} />
                                <div className="mb-4">
                                    <input title='coins' type="number" id="coins" name="coins" required
                                        min="1"
                                        max={max as string} className="mt-1 p-2 w-full border rounded-md text-black"></input>
                                </div>
                                <button type="submit" className="ml-48 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-5">Sell</button>
                            </form>
                        </div>

                    </div>
                </div>
            )}




        </div>
    );





};


