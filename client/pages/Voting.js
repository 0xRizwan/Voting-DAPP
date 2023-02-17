import {useContext} from 'react'
import { VotingContext } from '@/context/VotingContext'


const voting = () => {
  const{voteCandidate} = useContext(VotingContext)

  return (
    <>
    <div className="mt-20 mx-auto w-1/2 lg:w-1/4">
    <button className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full 
                focus:outline-none focus:shadow-outline mt-20"
            onClick={voteCandidate}
    >
                Vote 1
              </button>
  </div>

<div className="mt-20 w-1/2 mx-auto lg:w-1/4">
<button className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full 
            focus:outline-none focus:shadow-outline mt-20"
        onClick={voteCandidate}
>
            Vote 2
          </button>
</div>
</>
  )
}

export default voting








