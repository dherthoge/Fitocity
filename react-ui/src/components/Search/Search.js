import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card';
import "../../../node_modules/video-react/dist/video-react.css";
import { Player } from 'video-react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Navigation from '../Navigation/Navigation';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBTypography,
    MDBBtn,
    MDBInput,
  } from 'mdb-react-ui-kit';

const Search = () => {
    const [search, setSearch] = useState('')
    const [videosData, setVideosData] = useState('')
    const [category, setCategory] = useState('videos')

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    const onSelectChange = (event) => {
        setVideosData('')
        setCategory(event.target.value)
    }

    const onSubmit = (event) => {
        setVideosData('')
        setSearch('')
        event.preventDefault()
        if (!category) {
            setCategory("videos")
        }
        axios.get('/api/search/' + category, { params: { query: search } }).then((res) => {
            if (res.data.data.length > 0) {
                setVideosData(res.data.data)
            }
            else {
                toast('No results found!')
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        axios.get('/api/search/all').then((res) => {
            if (res.data.data.length > 0) {
                setVideosData(res.data.data)
            }
            else {
                toast('No results found!')
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    


    return (
        <div style={{backgroundColor:'#cbe2f7'}}>
            <Navigation />
            <MDBContainer className="py-5 h-100">
            <form onSubmit={onSubmit}>
           
                <MDBRow style={{backgroundColor:'#cbe2f7'}}>
                    <MDBCol md="7">
                        <MDBCardText style={{ 'marginLeft': '265px' }} className="text-muted">
                            <MDBInput label='Name' onChange={onSearchChange} value={search}
                                type='text' required  style={{backgroundColor:'white'}}/>
                        </MDBCardText>
                    </MDBCol>
                    <MDBCol md="2">
                        <MDBCardText className="text-muted">
                            <Form.Select aria-label="Category" onChange={onSelectChange} required>
                                <option value="videos">Videos</option>
                                <option value="users">Trainers</option>
                            </Form.Select>
                        </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="3">
                        <MDBCardText className="text-muted">
                            <MDBBtn>Search</MDBBtn>
                        </MDBCardText>
                    </MDBCol>
                </MDBRow>
            </form>
            </MDBContainer>
            <br />
            <MDBContainer>
                <MDBRow>
                    {videosData.length > 0 && videosData ? videosData.map((video) => {
                        return (

                            <MDBCol md="4" style={!video ? {'display': 'none'} : {}}>
                                {video ?
                                    <MDBCard style={{ width: '18rem', 'marginRight': '4%', 'marginBottom': '10%', 'marginLeft': '190px' }}>
                                        <Card.Body>
                                            <Card.Title>{category === 'videos' ? video.title :
                                                <Link to={'/profile/' + video._id}>{video.fullName}</Link>}
                                                <br />
                                                <Card.Img variant="top" style={{ 'marginTop': '10px' }} src={video.profileImage} />
                                            </Card.Title>
                                            {category === 'videos' ? <Player
                                                playsInline
                                                src={video.url}
                                            /> : ""}
                                            <br/>
                                            {console.log(JSON.stringify(video))}
                                            {video.postedBy && category === 'videos' ? 
                                                <Card.Text>Uploaded By <Link to={'/profile/' + video.postedBy._id}>{video.postedBy.fullName}</Link></Card.Text> 
                                                : 
                                            ""}
                                        </Card.Body>
                                    </MDBCard>
                                    : ""}
                            </MDBCol>
                        )
                    }) : ""}
                </MDBRow>
            </MDBContainer>
        </div>
    )
}

export default Search