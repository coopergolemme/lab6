/**
 * Visualization module for rendering graph data with D3
 */
console.log("Visualization module loaded");

const Visualization = (function () {
  // Default options
  const defaultOptions = {
    showLabels: true,
    showRelationships: false,
    nodeSize: "small",
  };

  // Visualization state
  let svg = null;
  let graphData = null;
  let visualOptions = { ...defaultOptions };
  let simulation = null;
  let dimensions = { width: 0, height: 0 };

  // Initialize visualization
  function init(containerSelector) {
    console.log("Visualization init called with", containerSelector);
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error("Container not found:", containerSelector);
      return;
    }

    // Create SVG element if it doesn't exist
    if (!svg) {
      svg = d3
        .select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

      // Add zoom behavior
      svg.call(
        d3
          .zoom()
          .scaleExtent([0.1, 10])
          .on("zoom", (event) => {
            const { transform } = event;
            svg.select("g").attr("transform", transform);
          })
      );
    }

    // Handle window resize
    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return svg;
  }

  // Update container dimensions
  function updateDimensions() {
    const container = document.querySelector("#visualization");
    if (container) {
      const rect = container.getBoundingClientRect();
      dimensions = { width: rect.width, height: rect.height };

      if (graphData) {
        render(graphData, visualOptions);
      }
    }
  }

  // Render graph visualization
  function render(data, options = {}) {
    console.log("Visualization render called");

    if (!svg || !data || !data.nodes || !data.links) {
      console.error("Cannot render: missing svg or data");
      return;
    }

    // Store original data
    graphData = data;
    visualOptions = { ...defaultOptions, ...options };

    // Clear previous visualization
    svg.selectAll("*").remove();

    // Stop any existing simulation
    if (simulation) {
      simulation.stop();
    }

    try {
      // Create SVG groups
      const g = svg.append("g");

      // Create force simulation
      simulation = d3
        .forceSimulation(data.nodes)
        .force(
          "link",
          d3
            .forceLink(data.links)
            .id((d) => d.id)
            .distance(100)
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force(
          "center",
          d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
        );

      // Create links
      const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("g")
        .data(data.links)
        .enter()
        .append("g");

      link
        .append("line")
        .attr("stroke", (d) => (d.type === "Rating" ? "#999" : "red"))
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1);

      link
        .append("text")
        .attr("class", "link-label")
        .attr("text-anchor", "middle")
        .attr("dy", (d) => (d.type === "Rating" ? -5 : 25))
        .style("font-size", "10px")
        .text((d) => (visualOptions.showRelationships ? d.type : ""));

      // Create nodes - all grey
      let radius =
        visualOptions.nodeSize === "small"
          ? 3
          : visualOptions.nodeSize === "medium"
          ? 6
          : 10;

      const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(data.nodes)
        .enter()
        .append("g") // Create a group for each node
        .call(drag(simulation));

      // Append a circle to each group
      node
        .append("circle")
        .attr("class", "node")
        .attr("r", (d) => (d.labels[0] === "Movie" ? 2 + radius : radius))
        .attr("fill", (d) => (d.labels[0] === "Movie" ? "orange" : "blue"));

      // Append a text element to each group
      node
        .append("text")
        .attr("x", (d) => d.x || 0)
        .attr("y", (d) => d.y || 0)
        .attr("class", "node-label")
        .attr("text-anchor", "middle") // Center Text
        .style("font-size", "12px")
        .attr("dy", 24) // Adjust vertical position
        .text((d) =>
          visualOptions.showLabels
            ? d.labels[0] === "Movie"
              ? d.properties.title
              : d.id.replace("_", " ")
            : ""
        );

      // Update positions on tick
      simulation.on("tick", () => {
        link
          .select("line")
          .attr("x1", (d) => d.source.x || 0)
          .attr("y1", (d) => d.source.y || 0)
          .attr("x2", (d) => d.target.x || 0)
          .attr("y2", (d) => d.target.y || 0);

        link
          .select("text")
          .attr("x", (d) => (d.source.x + d.target.x) / 2)
          .attr("y", (d) => (d.source.y + d.target.y) / 2);

        node
          .select("circle")
          .attr("cx", (d) => d.x || 0)
          .attr("cy", (d) => d.y || 0);
        node
          .select("text")
          .attr("x", (d) => d.x || 0)
          .attr("y", (d) => d.y || 0);
      });

      const legend = svg
        .append("g")
        .append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20, 20)");

      legend
        .append("rect")
        .attr("width", 110)
        .attr("height", 130)
        .attr("fill", "#FFE5B4")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity", 0.75)
        .attr("rx", 5)
        .attr("ry", 5);

      // Add legend title
      legend
        .append("text")
        .attr("x", 10)
        .attr("y", 25)
        .attr("font-weight", "bold")
        .attr("font-size", "14px")
        .text("Legend");

      const legendData = [
        { label: " - Movie", color: "orange", shape: "circle" },
        { label: " - Person", color: "blue", shape: "circle" },
        { label: " - Rating", color: "#999", shape: "line" },
        { label: " - Tags", color: "red", shape: "line" },
      ];

      const legendItem = legend
        .selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_, i) => `translate(15, ${40 + i * 20})`);

      legendItem.each(function (d) {
        if (d.shape === "line") {
          d3.select(this)
            .append("line")
            .attr("x1", 0)
            .attr("y1", 8)
            .attr("x2", 20)
            .attr("y2", 8)
            .attr("stroke", d.color)
            .attr("stroke-width", 2);
        } else {
          d3.select(this)
            .append("circle")
            .attr("cx", 8)
            .attr("cy", 8)
            .attr("r", 8)
            .attr("fill", d.color);
        }
      });

      legendItem
        .append("text")
        .attr("x", 25)
        .attr("y", 12)
        .attr("font-size", "12px")
        .attr("fill", "#000")
        .text((d) => d.label);

      console.log("Visualization rendered successfully");
    } catch (error) {
      console.error("Error rendering visualization:", error);
    }
  }

  // Drag handler for nodes
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  // Clear visualization
  function clear() {
    if (svg) {
      svg.selectAll("*").remove();
    }

    if (simulation) {
      simulation.stop();
    }
  }

  // Return public API
  return {
    init,
    render,
    clear,
    updateDimensions,
  };
})();
