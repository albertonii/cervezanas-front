import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";

interface Props {
  counter: number;
  resultsPerPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PaginationFooter({
  counter,
  currentPage,
  resultsPerPage,
  setCurrentPage,
}: Props) {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);

  const finalElementPage =
    counter < currentPage * resultsPerPage
      ? counter
      : currentPage * resultsPerPage;

  const finalPage = Math.ceil(counter / resultsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsLoading(false);
      }, 200);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(counter / resultsPerPage)) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
      }, 200);
    }
  };

  if (isLoading)
    return (
      <>
        {/* Prev and Next button for pagination  */}
        <div className="my-4 flex items-center justify-around py-4">
          <Button
            class=""
            onClick={() => handlePrevPage()}
            small
            primary
            disabled
            isLoading={true}
          >
            {t("prev")}
          </Button>

          <p className="text-sm text-gray-400 dark:text-gray-400">
            {t("pagination_footer_nums", {
              from: currentPage,
              to: finalElementPage,
              total: counter,
            })}
          </p>

          <Button
            class=""
            onClick={() => handleNextPage()}
            small
            primary
            disabled
            isLoading={true}
          >
            {t("next")}
          </Button>
        </div>
      </>
    );

  return (
    <>
      {/* Prev and Next button for pagination  */}
      <div className="my-4 flex  items-center justify-around py-4">
        <Button
          class=""
          onClick={() => handlePrevPage()}
          small
          primary
          disabled={currentPage === 1}
        >
          {t("prev")}
        </Button>

        <p className="text-sm text-gray-700 dark:text-gray-400">
          {t("pagination_footer_nums", {
            from: currentPage,
            to: finalElementPage,
            total: counter,
          })}
        </p>

        <Button
          class=""
          onClick={() => handleNextPage()}
          small
          primary
          disabled={currentPage === finalPage}
        >
          {t("next")}
        </Button>
      </div>
    </>
  );
}
