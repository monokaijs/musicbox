import {AutoComplete} from "antd";
import apiService from "@/services/api.service";
import {useState} from "react";
import {useRouter} from "next/router";

export default function SearchInput({value}: {value?: string}) {
  const [options, setOptions] = useState([]);
  const router = useRouter();

  return <AutoComplete
    options={options}
    value={value}
    placeholder={'Search for songs...'}
    showSearch={true}
    style={{flex :1}}
    onSearch={value => {
      if (value.trim() === '') return setOptions([]);
      apiService.searchSuggestion(value).then(response => {
        if (response) {
          setOptions(response.map((r: string) => {
            return {
              value: r,
              title: r,
            }
          }));
        }
      });
    }}
    onSelect={(value) => {
      return router.push('/search?q=' + encodeURIComponent(value));
    }}
  />
}
