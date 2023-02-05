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

            <div
              className={`flex flex-wrap ${
                !props?.metamask.account ? "justify-center" : "justify-left"
              } my-10`}
            >
              <button
                onClick={() => {
                  props.metamask.connectToMetamask();
                }}
                type="button"
                className=" inline-block mb-4 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                {props.metamask.account ? "Connected" : "Connect Metamask"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
