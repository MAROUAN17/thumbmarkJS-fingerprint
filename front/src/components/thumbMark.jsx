import { useEffect, useState } from "react";
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";
import axios from "axios";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function ThumbMark() {
  const [info, setInfo] = useState();
  const [score, setScore] = useState();
  useEffect(() => {
    const tm = new Thumbmark({ apiKey: "1c1f8a186ac04c61a319e41477c602fc" });
    tm.get()
      .then((res) => {
        console.log(res);
        setInfo(res);
        axios
          .post("http://localhost:3000/save", { data: res })
          .then(function (res) {
            setScore(res.data.score);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    //-------------------------------- fingerprintJS (free)
    // const fngrAsync = async () => {
    //   try {
    //     const fp = await FingerprintJS.load();
    //     const res = await fp.get();
    //     setInfo(res.visitorId);
    //     setScore(res.confidence.score);
    //     axios
    //       .post("http://localhost:3000/save", { data: res })
    //       .then(function (res) {
    //         console.log(res);
    //         // setScore();
    //       });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // fngrAsync();
    //----------------------------------------------------
  }, []);

  return (
    <>
      <h1>Id: {info?.thumbmark}</h1>
      <h1>Risk: {score}%</h1>
    </>
  );
}
