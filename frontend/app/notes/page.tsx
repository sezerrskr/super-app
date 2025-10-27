import React from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar/navbar'
import Card from '../components/NotesCard/card'

const page = () => {
  return (
    <div>
        <Navbar></Navbar>
        <div className='@container'>
            <div className='top-menu flex justify-between items-center px-4 py-2'>
                <h1 className='text-3xl font-medium'>My Notes</h1>
                <div className='bg-(--main-bg) px-6 py-1 rounded-full text-white cursor-pointer'><Link href="notes/addnote">Not Ekle</Link></div>
            </div>
            <div className='grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-2 px-4 py-2 '>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
                <Card></Card>
            </div>
        </div>
    </div>
  )
}

export default page