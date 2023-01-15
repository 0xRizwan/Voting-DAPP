import React from 'react'
import {useContext} from "react"

import { VotingContext } from '../context/VotingContext'

const Navbar = () => {
  const {connectWallet} = useContext(VotingContext)
  return (
    <div className="flex justify-end mt-10  ">
       <div className="flex-1 text-3xl font-bold mx-5 ">
       Voting DAPP
       </div>
      <div className="flex bg-blue-800 text-xl rounded-lg py-2 px-2 font-semibold text-white mx-10">
        <button type='button' onClick={connectWallet}>
            Connect wallet
        </button>
       </div>
       </div>

  )
}

export default Navbar