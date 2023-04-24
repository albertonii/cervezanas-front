import Link from "next/link";
import DeleteModal from "../../modals/DeleteModal";
import React, { ComponentProps, useMemo, useState } from "react";
import { faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../utils";
import { supabase } from "../../../utils/supabaseClient";
import { IconButton } from "../../common";
import { Modal } from "../../modals";
import { ICPMobile } from "../../../lib/types.d";

interface Props {
  cpMobile: ICPMobile[];
  handleCPList: ComponentProps<any>;
}

enum SortBy {
  NONE = "none",
  USERNAME = "username",
  NAME = "name",
  LAST = "last",
  COUNTRY = "country",
  CREATED_DATE = "created_date",
}

export default function ListCPMobile({ cpMobile, handleCPList }: Props) {
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsCount = ps.filter((product) => !product.is_archived).length;
  const pageRange = 10;
  const finalPage =
    productsCount < currentPage * pageRange
      ? productsCount
      : currentPage * pageRange;

  const editColor = { filled: "#90470b", unfilled: "grey" };
  const deleteColor = { filled: "#90470b", unfilled: "grey" };

  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedCP, setSelectedCP] = useState<ICPMobile>();

  const handleEditClick = async (cp: ICPMobile) => {
    setIsEditModal(true);
    setSelectedCP(cp);
  };

  const handleDeleteClick = async (cp: ICPMobile) => {
    setIsDeleteModal(true);
    setSelectedCP(cp);
  };

  // Remove from mobile list
  const removeFromMobileList = (id: string) => {
    const newList = cpMobile.filter((item) => item.id !== id);
    handleCPList(newList);
  };

  // Delete CP Mobile from database
  const handleRemoveCP = async () => {
    const { error } = await supabase
      .from("cp_mobile")
      .delete()
      .eq("id", selectedCP?.id);

    if (error) throw error;
  };

  // Update to mobile list
  const updToMobileList = () => {
    const newList = cpMobile.map((item) => {
      if (item.id === selectedCP?.id) {
        return selectedCP;
      }
      return item;
    });

    handleCPList(newList);
  };

  // Update CP Mobile in database
  const handleUpdate = async () => {
    const { error } = await supabase
      .from("cp_mobile")
      .update({
        cp_name: selectedCP?.cp_name,
        cp_description: selectedCP?.cp_description,
        organizer_name: selectedCP?.organizer_name,
        organizer_lastname: selectedCP?.organizer_lastname,
        organizer_email: selectedCP?.organizer_email,
        organizer_phone: selectedCP?.organizer_phone,
        address: selectedCP?.address,
        is_booking_required: selectedCP?.is_booking_required,
        maximum_capacity: selectedCP?.maximum_capacity,
      })
      .eq("id", selectedCP?.id);

    if (error) throw error;
  };

  const filteredItems = useMemo<ICPMobile[]>(() => {
    return cpMobile.filter((mobile) => {
      return mobile.cp_name.toLowerCase().includes(query.toLowerCase());
    });
  }, [cpMobile, query]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (cp: ICPMobile) => any> = {
      [SortBy.NAME]: (cp) => cp.cp_name,
      [SortBy.CREATED_DATE]: (cp) => cp.created_at,
    };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleDelete = () => {
    if (!selectedCP) return;

    removeFromMobileList(selectedCP.id);
    handleRemoveCP();
    setIsDeleteModal(false);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg px-6 py-4 ">
      {isEditModal && (
        <Modal
          title={t("accept")}
          icon={faCheck}
          color={editColor}
          handler={async () => {
            handleUpdate();
            updToMobileList();
            setIsEditModal(false);
          }}
          handlerClose={() => setIsEditModal(false)}
          description={"accept_cp_description_modal"}
          classIcon={""}
          classContainer={""}
          btnTitle={t("accept")}
          showModal={isEditModal}
          setShowModal={setIsEditModal}
        >
          <></>
        </Modal>
      )}

      {isDeleteModal && (
        <DeleteModal
          title={t("delete")}
          handler={async () => {
            handleDelete();
          }}
          handlerClose={() => setIsDeleteModal(false)}
          description={t("delete_cp_description_modal")}
          btnTitle={t("accept")}
          showModal={isDeleteModal}
          setShowModal={setIsDeleteModal}
        />
      )}

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search by name..."
        />
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th
              scope="col"
              className="py-3 px-6 hover:cursor-pointer"
              onClick={() => {
                handleChangeSort(SortBy.NAME);
              }}
            >
              {t("name_header")}
            </th>

            <th
              scope="col"
              className="py-3 px-6 hover:cursor-pointer"
              onClick={() => {
                handleChangeSort(SortBy.CREATED_DATE);
              }}
            >
              {t("created_date_header")}
            </th>

            <th scope="col" className="py-3 px-6 "></th>

            <th scope="col" className="py-3 px-6 "></th>

            <th scope="col" className="py-3 px-6 ">
              {t("action_header")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedItems.map((cp: ICPMobile) => {
            return (
              <tr
                key={cp.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="py-4 px-6 text-beer-blonde font-semibold hover:text-beer-draft">
                  <Link href={`/cp_name`}>{cp.cp_name}</Link>
                </td>

                <td className="py-4 px-6">{formatDate(cp.created_at)}</td>

                <td className="py-4 px-6 cursor-pointer"></td>

                <td className="py-4 px-6 cursor-pointer"></td>

                <td className="py-4 px-6 flex space-x-2">
                  <IconButton
                    icon={faEdit}
                    onClick={() => {
                      handleEditClick(cp);
                    }}
                    color={editColor}
                    classContainer={
                      "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full"
                    }
                    classIcon={""}
                    title={t("edit")}
                  />

                  <IconButton
                    icon={faTrash}
                    onClick={() => {
                      handleDeleteClick(cp);
                    }}
                    color={deleteColor}
                    classContainer={
                      "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full "
                    }
                    classIcon={""}
                    title={t("delete")}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
