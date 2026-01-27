import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <h2 className="text-4xl font-bold mb-4">404 - Penguin Not Found</h2>
            <p className="mb-4">Could not find requested resource</p>
            <Link href="/" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                Return Home
            </Link>
        </div>
    )
}