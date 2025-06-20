import express, { Request, Response, Application } from "express";
import cors from "cors";
import * as TinyUrl from "tinyurl"
import { Pirate } from "./pirate/pirate";

interface User {
  id: number;
  name: string;
  email: string;
}

// Create Express app
const app: Application = express();
const pirate: Pirate = new Pirate();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/getMovieDownloadLink", async (req: Request, res: Response) => {
  try {
    const { movie, movieUrl, movieQuality = "1080" } = req.body;
    if (!movie || !movieUrl) {
      res.status(400).json({ message: "Movie does not exist." });
    }

    const finalDownloadUrl = await pirate.getMovieDownloadLink(
      movie,
      movieUrl,
      movieQuality
    );
    res.status(200).json({ finalDownloadUrl: finalDownloadUrl });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Please try again later." });
  }
});

app.post("/searchForMovie", async (req: Request, res: Response) => {
  try {
    const { movie } = req.body;
    if (!movie) {
      res.status(400).json({ message: "No Movie has been entered." });
    }
    
    const movieData = await pirate.searchMovie(movie);
    console.log(movieData)
    res.status(200).json({ movieData: movieData });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Please try again later." });
  }
});

app.get("/about", (req: Request, res: Response): void => {});

// Start server
const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.listen(PORT, async () => {
  console.log(`🚀 Express server running at http://localhost:${PORT}/`);
  await pirate.init();
});

// Graceful shutdown
process.on("SIGTERM", (): void => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});
