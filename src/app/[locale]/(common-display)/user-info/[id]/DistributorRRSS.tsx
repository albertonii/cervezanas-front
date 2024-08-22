import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInstagram,
    faFacebook,
    faLinkedin,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { IDistributorUser } from '@/lib/types/types';
import Link from 'next/link';

const urlIG = 'https://www.instagram.com/';
const urlFB = 'https://www.facebook.com/';
const urlLinkedIn = 'https://www.linkedin.com/in/';

interface Props {
    distributor: IDistributorUser;
}

const DistributorRRSS = ({ distributor }: Props) => {
    const { company_ig, company_fb, company_linkedin, company_website } =
        distributor;

    return (
        <div className="flex items-center justify-center absolute right-0 ">
            <div className="p-4 bg-beer-softBlonde shadow-md rounded-lg flex space-x-6 justify-center">
                {company_website && (
                    <div className="transform transition-all duration-300 hover:scale-125 hover:rotate-12 hover:cursor-pointer hover:text-beer-blonde">
                        <Link
                            href={`${company_website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faGlobe} size="2xl" />
                        </Link>
                    </div>
                )}

                {company_ig && (
                    <div className="transform transition-all duration-300 hover:scale-125 hover:rotate-12 hover:cursor-pointer hover:text-beer-blonde">
                        <Link
                            href={`${urlIG}${company_ig}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faInstagram} size="2xl" />
                        </Link>
                    </div>
                )}

                {company_fb && (
                    <div className="transform transition-all duration-300 hover:scale-125 hover:rotate-12 hover:cursor-pointer hover:text-beer-blonde">
                        <Link
                            href={`${urlFB}${company_fb}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faFacebook} size="2xl" />
                        </Link>
                    </div>
                )}

                {company_linkedin && (
                    <div className="transform transition-all duration-300 hover:scale-125 hover:rotate-12 hover:cursor-pointer hover:text-beer-blonde">
                        <Link
                            href={`${urlLinkedIn}${company_linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={faLinkedin} size="2xl" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorRRSS;
