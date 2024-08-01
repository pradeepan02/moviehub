import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

const API_KEY = 'a265b18f41d898759c0a1e109b1e3bb9';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,watch/providers`);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details.');
      }
      setLoading(false);
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) return <div className="spinner"></div>;

  if (error) return <div>{error}</div>;

  if (!movie) return <div>Movie not found</div>;

  const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '';
  const trailer = movie.videos.results.find(video => video.type === 'Trailer');
  const watchProviders = movie['watch/providers']?.results?.US?.flatrate || [];
  const cast = movie.credits.cast.slice(0, 5); // Top 5 actors
  const crew = movie.credits.crew.filter(member => member.job === 'Director' || member.job === 'Producer'); // Directors and Producers
  const musicDirectors = movie.credits.crew.filter(member => member.job.toLowerCase().includes('music') || member.job.toLowerCase().includes('composer')); // Music Directors

  return (
    <div className="movie-details">
      <div className="movie-poster">
        <img src={imageUrl} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p><strong>Rating:</strong> {movie.vote_average}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Overview:</strong> {movie.overview}</p>
        {trailer && (
          <div className="trailer">
            <h3>Trailer</h3>
            <iframe 
              width="100%" 
              height="315" 
              src={`https://www.youtube.com/embed/${trailer.key}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        )}
        <h3>Where to Watch</h3>
        <div className="watch-providers">
          {watchProviders.length > 0 ? (
            <ul>
              {watchProviders.map(provider => (
                <li key={provider.provider_id}>
                  <a href={`https://www.${provider.provider_name.toLowerCase().replace(/ /g, '')}.com`} target="_blank" rel="noopener noreferrer">
                    {provider.provider_name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Not available for streaming</p>
          )}
        </div>
        <h3>Important Cast</h3>
        <div className="cast-crew-row">
          {cast.length > 0 ? (
            cast.map(actor => (
              <div key={actor.cast_id} className="member-card">
                <img 
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : 'https://via.placeholder.com/200x300'} 
                  alt={actor.name} 
                />
                <p><strong>{actor.name}</strong> as {actor.character}</p>
              </div>
            ))
          ) : (
            <p>No cast information available</p>
          )}
        </div>
        <h3>Important Crew</h3>
        <div className="cast-crew-row">
          {crew.length > 0 ? (
            crew.map(member => (
              <div key={member.id} className="member-card">
                <img 
                  src={member.profile_path ? `https://image.tmdb.org/t/p/w200/${member.profile_path}` : 'https://via.placeholder.com/200x300'} 
                  alt={member.name} 
                />
                <p><strong>{member.name}</strong> ({member.job})</p>
              </div>
            ))
          ) : (
            <p>No crew information available</p>
          )}
        </div>
        <h3>Music Directors</h3>
        <div className="cast-crew-row">
          {musicDirectors.length > 0 ? (
            musicDirectors.map(member => (
              <div key={member.id} className="member-card">
                <img 
                  src={member.profile_path ? `https://image.tmdb.org/t/p/w200/${member.profile_path}` : 'https://via.placeholder.com/200x300'} 
                  alt={member.name} 
                />
                <p><strong>{member.name}</strong> ({member.job})</p>
              </div>
            ))
          ) : (
            <p>No music director information available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
