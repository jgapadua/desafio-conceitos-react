import React, {useState, useEffect} from "react";
import api from './services/api';

import "./styles.css";

import Header from './components/Header';

function App(){
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => setRepositories(response.data));
  }, []);

  async function handleAddRepository(){
    const response = await api.post('repositories',{
      title: `Novo repositório ${Date.now()}`,
      url: `https://github.com/jgapadua/${Date.now()}`,
      techs: ["ReactJS", 'Node.js'] 
  });
 
  const repository = response.data;
    
  setRepositories([  ... repositories, repository]);
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const likedRepository = response.data;

    const repositoryLikedIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    const updatedRepositories = [...repositories];

    updatedRepositories[repositoryLikedIndex] = likedRepository;

    setRepositories(updatedRepositories);
  }
  
  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    setRepositories(repositories.filter(
      repository => repository.id != id 
    ))
  }

  async function handleUpdateRepository(id) {
    const response = await api.put(`repositories/${id}`,{
      title: `Novo repositório ${Date.now()}`,
      url: `https://github.com/jgapadua/${Date.now()}`,
      techs: ["ReactJS", "React Native"] 
  });
  const updatedRepository = response.data;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const updatedRepositories = [...repositories];

  updatedRepositories[repositoryIndex] = updatedRepository;

  setRepositories(updatedRepositories);
}


  return (
    <>
       <Header title="Repositórios "/>
      <ul data-testid="repository-list">
      {repositories.map(repository => <li key ={repository.id}>{repository.title}
      <button  className="btnrem" onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
          <button className="btnupd" onClick={() => handleUpdateRepository(repository.id)} >
            Alterar
          </button>
          <div className="techsContainer">
          {repository.techs.map((tech) => (
            <p className="tech">
            {tech}
            </p>
             ))}
          </div>
          <div className="likesContainer">
            <p className="likeText">
            {repository.likes} curtida{repository.likes !== 1 && "s"}
            </p>
          </div>
          <button className="btnlike" onClick={() => handleLikeRepository(repository.id)} >
          Curtir
          </button>
          </li>)}
        
      </ul>

      <button onClick={handleAddRepository} className="btnadd">Adicionar</button>
    </>
  );
}

export default App;
