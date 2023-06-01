import { React, useState, useEffect } from "react";
import { MDBAccordion, MDBAccordionItem } from "mdb-react-ui-kit";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import axios from "axios";
import Navigation from '../Navigation/Navigation';
import "react-toastify/dist/ReactToastify.css";
import "./Recommendation.css"

export default function Recommendation() {
  const [recommendations, setRecommendations] = useState(undefined);

  // Auth token and refresh token state
  const existingAuthtoken = localStorage.getItem('authToken') || '';
  const [authToken] = useState(existingAuthtoken);

  useEffect(() => {
    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const instance = axios.create({
        baseURL: 'http://localhost:5000',
        withCredentials: true,
        headers: headers
    });
    instance.get('/api/users/dietRecommendations')
      .then((res) => {
        console.log(res.data);
        setRecommendations(res.data.recommendations);
      }).catch((error) => {
        console.log(error);
      });
  }, [authToken])

  return (
    <div className="mainbody gradient-custom-2" style={{ backgroundColor: '#cbe2f7' }}>

      {/* Sidebar Navigation */}
      <Navigation/>

      <div>
        <MDBContainer className="py-5 section">
          <MDBRow className="justify-content-center align-items-center">
            <MDBCol g="9" xl="7" className="subsection">
              <MDBCard>
                {/* Show recommendations if possible or a message stating how to get recommendations */}
                {recommendations ?
                  <MDBCardBody className="text-black p-4">
                    <h2 className="mt-2 mb-1">Recommended Diet</h2>
                    <div className="p-4" style={{ flex: 'left', backgroundColor: "#f8f9fa" }}>
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCard background="danger">
                            <MDBCardBody>
                              <MDBCardTitle className='macro-title'>Calories</MDBCardTitle>
                              <MDBCardText className='required'>Required: <strong>{recommendations.diet.requiredCalories} cal</strong></MDBCardText>
                              <MDBCardText>Actual: <strong>{recommendations.diet.avgCalories} g</strong></MDBCardText>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                        <MDBCol sm="4">
                          <MDBCard background="warning">
                            <MDBCardBody>
                              <MDBCardTitle className='macro-title'>Protien</MDBCardTitle>
                              <MDBCardText className='required'>Required: <strong>{recommendations.diet.requiredProtein} g</strong></MDBCardText>
                              <MDBCardText>Actual: <strong>{recommendations.diet.avgProtein} g</strong></MDBCardText>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol sm="4">
                          <MDBCard background="success">
                            <MDBCardBody>
                              <MDBCardTitle className='macro-title'>Carbs</MDBCardTitle>
                              <MDBCardText className='required'>Required: <strong>{recommendations.diet.requiredCarbs} g</strong></MDBCardText>
                              <MDBCardText>Actual: <strong>{recommendations.diet.avgCarbs} g</strong></MDBCardText>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                        <MDBCol sm="4">
                          <MDBCard background="primary">
                            <MDBCardBody>
                              <MDBCardTitle className='macro-title'>Fat</MDBCardTitle>
                              <MDBCardText className='required'>Required: <strong>{recommendations.diet.requiredFat} g</strong></MDBCardText>
                              <MDBCardText>Actual: <strong>{recommendations.diet.avgFat} g</strong></MDBCardText>
                            </MDBCardBody>
                          </MDBCard>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBAccordion alwaysOpen initialActive={1}>
                        <MDBAccordionItem collapseId={1} headerTitle="Know more:">
                          {recommendations.diet.calorieRecommendation
                            || recommendations.diet.proteinRecommendation
                            || recommendations.diet.carbsRecommendation
                            || recommendations.diet.fatRecommendation
                            ?
                            <ul>
                              {recommendations.diet.calorieRecommendation ?
                                <li>
                                  {recommendations.diet.calorieRecommendation}
                                </li> : ''
                              }
                              {recommendations.diet.proteinRecommendation ?
                                <li>
                                  {recommendations.diet.proteinRecommendation}
                                </li> : ''
                              }
                              {recommendations.diet.carbsRecommendation ?
                                <li>
                                  {recommendations.diet.carbsRecommendation}
                                </li> : ''
                              }
                              {recommendations.diet.fatRecommendation ?
                                <li>
                                  {recommendations.diet.fatRecommendation}
                                </li> : ''
                              }
                            </ul>
                            :
                            <p>
                              Congradulations! You are hitting all of your macros! Your diet is currently optimal and you
                              should maintain it until you decide to change your fitness goals!
                            </p>
                          }
                        </MDBAccordionItem>
                      </MDBAccordion>
                    </div>
                  </MDBCardBody>
                  :
                  <MDBCardBody className="text-black p-4">
                    <h2 className="mt-2 mb-1">Diet Recommendations</h2>
                    <p>
                      In order to receive diet recommendations you must have entered at 
                      least three meals and have completely filled out your Profie page!
                    </p>
                  </MDBCardBody>
                }
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>

      {/* <div>
        <MDBContainer className="py-5 h-100 section">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol g="9" xl="7" className="subsection">
              <MDBCard>
                <MDBCardBody className="text-black p-4">
                  <h2 className="mt-2 mb-1">Recommended Workouts</h2>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBRow>
                      <MDBCol sm="6">
                        <MDBCard>
                          <MDBCardImage
                            src="https://mdbootstrap.com/img/new/standard/nature/182.webp"
                            alt="..."
                            position="top"
                          />
                          <MDBCardBody>
                            <MDBCardText>
                              Some quick example text to build on the card title
                              and make up the bulk of the card's content.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                      <MDBCol sm="6">
                        <MDBCard>
                          <MDBCardImage
                            src="https://mdbootstrap.com/img/new/standard/nature/182.webp"
                            alt="..."
                            position="top"
                          />
                          <MDBCardBody>
                            <MDBCardText>
                              Some quick example text to build on the card title
                              and make up the bulk of the card's content.
                            </MDBCardText>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBAccordion alwaysOpen initialActive={1}>
                      <MDBAccordionItem collapseId={1} headerTitle="Know more:">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </MDBAccordionItem>
                    </MDBAccordion>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>

      <div>
        <MDBContainer className="py-5 h-100 section">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol g="9" xl="7" className="subsection">
              <MDBCard>
                <MDBCardBody className="text-black p-4">
                  <h2 className="mt-2 mb-1">Recommended Sleep</h2>
                  <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                    <MDBRow>
                      <MDBCol sm="6">
                        <MDBCardText>
                          You should sleep atleast <strong>{}</strong> - more
                          hours
                        </MDBCardText>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBAccordion alwaysOpen initialActive={1}>
                      <MDBAccordionItem collapseId={1} headerTitle="Know more:">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into
                        electronic typesetting, remaining essentially unchanged.
                        It was popularised in the 1960s with the release of
                        Letraset sheets containing Lorem Ipsum passages, and
                        more recently with desktop publishing software like
                        Aldus PageMaker including versions of Lorem Ipsum.
                      </MDBAccordionItem>
                    </MDBAccordion>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div> */}
    </div>
  );
}
