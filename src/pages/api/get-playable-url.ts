import {Innertube} from 'youtubei.js';
import {NextApiRequest, NextApiResponse} from "next";
import ytdl from "@distube/ytdl-core";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let data = [];
  for (let id of req.body.ids || []) {
    const info = await ytdl.getInfo('https://www.youtube.com/watch?v=' + id);
    if (info && info.formats) {
      const formats = info.formats;
      const audioFormats = info.formats.filter(x => x.mimeType?.startsWith('audio/')).sort((a, b) => {
        return (b?.audioBitrate || 0) - (a?.audioBitrate || 0);
      });
      if (audioFormats.length > 0) {
        data.push({
          id,
          url: audioFormats[0].url,
          metadata: info,
        })
      }
    }
  }
  res.json({
    data,
  })
}
