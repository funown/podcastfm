/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, createRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import Skeleton from "react-loading-skeleton";
import DOMPurify from "dompurify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  fas,
  faArrowCircleDown,
  faLink,
  faRssSquare,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import "./App.scss";

library.add(
  fab,
  faGithub,
  fas,
  faArrowCircleDown,
  faLink,
  faRssSquare,
  faEnvelope
);

function App() {
  const [feed, setFeed] = useState({
    title: "",
    author: "",
    feedUrl: "",
    link: "",
    email: "",
    description: "",
    image: "",
  });
  const [episode, setEpisode] = useState({
    title: "",
    link: "",
    guid: "",
    content: "",
    description: "",
    url: "",
    type: "",
    image: "",
  });
  const [loaded, setLoaded] = useState(false);

  const [player] = useState(createRef());
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [currentPos, setCurrentPos] = useState(0.0);
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(1.0);

  const addHeadingZero = (num) => {
    return num > 9 ? num.toString() : `0${num}`;
  };

  const getTime = (num) => {
    let minutes = Math.floor(num / 60);
    let hours = Math.floor(minutes / 60);
    let seconds = Math.floor(num % 60);

    let strHours = addHeadingZero(hours);
    let strMinutes = addHeadingZero(
      num >= 3600 ? Math.floor(minutes % 60) : minutes
    );
    let strSeconds = addHeadingZero(seconds);

    const mmSs = `${strMinutes}:${strSeconds}`;
    const hhMmSs = `${strHours}:${strMinutes}:${strSeconds}`;

    if (num >= 3600) {
      return hhMmSs;
    }
    return mmSs;
  };

  const getRandom = async () => {
    setEpisode({
      ...episode,
      url: "",
      image: "",
    });
    await fetch("/api/random")
      .then((response) => response.json())
      .then((data) => {
        setFeed({
          ...feed,
          title: data.title,
          link: data.link,
          feedUrl: data.feedUrl,
          author: data.itunes.author,
          email: data.itunes.owner.email,
          description: data.description,
          image: data.itunes.image,
        });
        let randomEpisode =
          data.items[Math.floor(Math.random() * Math.floor(data.items.length))];
        setEpisode({
          ...episode,
          title: randomEpisode.title,
          link: randomEpisode.link,
          guid: randomEpisode.guid,
          content:
            randomEpisode["content:encoded"] == null
              ? randomEpisode.content
              : randomEpisode["content:encoded"],
          description: randomEpisode.description,
          url: randomEpisode.enclosure.url,
          type: randomEpisode.enclosure.type,
          image: randomEpisode.itunes.image,
        });
        setLoaded(true);
      })
      .catch((er) => {
        console.log(`random error: ${er}`);
      });
  };

  const handleSeekBar = (e) => {
    setCurrentPos(e.target.value);
    player.current.audio.current.currentTime = e.target.value;
  };

  const handleAudioPlayAndPause = () => {
    let control = player.current.audio.current;
    player.current.isPlaying() ? control.pause() : control.play();
  };

  const handleNext = () => {
    setLoaded(false);
    getRandom();
  };

  const getVolumeIcon = () => {
    if (mute) {
      return (
        <svg
          t="1612941915218"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2239"
          width="24"
          height="24"
        >
          <path
            d="M721.493333 600.746667l61.44 61.44a256 256 0 0 0-2.986666-305.066667 42.666667 42.666667 0 1 0-66.56 53.76 170.666667 170.666667 0 0 1 8.106666 189.866667z"
            p-id="2240"
          ></path>
          <path
            d="M896 512a277.76 277.76 0 0 1-75.946667 187.306667l60.586667 60.586666A363.946667 363.946667 0 0 0 981.333333 512a373.333333 373.333333 0 0 0-143.36-288.853333 42.666667 42.666667 0 1 0-54.613333 65.706666A290.133333 290.133333 0 0 1 896 512zM640 519.253333V170.666667a42.666667 42.666667 0 0 0-66.986667-35.413334L384 264.533333zM202.24 322.986667H85.333333a42.666667 42.666667 0 0 0-42.666666 42.666666v292.693334a42.666667 42.666667 0 0 0 42.666666 42.666666h213.333334l273.493333 187.733334A45.226667 45.226667 0 0 0 597.333333 896a42.666667 42.666667 0 0 0 42.666667-42.666667v-92.586666zM200.96 140.373333a42.666667 42.666667 0 0 0-60.586667 60.586667l682.666667 682.666667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z"
            p-id="2241"
          ></path>
        </svg>
      );
    }

    if (volume === 0) {
      return (
        <svg
          t="1612942137008"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2481"
          width="24"
          height="24"
        >
          <path
            d="M725.333333 896a45.226667 45.226667 0 0 1-24.32-7.253333L426.666667 701.013333H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V365.653333a42.666667 42.666667 0 0 1 42.666666-42.666666h213.333334l273.493333-187.733334A42.666667 42.666667 0 0 1 768 170.666667v682.666666a42.666667 42.666667 0 0 1-42.666667 42.666667z"
            p-id="2482"
          ></path>
        </svg>
      );
    }

    if (volume <= 0.5) {
      return (
        <svg
          t="1612942190946"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2686"
          width="24"
          height="24"
        >
          <path
            d="M886.613333 357.12a42.666667 42.666667 0 1 0-66.56 53.76 170.666667 170.666667 0 0 1 0 202.24A42.666667 42.666667 0 0 0 853.333333 682.666667a42.666667 42.666667 0 0 0 33.28-15.786667 256 256 0 0 0 0-309.76zM702.72 133.12a42.666667 42.666667 0 0 0-42.666667 0L384 322.986667H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v292.693334a42.666667 42.666667 0 0 0 42.666667 42.666666h213.333333l273.493333 187.733334A45.226667 45.226667 0 0 0 682.666667 896a42.666667 42.666667 0 0 0 42.666666-42.666667V170.666667a42.666667 42.666667 0 0 0-22.613333-37.546667z"
            p-id="2687"
          ></path>
        </svg>
      );
    }

    return (
      <svg
        t="1612942535770"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2927"
        width="24"
        height="24"
      >
        <path
          d="M779.946667 357.12a42.666667 42.666667 0 1 0-66.56 53.76 170.666667 170.666667 0 0 1 0 202.24A42.666667 42.666667 0 0 0 746.666667 682.666667a42.666667 42.666667 0 0 0 33.28-15.786667 256 256 0 0 0 0-309.76z"
          p-id="2928"
        ></path>
        <path
          d="M837.973333 223.146667a42.666667 42.666667 0 1 0-54.613333 65.706666A290.133333 290.133333 0 0 1 896 512a290.133333 290.133333 0 0 1-112.64 223.146667 42.666667 42.666667 0 0 0-5.546667 60.16A42.666667 42.666667 0 0 0 810.666667 810.666667a42.666667 42.666667 0 0 0 27.306666-9.813334A373.333333 373.333333 0 0 0 981.333333 512a373.333333 373.333333 0 0 0-143.36-288.853333zM617.386667 133.12a42.666667 42.666667 0 0 0-42.666667 0L298.666667 322.986667H85.333333a42.666667 42.666667 0 0 0-42.666666 42.666666v292.693334a42.666667 42.666667 0 0 0 42.666666 42.666666h213.333334l273.493333 187.733334A45.226667 45.226667 0 0 0 597.333333 896a42.666667 42.666667 0 0 0 42.666667-42.666667V170.666667a42.666667 42.666667 0 0 0-22.613333-37.546667z"
          p-id="2929"
        ></path>
      </svg>
    );
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    player.current.audio.current.volume = e.target.value;
  };

  const muteVolume = (e) => {
    setMute(!mute);
  };

  useEffect(() => {
    getRandom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="head-bar">
        <a className="logo" href="/">
          J<span>O</span>BA
        </a>
        <a
          className="icon-btn"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </div>
      <div className="main">
        <div className="player-section">
          <div className="episode-title">
            {loaded ? episode.title : <Skeleton />}
          </div>
          <div className="producer">
            {loaded ? (
              <img
                className="feed-logo"
                src={feed.image}
                alt="podcast's logo"
              ></img>
            ) : (
              <Skeleton circle={true} height={50} width={50} />
            )}
            <div className="feed-title">
              {loaded ? feed.title : <Skeleton />}
            </div>
          </div>
          <div className="player">
            <div className="invisible">
              <AudioPlayer
                src={episode.url}
                type={episode.type}
                ref={player}
                preload="metadata"
                onPlay={(e) => setPlaying(true)}
                onPause={(e) => setPlaying(false)}
                onListen={(e) => setCurrentPos(e.target.currentTime)}
                onEnded={(e) => {
                  setLoaded(false);
                  getRandom();
                }}
                onCanPlay={(e) =>
                  setDuration(
                    player.current.audio.current.attributes.src.ownerElement
                      .duration
                  )
                }
              />
            </div>
            <div className="control">
              <span
                className="icon-btn"
                alt="Play"
                onClick={handleAudioPlayAndPause}
              >
                {playing ? (
                  <svg
                    width="21"
                    height="23"
                    viewBox="0 0 21 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.5 0C3.88071 0 5 1.11929 5 2.5V20.5C5 21.8807 3.88071 23 2.5 23C1.11929 23 0 21.8807 0 20.5V2.5C0 1.11929 1.11929 0 2.5 0ZM18 0C19.3807 0 20.5 1.11929 20.5 2.5V20.5C20.5 21.8807 19.3807 23 18 23C16.6193 23 15.5 21.8807 15.5 20.5V2.5C15.5 1.11929 16.6193 0 18 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    width="21"
                    height="24"
                    viewBox="0 0 21 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.8 7.49686C19.1628 8.86101 20.3442 9.54308 20.7406 10.4336C21.0865 11.2103 21.0865 12.0973 20.7406 12.874C20.3442 13.7645 19.1628 14.4466 16.8 15.8107L7.2 21.3533C4.83722 22.7174 3.65583 23.3995 2.68641 23.2976C1.84085 23.2087 1.0727 22.7652 0.572948 22.0774C0 21.2888 0 19.9246 0 17.1963V6.11121C0 3.38291 0 2.01877 0.572948 1.23017C1.0727 0.542322 1.84085 0.0988328 2.68641 0.00995995C3.65583 -0.0919302 4.83722 0.590145 7.2 1.95429L16.8 7.49686Z"
                    />
                  </svg>
                )}
              </span>
              <span
                className="control-btn icon-btn"
                alt="Next"
                onClick={handleNext}
              >
                <svg
                  width="20"
                  height="22"
                  viewBox="0 0 20 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.311899 1.29208C0.979272 0.0833662 2.50014 -0.355474 3.70885 0.311899L18.7088 8.59395C19.4971 9.02917 19.9904 9.85465 20.0003 10.755C20.0102 11.6554 19.5352 12.4915 18.7567 12.944L3.75669 21.6619C2.56295 22.3557 1.0328 21.9504 0.339007 20.7567C-0.35479 19.563 0.0504928 18.0328 1.24423 17.339L12.4293 10.8383L1.29208 4.68902C0.0833662 4.02165 -0.355474 2.50079 0.311899 1.29208Z"
                  />
                </svg>
              </span>
              <span className="spacer"></span>
              <span className="volume-ctrl">
                <span
                  className="control-btn icon-btn"
                  alt="change volume"
                  onClick={muteVolume}
                >
                  {getVolumeIcon()}
                </span>
                <input
                  type="range"
                  step="0.1"
                  min="0"
                  max="1.0"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </span>
            </div>
            <div className="indicator">
              <input
                type="range"
                className="seekBar"
                step="0.000001"
                value={currentPos}
                min="0"
                max={duration}
                onInput={handleSeekBar}
              />
              <div className="progress-time">
                <span className="current">{getTime(currentPos)}</span>
                <span className="duration">{getTime(duration)}</span>
              </div>
            </div>
          </div>
          <div className="links">
            <a
              href={episode.url}
              className="icon-btn"
              alt="download link"
              download
            >
              <FontAwesomeIcon icon={faArrowCircleDown} size="lg" />
            </a>
            <a
              href={feed.feedUrl}
              className="icon-btn"
              alt="feed link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faRssSquare} size="lg" />
            </a>
            <a
              href={episode.link ?? feed.link}
              className="icon-btn"
              alt="website link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLink} size="lg" />
            </a>
            <a
              href={`mailto: ${feed.email}`}
              className="icon-btn"
              alt="email link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </a>
          </div>
        </div>
        {loaded ? (
          <div
            className="show-note"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                episode.content ?? episode.description
              ),
            }}
          ></div>
        ) : (
          <div className="show-note">
            <Skeleton count={5} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
