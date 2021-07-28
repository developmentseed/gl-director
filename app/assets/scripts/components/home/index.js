import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';

import App from '../common/app';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody
} from '../../styles/inpage';
import OptionsPanel from './options-panel';
import MbMap from '../common/mb-map';

import media from '../../styles/utils/media-queries';
import { themeVal } from '../../styles/utils/general';
import MapMessage from '../common/map-message';
import ExamplesModal from './example-modal';
import { animate, getAnimationValues, lerp } from '../../utils/animate';
import { mapStyles } from '../../utils/constants';

const ExploreCanvas = styled.div`
  display: grid;
  height: 100%;
  grid-template-columns: 1fr min-content;
  overflow: hidden;

  ${media.mediumDown`
    ${({ panelRight }) => panelRight && 'grid-template-columns: 0 min-content;'}
  `}

  > * {
    grid-row: 1;
  }
`;

const ExploreCarto = styled.section`
  position: relative;
  height: 100%;
  background: ${themeVal('color.baseAlphaA')};
  display: grid;
  grid-template-rows: 1fr auto;
  min-width: 0;
  overflow: hidden;
`;

const getResizedImage = (canvas, newWidth) => {
  // Create a new canvas
  let newCanvas = document.createElement('canvas');
  const context = newCanvas.getContext('2d');

  //set dimensions
  const ratio = canvas.width / canvas.height;
  newCanvas.width = newWidth;
  newCanvas.height = newWidth / ratio;

  //apply the old canvas to the new one
  context.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
  const dataUrl = newCanvas.toDataURL();
  newCanvas = null;
  return dataUrl;
};

const initialSettings = {
  exaggeration: 1,
  sunAltitude: 45,
  sunAzimuth: 0,
  sunHalo: { r: 255, b: 255, g: 255, a: 1 },
  sunAtmosphere: { r: 255, b: 255, g: 255, a: 1 }
};

function Home() {
  const cameraAnimationRef = React.useRef(null);
  const mapboxMapRef = useRef(null);

  const [panelRevealed, setPanelRevealed] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExampleModalRevealed, setExampleModalRevealed] = useState(true);

  // Target
  const [helperTarget, setHelperTarget] = useState(null);
  const [isSelectingHelperTarget, setIsSelectingHelperTarget] = useState(false);

  // Settings
  const [settings, setSettings] = useState(initialSettings);

  const [cameraPos, setCameraPos] = useState([]);

  const [mapStyleId, setMapStyleId] = useState(
    mapStyles.find((v) => v.initial).id
  );

  const [customMapUrl, setCustomMapUrl] = useState([])

  useEffect(() => {
    if (cameraPos.length < 2) return;

    const cStart = getAnimationValues(cameraPos[0]);
    const cEnd = getAnimationValues(cameraPos[1]);

    cameraAnimationRef.current = animate([
      {
        duration: cameraPos[0].duration * 1000,
        update: (phase) => {
          // Interpolate all the values.
          const values = {};
          for (const key in cStart) {
            values[key] = lerp(cStart[key], cEnd[key], phase);
          }

          const {
            position,
            target,
            exaggeration,
            sunAltitude,
            sunAzimuth,
            sunHalo: [hR, hG, hB, hA],
            sunAtmosphere: [aR, aG, aB, aA],
            targetElevation
          } = values;

          const m = mapboxMapRef.current;
          const camera = m.getFreeCameraOptions();

          camera.position = new mapboxgl.MercatorCoordinate(...position);

          // The lookAtPoint method takes the point's altitude into account
          // resulting in a bumpy camera movement as the target goes through
          // peaks and troughs. Override the method during enough time to get
          // the new value.
          const originalGetAtPoint = camera._elevation.getAtPoint;
          camera._elevation.getAtPoint = () => targetElevation;
          camera.lookAtPoint(target);
          // Restore to former glory.
          camera._elevation.getAtPoint = originalGetAtPoint;

          m.setFreeCameraOptions(camera);
          m.setTerrain({
            source: 'mapbox-dem',
            exaggeration: exaggeration
          });
          m.setLight({
            position: [1, sunAzimuth, sunAltitude],
            anchor: 'map'
          });
          const haloRGBA = `rgba(${hR}, ${hG}, ${hB}, ${hA})`;
          m.setPaintProperty('sky', 'sky-atmosphere-halo-color', haloRGBA);
          const atmRGBA = `rgba(${aR}, ${aG}, ${aB}, ${aA})`;
          m.setPaintProperty('sky', 'sky-atmosphere-color', atmRGBA);
        }
      }
    ]);
  }, [cameraPos]);

  useEffect(() => {
    if (cameraAnimationRef.current) {
      if (isAnimating) {
        cameraAnimationRef.current.play();
      } else {
        cameraAnimationRef.current.pause();
      }
    }
  }, [isAnimating]);

  const resizeMap = useCallback(() => {
    // Delay execution to give the panel animation time to finish.
    setTimeout(() => {
      mapboxMapRef.current.resize();
    }, 300);
  }, []);

  const captureCameraPosition = () => {
    const m = mapboxMapRef.current;
    const camera = m.getFreeCameraOptions();
    const { x, y, z } = camera.position;
    const orientation = camera.orientation;
    const target = m.getCenter().toArray();
    const targetElevation = camera._elevation.getAtPoint(
      mapboxgl.MercatorCoordinate.fromLngLat(target)
    );

    const image = getResizedImage(m.getCanvas(), 320);

    return {
      position: [x, y, z],
      orientation,
      target,
      targetElevation,
      image
    };
  };

  const onPanelAction = useCallback(
    (action, payload) => {
      switch (action) {
        case 'examples.click':
          setExampleModalRevealed(true);
          break;
        case 'camera.add': {
          setCameraPos((state) => [
            ...state,
            {
              id: Math.random().toString(16).substring(2, 8),
              duration: 10,
              ...captureCameraPosition(),
              settings
            }
          ]);
          break;
        }
        case 'camera.edit': {
          setCameraPos((state) => {
            const { idx } = payload;
            const current = state[idx];
            return Object.assign([], state, {
              [idx]: {
                ...current,
                ...captureCameraPosition(),
                settings
              }
            });
          });
          break;
        }
        case 'camera.view': {
          const { position, orientation, settings: camSettings } = payload;
          const m = mapboxMapRef.current;
          const camera = m.getFreeCameraOptions();
          camera.position = new mapboxgl.MercatorCoordinate(...position);
          camera.orientation = orientation;
          m.setFreeCameraOptions(camera);
          setSettings(camSettings);
          break;
        }
        case 'play':
          setIsAnimating(true);
          break;
        case 'stop':
          setIsAnimating(false);
          break;
        case 'camera.set-duration':
          setCameraPos((state) => {
            const { idx, value } = payload;
            const current = state[idx];
            return Object.assign([], state, {
              [idx]: {
                ...current,
                duration: value
              }
            });
          });
          break;
        case 'settings.set':
          setSettings((state) => ({
            ...state,
            [payload.prop]: payload.value
          }));
          break;
        case 'target.selecting':
          setIsSelectingHelperTarget((state) => !state);
          break;
        case 'target.clear':
          setIsSelectingHelperTarget(false);
          setHelperTarget(null);
          break;
        case 'target.focus': {
          const m = mapboxMapRef.current;
          const camera = m.getFreeCameraOptions();
          camera.lookAtPoint(helperTarget);
          m.setFreeCameraOptions(camera);
          break;
        }
      }
    },
    [helperTarget, settings]
  );

  const onMapAction = useCallback((action, payload) => {
    switch (action) {
      case 'style.set':
        setMapStyleId(payload.styleId);
        break;
      case 'customurl.set':
        setCustomMapUrl(payload.url);
      case 'target.set':
        setIsSelectingHelperTarget(false);
        setHelperTarget(payload.point);
        break;
    }
  }, []);

  const onExampleSelect = (ex) => {
    // Custom
    if (ex === null) {
      setSettings(initialSettings);
      setCameraPos([]);
    } else {
      setCameraPos(ex.shots);
      onPanelAction('camera.view', ex.shots[0]);
    }
    setExampleModalRevealed(false);
  };

  return (
    <App pageTitle='Home' hideFooter>
      <Inpage isMapCentric>
        <InpageHeader>
          <InpageHeaderInner>
            <InpageHeadline>
              <InpageTitle>Home</InpageTitle>
            </InpageHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <ExploreCanvas panelRight={panelRevealed}>
            <ExploreCarto>
              <MapMessage active={isSelectingHelperTarget}>
                <p>Click to set a target</p>
              </MapMessage>
              <MbMap
                ref={mapboxMapRef}
                onAction={onMapAction}
                isSelectingHelperTarget={isSelectingHelperTarget}
                helperTarget={helperTarget}
                settings={settings}
                mapStyleId={mapStyleId}
                customMapUrl={customMapUrl}
              />
            </ExploreCarto>
            <OptionsPanel
              revealed={panelRevealed}
              onAction={onPanelAction}
              isAnimating={isAnimating}
              onPanelChange={({ revealed }) => {
                resizeMap();
                setPanelRevealed(revealed);
              }}
              target={helperTarget}
              isSelectingTarget={isSelectingHelperTarget}
              cameraPositions={cameraPos}
              map={mapboxMapRef}
              settings={settings}
            />
          </ExploreCanvas>
        </InpageBody>
      </Inpage>
      <ExamplesModal
        revealed={isExampleModalRevealed}
        onCloseClick={() => setExampleModalRevealed(false)}
        onExampleSelect={onExampleSelect}
      />
    </App>
  );
}

export default Home;
