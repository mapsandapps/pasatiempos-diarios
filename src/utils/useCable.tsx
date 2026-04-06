// from https://codepen.io/keetraxx/pen/oNzXKVN?editors=0010

import { useRef, useCallback } from "react";
import * as d3 from "d3";

const CABLE_SEGMENTS = 5;

export function useCable() {
  const svgRef = useRef(null);
  const cableRef = useRef(null); // active cable being dragged
  const colorIndex = useRef(0); // tracks which color to use next
  const cablesRef = useRef([]);

  // stable line drawer — defined once, shared across all cables
  const lineDrawer = useRef(
    d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasis),
  );

  // TODO: change where the "far end" of the cable starts
  const startCable = useCallback(
    (
      cableStartX: number,
      cableStartY: number,
      cableEndX?: number,
      cableEndY?: number,
      color?: string,
    ) => {
      const svg = d3.select(svgRef.current);
      const i = colorIndex.current;
      const draw = lineDrawer.current;
      const stroke = color || d3.schemeCategory10[i % 10];

      const c = svg
        .append("path")
        .attr("stroke", stroke)
        .attr("fill", "none")
        .attr("stroke-width", 4);

      const nodes = d3.range(CABLE_SEGMENTS).map(() => ({}));
      const links = d3
        .pairs(nodes)
        .map(([source, target]) => ({ source, target }));

      nodes[0].fx = cableStartX;
      nodes[0].fy = cableStartY;

      // set the initial "far end" of the cable
      nodes[nodes.length - 1].fx = cableEndX;
      nodes[nodes.length - 1].fy = cableEndY;

      const sim = d3
        .forceSimulation(nodes)
        .force("gravity", d3.forceY(1000).strength(0.002))
        .force("collide", d3.forceCollide(20))
        .force("links", d3.forceLink(links).strength(0.9))
        .on("tick", () => c.attr("d", () => draw(nodes)));

      c.datum({ nodes, sim });
      cablesRef.current.push(c);
      cableRef.current = c;
      colorIndex.current = i + 1;
    },
    [],
  );

  const endCable = useCallback((cableEndX: number, cableEndY: number) => {
    if (!cableRef.current) return;

    const { nodes, sim } = cableRef.current.datum();
    const start = nodes[0];
    const end = nodes[nodes.length - 1];

    end.fx = cableEndX;
    end.fy = cableEndY;

    const distance = Math.hypot(end.fx - start.fx, end.fy - start.fy);
    sim.force("links").distance(distance / CABLE_SEGMENTS);
    sim.alpha(1).restart();

    cableRef.current = null;
  }, []);

  /**
   * if no "i" is provided, remove the most recent cable
   */
  const removeCable = useCallback((i?: number) => {
    const cables = cablesRef.current;
    const indexToRemove = i === null || i === undefined ? cables.length - 1 : i;
    if (indexToRemove < 0 || indexToRemove >= cables.length) return;

    const target = cables[indexToRemove];
    target.datum().sim.stop();
    target.remove();
    cables.splice(indexToRemove, 1);

    if (cableRef.current === target) cableRef.current = null;
  }, []);

  return { svgRef, endCable, removeCable, startCable };
}
