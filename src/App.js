import ConnectionCard from "./components/ConnectionCard";
import TokenBalances from "./components/TokenBalances";
import { useMetamask } from "./hooks/accountAndChain";

function App() {
  const metamask = useMetamask();

  return (
    <div
      className={`h-screen flex flex-wrap items-center justify-center`}
      style={{
        backgroundImage:
          "linear-gradient( 109.6deg, rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1% )",
      }}
    >
      {!metamask.account ? (
        <ConnectionCard metamask={metamask} />
      ) : (
        <TokenBalances metamask={metamask} />
      )}
    </div>
  );
}

export default App;
