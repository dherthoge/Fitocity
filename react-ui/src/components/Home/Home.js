import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

export default function Home() {
  let navigate = useNavigate();
  const routeToRegister = () => {
    navigate("/register");
  };

  const routeToLogin = () => {
    navigate("/login");
  };

  const routeToAdmin = () => {
    navigate("/admin");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Fitocity
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn px-3 me-2"
              onClick={routeToLogin}
            >
              Login
            </button>
            <button
              type="button"
              className="btn btn-primary me-3"
              onClick={routeToRegister}
            >
              Sign up for free
            </button>
          </div>
        </div>
      </nav>

      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              className="d-block w-100"
              src="https://www.calltheone.com/storage/blog/8/2020/09/08/how-to-exercise-safely-and-efficiently.jpg"
              alt="First slide"
            ></img>
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src="http://cdn.shopify.com/s/files/1/0430/6533/files/thfRTbtcHJfPXSFIJSJxen86NmY6ADuu1647612751.jpg?v=1647896442"
              alt="Second slide"
            ></img>
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src="https://serviceprofessionalsnetwork.com/wp-content/uploads/2022/09/How-to-improve-your-fitness-with-food-and-exercise.jpg"
              alt="Third slide"
            ></img>
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#carouselExampleControls"
          role="button"
          data-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a>
        <a
          className="carousel-control-next"
          href="#carouselExampleControls"
          role="button"
          data-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a>
      </div>

      <section className="home" id="home">
        <div className="content">
          <h1>About Fitocity</h1>
          <p>
            We at Fitocity are dedicated to providing our clients, trainers, and
            partners with quality workout videos, routines, and health
            recommendations. We are committed towards the goal of making the
            whole planet fit. We know the ferocity it takes to get fit!
          </p>
        </div>

        <div className="image">
          <img
            className="burger"
            src="https://www.muscleandfitness.com/wp-content/uploads/2019/12/1109-Home-Gtm-Dumbbells-shutterstock_1132401518.jpg?quality=86&strip=all"
          ></img>
        </div>
      </section>

      <h1 className="demo-title my-4">
        Our Prices
        <br />
      </h1>
      <div className="pricing-table">
        <div className="ptable-item">
          <div className="ptable-single">
            <div className="ptable-header">
              <div className="ptable-title">
                <h2>Silver</h2>
              </div>
              <div className="ptable-price">
                <h2>
                  <small>$</small>99<span>/ M</span>
                </h2>
              </div>
            </div>
            <div className="ptable-body">
              <div className="ptable-description">
                <ul>
                  <li>Monthly recommendations</li>
                  <li>One on one with upto 10 trainers</li>
                  <li>Support times between 1-2 hours</li>
                </ul>
              </div>
            </div>
            <div className="ptable-footer">
              <div className="ptable-action">
                <button
                  className="btn btn-primary me-3"
                  onClick={routeToRegister}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ptable-item featured-item">
          <div className="ptable-single">
            <div className="ptable-header">
              <div className="ptable-title">
                <h2>Gold</h2>
              </div>
              <div className="ptable-price">
                <h2>
                  <small>$</small>199<span>/ M</span>
                </h2>
              </div>
            </div>
            <div className="ptable-body">
              <div className="ptable-description">
                <ul>
                  <li>Monthly recommendations</li>
                  <li>One on one with upto 20 trainers</li>
                  <li>Support times between 30 min to 1 hour</li>
                </ul>
              </div>
            </div>
            <div className="ptable-footer">
              <div className="ptable-action">
                <button
                  className="btn btn-primary me-3"
                  onClick={routeToRegister}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="ptable-item">
          <div className="ptable-single">
            <div className="ptable-header">
              <div className="ptable-title">
                <h2>Platinum</h2>
              </div>
              <div className="ptable-price">
                <h2>
                  <small>$</small>299<span>/ M</span>
                </h2>
              </div>
            </div>
            <div className="ptable-body">
              <div className="ptable-description">
                <ul>
                  <li>Monthly recommendations</li>
                  <li>One on one with any number of trainers</li>
                  <li>Priority support with 2 minutes</li>
                </ul>
              </div>
            </div>
            <div className="ptable-footer">
              <div className="ptable-action">
                <button
                  className="btn btn-primary me-3"
                  onClick={routeToRegister}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="review" id="review">
        <h2 className="special-head">
          Our Customers <span>Reviews</span>
        </h2>
        <div className="container">
          <div className="box">
            <img src="https://static01.nyt.com/newsgraphics/2020/11/12/fake-people/4b806cf591a8a76adfc88d19e90c8c634345bf3d/fallbacks/mobile-03.jpg" />
            <h3>Harry Williamson</h3>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="far fa-star"></i>
            </div>
            <p>
              The user friendliness and the ease of moving around is very
              helpful.
            </p>
          </div>

          <div className="box">
            <img src="https://images.fastcompany.net/image/upload/w_596,c_limit,q_auto:best,f_auto/wp-cms/uploads/2019/02/5-create-fake-people-in-2-seconds-on-this-insane-site.jpg" />
            <h3>Victoria Skyes</h3>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="far fa-star"></i>
            </div>
            <p>Wonderful app to track my sleep, workouts and meals!</p>
          </div>

          <div className="box">
            <img src="https://media.istockphoto.com/photos/shot-of-a-handsome-young-man-standing-against-a-grey-background-picture-id1335941248?b=1&k=20&m=1335941248&s=170667a&w=0&h=sn_An6VRQBtK3BuHnG1w9UmhTzwTqM3xLnKcqLW-mzw=" />
            <h3>Jarod Tonte</h3>
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="far fa-star"></i>
            </div>
            <p>
              The recommendations based on my logs is really helpful and made me
              improve my health overall!
            </p>
          </div>
        </div>
      </section>

      <section className="order" id="order">
        <h2 className="special-head">
          <span>Contact</span> Us
        </h2>

        <div className="container">
          <div className="order-img">
            <img src="https://media.self.com/photos/58a34a76c29288190cbe7ba3/master/w_896,h_598,c_limit/Screen%20Shot%202017-02-14%20at%201.13.45%20PM.png" />
          </div>
          <div className="form">
            <div className="input">
              <input placeholder="Name:" />
              <input placeholder="Email:" />

              <input placeholder="Ph No:" />
              <input placeholder="Comment:" />

              <input
                style={{ color: "white" }}
                className="button"
                placeholder="Send"
              />
            </div>
          </div>
        </div>
      </section>

      <div>

  <footer
          className="text-center text-lg-start text-white"
          style={{backgroundColor: '#1c1502'}}
          >
   
    <div className="container p-4 pb-0">

      <section className="">
    
        <div className="row">
      
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">
              Fitocity
            </h6>
            <p>
          We are committed towards the goal of making the
            whole planet fit. We know the ferocity it takes to get fit!
            </p>
          </div>
       

          <hr className="w-100 clearfix d-md-none" />

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">Services</h6>
            <p>
              <a className="text-white">Workouts</a>
            </p>
            <p>
              <a className="text-white">Personalised Meal Recommendations</a>
            </p>
            <p>
              <a className="text-white">Trainer Interation</a>
            </p>
            <p>
              <a className="text-white">Track your Nutrition</a>
            </p>
          </div>
    

          <hr className="w-100 clearfix d-md-none" />

          <hr className="w-100 clearfix d-md-none" />


          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
            <p><i className="fas fa-home mr-3"></i> New York, NY 10012, US</p>
            <p><i className="fas fa-envelope mr-3"></i> fitocity@gmail.com</p>
            <p><i className="fas fa-phone mr-3"></i> + 01 234 567 88</p>
            <p><i className="fas fa-print mr-3"></i> + 01 234 567 89</p>
          </div>
      
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold">Follow us</h6>

         
            <a
               className="btn btn-primary btn-floating m-1"
               style={{backgroundColor: '#3b5998'}}
               href="#!"
               role="button"
               ><i className="fab fa-facebook-f"></i></a>

    
            <a
               className="btn btn-primary btn-floating m-1"
               style={{backgroundColor: '#55acee'}}
               href="#!"
               role="button"
               ><i className="fab fa-twitter"></i></a>

       
            <a
               className="btn btn-primary btn-floating m-1"
               style={{backgroundColor: '#dd4b39'}}
               href="#!"
               role="button"
               ><i className="fab fa-google"></i>
              </a>

            <a
               className="btn btn-primary btn-floating m-1"
               style={{backgroundColor: 'ac2bac'}}
               href="#!"
               role="button"
               ><i className="fab fa-instagram"></i>
              </a>

         
            <a
               className="btn btn-primary btn-floating m-1"
               style={{backgroundColor: '#0082ca'}}
               href="#!"
               role="button"
               ><i className="fab fa-linkedin-in"></i>
              </a>
           
            <a
               className="btn btn-primary btn-floating m-1"
               style={{backgroundColor: '#333333'}}
               href="#!"
               role="button"
               ><i className="fab fa-github"></i>
              </a>
          </div>
        </div>
  
      </section>
   
    </div>
 
    <div
         className="text-center p-3"
         style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
         >
      © 2022 Copyright:
      <a className="text-white" href="https://mdbootstrap.com/"
         >Fitocity.com</a>
    </div>
  
  </footer>

</div>
    </>
  );
}
