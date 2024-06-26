import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/auth_services/instance";

export default function AddData({ isOpen, setIsOpen, tableReload }) {
  const [genre, setgenre] = useState("");
  const [is_excluded, setis_excluded] = useState(false);
  const [is_active, setis_active] = useState(true);
  const [updated_by, setupdated_by] = useState(1);
  const router = useRouter();

  const [errorgenre, seterrorgenre] = useState("");
  const [errorgenreCode, seterrorgenreCode] = useState("");

  const insertData = async () => {
    if (genre == "") {
      seterrorgenre("genre name required!");
    } else {
      seterrorgenre("");
    }

    if (genre != "") {
      const genre_changecase = genre.charAt(0).toUpperCase() + genre.slice(1);

      const data = {
        genre: genre_changecase,
        is_excluded,
        is_active,
        updated_by,
      };

      try {
        const res = await axiosInstance.post(
          process.env.API_SERVER + "genre",
          data
        );
        setIsOpen(false);
        setgenre("");
        setis_excluded(true);
        setis_active(true);
      } catch (error) {
        console.log(error);
      }
      tableReload();
      //router.refresh();
    }
  };

  useEffect(() => {
    setgenre("");
    setis_excluded(false);
    setis_active(true);
  }, [isOpen]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto w-[600px] rounded-[15px] bg-white overflow-hidden">
              <div className="p-6 bg-blue-500 text-white text-xl font-semibold">
                Add Genre
              </div>
              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white">
                    Genre Name
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => {
                      setgenre(e.target.value);
                      seterrorgenre("");
                    }}
                    placeholder="Genre Name"
                    className={
                      errorgenre != ""
                        ? "px-5 h-[45px] w-full bg-red-200 rounded-md outline-none placeholder:text-gray-500"
                        : "px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500"
                    }
                  />
                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white">
                    Eligible for Tax Credits
                  </label>
                  <select
                    defaultValue={"included"}
                    id="Eligible for Tax Credits"
                    onChange={(e) =>
                      setis_excluded(
                        e.target.value == "included" ? true : false
                      )
                    }
                    className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8"
                  >
                    <option value="excluded">Yes</option>
                    <option value="included">No</option>
                  </select>

                  <label className="block mb-0 text-sm font-medium text-gray-700 dark:text-white">
                    Is Active
                  </label>
                  <select
                    defaultValue={"active"}
                    id="is_active"
                    onChange={(e) =>
                      setis_active(e.target.value === "active" ? false : true)
                    }
                    className="px-5 h-[45px] w-full bg-gray-200 rounded-md outline-none placeholder:text-gray-500 border-r-8"
                  >
                    <option value="active">Active</option>
                    <option value="not_active">Inactive</option>
                  </select>
                </div>
                <div className="mt-4 flex gap-x-4 justify-end">
                  <button
                    className="px-6 py-2.5 bg-blue-500 text-white rounded-md"
                    onClick={insertData}
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2.5 bg-gray-400 text-white rounded-md"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
