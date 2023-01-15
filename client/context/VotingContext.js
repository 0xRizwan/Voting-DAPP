
import React,{ useState, useEffect } from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";

import { contractAddress, contractABI} from "./constants"
import candidateList from "./Voting.json"

const fetchContract = (signerOrProvider) => new ethers.Contract(contractAddress, contractABI, signerOrProvider)

export const VotingContext = React.createContext();

export const VotingProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [Loading, setLoading] = useState(false);
    const [candidate, setCandidate] = useState("")
    const [winnerName, setWinnerName] = useState("")

    const checkIsWalletConnected = async () => {
        if(!window.ethereum)
           return alert("Please install Metamask");

        const accounts = await window.ethereum.request({method: "eth_accounts"});

        if(accounts.length) {
            setCurrentAccount(accounts[0])
        } else {
            alert("No accounts found")
        }
        console.log(accounts)
    }

    useEffect(() => {
        checkIsWalletConnected();
    },[])

    const connectWallet = async() => {
        if(!window.ethereum)
           return alert("Please install Metamask");

        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        setCurrentAccount(accounts[0]);
        window.location.reload();

    }

    const connectingWithContract = async () => {
        try {
          const web3modal = new Web3Modal();
          const connection = await web3modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const signer = provider.getSigner();
          const contract = fetchContract(signer);
          return contract;
        } catch (error) {
          console.log(error);
        }
      };

    const registerCandidates = async(_name, _age, _candidateAddress) => {
        try {
            const contract = await connectingWithContract();
            const registerCandidate = await contract.registerCandidates(_name, Number(_age), _candidateAddress);
            // setLoading(true);
            await registerCandidate.wait();
            // setLoading(false);
            window.location.reload();
        } 
        catch (error) {
            alert("Error while registering candidate") 
        }
    }

    const whiteListAddress = async(_voterAddress) => {
        try {
            const contract = await connectingWithContract();
            const whiteListAddress = await contract.whiteListAddress(_voterAddress);
            console.log(whiteListAddress)
            setLoading(true);
            await whiteListAddress.wait();
            setLoading(false);
            window.location.reload();
        } catch (error) {
            alert("Error while whiteListing voter addresses")
        }
    }

    const startVoting = async() => {
        try {
            const contract = await connectingWithContract();
            const startVoting = await contract.startVoting();
            setLoading(true);
            await startVoting.wait();
            setLoading(false);
            window.location.reload();

        } catch (error) {
            alert("Error while start voting")
        }
    }

    const stopVoting = async() => {
        try {
            const contract = await connectingWithContract();
            const stopVoting = await contract.stopVoting();
            setLoading(true);
            await stopVoting.wait();
            setLoading(false);
            window.location.reload();

        } catch (error) {
            alert("Error while stop voting")
        }
    }

    const vote = async(_candidateAddress) => {
        try {
            const contract = await connectingWithContract();
            const vote = await contract.vote(_candidateAddress);
            setLoading(true);
            await vote.wait();
            setLoading(false);
            window.location.reload();
            
        } catch (error) {
            alert("Error while voting the candidate")
        }
    }

    const getAllCandidate = async() => {
        try {
            const contract = await connectingWithContract();
            const getAllCandidate = await contract.getAllCandidate();

            for(let i=1; i<getAllCandidate.length; i++){
                candidateList.push(getAllCandidate[i])
            }
    
            setLoading(true);
            await getAllCandidate.wait();
            setLoading(false);
            window.location.reload();
            
        } catch (error) {
            alert("Error while loading the candidates")
        }
    }

    const votingStatus = async() => {
        try {
            const contract = await connectingWithContract();
            const votingStatus = await contract.votingStatus();
            setLoading(true);
            await votingStatus.wait();
            setLoading(false);
            window.location.reload();
            
        } catch (error) {
            alert("Error while fethching voting status")
        }
    }

    const winner = async() => {
        try {
            const contract = await connectingWithContract();
            const winner = await contract.winner();
            setWinnerName(winner.name);
            setLoading(true);
            await winner.wait();
            setLoading(false);
            window.location.reload();
            
        } catch (error) {
            alert("Error while picking winner")
        }
    }


    return(
        <VotingContext.Provider value={{registerCandidates, connectWallet, whiteListAddress, startVoting, stopVoting, vote, getAllCandidate, votingStatus, winner}} >{children}
        </VotingContext.Provider>
    )
}