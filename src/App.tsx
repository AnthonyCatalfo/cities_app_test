import { TextField } from "@material-ui/core";
import * as React from "react";
import throttle from "lodash.throttle";

import cities from "./data/cities.json";
import * as styles from "./App.module.less";

interface Item {
  city: string;
  state: string;
}

const data: Item[] = Object.entries(cities).reduce((acc: Item[], obj) => {
  const [state, items] = obj;

  for (let i = 0; i < items.length; i += 1) {
    acc.push({
      city: items[i],
      state,
    })
  }

  return acc;
}, [])

const Highlighted = ({ text = "", highlight = "" }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  return (
    <span>{text.toLowerCase().includes(highlight) ? <strong>{text}</strong> : text}</span>
  );
};

export const App = (): JSX.Element => {
  const [searchText, setSearchText] = React.useState<string>("")
  const [inputValue, setInputValue] = React.useState<string>("")
  const [places, setPlaces] = React.useState<Item[]>([])

  const updatePlaces = React.useCallback((keyword: string) => {
    setSearchText(keyword)
    const placesToSave = data.filter(
      (i) =>
        i.state.toLowerCase().includes(keyword.toLowerCase()) ||
        i.city.toLowerCase().includes(keyword.toLowerCase())
    );
    setPlaces(placesToSave)
  }, [])

  const throttled = React.useMemo(() => throttle(updatePlaces, 1000), [updatePlaces])

  React.useEffect(() => {
    throttled(inputValue)
  }, [inputValue, throttled])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className={styles.root}>
      <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()} className={styles.searchForm}>
        <div className={styles.searchWrapper}>
          <TextField fullWidth value={inputValue} onChange={handleChange} label="Search Cities" variant="outlined" />
        </div>
      </form>
      <div className={styles.listWrapper}>
        {searchText.trim().length > 0 && places.map((p) => (
          <div className={styles.place} key={p.city + p.state}>
            <Highlighted text={p.city} highlight={searchText.toLowerCase()} />,&nbsp;
            <Highlighted text={p.state} highlight={searchText.toLowerCase()} />
          </div>
        ))}
      </div>
    </div>
  );
};
