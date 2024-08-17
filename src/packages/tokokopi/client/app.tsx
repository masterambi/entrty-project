import React, { useState } from "react";
import httpReq from "~/lib/core/helpers/httpReq";

type Props = {};

const App = (props: Props) => {
  const [message, setMessage] = useState("");
  httpReq("/api/v1/users", { method: "GET" })
    .then((data) => {
      console.log(data);
      setMessage(data.response.message);
    })
    .catch((data) => {
      console.log(data);
    });

  return <div>{message}</div>;
};

export default App;
