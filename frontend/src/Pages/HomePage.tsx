import "animate.css";
import Navbar from "../components/Home/Navbar";
import WavyHero from "../components/Home/WavyHero";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <WavyHero className="w-screen">
        <div className="h-92v bg-transparent">
          <div className="mx-auto max-w-[100rem] pt-24 sm:pt-[10rem]">
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
              <section className="px-6 sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:flex lg:items-center lg:text-left">
                <div className="space-y-8">
                  <header className="space-y-5">
                    <div className="space-y-2">
                      <span className="rounded-full uppercase bg-indigo-500 px-3 py-0.5 text-sm font-semibold leading-5 text-white">
                        Demo
                      </span>
                      <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
                        <span className="animate__animated animate__fadeIn text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                          Machine Learning-Driven
                        </span>{" "}
                        Market Prediction
                      </h1>
                    </div>
                    <p className="font-normal text-base text-gray-100 text-xl leading-8">
                      StockWizard provides market trend predictions and
                      investment insights by analyzing historical market data to
                      forecast future trends by using machine learning
                      algorithms.
                    </p>
                    <p className="font-normal text-base text-gray-100 text-xl leading-9">
                      Leverage{" "}
                      <span className="font-bold">Alpaca Paper Trading</span>{" "}
                      for free to test your strategies.
                    </p>
                  </header>
                  <div className="flex space-x-4 items-center text-white ">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-shrink-0 -space-x-1">
                        <img
                          loading="lazy"
                          className="h-6 w-6 rounded-full ring-2 ring-white"
                          src="https://randomuser.me/api/portraits/men/29.jpg"
                          alt="User"
                        />
                        <img
                          loading="lazy"
                          className="h-6 w-6 rounded-full ring-2 ring-white"
                          src="https://randomuser.me/api/portraits/men/90.jpg"
                          alt="User"
                        />
                      </div>
                      <span className="flex-shrink-0 text-xs font-medium leading-5">
                        +15
                      </span>
                    </div>
                    <div className="h-4 border-l border-gray-700"></div>
                    <div className="flex items-center">
                      {/* SVGs omitted for brevity */}
                    </div>
                    <div className="h-4 border-l border-gray-700"></div>
                    <a
                      href="https://github.com/krish-bedi"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
                        alt="Product Hunt Badge"
                        className="w-5 h-5 md:w-10 md:h-10 lg:w-15 lg:h-15"
                      />
                      <div className="text-white font-extrabold">GitHub</div>
                    </a>
                  </div>
                </div>
              </section>
              <section className="animate__animated animate__fadeIn flex items-center w-full col-span-6">
                <img
                  loading="lazy"
                  src="../../public/placeholder-hero.webp"
                  alt="App screenshot"
                  style={{ height: "100%", width: "100%" }}
                  className="rounded-lg border-2 border-neutral-600"
                ></img>
              </section>
            </div>
          </div>
        </div>
      </WavyHero>
      <Outlet />
    </>
  );
};

export default HomePage;
