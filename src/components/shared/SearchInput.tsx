import {AutoComplete} from "antd";
import apiService from "@/services/api.service";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export default function SearchInput({value}: {value?: string}) {
  const [actualValue, setActualValue] = useState('');
  const [options, setOptions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (value !== actualValue) setActualValue(value || '');
  }, [value]);

  return <AutoComplete
    options={options}
    value={actualValue}
    placeholder={'Search for songs...'}
    showSearch={true}
    style={{flex :1}}
    onChange={value => setActualValue(value)}
    onKeyDown={e => {
      if (e.key === 'Enter') {
        return router.push('/search?q=' + encodeURIComponent(actualValue));
      }
    }}
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
