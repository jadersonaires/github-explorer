import React, { FormEvent, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Title, Form, Repository, Error } from './styles';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!inputError) {
      setInputError('Digite autor/nome do repository');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${input}`);
      const repository = response.data;
      setRepositories([...repositories, repository]);
      setInput('');
      setInputError('');
    } catch (error) {
      setInputError('Error na busca pelo repository.');
    }
  }

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repositórios no Github.</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          type="text"
          placeholder="Digite aqui seu repositories"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repository>
        {repositories.map(repository => (
          <a key={repository.full_name} href="/">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Repository>
    </>
  );
};

export default Dashboard;
