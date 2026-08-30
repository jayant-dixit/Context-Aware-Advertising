import React, { useState } from 'react'
import HeroSection from '../components/Hero'
import ContactSection from '../components/Contact'
import Footer from '../components/Footer'
import AnalysisPage from './AnalysisPage'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import BrandCircle from '../components/BrandCircle'

const Home = () => {
    const [page, setPage] = useState('home')
    const [url, setUrl] = useState('')

    const onBack = () => setPage('home')

    const onChange = (e) => {
        setUrl(e.target.value)
    }

    const startAnalysis = () => {
        setPage('analysis')
    }

    
    return (
        <>
            {page == 'home' ?
                <div className='overflow-hidden'>
                    {/* <BurningTopGlow/> */}
                    {/* <BurningGlowDemo/> */}
                    <HeroSection url={url} changeUrl={onChange} startAnalysis={startAnalysis}/>
                    <HowItWorks id='howitworks'/>
                    <Features id='features' />
                    <BrandCircle />
                    <ContactSection id='contact' />
                    <Footer />
                    {/* <div className='min-h-screen'></div> */}
                </div>
                :
                <AnalysisPage youtubeUrl={url} onBack={onBack} />
            }
        </>
    )
}

export default Home