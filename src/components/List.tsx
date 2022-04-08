/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo, useCallback, useEffect, useRef } from "react";

const gray = "#e8e8e8";
const grayDark = "#8f8f8f";

const container = css`
  height: 70vh;
  overflow-x: auto;
`;

const row = css`
  padding: 16px 0px;
  border-bottom: 1px solid ${gray};
  display: flex;
  flex-direction: row;
  align-items: center;
  :hover {
    .button-save {
      display: block;
    }
    .save-tag {
      display: none;
    }
  }
`;

const rowContent = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const rowDescription = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${grayDark};
  font-size: 16px;
  font-weight: 500;
`;

const titleText = css`
  font-size: 24px;
  text-align: left;
  margin-bottom: 8px;
`;

const authorNameText = css`
  margin-right: 8px;
`;

const loaderHeight = css`
  height: 50px;
`;

interface Repo {
  full_name: string;
  description: string;
}

interface ListItemProps {
  rowData: Repo;
}

const ListItem = (props: ListItemProps) => {
  const { rowData } = props;
  const { full_name, description } = rowData;

  return (
    <div css={row}>
      <div css={rowContent}>
        <div css={titleText}>{full_name}</div>
        <div css={rowDescription}>
          <div css={authorNameText}>{description}</div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  list: Repo[];
  isLoading?: boolean;
  onNextPage: () => void;
}
const List = (props: Props) => {
  const { list, isLoading, onNextPage } = props;
  const loader = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      console.log("target", target);
      if (target.isIntersecting) {
        onNextPage();
      }
    },
    [onNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    };
    const target = loader.current;
    const observer = new IntersectionObserver(handleObserver, option);
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [handleObserver]);

  return (
    <div css={container}>
      {list.map((rowData) => (
        <ListItem rowData={rowData} />
      ))}
      {isLoading && <div>Loading...</div>}
      <div ref={loader} css={loaderHeight} />
    </div>
  );
};

export default memo(List);
