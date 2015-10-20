/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';


/**
 * A simple graph which supports topological sorting.
 */
export
class TopSort {
  /**
   * Construct a new top sort graph from an array of edges.
   *
   * @param edges - The array of edges to add to the graph. Each
   *   edge is represented as a 2-tuple of `[fromNode, toNode]`.
   *
   * @returns A new top sort graph initialized with the given edges.
   */
  static fromEdges(edges: Array<[string, string]>): TopSort {
    var graph = new TopSort();
    for (var i = 0, n = edges.length; i < n; ++i) {
      var [fromNode, toNode] = edges[i];
      graph.addEdge(fromNode, toNode);
    }
    return graph;
  }

  /**
   * A convenience function to sort an array of edges.
   *
   * @param edges - The array of edges to add to the graph. Each
   *   edge is represented as a 2-tuple of `[fromNode, toNode]`.
   *
   * @returns The sorted array of nodes. If a cycle is present in
   *   the graph, the return value will be approximately sorted.
   */
  static sort(edges: Array<[string, string]>): string[] {
    return TopSort.fromEdges(edges).sort();
  }

  /**
   * Construct a new top sort graph.
   */
  constructor() { }

  /**
   * Add an edge to the graph.
   *
   * @param fromNode - The name of the ancestor node.
   *
   * @param toNode - The name of the dependent node.
   */
  addEdge(fromNode: string, toNode: string): void {
    if (!(fromNode in this._graph)) {
      this._graph[fromNode] = [];
    }
    if (toNode in this._graph) {
      this._graph[toNode].push(fromNode);
    } else {
      this._graph[toNode] = [fromNode];
    }
  }

  /**
   * Topologically sort the graph.
   *
   * @returns An array of topologically sorted nodes.
   *
   * #### Notes
   * If a cycle is encountered in the graph, it will be ignored. The
   * result will be an array which is only approximately sorted, as
   * a true sort is not possible in the presence of cycles.
   */
  sort(): string[] {
    var graph = this._graph;
    var sorted: string[] = [];
    var visited: StringMap<boolean> = Object.create(null);
    for (var node in graph) visit(node);
    return sorted;

    function visit(node: string): void {
      if (node in visited) return;
      visited[node] = true;
      graph[node].forEach(visit);
      sorted.push(node);
    }
  }

  private _graph: StringMap<string[]> = Object.create(null);
}


/**
 * A type alias for a generic string map.
 */
type StringMap<T> = { [key: string]: T };
