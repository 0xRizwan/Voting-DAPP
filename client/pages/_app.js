import '@/styles/globals.css'
import { VotingProvider } from '@/context/VotingContext'

import Navbar from '../components/Navbar'
import Footer from "../components/Footer"

export default function App({ Component, pageProps }) {
  return (
   <VotingProvider>
    <div>
       <Navbar/>
    <div>
       <Component {...pageProps} />
    </div>
       <Footer />
    </div>
   </VotingProvider>
    )
}
