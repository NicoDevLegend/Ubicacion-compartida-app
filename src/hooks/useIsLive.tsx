import { useEffect, useState } from "react";
import { location } from "./useGetLocations";

type isLiveLocation = location & {
  isLive: boolean;
};

type isLive = isLiveLocation[] | [];

const useIsLive = (locationsPoints: location[]) => {
  const [isLiveLocationsPoints, setIsLiveLocationsPoints] = useState<isLive>(
    []
  );

  useEffect(() => {
    const isLive = locationsPoints.map((item) => {
      const currenTime = new Date().getTime();
      const lastUpdate = new Date(`${item.date} ${item.time}`).getTime();
      const timeDifference = currenTime - lastUpdate;
      const threshold = 10000;
      if (timeDifference <= threshold) {
        return { ...item, isLive: true };
      }
      return { ...item, isLive: false };
    });
    setIsLiveLocationsPoints(isLive);
  }, [locationsPoints]);

  return isLiveLocationsPoints;
};

export default useIsLive;
