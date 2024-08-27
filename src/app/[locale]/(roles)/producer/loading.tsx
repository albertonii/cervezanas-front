import Image from 'next/image';
import DisplayImageProfile from '@/app/[locale]/components/common/DisplayImageProfile';
import SidebarSkeleton from '@/app/[locale]/components/skeletons/SidebarSkeleton';

export default function loading() {
    return (
        <section className="relative flex w-full ">
            <SidebarSkeleton />

            <section className="h-full w-full">
                {/* Background Image */}
                <section
                    className="relative h-full w-full bg-bear-alvine border-b-8 border-cerv-coal shadow-lg"
                    aria-label="Custom Header"
                >
                    <Image
                        className="max-h-[20vh] w-full object-cover md:max-h-[25vh]"
                        width={1260}
                        height={240}
                        src={'/assets/producer_layout_bg.jpg'}
                        alt={'background custom image'}
                    />
                    {/* Profile Image */}
                    <section
                        className="absolute bottom-28 w-48 space-x-2 pl-10 sm:w-64 sm:pl-24"
                        aria-label="Logo"
                    >
                        <figure className="relative">
                            <DisplayImageProfile
                                imgSrc={'/assets/producer_layout_bg.jpg'}
                                class={
                                    'absolute h-24 w-24 rounded-full sm:h-36 sm:w-36'
                                }
                            />

                            {/* Gamification experiencie  */}
                            <div className="absolute -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-beer-dark sm:-left-4 sm:-top-4 sm:h-14 sm:w-14">
                                <div className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-beer-blonde sm:h-10 sm:w-10">
                                    <p className="text-md font-semibold text-white">
                                        1
                                    </p>
                                </div>
                            </div>
                        </figure>
                    </section>

                    {/* Username and experience level */}
                    <section className="absolute bottom-4 right-10 flex flex-col items-center justify-center gap-4 rounded-xl bg-beer-draft bg-opacity-90 shadow-lg sm:-bottom-4 sm:left-[50%] sm:right-[50%] sm:w-[10rem] sm:-translate-x-[5rem] sm:p-4">
                        <p className="text-md font-semibold text-white">
                            username
                        </p>
                        <p className="text-lg font-semibold text-white">
                            1400 XP
                        </p>
                    </section>
                </section>

                <div
                    className="w-full bg-[url('/assets/lúpulo-horizontal.png')] bg-auto bg-top bg-no-repeat sm:pt-[5vh] md:pt-[5vh] h-[88vh]"
                    aria-label="Container Producer settings"
                ></div>
            </section>
        </section>
    );
}
