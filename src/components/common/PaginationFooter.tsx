import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

interface Props {
  counter: number;
  pageRange: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PaginationFooter({
  counter,
  currentPage,
  setCurrentPage,
}: Props) {
  const { t } = useTranslation();

  const pageRange = 10;
  const finalPage =
    counter < currentPage * pageRange ? counter : currentPage * pageRange;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(counter / pageRange)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      {/* Prev and Next button for pagination  */}
      <div className="my-4 flex  items-center justify-around py-4">
        <Button class="" onClick={() => handlePrevPage()} small primary>
          {t("prev")}
        </Button>

        <p className="text-sm text-gray-700 dark:text-gray-400">
          {t("pagination_footer_nums", {
            from: currentPage,
            to: finalPage,
            total: counter,
          })}
        </p>

        <Button class="" onClick={() => handleNextPage()} small primary>
          {t("next")}
        </Button>
      </div>
    </>
  );
}
