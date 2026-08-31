import os
import cv2
import json
import re
import shutil
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi


class YouTubeFeatureExtractor:

    def __init__(self, output_dir="data"):

        self.output_dir = output_dir

        self.dirs = {
            "videos": os.path.join(
                output_dir,
                "videos"
            ),

            "frames": os.path.join(
                output_dir,
                "frames"
            ),

            "metadata": os.path.join(
                output_dir,
                "metadata"
            ),

            "transcripts": os.path.join(
                output_dir,
                "transcripts"
            ),

            "results": os.path.join(
                output_dir,
                "results"
            )
        }

        for path in self.dirs.values():
            os.makedirs(
                path,
                exist_ok=True
            )

        # ==========================================================
        # YOUTUBE COOKIES
        # ==========================================================
        #
        # Render Secret File:
        #
        # /etc/secrets/youtube_cookies.txt
        #
        # Render Secret Files are READ-ONLY.
        #
        # Therefore we copy the cookie file to /tmp, which is
        # writable, and give the writable copy to yt-dlp.
        #
        # ==========================================================

        secret_cookie_file = os.getenv(
            "YOUTUBE_COOKIES_FILE",
            "/etc/secrets/youtube_cookies.txt"
        )

        self.cookies_file = None

        if os.path.exists(secret_cookie_file):

            writable_cookie_file = os.path.join(
                "/tmp",
                "youtube_cookies.txt"
            )

            try:

                shutil.copy2(
                    secret_cookie_file,
                    writable_cookie_file
                )

                self.cookies_file = (
                    writable_cookie_file
                )

                print(
                    "🍪 YouTube cookies loaded successfully."
                )

            except Exception as e:

                print(
                    f"⚠️ Could not copy YouTube cookies: {e}"
                )

        else:

            print(
                "⚠️ YouTube cookies file not found."
            )


    # ==============================================================
    # CLEANUP
    # ==============================================================

    def cleanup_temp_files(
        self,
        video_id: str
    ):

        """
        Safely delete temporary heavy .mp4 video file
        and extracted frames directory.

        Preserves:
            - metadata
            - transcripts
            - analysis results
        """

        video_path = os.path.join(
            self.dirs["videos"],
            f"{video_id}.mp4"
        )

        if os.path.exists(video_path):

            try:

                os.remove(
                    video_path
                )

                print(
                    f"[CLEANUP] Deleted temporary video: "
                    f"{video_path}"
                )

            except Exception as e:

                print(
                    f"[!] Could not delete video "
                    f"{video_path}: {e}"
                )


        frame_dir = os.path.join(
            self.dirs["frames"],
            video_id
        )

        if os.path.exists(frame_dir):

            try:

                shutil.rmtree(
                    frame_dir
                )

                print(
                    f"[CLEANUP] Deleted temporary frames "
                    f"directory: {frame_dir}"
                )

            except Exception as e:

                print(
                    f"[!] Could not delete frames directory "
                    f"{frame_dir}: {e}"
                )


    # ==============================================================
    # VIDEO ID
    # ==============================================================

    def extract_video_id(
        self,
        url
    ):

        match = re.search(
            r"(?:v=|\/|embed\/|youtu\.be\/)"
            r"([0-9A-Za-z_-]{11})",
            url
        )

        return (
            match.group(1)
            if match
            else None
        )


    # ==============================================================
    # DOWNLOAD VIDEO + METADATA
    # ==============================================================

    def download_video_and_metadata(
        self,
        url,
        video_id
    ):

        print(
            f"\n[1/3] Fetching video: {video_id}"
        )

        video_path = os.path.join(
            self.dirs["videos"],
            f"{video_id}.mp4"
        )

        metadata_path = os.path.join(
            self.dirs["metadata"],
            f"{video_id}.json"
        )

        clean_url = (
            f"https://www.youtube.com/watch?v={video_id}"
        )

        ydl_opts = {

            # Prefer low-resolution video because this
            # is being used for scene/context analysis.
            "format":
                "best[height<=360][ext=mp4]"
                "/bestvideo[height<=360][ext=mp4]+bestaudio"
                "/best[height<=480][ext=mp4]"
                "/worst[ext=mp4]"
                "/worst",

            "outtmpl":
                video_path,

            "noplaylist":
                True,

            "quiet":
                False,

            "no_warnings":
                False,

            "socket_timeout":
                20,

            "retries":
                5,

            "fragment_retries":
                5,

            "file_access_retries":
                3,

            "http_headers": {

                "User-Agent":
                    (
                        "Mozilla/5.0 "
                        "(Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 "
                        "(KHTML, like Gecko) "
                        "Chrome/120.0.0.0 "
                        "Safari/537.36"
                    ),

                "Accept-Language":
                    "en-US,en;q=0.9"
            },

            # Don't force Android/Web clients.
            # Let the current yt-dlp extractor decide.
            "extractor_args": {
                "youtube": {}
            }
        }


        # ==========================================================
        # USE WRITABLE COOKIE COPY
        # ==========================================================

        if self.cookies_file:

            ydl_opts["cookiefile"] = (
                self.cookies_file
            )


        # ==========================================================
        # DOWNLOAD
        # ==========================================================

        try:

            with yt_dlp.YoutubeDL(
                ydl_opts
            ) as ydl:

                info = ydl.extract_info(
                    clean_url,
                    download=True
                )


        except yt_dlp.utils.DownloadError as e:

            error_message = str(e)

            print(
                "\n❌ YouTube download failed."
            )


            # ------------------------------------------------------
            # BOT / AUTHENTICATION ERROR
            # ------------------------------------------------------

            if (
                "Sign in to confirm" in error_message
                or
                "not a bot" in error_message.lower()
            ):

                print(
                    "\n🔐 YouTube is requiring "
                    "authentication."
                )

                if self.cookies_file:

                    print(
                        "🍪 Cookie file was supplied."
                    )

                    print(
                        "⚠️ YouTube still rejected "
                        "the authenticated request."
                    )

                    print(
                        "The cookies may be expired, "
                        "invalid, or rejected by YouTube."
                    )

                else:

                    print(
                        "⚠️ No YouTube cookies are configured."
                    )

                return None


            # ------------------------------------------------------
            # RATE LIMIT
            # ------------------------------------------------------

            if (
                "429" in error_message
                or
                "Too Many Requests" in error_message
            ):

                print(
                    "\n🚦 YouTube rate-limited "
                    "the request."
                )

                print(
                    "Try again later and avoid "
                    "high download concurrency."
                )

                return None


            print(
                f"\nError details:\n{error_message}"
            )

            return None


        except Exception as e:

            print(
                f"\n❌ Unexpected download error: {e}"
            )

            return None


        if not info:

            print(
                "❌ yt-dlp returned no video information."
            )

            return None


        # ==========================================================
        # METADATA
        # ==========================================================

        metadata = {

            "id":
                info.get("id"),

            "title":
                info.get("title"),

            "description":
                info.get("description"),

            "tags":
                info.get("tags", []),

            "categories":
                info.get("categories", []),

            "view_count":
                info.get("view_count"),

            "like_count":
                info.get("like_count"),

            "duration":
                info.get("duration"),

            "channel":
                info.get("uploader"),

            "channel_id":
                info.get("channel_id"),

            "upload_date":
                info.get("upload_date"),

            "webpage_url":
                info.get("webpage_url")
        }


        try:

            with open(
                metadata_path,
                "w",
                encoding="utf-8"
            ) as f:

                json.dump(
                    metadata,
                    f,
                    indent=4,
                    ensure_ascii=False
                )

        except Exception as e:

            print(
                f"⚠️ Could not save metadata: {e}"
            )


        print(
            f"[OK] Video saved: {video_path}"
        )

        print(
            f"[OK] Metadata saved: {metadata_path}"
        )

        return video_path


    # ==============================================================
    # GET METADATA
    # ==============================================================

    def get_metadata(
        self,
        video_id: str
    ) -> dict:

        metadata_path = os.path.join(
            self.dirs["metadata"],
            f"{video_id}.json"
        )

        if os.path.exists(metadata_path):

            try:

                with open(
                    metadata_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    return json.load(f)

            except Exception as e:

                print(
                    f"[!] Could not read metadata "
                    f"{metadata_path}: {e}"
                )

        return {}


    # ==============================================================
    # TRANSCRIPT
    # ==============================================================

    def get_transcript(
        self,
        video_id: str
    ) -> list:

        """
        Fetch and cache timestamped subtitle transcript.
        """

        transcript_path = os.path.join(
            self.dirs["transcripts"],
            f"{video_id}.json"
        )

        # ----------------------------------------------------------
        # CACHE
        # ----------------------------------------------------------

        if os.path.exists(transcript_path):

            try:

                with open(
                    transcript_path,
                    "r",
                    encoding="utf-8"
                ) as f:

                    return json.load(f)

            except Exception:
                pass


        print(
            f"\n[2/3] Fetching transcript "
            f"for: {video_id}..."
        )


        try:

            api = YouTubeTranscriptApi()


            try:

                raw_transcript = api.fetch(
                    video_id
                )

            except Exception:

                transcript_list = api.list(
                    video_id
                )

                transcript_obj = (
                    transcript_list.find_transcript(
                        [
                            "en",
                            "en-US",
                            "en-GB",
                            "hi"
                        ]
                    )
                )

                raw_transcript = (
                    transcript_obj.fetch()
                )


            formatted = []


            for item in raw_transcript:

                if isinstance(
                    item,
                    dict
                ):

                    text = item.get(
                        "text"
                    )

                    start = item.get(
                        "start",
                        0.0
                    )

                    duration = item.get(
                        "duration",
                        0.0
                    )

                else:

                    text = getattr(
                        item,
                        "text",
                        None
                    )

                    start = getattr(
                        item,
                        "start",
                        0.0
                    )

                    duration = getattr(
                        item,
                        "duration",
                        0.0
                    )


                if text:

                    formatted.append({

                        "text":
                            text.replace(
                                "\n",
                                " "
                            ).strip(),

                        "start":
                            float(start),

                        "duration":
                            float(duration)
                    })


            with open(
                transcript_path,
                "w",
                encoding="utf-8"
            ) as f:

                json.dump(
                    formatted,
                    f,
                    indent=2,
                    ensure_ascii=False
                )


            print(
                f"[OK] Transcript saved: "
                f"{len(formatted)} snippets "
                f"({transcript_path})"
            )

            return formatted


        except Exception as e:

            print(
                f"[!] No transcript available "
                f"for video {video_id}: {e}"
            )

            return []


    # ==============================================================
    # TRANSCRIPT WINDOW
    # ==============================================================

    def get_transcript_window(
        self,
        transcript: list,
        timestamp: float,
        window_seconds: float = 15.0
    ) -> str:

        if not transcript:
            return ""


        start_window = max(
            0.0,
            timestamp - window_seconds
        )

        end_window = (
            timestamp + window_seconds
        )


        matching_texts = []


        for item in transcript:

            item_start = item.get(
                "start",
                0.0
            )

            item_end = (
                item_start
                +
                item.get(
                    "duration",
                    0.0
                )
            )


            if (
                item_start <= end_window
                and
                item_end >= start_window
            ):

                text = item.get(
                    "text",
                    ""
                ).strip()


                # Remove bracketed sound effects.
                clean_text = re.sub(
                    r"\[.*?\]|\(.*?\)",
                    "",
                    text
                )


                # Remove music symbols.
                clean_text = re.sub(
                    r"[\u266a\u266b\u266c\u266d\u266e\u266f♫♪]",
                    " ",
                    clean_text
                )


                clean_text = re.sub(
                    r"\s+",
                    " ",
                    clean_text
                ).strip()


                if clean_text:

                    matching_texts.append(
                        clean_text
                    )


        return " ".join(
            matching_texts
        ).strip()


    # ==============================================================
    # FRAME EXTRACTION
    # ==============================================================

    def extract_frames(
        self,
        video_path,
        video_id,
        interval_seconds=5
    ):

        if not video_path:

            print(
                "❌ Frame extraction skipped "
                "because video download failed."
            )

            return


        if not os.path.exists(
            video_path
        ):

            print(
                f"❌ Video file does not exist: "
                f"{video_path}"
            )

            return


        print(
            f"\n[3/3] Extracting frames "
            f"every {interval_seconds} seconds..."
        )


        frame_dir = os.path.join(
            self.dirs["frames"],
            video_id
        )

        os.makedirs(
            frame_dir,
            exist_ok=True
        )


        cap = cv2.VideoCapture(
            video_path
        )


        if not cap.isOpened():

            print(
                "[ERROR] Could not open video."
            )

            return


        fps = cap.get(
            cv2.CAP_PROP_FPS
        )


        if not fps or fps <= 0:

            print(
                "[ERROR] Could not determine FPS."
            )

            cap.release()

            return


        frame_interval = max(
            1,
            int(
                fps * interval_seconds
            )
        )


        count = 0
        saved_count = 0


        while True:

            ret, frame = cap.read()


            if not ret:
                break


            if (
                count % frame_interval
                == 0
            ):

                timestamp = int(
                    count / fps
                )


                frame_filename = os.path.join(
                    frame_dir,
                    f"frame_{timestamp}s.jpg"
                )


                success = cv2.imwrite(
                    frame_filename,
                    frame
                )


                if success:

                    saved_count += 1


            count += 1


        cap.release()


        print(
            f"[OK] Extracted "
            f"{saved_count} frames "
            f"to {frame_dir}"
        )


# ==============================================================
# MAIN
# ==============================================================

if __name__ == "__main__":

    youtube_url = input(
        "Enter YouTube URL: "
    ).strip()


    extractor = (
        YouTubeFeatureExtractor()
    )


    video_id = (
        extractor.extract_video_id(
            youtube_url
        )
    )


    if not video_id:

        print(
            "[ERROR] Invalid YouTube URL."
        )

    else:

        video_path = (
            extractor.download_video_and_metadata(
                youtube_url,
                video_id
            )
        )


        # IMPORTANT:
        # Don't continue processing if yt-dlp failed.

        if video_path:

            transcript = (
                extractor.get_transcript(
                    video_id
                )
            )


            print(
                "Transcript sample at 30s: "
                # f"{extractor.get_transcript_window("
                #     "transcript,"
                #     "30"
                # )}"
            )


            extractor.extract_frames(
                video_path,
                video_id,
                interval_seconds=5
            )

        else:

            print(
                "\n❌ Processing stopped because "
                "the video could not be downloaded."
            )
