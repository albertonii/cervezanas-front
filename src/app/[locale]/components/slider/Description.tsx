import React from 'react';
import { images } from './constants';
import left from '/public/slider/left.svg';
import right from '/public/slider/right.svg';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
    activeImage: any;
    clickNext: any;
    clickPrev: any;
};

const Description = ({ activeImage, clickNext, clickPrev }: Props) => {
    return (
        <div className="flex place-items-start w-full h-[300px] absolute z-10">
            {images.map((elem, idx) => (
                <div
                    key={idx}
                    className={`${
                        idx === activeImage
                            ? 'block w-full py-20 md:px-20 px-10 text-center'
                            : 'hidden'
                    }`}
                >
                    <motion.div
                        initial={{
                            opacity: idx === activeImage ? 0 : 0.5,
                        }}
                        animate={{
                            opacity: idx === activeImage ? 1 : 0.5,
                        }}
                        transition={{
                            ease: 'linear',
                            duration: 1,
                            x: { duration: 1 },
                        }}
                        className="w-full"
                    >
                        <div className="pt-6 pb-2 text-6xl text-white font-bold font-['NexaRust-script']">
                            {elem.title}
                        </div>
                        <div className="leading-relaxed font-medium text-xl tracking-wide italic text-white max-w-[580px] m-auto">
                            {' '}
                            {elem.desc}
                        </div>
                    </motion.div>

                    <button className="bg-[#ecae7e] text-white uppercase px-4 py-2 rounded-md my-10 hidden">
                        order now
                    </button>
                    <div className="absolute md:bottom-1 bottom-10 right-10 md:right-0 w-full flex justify-center items-center">
                        <div
                            className="absolute bottom-2 right-10 cursor-pointer"
                            onClick={clickPrev}
                        >
                            <Image src={left} alt="" />
                        </div>

                        <div
                            className="absolute bottom-2 right-2 cursor-pointer"
                            onClick={clickNext}
                        >
                            <Image src={right} alt="" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Description;
