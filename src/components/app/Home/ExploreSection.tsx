import SectionTitle from "@/components/app/Home/SectionTitle";
import {useEffect, useState} from "react";
import apiService from "@/services/api.service";
import TrackHorizontalSeries from "@/components/app/Home/TrackHorizontalSeries";

export default function ExploreSection() {
  const [sections, setSections] = useState<any[]>([]);
  useEffect(() => {
    apiService.getMusicExplore().then(data => {
      setSections(data.sections);
    });
  }, []);

  useEffect(() => {
    console.log(sections);
  }, [sections]);

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
