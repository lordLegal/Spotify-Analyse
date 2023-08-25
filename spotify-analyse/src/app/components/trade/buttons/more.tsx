"use client";
import { use, useState } from 'react';
import { VscAdd, VscChromeMinimize, VscEllipsis } from "react-icons/vsc";

export default function More() {

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
                    <VscEllipsis className="fas fa-cog stroke-2"></VscEllipsis>
                </button>
                <p className="text-white mt-2">More</p>
            </div>

            {isOpen && (
                <div>
                    <div
                        className="bg-black opacity-50 fixed inset-0"
                        onClick={handleCloseModal}
                    ></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50 ">

                        <div className="bg-zinc-900  p-8 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-2xl mb-4 text-green-500 font-bold">You want to Buy?!</h2>
                            <h3 className="mb-4 ">How much?</h3>
                            <button
                                onClick={handleCloseModal}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close Modal
                            </button>
                        </div>

                    </div>
                </div>
            )}




        </div>
    );
};


