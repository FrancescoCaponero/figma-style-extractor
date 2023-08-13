import React from 'react'
import FigmaExtractorForm  from './FigmaExtractorForm'

const Container = () => {
  return (
    <div className='min-w-screen flex justify-center'>
        <div className='flex justify-center items-center flex-col md:w-[600px] w-[calc(100%-1rem)]'>
            <h1 className='text-4xl font-[300] my-10'>
                Figma Style Extractor
            </h1>
            <FigmaExtractorForm/>
        </div>
    </div>
  )
}

export default Container