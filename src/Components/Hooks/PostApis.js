import { useState, useEffect } from "react";
import axios from "axios";
// const ServerURL = "http://192.168.0.5:8001"
import { ServerURL } from "../services/FetchNodeServices";

export const usePost = (options) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [cancelToken, setCancelToken] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);



  // console.log('aixos options' ,uploadPercentage)

  const makePostRequest = async (url,body) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const source = axios.CancelToken.source();
    setCancelToken(source);

    try {
      const response = await axios.post(`${ServerURL}/${url}`, body, {
        ...options,
        cancelToken: source.token,
        headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}`},
      });
            setResponse(response);
      var result = await response.data
      return (result)

    }
    catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled");
        return (false)
      } else {
        setError(error);
        console.log('error', error)
        return (false)
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = () => {


    console.log('girraj singh')
    if (cancelToken) {
      cancelToken.cancel();
    }
  };

  useEffect(() => {
    return cancelRequest;
  }, []);

  return {
    isLoading,
    error,
    response,
    makePostRequest,
    cancelRequest,
  };
};
