import { useState, useEffect } from "react";
import axios from "axios";
// const ServerURL = "http://192.168.0.5:8001"
import { ServerURL } from "../services/FetchNodeServices";
import { getDecreyptedData } from "../utils/localstorage";

export const useGet = (options) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [cancelToken, setCancelToken] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);



  // console.log('aixos options' ,uploadPercentage)

  const skip = `page_size=50`

  const makeGetRequest = async (url) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const source = axios.CancelToken.source();
    setCancelToken(source);

    try {
      const response = await axios.get(`${ServerURL}/${url}`, {
        ...options,
        cancelToken: source.token,
        headers: { Authorization: `token ${getDecreyptedData("tokenKey")}`},
      });
            // setResponse(response);
      var result = await response.data
      return (result)

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled");
        return (false)
      } else {
        setError(error);
        return (false)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = () => {


    // console.log('girraj singh')
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
    makeGetRequest,
    cancelRequest,
  };
};
