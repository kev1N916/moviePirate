import { DownloadLinks } from "./getDownloadLinks";

export const filterLinks=(links:DownloadLinks[],quality:string)=>{

    for (const link of links){
        if(link.linkTitle.includes(quality)){
            return link.linkUrl
        }
    }
    return ""

}