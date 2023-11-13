import {AutoComplete} from "antd";
import apiService from "@/services/api.service";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {setApp} from "@/redux/slices/app.slice";
import {BaseOptionType} from "rc-select/es/Select";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHistory} from "@fortawesome/free-solid-svg-icons";

export default function SearchInput({value}: {value?: string}) {
  const {searchHistory} = useAppSelector(state => state.app);
  const [actualValue, setActualValue] = useState('');
  const [suggestedOptions, setSuggestedOptions] = useState<BaseOptionType[]>([]);
  const [options, setOptions] = useState([]);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value !== actualValue) setActualValue(value || '');
  }, [value]);

  const doSearch = (value: string) => {
    if (searchHistory.findIndex(x => x.toLowerCase().trim() === value.toLowerCase().trim())) {
      dispatch(setApp({
        searchHistory: [value, ...searchHistory]
      }));
    } else {
      let newHistory = searchHistory.filter(x => x.toLowerCase().trim() !== value.toLowerCase().trim());
      newHistory.unshift(value);
      dispatch(setApp({
        searchHistory: newHistory,
      }));
    }
    return router.push('/search?q=' + encodeURIComponent(value))
  }

  const formatSearchItem = (item: string) => {
    return {
      value: item,
      label: <>
        <FontAwesomeIcon icon={faHistory}/>
        <span style={{paddingLeft: 8}}>{item}</span>
      </>,
    }
  };

  useEffect(() => {
    if (actualValue && actualValue.trim()) {
      setSuggestedOptions(searchHistory.filter((x) => {
        return x.trim().toLowerCase().includes(actualValue.trim().toLowerCase());
      }).filter((x, i) => {
        // only takes 3 items
        return i < 3;
      }).map(formatSearchItem));
    } else {
      setSuggestedOptions(searchHistory.filter((x, i) => {
        return i < 3;
      }).map(formatSearchItem));
    }
  }, [actualValue]);

  return <AutoComplete
    options={[...suggestedOptions, ...options]}
    value={actualValue}
    placeholder={'Search for songs...'}
    showSearch={true}
    style={{flex :1}}
    onChange={value => setActualValue(value)}
    onKeyDown={e => {
      if (e.key === 'Enter') return doSearch(actualValue);
    }}
    onSearch={(value) => {
      if (value.trim() === '') return setOptions([]);
      apiService.searchSuggestion(value).then(response => {
        if (response) {
          setOptions(response.map((r: string) => {
            return {
              value: r,
              label: r,
            }
          }));
        }
      });
    }}
    onSelect={(value) => doSearch(value)}
  />
}
