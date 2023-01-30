import { Fade } from "react-slideshow-image";

function Background() {
  return (
    <div className="slide-container">
      <Fade pauseOnHover={false} duration={3500}>
        <div className="each-fade">
          <div className="banner banner1" />
        </div>
        <div className="each-fade">
          <div className="banner banner2" />
        </div>
        <div className="each-fade">
          <div className="banner banner3" />
        </div>
        <div className="each-fade">
          <div className="banner banner4" />
        </div>
      </Fade>
    </div>
  )
}

export default Background;