import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:8000/api";

export default function useQuery(api){
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   
    useEffect(() => {
        const getData = async () => {
            try{
              setLoading(true);
              const info = await fetch(`${BASE_URL}/${api}`, {
                method: 'GET',
                mode: "cors",
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              
              if (!info.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await info.json();
              setData(data);
            } catch {
              setError("Api Error Info");
            } finally {
                setLoading(false);
            }
        }
        getData();
     }, []);

    return {data, loading, error};
};

