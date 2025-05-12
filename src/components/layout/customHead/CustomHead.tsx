import Head from 'next/head'
import { ReactNode } from 'react'

interface CustomHeadProps {
    title: string
    description: string
    children: ReactNode
}

export default function CustomHead({ title, description, children }: CustomHeadProps) {
    return (
        <>
            <Head>
                <title>{`${title} | SIPP Karhutla`}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <main>
                {children}
            </main>
        </>
    )
}