import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroModel from "./components/HeroModel";
import { CiMenuFries } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { Loader } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [hoveredCard, setHoveredCard] = useState<string>("normalMap");
  // const [open, setOpen] = useState(false);

  useGSAP(() => {
    // Animate section 2 - move from -100px to 0
    gsap.fromTo(
      "#section-2 .right",
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        // duration: 2,
        scrollTrigger: {
          trigger: "#section-2",
          start: "center bottom",
          end: "top 20%",
          scrub: 1,
          // markers: true,
        },
      },
    );

    // Animate section 4 - move from -100px to 0
    gsap.fromTo(
      "#section-4",
      {
        y: 200,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        // duration: 2,
        scrollTrigger: {
          trigger: "#section-4",
          start: "top center",
          end: "top 20%",
          // scrub: true,
          markers: false,
        },
      },
    );

    // Animate section 5 - move from -100px to 0
    gsap.fromTo(
      "#section-5",
      {
        y: 200,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#section-5",
          start: "top center",
          end: "top 20%",
          // scrub: true,
          markers: false,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const bottomRightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bottomRightRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    if (texts[hoveredCard]) {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0, pointerEvents: "none" },
        { y: 0, opacity: 1, duration: 0.8, pointerEvents: "auto" },
      );
    } else {
      gsap.to(el, { y: 40, opacity: 0, duration: 0.8, pointerEvents: "none" });
    }

    return () => gsap.killTweensOf(el);
  }, [hoveredCard]);

  return (
    <>
      <main>
        <div className="images">
          <img id="mat-1" src="/mat-1.png" alt="mat-1" />
          <img id="mat-2" src="/mat-2.png" alt="mat-2" />
          <img id="mat-3" src="/mat-3.png" alt="mat-3" />
          <img id="mat-4" src="/mat-4.png" alt="mat-4" />
          <img id="mat-5" src="/mat-5.png" alt="mat-5" />
          <img id="mat-6" src="/mat-6.png" alt="mat-6" />
        </div>
        <Canvas
          fallback={
            <div
              style={{
                position: "absolute",
                zIndex: 1000,
                left: 0,
                right: 0,
                fontSize: 45,
              }}
            >
              Sorry no WebGL supported!
            </div>
          }
          id="canvas-elem"
          style={{
            width: "100%",
            height: "100vh",
            position: "fixed",
            zIndex: 1,
          }}
        >
          <Suspense fallback={null}>
            <HeroModel currentMaterial={hoveredCard} />
          </Suspense>
        </Canvas>
        <section id="section-1">
          <nav>
            <h1>3D Hero</h1>
            <h2>
              {" "}
              <FaAngleRight
                className="right-arrow"
                size={14}
                color="red"
              />{" "}
              <span>All our cases</span>
            </h2>
            <div>
              <CiMenuFries
                size={20}
                color="white"
                fontWeight={700}
                style={{ cursor: "pointer" }}
              />
            </div>
          </nav>
          <div className="main-hero">
            <div className="left-hero">
              <h1>
                We <br /> create <br /> 3D <br /> heros
              </h1>
            </div>
            <div className="right-hero"></div>
            <div className="first-line"></div>
            <div className="second-line"></div>
            <div className="third-line"></div>
          </div>
        </section>
        <section id="section-2">
          <div className="left"></div>
          <div className="right">
            <h2>
              Dogstudio is a multidisciplinary <br /> creative studio at the
              intersection <br />
              of art, design and technology.
            </h2>
            <p>
              Our goal is to deliver amazing experiences that make <br /> people
              talk, and build strategic value for brands, tech, <br />{" "}
              entertainment, arts & culture.
            </p>
            <ul>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Newsletter</a>
              </li>
              <li>
                <a href="#">Dribble</a>
              </li>
            </ul>
          </div>
        </section>
        <section id="section-3">
          <div className="showcases">
            <div
              className="showcase-card card-1"
              onMouseEnter={() => setHoveredCard("mat1")}
              onMouseLeave={() => setHoveredCard("normalMap")}
            >
              <p>2016 - Ongoing</p>
              <h1>Tomorrowland</h1>
            </div>
            <div
              className="showcase-card card-2"
              onMouseEnter={() => setHoveredCard("mat2")}
              onMouseLeave={() => setHoveredCard("normalMap")}
            >
              <p>2017 - Today</p>
              <h1>Gold</h1>
            </div>
            <div
              className="showcase-card card-3"
              onMouseEnter={() => setHoveredCard("mat3")}
              onMouseLeave={() => setHoveredCard("normalMap")}
            >
              <p>2018 - Ongoing</p>
              <h1>Silver</h1>
            </div>
            <div
              className="showcase-card card-4"
              onMouseEnter={() => setHoveredCard("mat4")}
              onMouseLeave={() => setHoveredCard("normalMap")}
            >
              <p>2020 - Tomorrow</p>
              <h1>Our Merand</h1>
            </div>
            <div
              className="showcase-card card-5"
              onMouseEnter={() => setHoveredCard("mat5")}
              onMouseLeave={() => setHoveredCard("normalMap")}
            >
              <p>2022 - Ongoing</p>
              <h1>Lose</h1>
            </div>
            <div
              className="showcase-card card-6"
              onMouseEnter={() => setHoveredCard("mat6")}
              onMouseLeave={() => setHoveredCard("normalMap")}
            >
              <p>2026 - Today</p>
              <h1>Rise</h1>
            </div>
          </div>
        </section>
        <section id="section-4">
          <div className="footer-top">
            <div className="left">
              <h2>
                Lorem ipsum dolor sit <br /> amet consectetur <br /> adipisicing
                elit. <br /> Repellat.
              </h2>
            </div>
            <div className="right"></div>
          </div>
        </section>
        <section id="section-5">
          <div className="footer-bottom">
            <div className="left"></div>
            <div className="right">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                rem iusto quibusdam magni velit quod aperiam, consectetur
                deserunt sunt doloremque consequuntur enim laudantium repellat
                nulla.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
                rem iusto quibusdam magni velit quod aperiam, consectetur
                deserunt sunt doloremque consequuntur enim laudantium repellat
                nulla.
              </p>
            </div>
          </div>
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <h3>Dogstudio</h3>
                <p className="brand-sub">We craft immersive 3D experiences</p>
              </div>

              <nav className="footer-nav" aria-label="Footer navigation">
                <a href="#section-1">Home</a>
                <a href="#section-3">Showcases</a>
                <a href="#section-4">About</a>
                <a href="#section-5">Contact</a>
              </nav>

              <div className="footer-social">
                <a href="#">Instagram</a>
                <a href="#">Facebook</a>
                <a href="#">Twitter</a>
              </div>

              <div className="footer-newsletter">
                <p className="newsletter-title">Join our newsletter</p>
                <form
                  className="newsletter-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input type="email" placeholder="Your email" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>

            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} Dogstudio — All rights reserved.
              </p>
            </div>
          </footer>
        </section>
      </main>
      <div style={{position : 'fixed', width : '100%' , height : '100vh' , zIndex : 9999 , top : 0,left : 0}}>
         <Loader />
      </div>
       

      <div
        className="bottom-right-text"
        ref={bottomRightRef}
        style={{ opacity: 0, transform: "translateY(20px)" }}
      >
        <h6>{texts[hoveredCard] && texts[hoveredCard][0]}</h6>
        <p>{texts[hoveredCard] && texts[hoveredCard][1]}</p>
      </div>
      {/* <MenuPage open={open} setOpen={setOpen} /> */}
    </>
  );
}

export default App;

const texts: Record<string, string[]> = {
  mat1: [
    "2016-2017",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia similique id, fugit unde error blanditiis.",
  ],
  mat2: [
    "2017-2018",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia similique id, fugit.",
  ],
  mat3: [
    "2019-2020",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia similique id, fugit unde error blanditiis.",
  ],
  mat4: [
    "2016-2017",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia similique id, fugit unde error.",
  ],
  mat5: [
    "2016-2017",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia similique id, fugit unde error blanditiis.",
  ],
  mat6: [
    "2016-2017",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia similique id.",
  ],
};
