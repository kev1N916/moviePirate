import { MovieCard } from "./findMovieCard";

export const findMovieUrl=(movieCards:MovieCard[],movieTitle:string):string=>{

    for (const card of movieCards){
        if(card.title.toLowerCase().includes(movieTitle.toLowerCase())){
            return card.url
        }
    }

    return ""
}