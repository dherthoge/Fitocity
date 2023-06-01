import { React, useState, useEffect } from 'react';
import "../../App.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table';
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
export default function ShowVideos() {

  const [video, setListOfVideos] = useState([]);

  useEffect(()=>{
        axios.get('/api/admin/showvideos/').then((response) => {
          if(response.data){
            setListOfVideos(response.data)
          }
        }).catch(() => toast('Some error occured'))
  },[])


  const deleteVideo = async(id) => {
    const response = await fetch(`/api/admin/showvideos/${id}`)
    const json = await response.json()

    if(response.ok){
      setListOfVideos(video.filter(x => x._id != id))
      toast("Video Deleted Successfully!")
    }
    else{
      toast("Oops! Something went wrong")
    }
  }



  

  
  return (
    <>
    <Sidebar></Sidebar>
    <AdminHeader></AdminHeader>
    <div className="home-section app-trainers">

<ToastContainer />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <div class="container">
      <div class="row">
        <div class="col-md-offset-1 col-md-10">
          <div class="panel">
            <div class="panel-heading">
              <div class="row">
                <div class="col-sm-12 col-xs-12">
                  <a href="#" class="btn btn-sm btn-primary pull-left">
                    <i class="fa fa-plus-circle"></i> Add New
                  </a>
                  <form class="form-horizontal pull-right">
                    <div class="form-group">
                      <label>Show : </label>
                      <select class="form-control">
                        <option>5</option>
                        <option>10</option>
                        <option>15</option>
                        <option>20</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="panel-body table-responsive">
            {video.map((video)=>{
                  return (
              <Table striped bordered hover>
                <thead style={{textAlign:'center'}}>
                  <tr>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Description</th>
                    <th>Trainer</th>
                    <th>Views</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{textAlign:'center'}}>
                    <td>{video.title}</td>
                    <td>{video.genre}</td>
                    <td>{video.description}</td>
                    <td>{video.postedBy}</td>
                    <td>{video.views}</td>
                    <td>{video.updated}</td>
                    <td>
                    
                            <button onClick={()=>deleteVideo(video._id)} class="btn btn-danger">
                              <i class="fa fa-times"></i>
                            </button>
                          
                    </td>
                  </tr>
                  
                </tbody>
              </Table>);
            })}
            </div>
            <div class="panel-footer">
              <div class="row">
                <div class="col-sm-6 col-xs-6">
                  showing <b>5</b> out of <b>25</b> entries
                </div>
                <div class="col-sm-6 col-xs-6">
                  <ul class="pagination hidden-xs pull-right">
                    <li>
                      <a href="#">«</a>
                    </li>
                    <li class="active">
                      <a href="#">1</a>
                    </li>
                    <li>
                      <a href="#">2</a>
                    </li>
                    <li>
                      <a href="#">3</a>
                    </li>
                    <li>
                      <a href="#">4</a>
                    </li>
                    <li>
                      <a href="#">5</a>
                    </li>
                    <li>
                      <a href="#">»</a>
                    </li>
                  </ul>
                  <ul class="pagination visible-xs pull-right">
                    <li>
                      <a href="#">«</a>
                    </li>
                    <li>
                      <a href="#">»</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  );
}
