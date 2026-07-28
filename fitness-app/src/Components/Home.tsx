

import { Link } from 'react-router'
function Home() {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6 w-4xl">
            <h1 className="w-full text-center">Home</h1>
            <Link to="/programs">
                <button className="inline-flex items-center gap-2 hover:text-sky-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors active:scale-95">
                    View Programs
                </button>
            </Link>
        </div>
    )
}

export default Home