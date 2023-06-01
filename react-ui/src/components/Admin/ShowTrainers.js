import { React, useState, useEffect } from 'react';
import "../../App.css";
import AdminHeader from './AdminHeader';
import Sidebar from './Sidebar';


export default function ShowTrainers() {

  const [trainer, setListOfTrainers] = useState([]);

  useEffect(()=>{

      const fetchTrainers = async () =>{
        const response = await fetch('/api/admin/showtrainers/')
        const json = await response.json()

        if(response.ok){
          setListOfTrainers(json)
        }
      }

      fetchTrainers()
  },[])


  return (
    <>
    <Sidebar></Sidebar>
    <AdminHeader></AdminHeader>
    <div className="home-section app-trainers">
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <div class="container">
      <div class="row">
        <div class="col-md-10">
          <div class="panel">
            
            <div className="panel-body">
                {trainer.map((trainer)=>{
                  return (
                    <table className="table">
                  <thead>
                    <tr style={{textAlign:'center'}}>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>ROLE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{textAlign:'center'}}>
                    <td>{trainer.name}</td>
                      <td>{trainer.email}</td>
                      <td>{trainer.role}</td>
                    
                    </tr>
        
                  </tbody>
                </table>
                  );
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
