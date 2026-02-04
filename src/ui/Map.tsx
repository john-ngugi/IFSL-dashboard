import { useState, useCallback, useRef } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { LayerProps, MapLayerMouseEvent } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapRef } from "@vis.gl/react-maplibre";
import FieldInfoPanel from "./FieldInfoPanel";

interface MapViewProps {
  width?: string | number;
  height?: string | number;
}

interface PulsingDotImage {
  width: number;
  height: number;
  data: Uint8Array | Uint8ClampedArray;
  context?: CanvasRenderingContext2D | null;
  onAdd: () => void;
  render: () => boolean;
}

const layerStyle: LayerProps = {
  id: "field-points",
  type: "circle",
  paint: {
    "circle-radius": 8,
    "circle-color": "#011d40", // Dark blue
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

const layerStyleHover: LayerProps = {
  id: "field-points-hover",
  type: "circle",
  paint: {
    "circle-radius": 12,
    "circle-color": "#023e7d", // Lighter blue on hover
    "circle-stroke-width": 3,
    "circle-stroke-color": "#ffffff",
    "circle-opacity": 0.8,
  },
};

const pulsingLayerStyle: LayerProps = {
  id: "field-points-active",
  type: "symbol",
  layout: {
    "icon-image": "pulsing-dot",
    "icon-size": 0.6,
    "icon-allow-overlap": true,
  },
};

const fieldPoints = "data/spatial/field_points.geojson";
const countyBoundaries = "data/spatial/ken_admin2.geojson";

const MapView: React.FC<MapViewProps> = ({
  width = "100%",
  height = "100%",
}) => {
  const [selectedField, setSelectedField] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<
    string | number | null
  >(null);
  const [cursor, setCursor] = useState<string>("auto");
  const mapRef = useRef<MapRef | null>(null);
  const [activeFeatureId, setActiveFeatureId] = useState<
    string | number | null
  >(null);

  const onMapLoad = useCallback((event: any) => {
    const map = event.target;
    const size = 200;

    const pulsingDot: PulsingDotImage = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),
      context: null,

      onAdd() {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        this.context = canvas.getContext("2d");
      },

      render() {
        if (!this.context) return false;

        const ctx = this.context;
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.25;
        const outerRadius = (size / 2) * 0.7 * t + radius;

        ctx.clearRect(0, 0, size, size);

        // Outer pulse
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 0, ${1 - t})`;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0000"; // Changed to red
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        const imageData = ctx.getImageData(0, 0, size, size);
        this.data = new Uint8Array(imageData.data.buffer);

        map.triggerRepaint();
        return true;
      },
    };

    if (!map.hasImage("pulsing-dot")) {
      map.addImage("pulsing-dot", pulsingDot, {
        pixelRatio: 2,
        // sdf: true,
      });
    }
  }, []);

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      console.log("Feature:", feature); // See the whole feature
      console.log("Feature ID:", feature.id ?? null); // Check built-in id
      console.log("Feature properties:", feature.properties); // Check properties
      setSelectedField(feature.properties);
      setIsPanelOpen(true);
      setActiveFeatureId(feature.properties?.field_1 ?? null);
      if (mapRef.current && feature.geometry.type === "Point") {
        const [lng, lat] = feature.geometry.coordinates as [number, number];

        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          speed: 1.2, // animation speed
          curve: 1.5, // smoothness
          essential: true,
        });
      }
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    setCursor("pointer");
  }, []);

  const onMouseLeave = useCallback(() => {
    setCursor("auto");
    setHoveredFeatureId(null);
  }, []);

  const onMouseMove = useCallback((event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
      setHoveredFeatureId(features[0].id as string | number);
    }
  }, []);
  const closePanel = () => {
    setIsPanelOpen(false);
    setActiveFeatureId(null); // 👈 pulse stops here
  };
  return (
    <div style={{ width, height }} className="relative">
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{
          longitude: 37.6834,
          latitude: -3.3988,
          zoom: 11,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://api.maptiler.com/maps/hybrid-v4/style.json?key=Zk2vXxVka5bwTvXQmJ0l"
        interactiveLayerIds={["field-points"]}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        cursor={cursor}
      >
        <Source
          id="field-points-source"
          type="geojson"
          data={fieldPoints}
          promoteId="field_1"
        >
          {/* Regular points - hide the active one */}
          <Layer
            {...layerStyle}
            {...(activeFeatureId && {
              filter: ["!=", ["get", "field_1"], activeFeatureId],
            })}
          />

          {hoveredFeatureId && (
            <Layer
              {...layerStyleHover}
              filter={["==", ["get", "field_1"], hoveredFeatureId]}
            />
          )}

          {activeFeatureId && (
            <Layer
              {...pulsingLayerStyle}
              filter={["==", ["get", "field_1"], activeFeatureId]}
            />
          )}
        </Source>
        <Source id="county-boundaries" type="geojson" data={countyBoundaries}>
          <Layer
            id="county-boundaries-layer"
            type="fill"
            paint={{
              "fill-color": "#ff0000",
              "fill-opacity": 0.2,
              "fill-outline-color": "white",
            }}
          />
        </Source>
      </Map>

      {/* Info Panel */}
      <FieldInfoPanel
        isOpen={isPanelOpen}
        onClose={() => closePanel()}
        data={selectedField}
      />

      {/* Map Legend */}
      <div className="absolute bottom-6 left-6 bg-white  shadow-lg p-4 border-t-4 border-primary-600">
        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: "#011d40" }}
          ></div>
          Field Points
        </h3>
        <div className="space-y-2 text-xs text-neutral-600">
          <p className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: "#ff0000" }}
            ></span>
            Active Farm Field
          </p>
          <p className="text-xs text-neutral-500 italic">
            Click on a point for details
          </p>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-primary-50 transition-colors border-b border-neutral-200">
          <svg
            className="w-5 h-5 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-primary-50 transition-colors">
          <svg
            className="w-5 h-5 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapView;
