import React from 'react'
import '../pages/css/Card.css'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import ImgDemo from '../assets/TaskImageDemo.png'

const Card = () => {
  return (
    <div className="task-card">
      <div className="task-card__image">
        <img src={ImgDemo} alt="Task" />
        <div className="task-card__badge">$75</div>
      </div>
      <div className="task-card__content">
        <div className="task-card__header">
          <span className="task-card__category">Household</span>
          <span className="task-card__status">Open</span>
        </div>
        <h2 className="task-card__title">Hang some pictures</h2>
        <p className="task-card__desc">
          Need help hanging several pictures in my living room. Must have own tools and experience with drywall.
        </p>
        <div className="task-card__meta">
          <div className="task-card__meta-item">
            <LocationOnIcon className="task-card__icon" />
            <span>NewTown NSW</span>
          </div>
          <div className="task-card__meta-item">
            <CalendarTodayIcon className="task-card__icon" />
            <span>April 27, 2025</span>
          </div>
        </div>
        <div className="task-card__footer">
          <button className="task-card__button">View Details</button>
        </div>
      </div>
    </div>
  )
}

export default Card