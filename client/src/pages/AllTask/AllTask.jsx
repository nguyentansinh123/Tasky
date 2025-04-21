import React from 'react'
import Card from '../../components/Card'
import '../css/AllTask.css'
import SearchBar from '../../components/SearchBar';

const AllTask = () => {
    return (
        <>
        <SearchBar/>
      <div className="all-tasks-grid">
        <Card />
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