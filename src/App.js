import './App.css';
import { useState } from 'react';

function App() {
  const [answer, setAnswer] = useState('');
  const [submittedCorrect, setSubmittedCorrect] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [carouselVisible, setCarouselVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const imageCount = 16;
  const [srcExts, setSrcExts] = useState(Array(imageCount).fill('jpg'));

  const baseNames = Array.from({ length: imageCount }, (_, i) => `/photo${i + 1}`);

  function currentSrc(index) {
    return `${baseNames[index]}.${srcExts[index]}`;
  }

  function handleImageError(index) {
    setSrcExts((prev) => {
      const next = [...prev];
      const current = next[index];
      if (current === 'jpg') {
        next[index] = 'JPG';
      } else if (current === 'JPG') {
        next[index] = 'jpeg';
      } else if (current === 'jpeg') {
        next[index] = 'JPEG';
      } else if (current === 'JPEG') {
        next[index] = 'png';
      } else if (current === 'png') {
        next[index] = 'webp';
      } else {
        // No more fallbacks; keep last attempted extension
        next[index] = current;
      }
      return next;
    });
  }

  function goPrev() {
    setPreviousIndex(currentIndex);
    const nextIndex = (currentIndex - 1 + baseNames.length) % baseNames.length;
    setCurrentIndex(nextIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 450);
  }

  function goNext() {
    setPreviousIndex(currentIndex);
    const nextIndex = (currentIndex + 1) % baseNames.length;
    setCurrentIndex(nextIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 450);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const normalized = answer.trim().toLowerCase();
    if (normalized === 'gualala') {
      setSubmittedCorrect(true);
      // wait for prompt fade-out (matches CSS 1200ms), then hide and show carousel
      setTimeout(() => {
        setShowPrompt(false);
        setCarouselVisible(true);
      }, 1200);
    }
  }

  return (
    <div className="App" role="main">
      {showPrompt && (
        <div className={`prompt-card${submittedCorrect ? ' fade-out' : ''}`}>
          <h1 className="prompt-question">
            <span className="prompt-line">What town did we stay in</span>
            <span className="prompt-line">when we saw Mazi the Giraffe?</span>
          </h1>
          <form onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="answer">Answer</label>
            <input
              id="answer"
              className="prompt-input"
              type="text"
              placeholder="Type your answer"
              autoComplete="off"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button type="submit" className="sr-only">Submit</button>
          </form>
        </div>
      )}

      {submittedCorrect && (
        <div className={`carousel${carouselVisible ? ' show' : ''}`}>
          <div className="carousel-track">
            <img
              className="carousel-thumb"
              src={currentSrc((currentIndex - 1 + baseNames.length) % baseNames.length)}
              onClick={goPrev}
              alt="Previous memory"
              onError={() => handleImageError((currentIndex - 1 + baseNames.length) % baseNames.length)}
            />
            <div className="carousel-stage">
              {isAnimating && previousIndex !== null && (
                <img
                  className="slide-image fade-out"
                  src={currentSrc(previousIndex)}
                  alt="Previous"
                  onError={() => handleImageError(previousIndex)}
                />
              )}
              <img
                className={`slide-image ${isAnimating ? 'fade-in' : 'shown'}`}
                src={currentSrc(currentIndex)}
                onError={() => handleImageError(currentIndex)}
                alt={`Memory ${currentIndex + 1}`}
              />
            </div>
            <img
              className="carousel-thumb"
              src={currentSrc((currentIndex + 1) % baseNames.length)}
              onClick={goNext}
              alt="Next memory"
              onError={() => handleImageError((currentIndex + 1) % baseNames.length)}
            />
          </div>
          <div className="carousel-controls">
            <button type="button" className="nav-btn" onClick={goPrev} aria-label="Previous photo">◀</button>
            <button type="button" className="nav-btn" onClick={goNext} aria-label="Next photo">▶</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
