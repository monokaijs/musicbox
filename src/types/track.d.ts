interface YouTubeTrack {
  title: {
    text: string;
  };
  author: {
    id: string;
    name: string;
  };
  duration: {
    text: string;
    seconds: number;
  };
  published: {
    text: string;
  };
  short_view_count: {
    text: string;
  };
  id: string;
  thumbnails: {
    width: number;
    height: number;
    url: string;
  }[];
  thumbnail?: {
    width: number;
    height: number;
    url: string;
  }[];
  view_count: {
    text: string;
  };
}
