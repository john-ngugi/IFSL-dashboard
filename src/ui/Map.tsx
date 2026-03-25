import { useState, useCallback, useRef, useEffect } from "react";
import Map, { Source, Layer } from "@vis.gl/react-maplibre";
import type { LayerProps, MapLayerMouseEvent } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapRef } from "@vis.gl/react-maplibre";
import FieldInfoPanel from "./FieldInfoPanel";

interface MapViewProps {
  width?: string | number;
  height?: string | number;
}

interface FilterState {
  farmerCode: string;
  farmerName: string;
  gender: string;
  soilHealth: string;
  fieldType: string;
  minScore: string;
  maxScore: string;
  valueChain: string;
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
    "circle-color": [
      "case",
      // Livestock — purple
      ["==", ["get", "FIELD_TYPE"], "Livestock"],
      "#9333ea",
      // Water — blue-ish
      ["==", ["get", "FIELD_TYPE"], "Water"],
      "#0ea5e9",
      // Soil — color by health rating
      ["==", ["get", "has_soil_data"], true],
      [
        "match",
        ["get", "health_rating"],
        "Excellent",
        "#10b981",
        "Good",
        "#3b82f6",
        "Fair",
        "#eab308",
        "Poor",
        "#f97316",
        "Critical",
        "#ef4444",
        "#6b7280", // fallback for soil with no rating
      ],
      // Unknown / anything else — gray
      "#6b7280",
    ],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

const layerStyleHover: LayerProps = {
  id: "field-points-hover",
  type: "circle",
  paint: {
    "circle-radius": 12,
    "circle-color": [
      "case",
      ["==", ["get", "FIELD_TYPE"], "Livestock"],
      "#7e22ce",
      ["==", ["get", "FIELD_TYPE"], "Water"],
      "#0284c7",
      ["==", ["get", "has_soil_data"], true],
      [
        "match",
        ["get", "health_rating"],
        "Excellent",
        "#059669",
        "Good",
        "#2563eb",
        "Fair",
        "#ca8a04",
        "Poor",
        "#ea580c",
        "Critical",
        "#dc2626",
        "#4b5563",
      ],
      "#4b5563",
    ],
    "circle-stroke-width": 3,
    "circle-stroke-color": "#ffffff",
    "circle-opacity": 0.8,
  },
};

const pulsingLayerStyle: LayerProps = {
  id: "field-points-active",
  type: "symbol",
  layout: {
    "symbol-placement": "point",
    "icon-image": "pulsing-dot",
    "icon-size": 0.6,
    "icon-allow-overlap": true,
  },
};

const countyBoundaries = "data/spatial/ken_admin2.geojson";
const wards = "data/spatial/wards.geojson";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const wardsBorderLayer: LayerProps = {
  id: "wards-border",
  type: "line",
  paint: {
    "line-color": "#3b82f6",
    "line-width": 1.5,
    "line-opacity": 0.7,
  },
};

const wardsLabelLayer: LayerProps = {
  id: "wards-labels",
  type: "symbol",
  minzoom: 10, // only show labels from zoom 10+
  layout: {
    "text-field": ["get", "IEBC_WARDS"], // your property name
    "text-font": ["Noto Sans Bold"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10, 14, 14],
    "symbol-placement": "point", // centers label on polygon centroid
    "text-allow-overlap": false,
    "text-ignore-placement": false,
  },
  paint: {
    "text-color": "#ffffff",
    "text-halo-color": "#ffffff",
    "text-halo-width": 2,
  },
};

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
  const [activeFeatureId, setActiveFeatureId] = useState<
    string | number | null
  >(null);
  const [fieldPointsData, setFieldPointsData] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const mapRef = useRef<MapRef | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    farmerCode: "",
    farmerName: "",
    gender: "all",
    soilHealth: "all",
    fieldType: "all",
    minScore: "",
    maxScore: "",
    valueChain: "",
  });

  // Fetch filtered data
  const fetchFilteredData = useCallback(
    async (filtersToUse?: FilterState) => {
      const activeFilters = filtersToUse || filters;
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        // Build search query from code and name
        const searchTerms = [];
        if (activeFilters.farmerCode)
          searchTerms.push(activeFilters.farmerCode);
        if (activeFilters.farmerName)
          searchTerms.push(activeFilters.farmerName);
        if (searchTerms.length > 0) {
          params.append("q", searchTerms.join(" "));
        }

        if (activeFilters.fieldType !== "all")
          params.append("field_type", activeFilters.fieldType);
        if (activeFilters.soilHealth !== "all")
          params.append("rating", activeFilters.soilHealth);
        if (activeFilters.gender !== "all")
          params.append("gender", activeFilters.gender);
        if (activeFilters.valueChain)
          params.append("value_chain", activeFilters.valueChain);
        if (activeFilters.minScore)
          params.append("min_score", activeFilters.minScore);
        if (activeFilters.maxScore)
          params.append("max_score", activeFilters.maxScore);

        const url = `${BASE_URL}/api/search-farmers/?${params.toString()}`;
        console.log("🔍 Fetching from:", url);
        console.log("📋 Active filters:", activeFilters);

        const response = await fetch(url);
        const data = await response.json();

        console.log("✅ API Response count:", data.count);
        console.log("📊 Filters applied:", data.filters);

        // Convert to GeoJSON
        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: data.results.map((result: any) => ({
            type: "Feature",
            properties: {
              // Identifiers
              field_1: result.code,
              code: result.code,

              // Location
              X_FIELD: result.coordinates[1],
              Y_FIELED: result.coordinates[0],

              // Basic Information
              "NAME OF FARMER": result.farmer_name,
              GENDER: result.gender,
              "VALUE CHAIN": result.value_chain,
              FIELD_TYPE: result.field_type,

              // County/Subcounty
              county: result.county,
              subcounty: result.subcounty,

              // Health Score Info (for map display)
              health_score: result.health_score,
              health_rating: result.health_rating,
              health_color: result.health_color,

              // Flags
              has_soil_data: result.has_soil_data,
              has_livestock_data: result.has_livestock_data,

              // Report URL
              report_url: result.report_url,
            },
            geometry: {
              type: "Point",
              coordinates: [result.coordinates[1], result.coordinates[0]],
            },
          })),
        };

        setFieldPointsData(geojson);
        setResultCount(geojson.features.length);
        console.log("🗺️  Map updated with", geojson.features.length, "points");

        // Fit map to bounds if there are results
        if (geojson.features.length > 0 && mapRef.current) {
          const coordinates = geojson.features.map(
            (f) =>
              (f.geometry as GeoJSON.Point).coordinates as [number, number],
          );

          if (coordinates.length > 0) {
            const bounds: [[number, number], [number, number]] =
              coordinates.reduce(
                (bounds, coord) => {
                  return [
                    [
                      Math.min(bounds[0][0], coord[0]),
                      Math.min(bounds[0][1], coord[1]),
                    ],
                    [
                      Math.max(bounds[1][0], coord[0]),
                      Math.max(bounds[1][1], coord[1]),
                    ],
                  ];
                },
                [
                  [coordinates[0][0], coordinates[0][1]],
                  [coordinates[0][0], coordinates[0][1]],
                ],
              );

            mapRef.current.fitBounds(bounds, {
              padding: 50,
              maxZoom: 15,
            });
          }
        }
      } catch (error) {
        console.error("❌ Error fetching filtered data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters],
  );

  // Initial load
  useEffect(() => {
    console.log("🚀 Initial data load");
    fetchFilteredData();
  }, []);

  // Apply filters
  const applyFilters = () => {
    console.log("🔘 Apply button clicked with filters:", filters);
    fetchFilteredData();
  };

  // Reset filters
  const resetFilters = () => {
    console.log("🔄 Resetting all filters");
    const emptyFilters = {
      farmerCode: "",
      farmerName: "",
      gender: "all",
      soilHealth: "all",
      fieldType: "all",
      minScore: "",
      maxScore: "",
      valueChain: "",
    };
    setFilters(emptyFilters);
    // Immediately fetch with empty filters
    fetchFilteredData(emptyFilters);
  };

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

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 0, ${1 - t})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0000";
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
      });
    }
  }, []);

  const onClick = useCallback(async (event: MapLayerMouseEvent) => {
    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      const code = feature.properties?.code;

      if (code) {
        try {
          // Fetch complete field data with all soil/water/livestock properties
          const response = await fetch(`${BASE_URL}/api/field-detail/${code}`);
          const detailedData = await response.json();

          console.log("📄 Loaded detailed field data:", detailedData);

          setSelectedField(detailedData);
          setIsPanelOpen(true);
          setActiveFeatureId(feature.properties?.field_1 ?? null);

          if (mapRef.current && feature.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates as [number, number];
            mapRef.current.flyTo({
              center: [lng, lat],
              zoom: 15,
              speed: 1.2,
              curve: 1.5,
              essential: true,
            });
          }
        } catch (error) {
          console.error("❌ Error fetching field details:", error);
          // Fallback to basic properties if detailed fetch fails
          setSelectedField(feature.properties);
          setIsPanelOpen(true);
          setActiveFeatureId(feature.properties?.field_1 ?? null);
        }
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
      setHoveredFeatureId(features[0].properties?.field_1 as string | number);
    }
  }, []);

  const closePanel = () => {
    setIsPanelOpen(false);
    setActiveFeatureId(null);
  };

  const zoomIn = () => {
    mapRef.current?.easeTo({
      zoom: mapRef.current.getZoom() + 1,
      duration: 300,
    });
  };

  const zoomOut = () => {
    mapRef.current?.easeTo({
      zoom: mapRef.current.getZoom() - 1,
      duration: 300,
    });
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
        {fieldPointsData && (
          <Source
            id="field-points-source"
            type="geojson"
            data={fieldPointsData}
            promoteId="field_1"
          >
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
        )}

        <Source id="wards" type="geojson" data={wards}>
          <Layer {...wardsBorderLayer} />
          <Layer {...wardsLabelLayer} />
        </Source>
        <Source id="county-boundaries" type="geojson" data={countyBoundaries}>
          <Layer
            id="county-boundaries-layer"
            type="line"
            paint={{
              "line-color": "#ffffff",
              "line-width": 3,
              "line-opacity": 0.9,
            }}
          />
        </Source>
      </Map>

      {/* Filter Sidebar Panel */}
      <div className="absolute bottom-0 sm:top-0 right-0 sm:h-full w-full sm:w-80 max-h-64 sm:max-h-full bg-white shadow-2xl overflow-y-auto border-t sm:border-t-0 sm:border-l border-neutral-200 z-10">
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 p-6 border-b border-primary-800 z-10">
          <h2 className="text-xl font-bold text-white mb-2">Field Filters</h2>
          <p className="text-emerald-100 text-sm">
            {resultCount} {resultCount === 1 ? "field" : "fields"} found
          </p>
        </div>

        <div className="p-6">
          {/* Filters Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Farmer Name
              </label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.farmerName}
                onChange={(e) =>
                  setFilters({ ...filters, farmerName: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">
                Farmer Code
              </label>
              <input
                type="text"
                placeholder="e.g., BM01"
                value={filters.farmerCode}
                onChange={(e) =>
                  setFilters({ ...filters, farmerCode: e.target.value })
                }
                className="w-full px-3 py-2.5 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={applyFilters}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Apply"}
              </button>
              <button
                onClick={resetFilters}
                disabled={isLoading}
                className="px-4 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel for Selected Field */}
      {isPanelOpen && selectedField && (
        <FieldInfoPanel
          isOpen={isPanelOpen}
          onClose={() => closePanel()}
          data={selectedField}
        />
      )}

      {/* Map Legend */}
      <div className="absolute bottom-72 sm:bottom-6 left-6 bg-white shadow-lg p-4 border-t-4 border-emerald-600 rounded-lg">
        <h3 className="text-sm font-bold text-neutral-900 mb-3">
          Soil Health Ratings
        </h3>
        <div className="space-y-2 text-xs">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              <span>Excellent (80-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
              <span>Good (60-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white" />
              <span>Fair (40-59)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white" />
              <span>Poor (40-59)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white" />
              <span>Critical (&lt;40)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600 border-2 border-white" />
              <span>Livestock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-500 border-2 border-white" />
              <span>Water</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-white" />
              <span>Unknown</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-6 right-4 sm:right-[22rem] bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden">
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 transition-colors border-b border-neutral-200"
          onClick={zoomIn}
        >
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
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 transition-colors"
          onClick={zoomOut}
        >
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
