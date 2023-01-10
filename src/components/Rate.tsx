import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faStar } from "@fortawesome/free-solid-svg-icons";

interface Color {
  filled: string;
  unfilled: string;
}

interface Props {
  count: number;
  rating: number;
  color: Color;
  onRating: (rating: number) => void;
}

export default function Rate({ count, rating, color, onRating }: Props) {
  const [hoverRating, setHoverRating] = useState(0);
  const [effect, setEffect] = useState(false);

  const starRating = useMemo(() => {
    const getColor = (index: number) => {
      if (hoverRating >= index) {
        return color.filled;
      } else if (!hoverRating && rating >= index) {
        return color.filled;
      }

      return color.unfilled;
    };

    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => (
        <FontAwesomeIcon
          key={idx}
          className={`cursor-pointer ${
            effect && "animate-wiggle" ? "animate-wiggle" : ""
          }`}
          icon={faStar}
          style={{ color: getColor(idx) }}
          onMouseEnter={() => setHoverRating(idx)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => {
            onRating(idx);
            setEffect(true);
          }}
          onAnimationEnd={() => setEffect(false)}
        />
      ));
  }, [
    color.filled,
    color.unfilled,
    count,
    hoverRating,
    onRating,
    rating,
    effect,
  ]);

  return <div className="flex flex-row h-6 my-2">{starRating}</div>;
}
