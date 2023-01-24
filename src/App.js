import ConnectionCard from "./components/ConnectionCard";

function App() {
  return (
    <div
      className=" h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient( 109.6deg, rgba(156,252,248,1) 11.2%, rgba(110,123,251,1) 91.1% )",
      }}
    >
      <ConnectionCard />
    </div>
  );
}

export default App;
