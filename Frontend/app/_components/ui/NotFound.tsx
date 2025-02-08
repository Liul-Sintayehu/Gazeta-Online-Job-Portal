"use client"
import Image from 'next/image'
import React from 'react'

type NotFoundProps = {
    title?: string
    description? : string
}
const NotFound = (props : NotFoundProps) => {
  return (
<section className="flex items-center p-8">
  <div className="container flex flex-col items-center ">
    <div className="flex flex-col gap-6 max-w-xl text-center ">
      <Image src="/images/notfound.png" alt='Notfound' width={300} height={300}/>
      <h2 className="font-semibold text-md text-gray-600 dark:text-gray-100">
        {props?.title}
      </h2>
      <p className="text-sm dark:text-gray-300">{props?.description}</p>
    </div>
  </div>
</section>
  )
}

export default NotFound
