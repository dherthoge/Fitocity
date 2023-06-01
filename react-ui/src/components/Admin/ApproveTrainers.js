import { React, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';
export default function ApproveTrainers() {

  const [approval, setListOfTrainers] = useState([]);

  useEffect(()=>{

      const fetchTrainers = async () =>{
        const response = await fetch('/api/admin/approvetrainers/')
        const json = await response.json()

        if(response.ok){
          setListOfTrainers(json)
        }
      }

      fetchTrainers()
  },[])

  const approve = async(id) => {
    axios.get('/api/admin/traineractions/', { params: { id: id, action:'approved' } }).then((response) => {
      if(response.data){
        var index = approval.findIndex(x => x._id == id)
        //approval[index].status = response.data.status
        let newArr = [...approval]
        newArr[index].status = response.data.status
        setListOfTrainers(newArr)
        toast("Trainer Status Changed!")
      }
    }).catch(() => toast('Some error occured'))
  }

  const decline = async(id) => {

    axios.get('/api/admin/traineractions/', { params: { id: id, action:'declined' } }).then((response) => {
      if(response.data){
        var index = approval.findIndex(x => x._id == id)
        //approval[index].status = response.data.status
        let newArr = [...approval]
        newArr[index].status = response.data.status
        setListOfTrainers(newArr)
        toast("Trainer Status Changed!")
      }
    }).catch(() => toast('Some error occured'))

  }

  const inprocess = async(id) => {
    axios.get('/api/admin/traineractions/', { params: { id: id, action:'pending' } }).then((response) => {
      if(response.data){
        var index = approval.findIndex(x => x._id == id)
        //approval[index].status = response.data.status
        let newArr = [...approval]
        newArr[index].status = response.data.status
        setListOfTrainers(newArr)
        toast("Trainer Status Changed!")
      }
    }).catch(() => toast('Some error occured'))

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
                    
                  </div>
                </div>
              </div>
              <div class="panel-body">
              {approval.map((approval)=>{
                  return (
                <table class="table">
                  <thead style={{textAlign:'center'}}>
                  <tr>
                      <th style={{width:'40vh'}}>EMAIL</th>
                      <th style={{width:'40vh'}}>DESCRIPTION</th>
                      <th style={{width:'20vh'}}>STATUS</th>
                      <th style={{width:'60vh'}}>ACTION</th>

                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{textAlign:'center'}}>
                      <td>{approval.email}</td>
                      <td>{approval.description}</td>
                      <td>{approval.status}</td>
                      <td>
                        <ul class="action-list">
                          <li>
                          <button class="btn btn-success mx-2" onClick={()=>approve(approval._id)}>
                              <i class="fa fa-check"></i>
                            </button>
                          </li>
                          <li>
                            <button class="btn btn-danger mx-2" onClick={()=>decline(approval._id)}>
                              <i class="fa fa-times"></i>
                            </button>
                          </li>
                          <li>
                            <button class="btn btn-primary mx-2" onClick={()=>inprocess(approval._id)}>
                              <i class="fa fa-question"></i>
                            </button>
                          </li>
                        </ul>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>);
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
  )
}
