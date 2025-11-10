import { useEffect, useState } from "react";
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";

export default function ThumbMark() {
  const [info, setInfo] = useState();
  useEffect(() => {
    const tm = new Thumbmark({ apiKey: "1c1f8a186ac04c61a319e41477c602fc" });

    tm.get().then((res) => {
      console.log(res);
      setInfo(res);
    });
  }, []);

  return (
    <>
      <h1>Id: {info?.thumbmark}</h1>
      <h1>Language: {info?.components.locales.languages}</h1>
      <h1>userAgent: {info?.components.system.useragent}</h1>

    </>
  );
}
