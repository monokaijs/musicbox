import SectionTitle from "@/components/app/Home/SectionTitle";
import {useEffect, useState} from "react";
import apiService from "@/services/api.service";
import TrackHorizontalSeries from "@/components/app/Home/TrackHorizontalSeries";

export default function ExploreSection() {
  const [sections, setSections] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const exploreData = localStorage.getItem('explore');
      const lastExploreTimestamp = parseInt(localStorage.getItem('explore-ts') || '0');
      const now = new Date().getTime();
      const data: any = (exploreData && now - lastExploreTimestamp < 5 * 60 * 1000) ? JSON.parse(exploreData) : await apiService.getMusicExplore().then(r => {
        localStorage.setItem('explore', JSON.stringify(r));
        localStorage.setItem('explore-ts', now.toString());
        return r;
      });
      setSections(data.sections);
    })();
  }, []);

  return <div>
    {sections.filter(section => !section.num_items_per_column).map(section => (
      <>
        <SectionTitle
          title={section.header?.title?.text}
        />
        <TrackHorizontalSeries tracks={section.contents}/>
      </>
    ))}
  </div>
}
