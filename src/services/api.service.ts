import axios from "axios";
import {Innertube} from "youtubei.js"

class ApiService {
  search(query: string) {
    return this.call('search', {
      query,
    }) as Promise<any>
  }

  searchSuggestion(query: string) {
    return this.call('search-suggestions', {
      query,
    }) as Promise<any>;
  }

  getPlayableUrl(id: string) {
    return this.call('get-playable-url', {
      ids: [id]
    }) as Promise<any>
  }

  getMultiplePlayableUrls(ids: string[]) {
    return this.call('get-playable-url', {
      ids: ids
    }) as Promise<any>
  }

  getTrack(id: string) {
    return this.call('get-track', {
      id: id,
    }) as Promise<any>
  }

  getMusicExplore() {
    return this.call('music-explore', {}) as Promise<any>;
  }

  async call(endpoint: string, data?: any) {
    const r = await axios(`/api/${endpoint}`, {
      method: 'POST',
      data,
    });
    return r.data;
  }
}

export default new ApiService();
