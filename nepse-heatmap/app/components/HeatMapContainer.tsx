// app/components/HeatMapContainer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hierarchy, treemap } from "d3-hierarchy";
import { nepseData } from "@/app/data/nepseData";
import styles from './HeatMapContainer.module.scss';

export default function HeatMapContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  function getSectorwiseData(data) {
    const sectorData:any[] = [];
    data.forEach((stock) => {
      const existingSector = sectorData.find((sector) => sector.sector === stock.sector);
      if (existingSector) {
        existingSector.companies.push(stock);
      } else {
        sectorData.push({
          sector: stock.sector,
          companies: [stock],
        });
      }
    });
    console.log("Sector-wise data:", sectorData);
    return sectorData;
  }

  const sectorWiseData = useMemo(() => {
    return getSectorwiseData(nepseData);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    // Convert sector → company structure into hierarchy format
    console.log("sector wise data", sectorWiseData)
    const root = hierarchy({
      children: sectorWiseData.map((sector) => ({
        name: sector.sector,
        children: sector.companies,
      })),
    })
      .sum((d: any) => d.totalTradeQuantity || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    treemap()
      .size([width, height])
      .paddingInner(0.5)
      .paddingOuter(2)(root);

    setNodes(root.leaves());
  }, [sectorWiseData]);

  function getColor(change: number) {
    if (change > 2) return "#008f39";
    if (change > 0) return "#2ecc71";
    if (change < -2) return "#c0392b";
    if (change < 0) return "#e74c3c";
    return "#7f8c8d";
  }

  return (
    <>
    <h1 className={styles.stockHeading}>HeatMap Container</h1>
    <div
      ref={containerRef}
      className={styles.heatmapContainer}
    >
      {nodes.map((node, i) => {
        const { x0, y0, x1, y1, data, parent } = node;
        const sectorName = parent?.data?.name;
        const width = x1 - x0;
        const height = y1 - y0;
        const minDimension = Math.min(width, height);
        const fontSize = Math.max(10, minDimension * 0.18); // 0.18 is the scaling factor

        return (
          <>
          <div
            key={i}
            onMouseEnter={() => setHoveredSector(sectorName)}
            onMouseLeave={() => setHoveredSector(null)}
            style={{
              position: "absolute",
              left: x0,
              top: y0,
              width: width,
              height: height,
              background: getColor(data.percentageChange),
              border:
                hoveredSector === sectorName
                  ? "4px solid #1A05A2"
                  : "",
              borderRadius: hoveredSector === sectorName ? "4px" : "0px",
              padding: hoveredSector === sectorName ? "0px" : "2px",
            }}
            className={styles.stockIndex}
          >
            {width > 30 && height > 30 && (
              <>
                <strong style={{ fontSize: `${fontSize}px` }}>{data.symbol}</strong>
                {width > 100 && height > 100 && 
                  <span>{Number(data.percentageChange).toFixed(2)}%</span>
                }
              </>
            )}
          </div>
          </>
        );
      })}
    </div>
    </>
  );
}