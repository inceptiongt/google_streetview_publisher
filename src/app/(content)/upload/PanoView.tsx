import "@egjs/react-view360/css/view360.min.css";

import React, { useRef, useEffect, useMemo } from "react";
import View360, { EquirectProjection } from "@egjs/react-view360";

// Suppose it's Typescript(.tsx) file
export default ({pic}) => {
  const viewerRef = useRef<View360>();

  const projection = useMemo(() => new EquirectProjection({
      src: pic
    }), [pic]);
  useEffect(() => {
    // We got an instance of View360. This provides access to properties and methods.
    const view360 = viewerRef.current;

    
    view360?.load(projection);
  }, [pic]);

  return <View360 ref={viewerRef} />;
}