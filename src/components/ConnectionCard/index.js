import { useEffect, useState } from "react";
import { useMetamask } from "../../hooks/accountAndChain";
import Pic from "../../assets/swapbg.png";
const ConnectionCard = () => {
  const metamask = useMetamask();

  useEffect(() => {
    metamask.onLoad();
  }, []);

  console.log({ metamask });

  return (
    <div className="flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl rounded-2xl bg-white">
        <figure>
          <img src={Pic} alt="Shoes" className="rounded-2xl" />
        </figure>
        <div className="card-body px-4">
          <h2 className="card-title mt-4">Hey Buddy !</h2>
          <p>Welcome to the SWAPPER</p>

          <div className="flex flex-wrap justify-center my-10">
            {!metamask.account && (
              <button
                onClick={() => {
                  metamask.connectToMetamask();
                }}
                type="button"
                className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                {metamask.account ? "Connected" : "Connect Metamask"}
              </button>
            )}
            {metamask.account && (
              <div className="mt-4 px-4">
                <p>Connected Account :</p>
                <p>{metamask.account}</p>
                <p>Chain : {metamask.chain}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
