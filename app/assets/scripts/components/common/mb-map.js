import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import { saveAs } from 'file-saver';

import config from '../../config';
import { glsp } from '../../styles/utils/theme-values';
import { mapStyles } from '../../utils/constants';
import { useMapboxControl } from './mapbox-react-control';

import StyleControlDropdown from './map-style-control';

// Set mapbox token.
mapboxgl.accessToken = config.mbToken;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* Styles to accommodate the partner logos */
  .mapboxgl-ctrl-bottom-left {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;

    > .mapboxgl-ctrl {
      margin: 0 ${glsp(0.5)} 0 0;
    }
  }
`;

const MbMap = React.forwardRef((props, ref) => {
  const {
    isSelectingHelperTarget,
    helperTarget,
    settings,
    onAction,
    mapStyleId,
    customMapUrl
  } = props;
  const mapContainer = useRef(null);

  const [isLoaded, setLoaded] = useState(false);

  const mapStyleControl = useMapboxControl(() => {
    return (
      <StyleControlDropdown
        styles={mapStyles}
        activeStyleId={mapStyleId}
        onChange={(styleId) => onAction('style.set', { styleId })}
        onInputChange={(url) => onAction('customurl.set', { url })}
      />
    );
  }, [mapStyleId, onAction]);

  // Initialize map
  useEffect(() => {
    const style = mapStyles.find((v) => v.id === mapStyleId);
    const mbMap = new mapboxgl.Map({
      attributionControl: false,
      container: mapContainer.current,
      style: style.url,
      logoPosition: 'bottom-left',
      zoom: 13,
      center: [-25.75974990820663, 37.85838746294672],
      pitch: 73.37724,
      bearing: 127.53,
      preserveDrawingBuffer: true
    });
    window.ma = ref.current = mbMap;

    // Add zoom controls.
    mbMap.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Custom style selection control
    mbMap.addControl(mapStyleControl, 'top-left');

    // Style attribution
    mbMap.addControl(new mapboxgl.AttributionControl({ compact: true }));

    mbMap.on('style.load', function () {
      mbMap.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14
      });
      mbMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      mbMap.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-opacity': [
            'interpolate',
            ['exponential', 0.1],
            ['zoom'],
            5,
            0,
            22,
            1
          ]
        }
      });

      if (mbMap.getLayer('satellite')) {
        mbMap.setPaintProperty('satellite', 'raster-fade-duration', 0);
      }

      setLoaded(true);
    });

    return () => {
      mbMap.remove();
    };
  }, [ref]);

  // Update style
  useMapStyle(ref, mapStyleId, customMapUrl);

  useEffect(() => {
    const mbMap = ref.current;
    const clickListener = (e) => {
      onAction('target.set', {
        point: [e.lngLat.lng, e.lngLat.lat]
      });
    };

    if (isSelectingHelperTarget) {
      mbMap.getCanvas().style.cursor = 'crosshair';
      mbMap.on('click', clickListener);
    }
    return () => {
      if (isSelectingHelperTarget) {
        mbMap.getCanvas().style.cursor = '';
        mbMap.off('click', clickListener);
      }
    };
  }, [ref, isSelectingHelperTarget, onAction]);

  useEffect(() => {
    const mbMap = ref.current;
    let theMarker = null;

    if (helperTarget) {
      theMarker = new mapboxgl.Marker().setLngLat(helperTarget).addTo(mbMap);
    }
    return () => {
      if (theMarker) {
        theMarker.remove();
      }
    };
  }, [ref, helperTarget]);

  // Settings
  useMapSettings(ref, isLoaded, settings);

  return <MapContainer ref={mapContainer} />;
});

MbMap.propTypes = {
  isSelectingHelperTarget: T.bool,
  helperTarget: T.array,
  settings: T.shape({
    exaggeration: T.number,
    sunAltitude: T.number,
    sunAzimuth: T.number,
    sunHaloIntensity: T.number,
    sunAtmosphereIntensity: T.number
  }),
  onAction: T.func,
  mapStyleId: T.string,
  customMapUrl: T.string
};

export default MbMap;

const useMapSettings = (ref, isLoaded, settings) => {
  const mbMap = ref.current;
  const {
    exaggeration,
    sunAltitude,
    sunAzimuth,
    sunHalo,
    sunAtmosphere
  } = settings;

  useEffect(() => {
    if (!mbMap) return;
    mbMap.setTerrain({ source: 'mapbox-dem', exaggeration: exaggeration });
  }, [mbMap, isLoaded, exaggeration]);

  useEffect(() => {
    if (!mbMap) return;
    mbMap.setLight({
      position: [1, sunAzimuth, sunAltitude],
      anchor: 'map'
    });
  }, [mbMap, isLoaded, sunAltitude, sunAzimuth]);

  useEffect(() => {
    if (!mbMap) return;
    const { r, g, b, a } = sunHalo;
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    mbMap.setPaintProperty('sky', 'sky-atmosphere-halo-color', rgba);
  }, [mbMap, isLoaded, sunHalo]);

  useEffect(() => {
    if (!mbMap) return;
    const { r, g, b, a } = sunAtmosphere;
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    mbMap.setPaintProperty('sky', 'sky-atmosphere-color', rgba);
  }, [mbMap, isLoaded, sunAtmosphere]);
};

const useMapStyle = (ref, mapStyleId, customMapUrl) => {
  // We only want to allow change styles once the map is mounted.
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) return;

    const mbMap = ref.current;

    if (mbMap) {
      const style = mapStyleId == 'custom'
      ? { url: customMapUrl }
      : mapStyles.find((v) => v.id === mapStyleId);
      mbMap.setStyle(style.url);
    }
  }, [ref, mapStyleId, customMapUrl]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
};
