import React, { ComponentProps } from "react";
import { capitalizeFirstLetter } from "../../utils";

interface Props {
  content: string;
  handleRemove: ComponentProps<any>;
}
export function ChipCard({ content, handleRemove }: Props) {
  return (
    <div className="flex justify-center items-center m-1 font-medium py-2 px-3 bg-beer-draft rounded-full text-beer-foam border border-beer-blonde ">
      <span className="text-md font-normal leading-none max-w-full flex-initial ">
        {capitalizeFirstLetter(content)}
      </span>

      <div
        className="flex flex-auto flex-row-reverse"
        onClick={() => handleRemove()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-x cursor-pointer hover:text-beer-blonde rounded-full w-4 h-4 ml-2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
    // <div className="p-5">
    //   <div className="flex flex-wrap justify-center">
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //     </div>
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-blue-700 bg-blue-100 border border-blue-300 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //     </div>
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-pink-700 bg-pink-100 border border-pink-300 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //     </div>

    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-red-100 bg-red-700 border border-red-700 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //     </div>
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-orange-100 bg-orange-700 border border-orange-700 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //     </div>
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-green-700 bg-green-100 border border-green-300 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //     </div>
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-indigo-100 bg-indigo-700 border border-indigo-700 ">
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //       <div className="flex flex-auto flex-row-reverse">
    //         <div>
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="100%"
    //             height="100%"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //             stroke-width="2"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             className="feather feather-x cursor-pointer hover:text-indigo-400 rounded-full w-4 h-4 ml-2"
    //           >
    //             <line x1="18" y1="6" x2="6" y2="18"></line>
    //             <line x1="6" y1="6" x2="18" y2="18"></line>
    //           </svg>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-yellow-100 bg-yellow-700 border border-yellow-700 ">
    //       <div slot="avatar">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="100%"
    //           height="100%"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           stroke="currentColor"
    //           stroke-width="2"
    //           stroke-linecap="round"
    //           stroke-linejoin="round"
    //           className="feather feather-heart w-3 mr-1"
    //         >
    //           <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    //         </svg>
    //       </div>
    //       <div className="text-xs font-normal leading-none max-w-full flex-initial">
    //         Hello!
    //       </div>
    //       <div className="flex flex-auto flex-row-reverse">
    //         <div>
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="100%"
    //             height="100%"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //             stroke="currentColor"
    //             stroke-width="2"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             className="feather feather-x cursor-pointer hover:text-yellow-400 rounded-full w-4 h-4 ml-2"
    //           >
    //             <line x1="18" y1="6" x2="6" y2="18"></line>
    //             <line x1="6" y1="6" x2="18" y2="18"></line>
    //           </svg>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
