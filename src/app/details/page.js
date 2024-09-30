'use client'
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon, ClockIcon, DollarSignIcon, UsersIcon } from "lucide-react"

export default function MovieDetails() {
  const [movie, setMovie] = useState(null);

  // Extract the query parameter manually
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const movieData = params.get('movieData');
    if (movieData) {
      setMovie(JSON.parse(movieData)); // Parse movie data from the query string
    }
  }, []);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{movie.Series_Title}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img
                src={movie.Poster_Link}
                alt={movie.Series_Title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{movie.Released_Year}</Badge>
                <Badge variant="secondary">{movie.Certificate}</Badge>
                <Badge variant="secondary">{movie.Runtime}</Badge>
                <Badge variant="secondary">{movie.Genre}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="text-yellow-400" />
                <span className="font-bold">{movie.IMDB_Rating}</span>
                <span className="text-gray-400">IMDb rating</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{movie.Meta_score}</span>
                <span className="text-gray-400">Metascore</span>
              </div>
              <p className="text-gray-300">{movie.Overview}</p>
              <div className="space-y-2">
                <p><span className="font-semibold">Director:</span> {movie.Director}</p>
                <p><span className="font-semibold">Stars:</span> {movie.Star1}, {movie.Star2}, {movie.Star3}, {movie.Star4}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UsersIcon className="text-gray-400" />
                  <span>{movie.No_of_Votes} votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="text-gray-400" />
                  <span>{movie.Gross}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
