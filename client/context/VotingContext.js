
import React,{ useState, useEffect } from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import { providers, Contract } from "ethers";
import { useRef} from "react";

import { contractAddress, contractABI} from "./constants"
import candidateList from "./Voting.json"

const fetchContract = (signerOrProvider) => new ethers.Contract(contractAddress, contractABI, signerOrProvider)

export const VotingContext = React.createContext();

export const VotingProvider = ({children}) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [candidateList, setCandidateList] = useState([])
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [address, setAddress] = useState("");
    const [voterAddress, setVoterAddress] = useState("")
    const [winner, setWinner] = useState("")
    const [vote, setVote] = useState("");


    const web3ModalRef = useRef();
  
  
    const getProviderOrSigner = async (needSigner = false) => {
      const connection = await web3ModalRef.current.connect();
      const provider = new providers.Web3Provider(connection);
  
      const { chainId } = await provider.getNetwork();
      if (chainId !== 5) {
        window.alert("Change the network to Goerli");
        throw new Error("Change network to Goerli");
      }
  
      if (needSigner) {
        const signer = provider.getSigner();
        return signer;
      }
      return provider;
    };
  
   
    const connectWallet = async () => {
      try {
        await getProviderOrSigner();
        setWalletConnected(true);
        setIsUserLoggedIn(true)
  
      } catch (err) {
        console.error(err);
      }
    };
  
    
    useEffect(() => {
      if (!walletConnected) {
        web3ModalRef.current = new Web3Modal({
          network: "goerli",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        connectWallet();
      }
  
    }, [walletConnected])

    const registerCandidates = async(e) => {
        // To avoid refresh, use e.preventDefault()
        e.preventDefault()

        let candidate = {
            name: name,
            age: age,
            address: address
        }

        try {
            const signer = await getProviderOrSigner(true);
            const VotingContract = fetchContract(signer);
            const registerCandidate = await VotingContract.registerCandidates(candidate.name, candidate.age, candidate.address);
            setCandidateList([...candidateList, candidate])
            console.log("Candidate is registered successfully")
            console.log(registerCandidate)
            setLoading(true);
            await registerCandidate.wait();
            setLoading(false);
            window.location.reload();

        } 
        catch (error) {
            alert("Error while registering candidate") 
        }
        setName("");
        setAge("");
        setAddress("");
    }


    const whiteListAddress = async(e) => {
        // To avoid refresh, use e.preventDefault()
        e.preventDefault()

        let voter = {
            address: voterAddress
        }

        try {
            const signer = await getProviderOrSigner(true);
            const VotingContract = fetchContract(signer);
            const whiteListAddress = await VotingContract.whiteListAddress(voter.address);
            setVoterAddress(voter)
            console.log("Voter is registered successfully")
            setLoading(true);
            await whiteListAddress.wait();
            setLoading(false);
            window.location.reload();
        } 
        catch (error) {
            alert("Error while registering voter") 
        }
        setVoterAddress("");
    }
    

    const startVoting = async() => {
        try {
            const signer = await getProviderOrSigner(true);
            const VotingContract = fetchContract(signer);
            const startVoting = await VotingContract.startVoting();
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
            const signer = await getProviderOrSigner(true);
            const VotingContract = fetchContract(signer);
            const stopVoting = await VotingContract.stopVoting();
            setLoading(true);
            await stopVoting.wait();
            setLoading(false);
            window.location.reload();

        } catch (error) {
            alert("Error while stop voting")
        }
    }

    const voteCandidate = async(e) => {
         // To avoid refresh, use e.preventDefault()
         e.preventDefault()

         let candidate = {
             address: address
         }
 
         try {
             const signer = await getProviderOrSigner(true);
             const VotingContract = fetchContract(signer);
             const voteCandidate = await VotingContract.vote(candidate.address);
             setVote(voteCandidate)
             console.log("You have voted successfully")
             setLoading(true);
             await voteCandidate.wait();
             setLoading(false);
             window.location.reload();
         } 
         catch (error) {
             alert("Error while voting candidate") 
         }
     }

    // const getAllCandidate = async() => {
    //     try {
    //         const contract = await connectingWithContract();
    //         const getAllCandidate = await contract.getAllCandidate();

    //         for(let i=1; i<getAllCandidate.length; i++){
    //             candidateList.push(getAllCandidate[i])
    //         }
    
    //         setLoading(true);
    //         await getAllCandidate.wait();
    //         setLoading(false);
    //         window.location.reload();
            
    //     } catch (error) {
    //         alert("Error while loading the candidates")
    //     }
    // }

    // const votingStatus = async() => {
    //     try {
    //         const contract = await connectingWithContract();
    //         const votingStatus = await contract.votingStatus();
    //         setLoading(true);
    //         await votingStatus.wait();
    //         setLoading(false);
    //         window.location.reload();
            
    //     } catch (error) {
    //         alert("Error while fethching voting status")
    //     }
    // }

    const getWinner = async(e) => {
        e.preventDefault()

        try {
            const signer = await getProviderOrSigner(true);
            const VotingContract = fetchContract(signer);
            const getWinner = await VotingContract.getWinner();
            setWinner(getWinner.name);
            setLoading(true);
            await winner.wait();
            setLoading(false);
            
        } catch (error) {
            alert("Error while picking winner")
        }
    }


    return(
        <VotingContext.Provider value={{connectWallet,candidateList, name, setName, age, setAge, address, setAddress, registerCandidates, voterAddress, setVoterAddress, whiteListAddress, startVoting, stopVoting, winner, setWinner, getWinner, voteCandidate}} >
            {children}
        </VotingContext.Provider>
    )
    }


