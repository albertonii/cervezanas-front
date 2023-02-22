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
  editable: boolean;
}

export function Rate({ count, rating, color, onRating, editable }: Props) {
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
          size="lg"
          key={idx}
          className={`${
            editable
              ? "cursor-pointer transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300"
              : ""
          }  ${
            effect && editable && "animate-wiggle" ? "animate-wiggle" : ""
          } `}
          icon={faStar}
          style={{ color: getColor(idx) }}
          onMouseEnter={() =>
            editable ? setHoverRating(idx) : setHoverRating(rating)
          }
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
    editable,
  ]);

  return <div className="flex flex-row h-6 my-2">{starRating}</div>;
}
