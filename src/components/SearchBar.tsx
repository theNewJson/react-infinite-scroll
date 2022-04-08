/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { debounce } from "lodash-es";
import { memo, useCallback, useEffect, useRef } from "react";

const gray = "#e8e8e8";

const container = css`
  text-align: left;
  padding: 16px;
`;

const search = css`
  height: 35px;
  width: 200px;
  border: 1px solid ${gray};
  border-radius: 1px;
`;

interface Props {
  onSearch: (text: string) => void;
  onTyping?: () => void;
  defaultValue?: string;
}

const SearchBar = (props: Props) => {
  const { onSearch, onTyping, defaultValue } = props;
  const typingRef = useRef(false);
  const debouncedChange = useCallback(
    debounce((event) => {
      onSearch((event.target as HTMLInputElement).value);
      typingRef.current = false;
    }, 1000),
    [onSearch]
  );

  const onChange = useCallback(
    (event) => {
      if (!typingRef.current && onTyping) {
        typingRef.current = true;
        onTyping();
      }
      debouncedChange(event);
    },
    [debouncedChange, onTyping]
  );

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);
  return (
    <div css={container}>
      <input
        defaultValue={defaultValue}
        css={search}
        type="search"
        placeholder="Please enter the keyword"
        onChange={onChange}
      />
    </div>
  );
};

export default memo(SearchBar);
