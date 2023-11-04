import {Innertube} from 'youtubei.js';
import {NextApiRequest, NextApiResponse} from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const youtube = await Innertube.create();
  let data = [];
  for (let id of req.body.ids || []) {
    const info = await youtube.getInfo(id, 'ANDROID');
    const format = info.chooseFormat({type: 'audio', quality: 'best'});
    const url = format?.decipher(youtube.session.player);
    data.push({
      id, url,
      metadata: info,
    });
  }
  res.json({
    data,
  })
}
