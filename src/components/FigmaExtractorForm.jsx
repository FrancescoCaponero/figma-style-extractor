import React, { useState, useEffect } from 'react';
import { fetchFigma } from '../api/axiosEndpoint';
import Loader from '../assets/loading.svg'



const FigmaExtractorForm = () => {
  const [fileId, setFileId] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [error, setError] = useState('');
  const [figmaData, setFigmaData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [colorsUsed, setColorsUsed] = useState([]); 
  const [fontUsed, setFontsUsed] = useState([]);

  const extractColors = (data) => {
    const colorSet = new Set();
    const extractedColors = [];
  
    const extractColorsRecursive = (node) => {
      if (node?.fills && Array.isArray(node?.fills)) {
        for (const fill of node.fills) {
          if (fill.color) {
            const colorKey = `${fill.color.r}_${fill.color.g}_${fill.color.b}`;
            if (!colorSet.has(colorKey)) {
              colorSet.add(colorKey);
              const color = {
                r: fill.color.r * 255, 
                g: fill.color.g * 255, 
                b: fill.color.b * 255, 
                a: fill.color.a, 
              };
              extractedColors.push(color);
            }
          }
        }
      }
  
      if (node?.children && Array.isArray(node?.children)) {
        for (const child of node?.children) {
          extractColorsRecursive(child);
        }
      }
    };
  
    if (data && data?.document?.children) {
      const topLevelChildren = data?.document?.children;
    
      for (const topLevelChild of topLevelChildren) {
        if (topLevelChild?.children) {
          for (const child of topLevelChild?.children) {
            extractColorsRecursive(child);
          }
        }
      }
    }
  
    return extractedColors;
  };

  const extractFonts = (data) => {
    const fontSet = new Set();
    const extractedFonts = [];
  
    const extractFontsRecursive = (node) => {
      if (node?.type === 'TEXT' && node?.style && node?.style?.fontFamily) {
        const fontFamily = node?.style?.fontFamily;
        if (!fontSet.has(fontFamily)) {
          fontSet.add(fontFamily);
          extractedFonts.push(fontFamily);
        }
      }
  
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          extractFontsRecursive(child);
        }
      }
    };
  
    if (data && data?.document?.children) {
      const topLevelChildren = data?.document?.children;
    
      for (const topLevelChild of topLevelChildren) {
        if (topLevelChild?.children) {
          for (const child of topLevelChild?.children) {
            extractFontsRecursive(child);
          }
        }
      }
    }
  
    return extractedFonts;
  };
  
  const handleExtract = async () => {
    try {
        setError('');
        setIsLoading(true); 
        const data = await fetchFigma(fileId, figmaToken); 
        setFigmaData(data);  

        // Update colorsUsed state
        const extractedColors = extractColors(data);
        setColorsUsed(extractedColors);

        // Update fontUsed state
        const extractedFonts = extractFonts(data);
        setFontsUsed(extractedFonts);

    }
     catch (error) 
    {
        setError('Invalid Figma File ID or Token');
        console.error('Error extracting Figma:', error);
    } 
    finally 
    {

        setIsLoading(false);
    }
  };


  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
  
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};


const handleExtractButtonClick = () => {
    handleExtract();   
  };

return (
    <>
        {
            isLoading ? (
                <div className='transition-all fixed z-50 left-0 10 backdrop-filter backdrop-blur-sm top-0 bg-red w-screen min-h-screen justify-center items-center'>
                    <div className='transition-all w-[600px] flex justify-center items-center absolute left-1/2 top-1/4 md:top-1/2 transform -translate-y-1/2 -translate-x-1/2'>
                        <img src={Loader} />
                    </div>
                </div>
            ) : null
        }
        <div className="my-[3rem] w-full ">
        <form className='w-full' onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Figma File ID:
            </label>
            <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                error ? 'border-red-500' : 'border-gray-300'
                } rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white ${
                error ? 'focus:border-red-500' : 'focus:border-blue-500'
                }`}
                type="text"
                value={fileId}
                onChange={(e) => {
                setFileId(e.target.value);
                setError('');
                }}
            />
            {error && (
                <p className="text-red-500 text-xs italic">{error}</p>
            )}
            </div>
            <div className="mb-4">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Figma Token:
            </label>
            <input
                className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
                error ? 'border-red-500' : 'border-gray-300'
                } rounded py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white ${
                error ? 'focus:border-red-500' : 'focus:border-blue-500'
                }`}
                type="text"
                value={figmaToken}
                onChange={(e) => {
                setFigmaToken(e.target.value);
                setError('');
                }}
            />
            {error && (
                <p className="text-red-500 text-xs italic">{error}</p>
            )}
            </div>
            <button
            className="mt-[1rem] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            onClick={handleExtractButtonClick}
            >
            Extract
            </button>
            {figmaData && (
                <div className='w-full'>
                <h2 className='text-2xl font-[300] mt-[1rem]'>Project's Name:</h2>
                    <div className='code-style'>
                        {JSON.stringify(figmaData.name, null, 2)}
                    </div>
                </div>
            )}

            {figmaData && colorsUsed.length >= 0 && (
            <div className='w-full'>
            <h2 className='text-2xl font-[300] mt-[1rem]'>Extracted Colors:</h2>
            <div className='flex flex-col code-style'>
                <div className='flex'>
                {colorsUsed?.map((color, index) => (
                <div key={index} className='flex'>
                    <div className='flex'>
                        <div
                        className='w-12 h-[12rem]'
                        style={{
                            backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                        }}
                        ></div>
                    </div>
                </div >
                ))}
                </div>
                {colorsUsed?.map((color, index) => (
                    <div  key={index} className='flex flex-col mt-[2rem]'>
                    <div>{rgbToHex(color.r, color.g, color.b)}</div> {/* Add this line */}
                    </div>
                ))}
            </div>
            </div>
            )}

            {figmaData && fontUsed.length >= 0 && (
            <div className='w-full'>
                <h2 className='text-2xl font-[300] mt-[1rem]'>Fonts Used:</h2>
                <div className='code-style'>
                {fontUsed?.map((font, index) => (
                    <div key={index}>{font}</div>
                ))}
                </div>
            </div>
            )}

        </form>
        </div>
    </>
  );
}

export default FigmaExtractorForm;
