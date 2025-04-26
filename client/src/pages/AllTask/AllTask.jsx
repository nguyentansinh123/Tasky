import React from 'react'
import Card from '../../components/Card'
import '../css/AllTask.css'
import SearchBar from '../../components/SearchBar';
import { Link } from 'react-router-dom'

const AllTask = () => {
    return (
        <>
        <SearchBar/>
      <div className="all-tasks-grid">
        <Link to="/task/123" className="my-task-link">
          <Card />
        </Link>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
      </>
    );
  };
  
  export default AllTask;