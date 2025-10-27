import React from 'react'

const Card = () => { 
  return (
    <div className='flex w-full bg-amber-300 rounded-md p-4 shadow-lg'> 
        <div className='p-0 w-full'>
            <h1 className='text-xl font-bold mb-1'>Title</h1>
            <div className='w-full h-0.5 bg-black opacity-25 mb-2'></div>
            
            <p 
                className='text-sm text-gray-800' 
                style={{ 
                    display: '-webkit-box', 
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2, // Sadece 2. satıra kadar gösterir
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, iste. lorem110. Bu metin iki satıra kadar devam edecek ve sonra kesilecektir.
            </p>
        </div>
    </div>
  )
}

export default Card