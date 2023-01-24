import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { tokenAbi } from "../utils/tokenAbi";
export const useMetamask = () => {
  const [chain, setChain] = useState("");
  const [account, setAccount] = useState("");
  const [assets, setAssets] = useState([]);
  const addWalletlistener = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Instance web3 with the provided information
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        setChain(window.ethereum.chainId);
      });
    } else {
      setAccount("");
    }
  };
  const chainChangedHandler = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.on("chainChanged", (accounts) => {
        onLoad();
      });
    } else {
      setAccount("");
    }
  };
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
        console.log(error.message);
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
    console.log({ ether, tokenList, wallet, provider });
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
    console.log({ promiseResults, tokenAbi });
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
        throw new Error(error);
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

      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      if (fetchedAccount.length > 0) {
        const signer = provider.getSigner();
        let ether = await signer.getBalance();
        ether = ethers.utils.formatEther(ether, 18);
        setAccount(fetchedAccount[0]);
        setChain(window.ethereum.chainId);
        const tokenList = await getTokens(window.ethereum.chainId);
        const result = await getAllTokenBalances(
          ether,
          tokenList,
          fetchedAccount[0],
          provider
        );
        setAssets(result);
      }
    } else {
      console.log("Please connect the metamask wallet");
    }
  };

  useEffect(() => {
    addWalletlistener();
    chainChangedHandler();
    onLoad();
  }, []);

  return {
    onLoad,
    chain,
    account,
    connectToMetamask,
    assets,
  };
};
