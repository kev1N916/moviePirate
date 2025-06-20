import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // You can use any icon library you prefer
import { ImSpinner2 } from "react-icons/im"; // Spinner icon

const apiUrl = import.meta.env.VITE_PIRATE_URL;

type Movie = {
  title: string;
  quality: string;
  url: string;
};

function extractMovieName(title: string) {
  const match = title.match(/^Download\s+(.+?)\s+\(\d{4}\)/);
  return match ? match[1] : null;
}
const App = () => {
  enum DownloadState {
    DOWNLOADING = "downloading",
    DOWNLOADED = "completed",
    NOT_DOWNLOADING = "not_downloading",
  }
  const [movies, setMovies] = useState<Movie[]>([
    // Declaring movies as a state variable
    { title: "Inception", quality: "1080", url: "" },
    { title: "The Matrix", quality: "720", url: "" },
    { title: "Interstellar", quality: "1080", url: "" },
    { title: "The Dark Knight", quality: "720", url: "" },
    { title: "Forrest Gump", quality: "1080", url: "" },
    { title: "Gladiator", quality: "SD", url: "" },
    { title: "Pulp Fiction", quality: "HD", url: "" },
    { title: "The Shawshank Redemption", quality: "4K", url: "" },
    { title: "Fight Club", quality: "HD", url: "" },
    { title: "The Godfather", quality: "SD", url: "" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadState, setDownloadState] = useState<DownloadState>(
    DownloadState.NOT_DOWNLOADING
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [finalDownloadUrl, setFinalDownloadUrl] = useState<String>("");
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setDownloadState(DownloadState.NOT_DOWNLOADING)
  };

const handleFinalDownloadClick = () => {
  const finalUrl = finalDownloadUrl as string;
  
  const link = document.createElement('a');
  link.href = finalUrl;
  link.download = ''; // This suggests it's a download
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  const handleDownloadClick = async () => {
    setDownloadState(DownloadState.DOWNLOADING);
    const movie = selectedMovie?.title;
    const movieUrl = selectedMovie?.url;
    const quality = "1080";

    try {
      const response = await fetch(
        apiUrl+"/getMovieDownloadLink",
        {
          body: JSON.stringify({
            movie: movie,
            movieUrl: movieUrl,
            movieQuality: quality,
          }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.finalDownloadUrl);
      setFinalDownloadUrl(data.finalDownloadUrl)
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setDownloadState(DownloadState.DOWNLOADED);
    }
  };
  const handleSearchClick = async () => {
    setLoading(true);
    const movie = searchTerm;
    console.log(movie);

    try {
      const response = await fetch(apiUrl+"/searchForMovie", {
        body: JSON.stringify({ movie: movie }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      const responseMovieData: Movie[] = [];
      for (const movie of data.movieData) {
        console.log(movie.title);
        responseMovieData.push({
          title: String(extractMovieName(movie.title)),
          quality: "1080",
          url: String(movie.url),
        });
      }
      setMovies(responseMovieData);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-gray-100 text-gray-800">
      <div className="w-full max-w-md bg-white shadow border rounded mt-10">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border-none focus:outline-none font-medium rounded-l-lg"
          />
          <button
            onClick={handleSearchClick}
            className="p-3 bg-black text-white hover:bg-gray-800"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="w-lvh p-4 flex justify-center items-center mt-4">
        <div className="w-full max-w-md h-96 flex justify-center items-center border rounded p-4 bg-white shadow">
          {loading ? (
            <ImSpinner2 className="animate-spin text-3xl text-gray-600" />
          ) : (
            <div className="w-full h-full overflow-y-scroll space-y-3">
              {movies.map((movie, index) => (
                <div
                  key={index}
                  onClick={() => handleMovieClick(movie)}
                  className="p-3 border-b last:border-none flex justify-between items-center rounded cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold">{movie.title}</span>
                  <span className="text-sm text-gray-500">{movie.quality}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black flex justify-center items-center z-50 pointer-events-auto">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center relative pointer-events-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-l font-bold mb-4">{selectedMovie.title}</h2>
            {downloadState === DownloadState.NOT_DOWNLOADING && (
              <button
                onClick={handleDownloadClick}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Get Download Link
              </button>
            )}
            {downloadState === DownloadState.DOWNLOADING && (
              <div className="flex flex-col items-center mt-2 space-y-1">
                <p className="text-l font-bold mb-4 text-gray-700">
                  Link Being Retrieved
                </p>
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
                  <span className="w-2 h-2 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
                  <span className="w-2 h-2 bg-gray-700 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            {downloadState === DownloadState.DOWNLOADED && (
              <button
                onClick={handleFinalDownloadClick}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Download
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
