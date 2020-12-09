export const compileExport = ({
  token,
  start,
  end,
  duration
}) => `<!DOCTYPE html>
<html>
  <head>
  <title>Mapbox GL JS</title>
  <meta charset='utf-8'>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    html, body, #map { height: 100%; }

    #controls {
      position: absolute;
      background: #fff;
      top: 16px;
      left: 16px;
      padding: 16px;
      border-radius: 4px;
      box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.24);
    }
  </style>
  </head>
<body>
  <div id='map'></div>
  <div id='controls'>
    <button id="animation-control" type="button" disabled>Play</button>
  </div>

  <script>
    function lerp(r,n,t){if(Array.isArray(r)&&Array.isArray(n)){const e=[];for(let a=0;a<Math.min(r.length,n.length);a++)e[a]=r[a]*(1-t)+n[a]*t;return e}return r*(1-t)+n*t}
    function animate(n){let t=null,o=null,e=0,u=0;const a=function(c){o=requestAnimationFrame(a);const i=c-t;t=c,e+=i;const{duration:l,update:r}=n[u];e>l?(u++,u%=n.length,e-=l):r(e/l)};function c(){o&&cancelAnimationFrame(o),o=null}return{play:function(){o||(t=performance.now(),a(t))},pause:c,stop:function(){c(),e=0,u=0}}}

    mapboxgl.accessToken = '${token}';

    var animation = null;
    var map = window.map = new mapboxgl.Map({
      container: 'map',
      zoom: 1,
      center: [0, 0],
      style: 'mapbox://styles/mapbox/satellite-v9'
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocation: true,
      fitBoundsOptions: {
        maxZoom: 20
      }
    }));
    map.addControl(new mapboxgl.ScaleControl());
    map.addControl(new mapboxgl.FullscreenControl());

    map.on('load', function() {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.terrain-rgb',
        tileSize: 512,
        maxzoom: 14
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
      map.addLayer({
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
      map.setPaintProperty('satellite', 'raster-fade-duration', 0);
      document.getElementById('animation-control').removeAttribute('disabled');

      const start = {
        position: [${start.position.join(', ')}],
        target: [${start.target.join(', ')}],
        exaggeration: ${start.exaggeration},
        sunAltitude: ${start.sunAltitude},
        sunAzimuth: ${start.sunAzimuth},
        sunHalo: [${start.sunHalo.join(', ')}],
        sunAtmosphere: [${start.sunAtmosphere.join(', ')}]
      };
      const end = {
        position: [${end.position.join(', ')}],
        target: [${end.target.join(', ')}],
        exaggeration: ${end.exaggeration},
        sunAltitude: ${end.sunAltitude},
        sunAzimuth: ${end.sunAzimuth},
        sunHalo: [${end.sunHalo.join(', ')}],
        sunAtmosphere: [${end.sunAtmosphere.join(', ')}]
      };

      function setMapValues (values) {
        const {
          position,
          target,
          exaggeration,
          sunAltitude,
          sunAzimuth,
          sunHalo,
          sunAtmosphere
        } = values;

        const camera = map.getFreeCameraOptions();

        camera.position = new mapboxgl.MercatorCoordinate(position[0], position[1], position[2]);
        camera.lookAtPoint(target);

        map.setFreeCameraOptions(camera);
        map.setTerrain({
          source: 'mapbox-dem',
          exaggeration: exaggeration
        });
        map.setLight({
          position: [1, sunAzimuth, sunAltitude],
          anchor: 'map'
        });
        map.setPaintProperty('sky', 'sky-atmosphere-halo-color',
          'rgba(' + sunHalo[0] + ', ' + sunHalo[1] + ', ' + sunHalo[2] + ', ' + sunHalo[3] + ')');
        map.setPaintProperty('sky', 'sky-atmosphere-color',
          'rgba(' + sunAtmosphere[0] + ', ' + sunAtmosphere[1] + ', ' + sunAtmosphere[2] + ', ' + sunAtmosphere[3] + ')');
      }

      // Prepare the map for the initial position.
      setMapValues(start);

      // Prepare the animation
      animation = animate([{
        duration: ${duration * 1000},
        update: function (phase) {
          // Interpolate all the values.
          const values = {};
          for (const key in start) {
            values[key] = lerp(start[key], end[key], phase);
          }
          setMapValues(values);
        }
      }]);
    });

    document.getElementById('animation-control').addEventListener('click', function(e) {
      if (!animation) return;
      if (e.target.innerHTML === 'Pause') {
        animation.pause();
        e.target.innerHTML = 'Play';
      } else {
        animation.play();
        e.target.innerHTML = 'Pause';
      }
    });

  </script>
</body>
</html>`;
