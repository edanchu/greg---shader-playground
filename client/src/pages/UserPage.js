import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserPage.css';
import '../components/Cards';
import CardItem from '../components/CardItem';

export default function UserPage({ currUser }) {
  let { id } = useParams();

  const [user, setUser] = useState(null);
  const [isCurrUser, setIsCurrUser] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user)
      axios.get('/api/user/find-by-id/' + id).then((res) => {
        setUser(res.data);
      });
  }, []);

  useEffect(() => {
    if (user) {
      setIsCurrUser(currUser?._id === user._id);
      if (currUser?._id === user._id)
        axios
          .get('/api/user/get-self-projects')
          .then((res) => {
            setProjects(res.data);
          })
          .catch((err) => console.log(err));
      else
        axios
          .get('/api/user/get-user-projects/' + user?._id)
          .then((res) => {
            setProjects(res.data);
          })
          .catch((err) => console.log(err));
    }
  }, [user]);

  if (!user) return <></>;

  return (
    <>
      <div className='Profile'>
        <img
          src='https://bootdey.com/img/Content/avatar/avatar7.png'
          alt='Admin'
          className='profileImage'
        />
        <div className='description'>
          <h4 className='username'>{user.username}</h4>
          <p>Professional Shader</p>
        </div>
      </div>
      <div className='card-body'>
        <h1 className='title'>Projects</h1>
      </div>
      <div className='cards'>
        <div className='cards__container'>
          <div className='cards__wrapper'>
            <ul className='cards__items'>
              {projects.map((project) => (
                <CardItem
                  key={project._id}
                  project={project}
                  pause={true}
                  playOnMouseOver={true}
                  showButtons={false}
                  commonFragShaderCustomCode={project.code[5]}
                  finalFragShaderCustomCode={project.code[0]}
                  buffer1FragShaderCustomCode={project.code[1]}
                  buffer2FragShaderCustomCode={project.code[2]}
                  buffer3FragShaderCustomCode={project.code[3]}
                  buffer4FragShaderCustomCode={project.code[4]}
                  channels={project.channelUniforms}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
