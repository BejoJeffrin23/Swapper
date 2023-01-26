import Pic from "../../assets/swapbg.png";
const ConnectionCard = (props) => {
  return (
    <div className="flex flex-wrap items-center justify-center sm:px-4 md:px-10">
      <div>
        <div className="card xs:max-w-xs  bg-base-100 shadow-xl rounded-2xl bg-white">
          <figure>
            <img src={Pic} alt="Shoes" className="rounded-2xl" />
          </figure>
          <div className="card-body px-4">
            <h2 className="card-title mt-4">Hey Buddy !</h2>
            <p>Welcome to the SWAPPER</p>

            <div className="flex flex-wrap justify-left my-10">
              {!props?.metamask.account && (
                <button
                  onClick={() => {
                    props.metamask.connectToMetamask();
                  }}
                  type="button"
                  className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  {props.metamask.account ? "Connected" : "Connect Metamask"}
                </button>
              )}
              {props.metamask.account && (
                <div className="mt-4 px-4">
                  <p>
                    {" "}
                    Account : {props.metamask.account.substr(0, 6)}....
                    {props.metamask.account.slice(-7)}
                  </p>
                  <p>Chain : {props.metamask.chain}</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default ConnectionCard;
