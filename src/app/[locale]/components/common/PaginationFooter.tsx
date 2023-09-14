import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  console.log(counter);

  const [isLoading, setIsLoading] = useState(false);

  const lastElementPage =
    counter < currentPage * resultsPerPage
      ? counter
      : currentPage * resultsPerPage;

  const finalPage = Math.ceil(counter / resultsPerPage);

  const handlePrevPage = () => {
    if (!isLoading && currentPage > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsLoading(false);
      }, 200);
    }
  };

  const handleNextPage = () => {
    if (!isLoading && currentPage < Math.ceil(counter / resultsPerPage)) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
      }, 200);
    }
  };

  const renderPaginationButtons = () => (
    <footer className="max-1/2 lg:max-w-3/4 my-4 flex items-center justify-center gap-4 py-4">
      <Button
        onClick={() => handlePrevPage()}
        small
        box
        primary
        disabled={isLoading || currentPage === 1}
      >
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          style={{ color: "#432a14" }}
          title={"chevron_circle_left"}
          width={20}
          height={20}
          className={`rotate-180`}
        />
      </Button>

      <p className="text-lg text-gray-400 dark:text-gray-400">
        {t("pagination_footer_nums", {
          from: currentPage,
          to: lastElementPage,
          total: counter,
        })}
      </p>

      <Button
        onClick={() => handleNextPage()}
        box
        small
        primary
        disabled={isLoading || currentPage === finalPage}
      >
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          style={{ color: "#432a14" }}
          title={"chevron_circle_right"}
          width={30}
          height={30}
          className={``}
        />
      </Button>
    </footer>
  );

  return <>{renderPaginationButtons()}</>;
}
