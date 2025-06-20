import * as readline from "readline";
import { downloadMovie } from ".";
interface MovieRequest {
  name: string;
  quality: string;
}

class MovieCLI {
  private rl: readline.Interface;
  private validQualities = ["1080", "720", "360"];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async getMovieName(): Promise<string> {
    let movieName = "";

    while (!movieName) {
      movieName = await this.question("Enter movie name: ");

      if (!movieName) {
        console.log("Movie name cannot be empty. Please try again.");
      }
    }

    return movieName;
  }

  private async getQuality(): Promise<string> {
    let quality = "";

    while (!this.validQualities.includes(quality)) {
      quality = await this.question("Enter MP4 quality (1080/720/360): ");

      if (!this.validQualities.includes(quality)) {
        console.log("Invalid quality. Please choose from: 1080, 720, or 360");
      }
    }

    return quality;
  }

  private displayMovieInfo(movie: MovieRequest): void {
    console.log("\n" + "=".repeat(40));
    console.log("Movie Request Summary:");
    console.log("=".repeat(40));
    console.log(`Movie: ${movie.name}`);
    console.log(`Quality: ${movie.quality}p MP4`);
    console.log("=".repeat(40));
  }

  private async askToContinue(): Promise<boolean> {
    const answer = await this.question(
      "\nWould you like to request another movie? (y/n): "
    );
    return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
  }

  public async run(): Promise<void> {
    console.log("Welcome to Movie Request CLI!");
    console.log("This tool helps you specify movie download preferences.\n");

    try {
      let continueApp = true;

      while (continueApp) {
        const movieName = await this.getMovieName();
        const quality = await this.getQuality();

        const movieRequest: MovieRequest = {
          name: movieName,
          quality: quality,
        };

        this.displayMovieInfo(movieRequest);

        const finalDownloadUrl = await downloadMovie(movieName, quality);
        if (finalDownloadUrl) {
          console.log(`The url for downloading ${movieName} is : \n`);
          console.log(finalDownloadUrl);
        }
        continueApp = await this.askToContinue();
      }

      console.log("\nThank you for using Movie Request CLI!");
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      this.rl.close();
    }
  }
}

// Main execution
const app = new MovieCLI();
app.run().catch(console.error);
