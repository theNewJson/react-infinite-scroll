/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { memo, useCallback, useEffect, useRef } from "react";
import { Repo } from "../hooks/useRepos";

const grayLight = "#d3d3d3";
const gray = "#e8e8e8";
const grayDark = "#8f8f8f";

const noLinkStyle = css`
  text-decoration: none;
  color: inherit;
`;

const container = css`
  height: 70vh;
  overflow-x: auto;
  border: 2px solid ${gray};
  border-radius: 3px;
  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${grayDark};
    border-color: ${grayDark} transparent ${grayDark} transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const row = css`
  padding: 16px 16px;
  border-bottom: 1px solid ${gray};
  display: flex;
  flex-direction: row;
  align-items: center;
  :hover {
    background-color: ${grayLight};
    cursor: pointer;
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
  text-align: left;
`;

const titleText = css`
  font-size: 24px;
  text-align: left;
  margin-bottom: 8px;
`;

const loaderHeight = css`
  height: 50px;
`;

interface ListItemProps {
  rowData: Repo;
}

const ListItem = (props: ListItemProps) => {
  const { rowData } = props;
  const { full_name, description, html_url } = rowData;

  return (
    <a css={noLinkStyle} href={html_url} target="_blank" rel="noreferrer">
      <div css={row}>
        <div css={rowContent}>
          <div css={titleText}>{full_name}</div>
          <div css={rowDescription}>{description}</div>
        </div>
      </div>
    </a>
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
      if (target.isIntersecting) {
        onNextPage();
      }
    },
    [onNextPage]
  );

  useEffect(() => {
    if (!isLoading) {
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
    }
  }, [handleObserver, isLoading]);

  return list.length > 0 ? (
    <div css={container}>
      {list.map((rowData) => (
        <ListItem rowData={rowData} />
      ))}
      {isLoading && <div className="lds-dual-ring"></div>}
      {!isLoading && <div ref={loader} css={loaderHeight} />}
    </div>
  ) : (
    <div>No result</div>
  );
};

export default memo(List);
