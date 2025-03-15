import { Button } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

export default function UserCard() {
  const [data, setData] = useState(null);
  const [sseConnection, setSSEConnection] = useState(null);

  const listenToSSEUpdates = useCallback(() => {
    console.log("listenToSSEUpdates func");
    const eventSource = new EventSource("/api/sse");
    eventSource.onopen = () => {
      console.log("SSE connection opened.");
      // Save the SSE connection reference in the state
      setSSEConnection(eventSource);
    };
    eventSource.onmessage = (event) => {
      console.log(event);
      setData(event.data);

      // Update your UI or do other processing with the received data
    };
    eventSource.onerror = (event) => {
      console.error("SSE Error:", event);
      // Handle the SSE error here
    };

    return eventSource;
  }, []);

  useEffect(() => {
    listenToSSEUpdates();
    return () => {
      if (sseConnection) {
        sseConnection.close();
      }
    };
  }, [listenToSSEUpdates]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.dir(sseConnection);
      if (sseConnection) {
        console.info("Closing SSE connection before unloading the page.");
        sseConnection.close();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sseConnection]);

  return (
    <div className="m-4 p-2 rounded-lg shadow-sm flex flex-col bg-gray-50">
      {data ? <div>{JSON.stringify(data)} </div> : <p>No data</p>}
      <Button onClick={() => (sseConnection ? sseConnection.close() : null)}>
        Close connection
      </Button>
    </div>
  );
}
