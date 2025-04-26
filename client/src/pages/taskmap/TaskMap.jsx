/* global google */
import React, { useRef, useState, useEffect } from 'react'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { FaLocationArrow, FaTimes, FaRoute } from 'react-icons/fa'
import '../css/TaskMap.css'

const libraries = ['places'];

const defaultCenter = { lat: -25.2744, lng: 133.7751 };

const TaskMap = ({ taskLocations = [] }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: libraries,
  })

  const [map, setMap] = useState(null)
  const [mapType, setMapType] = useState('roadmap')
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [markers, setMarkers] = useState([])
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [mapZoom, setMapZoom] = useState(4) 

  const originRef = useRef()
  const destinationRef = useRef()

  const geocodeLocations = async () => {
    if (!isLoaded || !map) return;
    
    const geocoder = new google.maps.Geocoder();
    const geocodePromises = taskLocations.map(task => {
      return new Promise((resolve) => {
        if (!task.location) {
          resolve({ ...task, position: null });
          return;
        }
        
        geocoder.geocode({ address: task.location }, (results, status) => {
          if (status === "OK" && results[0]) {
            const position = results[0].geometry.location;
            resolve({
              ...task,
              position: { lat: position.lat(), lng: position.lng() }
            });
          } else {
            console.warn(`Could not geocode location: ${task.location}`, status);
            resolve({ ...task, position: null });
          }
        });
      });
    });
    
    const geocodedTasks = await Promise.all(geocodePromises);
    const validMarkers = geocodedTasks.filter(task => task.position !== null);
    setMarkers(validMarkers);
    
    if (validMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validMarkers.forEach(marker => {
        if (marker.position) {
          bounds.extend(marker.position);
        }
      });
      map.fitBounds(bounds);
      
      if (validMarkers.length === 1) {
        setMapCenter(validMarkers[0].position);
        setMapZoom(14);
      }
    }
  };
  
  useEffect(() => {
    if (isLoaded && map) {
      geocodeLocations();
    }

    console.log('Map loaded:', isLoaded, map);
  }, [isLoaded, map, taskLocations]);

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Loading map...</p>
      </div>
    )
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return
    }
    
    setDirectionsResponse(null)
    
    const directionsService = new google.maps.DirectionsService()
    
    try {
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value, 
        travelMode: google.maps.TravelMode.DRIVING,
      })
      
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
      
      // Fit the map to the route bounds
      const bounds = new google.maps.LatLngBounds()
      results.routes[0].legs[0].steps.forEach(step => {
        bounds.extend(step.start_location)
        bounds.extend(step.end_location)
      })
      map.fitBounds(bounds)
    } catch (error) {
      console.error("Error calculating route:", error)
      alert("Could not calculate route. Please check your inputs.")
    }
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
    
    // Restore markers view
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => {
        if (marker.position) {
          bounds.extend(marker.position);
        }
      });
      map.fitBounds(bounds);
    }
  }

  return (
    <div className="task-map">
      <GoogleMap
        center={mapCenter}
        zoom={mapZoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          mapTypeId: mapType,
          zoomControl: false,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={map => setMap(map)}
      >
        {/* Display task location markers only if no directions are shown */}
        {!directionsResponse && markers.map((task, index) => (
          <Marker 
            key={index} 
            position={task.position}
            label={task.label || String(index + 1)}
            title={task.title || 'Task location'}
          />
        ))}
        
        {/* Directions renderer */}
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
      
      {/* Route calculation panel */}
      <div className="route-panel">
        <div className="route-inputs">
          <div className="input-group">
            <label>Start</label>
            <Autocomplete>
              <input
                className="route-input"
                type="text"
                placeholder="Enter start location"
                ref={originRef}
              />
            </Autocomplete>
          </div>
          
          <div className="input-group">
            <label>Destination</label>
            <Autocomplete>
              <input
                className="route-input"
                type="text"
                placeholder="Enter destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </div>
          
          <div className="route-actions">
            <button 
              className="calculate-btn" 
              onClick={calculateRoute}
            >
              <FaRoute /> Calculate Route
            </button>
            
            <button 
              className="clear-btn"
              onClick={clearRoute}
            >
              <FaTimes /> Clear
            </button>
          </div>
        </div>
        
        {/* Show distance and duration if available */}
        {(distance || duration) && (
          <div className="route-info">
            <div className="route-detail">
              <span className="route-label">Distance:</span>
              <span className="route-value">{distance}</span>
            </div>
            <div className="route-detail">
              <span className="route-label">Duration:</span>
              <span className="route-value">{duration}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Map type controls */}
      <div className="map-controls">
        <span 
          className={`map-control ${mapType === 'roadmap' ? 'active' : ''}`}
          onClick={() => setMapType('roadmap')}
        >
          Map
        </span>
        <span 
          className={`map-control ${mapType === 'satellite' ? 'active' : ''}`}
          onClick={() => setMapType('satellite')}
        >
          Satellite
        </span>
      </div>
      
      {/* Center button */}
      <button
        className="map-center-btn"
        aria-label="center map"
        onClick={() => {
          if (markers.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            markers.forEach(marker => {
              if (marker.position) {
                bounds.extend(marker.position);
              }
            });
            map.fitBounds(bounds);
          } else {
            map.panTo(defaultCenter);
            map.setZoom(4);
          }
        }}
      >
        <FaLocationArrow />
      </button>
      
      {/* Map Footer */}
      <div className="map-footer">
        <span>Terms of use</span>
        <span>Report a map error</span>
      </div>
    </div>
  )
}

export default TaskMap