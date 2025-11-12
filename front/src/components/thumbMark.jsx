import { useEffect, useState } from "react";
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";
import axios from "axios";

export default function ThumbMark() {
  const [info, setInfo] = useState();
  const [score, setScore] = useState();
  useEffect(() => {
    const tm = new Thumbmark({ apiKey: "1c1f8a186ac04c61a319e41477c602fc" });
    tm.get().then((res) => {
      setInfo(res);
      axios
        .post("http://localhost:3000/save", { data: res })
        .then(function (res) {
          setScore(res.data.score);
        });
    });
  }, []);

  return (
    <>
      <h1>Id: {info?.thumbmark}</h1>
      <h1>Trust: {score}%</h1>
    </>
  );
}
