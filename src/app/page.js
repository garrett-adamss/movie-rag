'use client'
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon, Sparkles, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const searchSuggestions = [
    "Movies directed by Tim Burton that star Johnny Depp",
    "Sci-Fi movies with an IMDB rating of 8 or higher",
    "Crime movies before the year 1980",
  ]

  // Fetch all movies on page load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // const response = await fetch("http://127.0.0.1:8000/movies/");
        const response = await fetch("https://rag-backend-production.up.railway.app/movies/");
        const data = await response.json();
        setMovies(data.movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  // Handle search functionality
  const handleSearch = async (query) => {
    if (!query) {
      // If the search query is empty, fetch all movies again
      const response = await fetch("https://rag-backend-production.up.railway.app/movies/");
      const data = await response.json();
      setMovies(data.movies);
      return;
    }

    try {
      const response = await fetch("https://rag-backend-production.up.railway.app/movies/search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: query }),
      });
      const data = await response.json();
      setMovies(data.movies);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh on form submit
    handleSearch(searchQuery); // Call the search function with the query
  };

  // Update search query state on input change
  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle clearing the search query
  const handleClearSearch = () => {
    setSearchQuery(""); // Reset the search query
    handleSearch(""); // Fetch all movies again
  };

  // Handle card click to navigate to movie details  // Handle card click to navigate to details page
  const handleCardClick = (movie) => {
    router.push(`/details?movieData=${encodeURIComponent(JSON.stringify(movie))}`);
  };

  // Handle suggestion click to fill input and submit the form
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion)
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 relative">
          <form onSubmit={handleSubmit} className="mb-8 relative">
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-gray-100 border-gray-700 rounded-full pl-12"
            />
            <SearchIcon onClick={() => handleSearch(searchQuery)} type="button" className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <XCircle
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={handleClearSearch} // Call handleClearSearch to reset the input and fetch all movies
              />
            )}
          </form>
        </div>
        <div className="mb-8 flex flex-col space-y-2" role="list" aria-label="AI-powered search suggestions">
          {searchSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700 justify-start"
              onClick={() => handleSuggestionClick(suggestion)} 
            >
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" aria-hidden="true" />
              <span>{suggestion}</span>
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 overflow-hidden cursor-pointer" onClick={() => handleCardClick(movie)}>
                <CardContent className="p-0">
                  <img
                    src={movie.Poster_Link} // Assuming Poster_Link contains a valid image URL
                    alt={movie.Series_Title}
                    className="w-full h-auto object-cover"
                    width={200}
                    height={300}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{movie.Series_Title}</h3>
                    <p className="text-sm text-gray-400">{movie.Released_Year}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </div>
    </div>
  )
}