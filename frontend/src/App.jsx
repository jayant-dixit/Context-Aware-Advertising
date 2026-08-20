import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const [placements, setPlacements] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [currentAd, setCurrentAd] = useState(null);

  const playerRef = useRef(null);
  const pollingRef = useRef(null);
  const timeIntervalRef = useRef(null);

  // --------------------------------------------------
  // Extract YouTube video ID
  // --------------------------------------------------

  const extractVideoId = (url) => {
    try {
      const parsed = new URL(url);

      // youtube.com/watch?v=VIDEO_ID
      if (parsed.hostname.includes("youtube.com")) {
        return parsed.searchParams.get("v");
      }

      // youtu.be/VIDEO_ID
      if (parsed.hostname.includes("youtu.be")) {
        return parsed.pathname.substring(1);
      }

      return null;
    } catch {
      return null;
    }
  };

  // --------------------------------------------------
  // Start analysis
  // --------------------------------------------------

  const startAnalysis = async () => {
    if (!youtubeUrl.trim()) {
      alert("Please enter a YouTube URL.");
      return;
    }

    const id = extractVideoId(youtubeUrl);

    if (!id) {
      alert("Invalid YouTube URL.");
      return;
    }

    setVideoId(id);

    setStatus("starting");
    setProgress(0);
    setPlacements([]);
    setCurrentAd(null);

    try {
      const response = await fetch(
        `${API_URL}/api/analyze`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            youtube_url: youtubeUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to start analysis."
        );
      }

      const newJobId = data.job_id;

      setJobId(newJobId);
      setStatus("processing");

      // Start polling backend
      startPolling(newJobId);

    } catch (error) {
      console.error(error);

      setStatus("error");

      alert(error.message);
    }
  };

  // --------------------------------------------------
  // Poll analysis status
  // --------------------------------------------------

  const startPolling = (id) => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(
      async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/analyze/${id}`
          );

          if (!response.ok) {
            throw new Error(
              "Failed to get analysis status."
            );
          }

          const result = await response.json();

          const job = result.data;

          setStatus(job.status);

          setProgress(
            job.progress || 0
          );

          // New advertisements discovered
          setPlacements(
            job.placements || []
          );

          if (job.status === "completed") {
            clearInterval(
              pollingRef.current
            );

            pollingRef.current = null;

            setProgress(100);
          }

          if (job.status === "failed") {
            clearInterval(
              pollingRef.current
            );

            pollingRef.current = null;

            alert(
              job.error ||
                "Video analysis failed."
            );
          }

        } catch (error) {
          console.error(
            "Polling error:",
            error
          );
        }
      },
      3000
    );
  };

  // --------------------------------------------------
  // YouTube player ready
  // --------------------------------------------------

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  // --------------------------------------------------
  // Track video time
  // --------------------------------------------------

  const startTimeTracking = () => {
    if (timeIntervalRef.current) {
      clearInterval(
        timeIntervalRef.current
      );
    }

    timeIntervalRef.current = setInterval(
      () => {
        if (!playerRef.current) {
          return;
        }

        const time =
          playerRef.current.getCurrentTime();

        setCurrentTime(time);
      },
      500
    );
  };

  // --------------------------------------------------
  // Stop time tracking
  // --------------------------------------------------

  const stopTimeTracking = () => {
    if (timeIntervalRef.current) {
      clearInterval(
        timeIntervalRef.current
      );

      timeIntervalRef.current = null;
    }
  };

  // --------------------------------------------------
  // Find advertisement for current timestamp
  // --------------------------------------------------

  useEffect(() => {
    if (!placements.length) {
      setCurrentAd(null);
      return;
    }

    /*
      Example placements:

      10s → Nike
      25s → Amazon
      40s → Zomato

      If current time is 27s,
      we use the latest placement
      whose timestamp <= current time.
    */

    let latestAd = null;

    for (const placement of placements) {
      if (
        placement.timestamp <= currentTime
      ) {
        if (
          !latestAd ||
          placement.timestamp >
            latestAd.timestamp
        ) {
          latestAd = placement;
        }
      }
    }

    setCurrentAd(latestAd);

  }, [
    currentTime,
    placements,
  ]);

  // --------------------------------------------------
  // Cleanup
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(
          pollingRef.current
        );
      }

      if (timeIntervalRef.current) {
        clearInterval(
          timeIntervalRef.current
        );
      }
    };
  }, []);

  // --------------------------------------------------
  // Player options
  // --------------------------------------------------

  const playerOptions = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
    },
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="app">

      <header className="header">
        <h1>
          Contextual Advertising
        </h1>

        <p>
          AI-powered advertisement placement
        </p>
      </header>


      {/* ------------------------------------------ */}
      {/* URL INPUT */}
      {/* ------------------------------------------ */}

      <div className="input-section">

        <input
          type="text"
          placeholder="Paste YouTube video URL..."
          value={youtubeUrl}
          onChange={(e) =>
            setYoutubeUrl(
              e.target.value
            )
          }
          disabled={
            status === "processing"
          }
        />

        <button
          onClick={startAnalysis}
          disabled={
            status === "processing"
          }
        >
          {status === "processing"
            ? "Analyzing..."
            : "Analyze Video"}
        </button>

      </div>


      {/* ------------------------------------------ */}
      {/* STATUS */}
      {/* ------------------------------------------ */}

      {status !== "idle" && (
        <div className="status">

          <div>
            Status:{" "}
            <strong>
              {status}
            </strong>
          </div>

          <div>
            Progress:{" "}
            <strong>
              {progress}%
            </strong>
          </div>

          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>
      )}


      {/* ------------------------------------------ */}
      {/* MAIN CONTENT */}
      {/* ------------------------------------------ */}

      {videoId && (
        <div className="content">

          {/* VIDEO */}

          <div className="video-section">

            <div className="video-wrapper">

              <YouTube
                className="youtube"
                videoId={videoId}
                opts={playerOptions}
                onReady={onPlayerReady}
                onPlay={
                  startTimeTracking
                }
                onPause={
                  stopTimeTracking
                }
                onEnd={
                  stopTimeTracking
                }
              />

            </div>

            <div className="time">

              Video time:{" "}

              <strong>
                {formatTime(
                  currentTime
                )}
              </strong>

            </div>

          </div>


          {/* AD */}

          <div className="ad-section">

            <h2>
              Contextual Advertisement
            </h2>

            {!currentAd && (
              <div className="no-ad">
                {status ===
                "processing"
                  ? "Analyzing video..."
                  : "No advertisement available"}
              </div>
            )}


            {currentAd && (
              <div className="ad-card">

                <div className="ad-label">
                  RECOMMENDED AD
                </div>

                <h3>
                  {currentAd.ad.brand}
                </h3>

                <h4>
                  {currentAd.ad.title}
                </h4>

                <div className="ad-category">
                  {currentAd.ad.category}
                </div>

                <p>
                  {currentAd.ad.description}
                </p>

                <div className="ad-meta">

                  <span>
                    At{" "}
                    {currentAd.timestamp_formatted}
                  </span>

                  <span>
                    Score:{" "}
                    {currentAd.score.toFixed(
                      3
                    )}
                  </span>

                </div>

              </div>
            )}

          </div>

        </div>
      )}


      {/* ------------------------------------------ */}
      {/* DEBUG: PLACEMENTS */}
      {/* ------------------------------------------ */}

      {placements.length > 0 && (
        <div className="placements">

          <h2>
            Detected Advertisements
          </h2>

          {placements.map(
            (placement, index) => (

              <div
                className="placement"
                key={`${placement.timestamp}-${index}`}
              >

                <div>
                  <strong>
                    {
                      placement.timestamp_formatted
                    }
                  </strong>
                </div>

                <div>
                  {
                    placement.ad.brand
                  }
                </div>

                <div>
                  {
                    placement.scene
                  }
                </div>

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
}


// --------------------------------------------------
// Format seconds
// --------------------------------------------------

function formatTime(seconds) {

  const totalSeconds =
    Math.floor(seconds);

  const minutes =
    Math.floor(
      totalSeconds / 60
    );

  const secs =
    totalSeconds % 60;

  return (
    `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`
  );
}


export default App;