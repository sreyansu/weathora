import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { WeatherAPI } from '../services/weatherApi';
import { LocationData } from '../types/api';

interface LocationMarkerProps {
  position: [number, number, number];
  data: LocationData;
  onClick: () => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, data, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2;
      meshRef.current.scale.setScalar(hovered ? 1.5 : 1);
    }
  });

  const getColorByAQI = (aqi: number) => {
    if (aqi <= 50) return '#10B981'; // Green
    if (aqi <= 100) return '#F59E0B'; // Yellow
    if (aqi <= 150) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={getColorByAQI(data.aqi)} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white p-2 rounded-lg text-xs whitespace-nowrap pointer-events-none">
            <div className="font-semibold">{data.name}</div>
            <div>{data.temperature}°C • AQI: {data.aqi}</div>
            <div>{data.condition}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

const Earth: React.FC<{ locations: LocationData[]; onLocationClick: (location: LocationData) => void }> = ({ 
  locations, 
  onLocationClick 
}) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  // Convert lat/lng to 3D coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number = 1) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return [x, y, z] as [number, number, number];
  };

  useEffect(() => {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene]);

  return (
    <group>
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          color="#1a1a2e"
          transparent
          opacity={0.8}
          emissive="#0f0f23"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Atmosphere */}
      <Sphere args={[1.02, 64, 64]}>
        <meshBasicMaterial
          color="#4299e1"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Location markers */}
      {locations.map((location, index) => (
        <LocationMarker
          key={index}
          position={latLngToVector3(location.lat, location.lon, 1.05)}
          data={location}
          onClick={() => onLocationClick(location)}
        />
      ))}
    </group>
  );
};

interface GlobeProps {
  onLocationSelect: (location: string) => void;
}

export const Globe: React.FC<GlobeProps> = ({ onLocationSelect }) => {
  const [locations, setLocations] = useState<LocationData[]>([]);

  useEffect(() => {
    // Sample major cities for demonstration
    const majorCities = [
      'New York', 'London', 'Tokyo', 'Paris', 'Sydney', 
      'Mumbai', 'Beijing', 'São Paulo', 'Cairo', 'Moscow'
    ];

    const fetchLocationData = async () => {
      const locationData: LocationData[] = [];
      
      for (const city of majorCities) {
        try {
          const weather = await WeatherAPI.getCurrentWeather(city);
          locationData.push({
            name: weather.location.name,
            country: weather.location.country,
            lat: weather.location.lat,
            lon: weather.location.lon,
            temperature: weather.current.temp_c,
            condition: weather.current.condition.text,
            aqi: weather.current.air_quality ? weather.current.air_quality['us-epa-index'] : 0
          });
        } catch (error) {
          console.error(`Failed to fetch data for ${city}`);
        }
      }
      
      setLocations(locationData);
    };

    fetchLocationData();
  }, []);

  const handleLocationClick = (location: LocationData) => {
    onLocationSelect(`${location.lat},${location.lon}`);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-blue-600/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-4">Global Weather & Air Quality</h3>
      <div className="h-96 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-900/20 to-indigo-900/20">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          <Earth locations={locations} onLocationClick={handleLocationClick} />
        </Canvas>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-gray-300">Good AQI (0-50)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-300">Moderate AQI (51-100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-gray-300">Unhealthy AQI (100+)</span>
        </div>
      </div>
    </div>
  );
};