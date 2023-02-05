import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import { tokenAbi } from "../utils/tokenAbi";
export const useMetamask = () => {
  const [chain, setChain] = useState("");
  const [account, setAccount] = useState("");
  const [assets, setAssets] = useState([]);

  const getAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts;
  };

  const getBalances = async (account) => {
    const accounts = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    return accounts;
  };

  const connectToMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Instance web3 with the provided information
      try {
        // Request account access
        let acc = await getAccount();
        let balance = await getBalances(acc[0]);
        console.log({ balance, acc });
        setAccount(acc[0]);
        setChain(window.ethereum.chainId);
      } catch (error) {
        console.log({ error });
      }
    } else {
      console.log("please install metamask");
    }
  };

  const map = {
    56: { name: "Binance", symbol: "BNB" },
    43114: { name: "Avalanche", symbol: "AVAX" },
    1: { name: "Ethereum", symbol: "ETH" },
    137: { name: "Polygon", symbol: "MATIC" },
    42161: { name: "Ethereum", symbol: "ETH" },
    10: { name: "Ethereum", symbol: "ETH" },
    5: { name: "Ethereum", symbol: "ETH" },
  };
  const convertToNumber = (hex, decimals = 18) => {
    if (!hex) return 0;
    return ethers.utils.formatUnits(hex, decimals);
  };
  const getAllTokenBalances = async (ether, tokenList, wallet, provider) => {
    console.log("getting all token balances");

    // array to store all balance requests
    let proms = [];
    // array to store balances
    let results = [
      {
        name: map[window.ethereum.networkVersion]?.name,
        symbol: map[window.ethereum.networkVersion]?.symbol,
        logo: ``,
        balance: Number(ether),
      },
    ];
    let sortedResult = [];
    for (const tkn of tokenList) {
      // create ERC20 token contract instance
      const erc20 = new ethers.Contract(tkn.address, tokenAbi, provider);
      // save request in array of Promises
      proms.push(erc20.balanceOf(wallet));
    }
    // actually requests all balances simultaneously
    const promiseResults = await Promise.allSettled(proms);
    // loop through all responses to format response
    for (let index = 0; index < promiseResults.length; index++) {
      if (promiseResults[index]?.value > 0) {
        // transforms balance to decimal
        const bal = convertToNumber(
          promiseResults[index]?.value,
          tokenList[index]?.decimals
        );
        // save balance with token name and symbol
        results.push({
          name: tokenList[index]?.name,
          symbol: tokenList[index]?.symbol,
          logo: tokenList[index]?.logoURI,
          balance: Number(bal),
        });
      }
    }
    sortedResult = results
      .sort(function (a, b) {
        return b?.balance - a?.balance;
      })
      ?.map((item) => {
        let obj = {
          logo: item?.logo,
          coinName: item?.name,
          symbol: item?.symbol,
          quantity: item?.balance?.toFixed(5),
        };
        return obj;
      });

    return sortedResult;
  };
  const TOKEN_LISTS = {
    "0x1":
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/ethereum.json",
    Avalanche:
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/avax.json",
    "0x38":
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/bsc.json",
    "0x89":
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json",
    "0x5":
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/goerli.json",
  };

  const getTokens = async (chain = "0x1") => {
    // get token list file URL by chain
    const tokenSource = TOKEN_LISTS[chain];
    // retrieve token list from URL
    const res = await fetch(tokenSource, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok || response.status === 404) {
          return response.json();
        } else if (response.status === 401 || response.status === 403) {
        } else {
          throw new Error(response?.message);
        }
      })
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.log({ errorInTokens: error });
        return [];
        // throw new Error(error);
      });
    // return list of tokens
    return res;
  };

  // function to maintain connection on refresh
  const onLoad = async () => {
    if (typeof window.ethereum !== "undefined") {
      const fetchedAccount = await window.ethereum.request({
        method: "eth_accounts",
      });
      //window.ethereum.selectedAddress; //window.ethereum._state.account;
      if (fetchedAccount) {
        setAccount(fetchedAccount[0]);
        setChain(window.ethereum.chainId);
        fetchTokens(fetchedAccount[0]);
      }
    } else {
      console.log("Please connect the metamask wallet");
    }
  };

  const fetchTokens = async (fetchedAccount) => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let ether = await signer.getBalance();
    ether = ethers.utils.formatEther(ether, 18);
    const tokenList = await getTokens(window.ethereum.chainId);
    const result = await getAllTokenBalances(
      ether,
      tokenList,
      fetchedAccount,
      provider
    );
    setAssets(result);
  };

  //"0x38" // bsc
  // "0x4"
  // 97 test bsc
  // switches network to the one provided
  const switchNetwork = async (chainId) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
    // refresh
    // window.location.reload();
  };

  const {
    abi: V3SwapRouterABI,
  } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
  const {
    abi: PeripheryPaymentsABI,
  } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IPeripheryPayments.sol/IPeripheryPayments.json");
  const {
    abi: MulticallABI,
  } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IMulticall.sol/IMulticall.json");

  const V3SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  // code for multihop

  const ADDR_SIZE = 20;
  const FEE_SIZE = 3;
  const OFFSET = ADDR_SIZE + FEE_SIZE;
  const DATA_SIZE = OFFSET + ADDR_SIZE;

  const encodePath = (path, fees) => {
    if (path.length !== fees.length + 1) {
      throw new Error("path/fee lengths do not match");
    }

    let encoded = "0x";
    for (let i = 0; i < fees.length; i++) {
      // 20 byte encoding of the address
      encoded += path[i].slice(2);
      // 3 byte encoding of the fee
      encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, "0");
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase();
  };

  const multiHop = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const uniswapContractInstance = new ethers.Contract(
      V3SwapRouterAddress,
      V3SwapRouterABI.concat(PeripheryPaymentsABI).concat(MulticallABI),
      signer
    );
    // const WETHAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
    // const USDCAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
    // const UNIAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

    const USDT = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
    const USDC = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
    const WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
    const LINK = "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39";
    const MATIC = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270";
    // [t1,fee,t2,fee2,t3,fee3,t4]
    console.log("encoding the path");

    const path = encodePath([USDC, LINK, MATIC], [3000, 3000]);
    const params = {
      path: path,
      recipient: account,
      deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      // amountIn: ethers.utils.parseEther("0.1"),
      amountIn: ethers.utils.parseUnits("0.05", 6), //multiply and make calc
      amountOutMinimum: 0,
    };

    const data = uniswapContractInstance.interface.encodeFunctionData(
      "exactInput",
      [params]
    );

    const multiCall = uniswapContractInstance.interface.encodeFunctionData(
      "multicall",
      [[data]]
    );
    console.log({ multiCall });
    let targs = {
      to: V3SwapRouterAddress,
      from: account,
      data: multiCall,
    };

    const gasBigNumber = await provider.estimateGas(targs);
    const gasLimit = BigNumber.from(gasBigNumber).toString();

    targs = { ...targs, gasLimit };
    console.log({ targs });

    const tx = await signer.sendTransaction(targs);
    const reciept = await tx.wait();
  };

  useEffect(() => {
    console.log("metamask hook getting called");
    onLoad();
    if (window.ethereum) {
      window.ethereum.on("chainChanged", onLoad);
      window.ethereum.on("accountsChanged", onLoad);
    }
    return () => {
      window.ethereum.removeListener("chainChanged", onLoad);
      window.ethereum.removeListener("accountsChanged", onLoad);
    };
  }, []);

  return {
    onLoad,
    chain,
    account,
    connectToMetamask,
    assets,
    metamaskAssetsLoading: false,
    switchNetwork,
    fetchTokens,
    multiHop,
  };
};
