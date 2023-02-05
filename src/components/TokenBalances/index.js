import { useState } from "react";

const TokenBalances = (props) => {
  console.log({ props });
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div class="flex flex-col">
        <p className="text-center text-2xl">SWAPPER</p>
        <div className="mt-4 px-4">
          <p> Account : {props.metamask.account}</p>
          <p>Chain : {props.metamask.chain}</p>
        </div>

        <div className="mt-4 px-4">
          <p>Switch Chain :</p>
          <div className="grid xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                props?.metamask.switchNetwork("0x1");
              }}
            >
              Ethereum Mainnet
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                props?.metamask.switchNetwork("0x89");
              }}
            >
              Polygon Mainnet
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                props?.metamask.switchNetwork("0x5");
              }}
            >
              Goerli testnet
            </div>
          </div>
        </div>

        <div className="mt-4 px-4">
          <p>Make Multihop Multicall Swap :</p>

          <div class="flex space-x-2 justify-center">
            <button
              data-modal-target="popup-modal"
              data-modal-toggle="popup-modal"
              onClick={() => {
                setShowModal(true);
              }}
              class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              Initiate Swap
            </button>

            {showModal && (
              <div
                id="popup-modal"
                tabindex="-1"
                class="fixed top-0 left-0 right-0 z-50  p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
              >
                <div class="relative w-full h-full max-w-md md:h-auto">
                  <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button
                      type="button"
                      class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                      data-modal-hide="popup-modal"
                    >
                      <svg
                        onClick={() => {
                          setShowModal(false);
                        }}
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-6 text-center">
                      <svg
                        aria-hidden="true"
                        class="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <h5 class="mb-5 text-xs font-normal text-gray-500 text-left dark:text-gray-400">
                        * In this swap multihop with multicall is experimented{" "}
                        <br />
                        * Try with polygon chain (low fee)
                        <br />* 0.05 USDC will be swapped to LINK and then to
                        WMATIC
                      </h5>
                      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want make this swap?
                      </h3>
                      <button
                        onClick={() => {
                          props?.metamask.multiHop();
                        }}
                        data-modal-hide="popup-modal"
                        type="button"
                        class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                        }}
                        type="button"
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div class="h-96 overflow-y-scroll">
              <table class="min-w-full">
                <thead class="border-b">
                  <tr>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Logo
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Symbol
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props?.metamask.assets.map((item) => {
                    return (
                      <tr class="border-b">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <img
                            alt={item?.symbol}
                            src={item?.logo}
                            className="h-10 w-10"
                          />
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item?.coinName}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item?.symbol}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item?.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};
export default TokenBalances;
