
import { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import './Home.css'
mapboxgl.accessToken = 'pk.eyJ1IjoiaWNhcm83MDEiLCJhIjoiY2pvMmEzMWNhMGs4ZTNwbXcwaWVoZjB2eiJ9.LbFJyjAt1R_vbv-79u9xng'

export default function Home() {
  const [coordinates, setCoordinates] = useState({ lat: 0, long: 0 })
  const [city, setCity] = useState()
  const [climate, setClimate] = useState(0)
  const [zoom, setZoom] = useState(14)
  const [showMessage, setShowMessage] = useState(false)
  const map: any = useRef(null)
  const mapContainer = useRef(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates({ lat: position.coords.latitude, long: position.coords.longitude })
    });
  }, [])
  const updateCoordinates = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoordinates({ lat: position.coords.latitude, long: position.coords.longitude })
    });
  }
  useEffect(() => {
    if (coordinates.lat && coordinates.long) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.long}&appid=ecdb3af1e50e3671b651b0c7e8c38074&units=metric`)
        .then((res) => res.json())
        .then((data) => {
          setCity(data.name)
          setClimate(data.main.temp)
          console.log(data)
        })
    }
  }, [coordinates])

  useEffect(() => {
    if (map.current) return
    if (coordinates.lat && coordinates.long) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: [coordinates.long, coordinates.lat],
        zoom: zoom
      });
    }
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    if (coordinates.lat && coordinates.long) {
      map.current.on('move', () => {
        setCoordinates({ lat: map.current.getCenter().lat.toFixed(4), long: map.current.getCenter().lng.toFixed(4) })
        setZoom(map.current.getZoom().toFixed(2))
      });
    }
  });
  return (
    <div className="App">
      <div className="sidebar">
        {city} | Longitude: {coordinates.long} | Latitude: {coordinates.lat} | Zoom: {zoom}
      </div>
      <div onClick={() => { updateCoordinates() }} onMouseEnter={() => { setShowMessage(true) }} onMouseLeave={() => { setShowMessage(false) }} >
        <a target="_blank">
          <img src="/logo.gif" className="logo" alt="Vite logo" />
        </a>
      </div>
      <h2> {Math.round(climate)}ºC  {showMessage && <p className="small-message">Atualizar localização</p>}</h2>
      <div ref={mapContainer} className="map-container" />
      <p className="read-the-docs">
        Feito com ❤️ por Ícaro Bernard
      </p>
    </div>
  )
}


