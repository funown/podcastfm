import React from "react";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

function skeleton(props) { 
  return <SkeletonTheme color="#F2F2F2">
    <Skeleton></Skeleton>
  </SkeletonTheme>
}