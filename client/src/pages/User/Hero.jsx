import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Hero() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const searchHandler = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== "") {
            navigate(`/course/search?query=${searchQuery}`);
        }
        setSearchQuery(""); // Clear the search input after submission
    }


    return (
        <div className='relative bg-gradient-to-r from-blue-500 to-indigo-600  dark:from-blue-900 dark:to-gray-900 py-20 px-4 text-center w-full'>
            <div className='max-w-3xl mx-auto w-full mt-8'>
                <h1 className='text-white text-4xl md:text-5xl font-bold mb-4'>Find the Best Course For Yourself</h1>
                <p className="mb-8 text-white text-lg">Discover, learn, and grow with our curated courses.</p>
                <form onSubmit={searchHandler} className="flex flex-col items-center gap-4 w-full">
                    <div className="flex w-full max-w-lg">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for courses..."
                            className="bg-white border-none focus-visible:ring-2 focus-visible:ring-blue-400 px-6 py-3 text-black rounded-l-md"
                        />
                        <Button
                            type="submit"
                            className="rounded-r-md bg-blue-600 hover:bg-blue-700"
                            size="icon"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>
                    <Button
                       onClick={()=>navigate(`/course/search?query`)}
                        type="button"
                        className="h-12 px-8 py-3 text-lg rounded-full font-semibold bg-white text-blue-600 hover:bg-gray-200"
                    >
                        Explore Courses
                    </Button>
                </form>
            </div>
        </div>
    )
}
export default Hero