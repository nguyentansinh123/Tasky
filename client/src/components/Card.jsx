import React from 'react'
import '../pages/css/Card.css'
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Card = () => {
  return (
    <div className='Card_container'>
        <div className="Card_container__Header">
            <h1 className='Card_container__Header-Text'>Hang some pictures</h1>
            <h1 className='Card_container__Header-Price'>$90</h1>
        </div>
        <div className="Card_container-Info">
            <div className="Card_container-Info__TaskInfo">
                <HomeIcon className='Card_container-Info__TaskInfo_Icon'/>
                <p className='Card_container-Info__TaskInfo_text'>NewTown NSW</p>
            </div>
            <div className="Card_container-Info__TaskInfo">
                <CalendarTodayIcon className='Card_container-Info__TaskInfo_Icon'/>
                <p className='Card_container-Info__TaskInfo_text'>Flexible</p>
            </div>
        </div>
        <div className="Card_container__footer">
            <p className='Card_container__footer__OpenButton'>Open</p>
            <div className="Card_container__footer_Avatar"></div>
        </div>
    </div>
  )
}

export default Card