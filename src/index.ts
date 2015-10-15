/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';


/**
 * An object which can be topologically sorted.
 */
export
interface ISortableItem {
  /**
   * The unique identifier for the item.
   */
  id?: string;

  /**
   * The id of the item *before which* this item should be placed.
   */
  before?: string;
}


/**
 * Perform a topological sort of an array of sortable items.
 *
 * @param items - The array of items to be sorted.
 *
 * @returns A new array of the items in topologically sorted order.
 *
 * #### Notes
 * Warnings will be logged if any of the items have a duplicate `id`
 * or an invalid `before` reference.
 *
 * If a `before` reference is not provided for an item, it will be
 * implicitly constrained follow its previous sibling.
 *
 * Sorting is performed in a tolerant fashion. If an item's constraints
 * cause cyclical conflicts, they will be ignored. This will yield a
 * an array which is only approximately sorted (a full sort cannot be
 * acheived if cyles are present).
 */
export
function topSort<T extends ISortableItem>(items: T[]): T[] {
  // Collect the item ids, creating temp ids as needed.
  var tick = 0;
  var prefix = '-auto-item-id-';
  var idArray = new Array<string>(items.length);
  var itemMap: StringMap<T> = Object.create(null);
  for (var i = 0, n = items.length; i < n; ++i) {
    var id: string;
    var item = items[i];
    if (item.id && item.id in itemMap) {
      console.warn('duplicate item id:', item.id);
      id = prefix + tick++;
    } else {
      id = item.id || (prefix + tick++);
    }
    idArray[i] = id;
    itemMap[id] = item;
  }

  // Create and populate the graph with the item ids. If an
  // item has no position info, preserve the relative order.
  var graph: Graph = Object.create(null);
  for (var i = 0, n = idArray.length; i < n; ++i) {
    var id = idArray[i];
    var item = items[i];
    var validBefore = item.before in itemMap;
    if (validBefore) {
      addEdge(graph, id, item.before);
    } else if (item.before) {
      console.warn('invalid `before` reference:', item.before);
    }
    if (i > 0 && !validBefore) {
      addEdge(graph, idArray[i - 1], id);
    }
  }

  // Sort the graph and return a new array of sorted items.
  return sortGraph(graph).map(id => itemMap[id]);
}


/**
 * A type alias for a generic string map.
 */
type StringMap<T> = { [key: string]: T };


/**
 * A type alias for a string:string graph.
 */
type Graph = StringMap<string[]>;


/**
 * Add an edge to a graph.
 *
 * @param graph - The graph of interest.
 *
 * @param fromNode - The ancestor node.
 *
 * @param toNode - The dependent node.
 */
function addEdge(graph: Graph, fromNode: string, toNode: string): void {
  if (!(fromNode in graph)) {
    graph[fromNode] = [];
  }
  if (toNode in graph) {
    graph[toNode].push(fromNode);
  } else {
    graph[toNode] = [fromNode];
  }
}


/**
 * Topologically sort a graph.
 *
 * @param graph - The graph of interest.
 *
 * @returns The topologically sorted nodes.
 *
 * #### Notes
 * If a cycle is encountered in the graph, it is ignored, which
 * means the result will only be approximately sorted, since a
 * true sort is not possible.
 */
function sortGraph(graph: Graph): string[] {
  var sorted: string[] = [];
  var visited: StringMap<boolean> = Object.create(null);
  Object.keys(graph).forEach(visit);
  return sorted;

  function visit(node: string): void {
    if (node in visited) {
      console.warn('order conflict:', node);
      return;
    }
    visited[node] = true;
    graph[node].forEach(visit);
    sorted.push(node);
  }
}
