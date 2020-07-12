import React from 'react';
import { TreeView, Sortable } from 'devextreme-react';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.treeViewDriveCRef = React.createRef();
    this.treeViewDriveDRef = React.createRef();

    this.state = {
      itemsDriveC: service.getItemsDriveC(),
      itemsDriveD: service.getItemsDriveD()
    };

    this.onDragChange = this.onDragChange.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  render() {
    return (
      <div className="form">
        <div className="drive-panel">
          <div><i className="icon dx-icon-activefolder"></i>&nbsp;Drive C:</div>
          <Sortable
            filter=".dx-treeview-item"
            group="shared"
            data="driveC"
            allowDropInsideItem={true}
            allowReordering={true}
            onDragChange={this.onDragChange}
            onDragEnd={this.onDragEnd}>
            <TreeView
              id="treeviewDriveC"
              expandNodesRecursive={false}
              dataStructure="tree"
              ref={this.treeViewDriveCRef}
              items={this.state.itemsDriveC}
              width={250}
              height={380}
              itemRender={renderTreeViewItem}
            />
          </Sortable>
        </div>
        <div className="drive-panel">
          <div><i className="icon dx-icon-activefolder"></i>&nbsp;Drive D:</div>
          <Sortable
            filter=".dx-treeview-item"
            group="shared"
            data="driveD"
            allowDropInsideItem={true}
            allowReordering={true}
            onDragChange={this.onDragChange}
            onDragEnd={this.onDragEnd}>
            <TreeView
              id="treeviewDriveD"
              expandNodesRecursive={false}
              dataStructure="tree"
              ref={this.treeViewDriveDRef}
              items={this.state.itemsDriveD}
              width={250}
              height={380}
              itemRender={renderTreeViewItem}
            />
          </Sortable>
        </div>
      </div>
    );
  }

  get treeViewDriveC() {
    return this.treeViewDriveCRef.current.instance;
  }

  get treeViewDriveD() {
    return this.treeViewDriveDRef.current.instance;
  }

  onDragChange(e) {
    if(e.fromComponent === e.toComponent) {
      const nodes = e.element.querySelectorAll('.dx-treeview-node');
      const isDragIntoChild = nodes[e.fromIndex].querySelectorAll(`[data-item-id="${nodes[e.toIndex].getAttribute('data-item-id')}"]`).length > 0;
      if (isDragIntoChild) {
        e.cancel = true;
      }
    }
  }

  onDragEnd(e) {
    if(e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
      return;
    }

    const fromTreeView = this.getTreeView(e.fromData);
    const toTreeView = this.getTreeView(e.toData);

    const fromNode = this.findNode(fromTreeView, e.fromIndex);
    const toNode = this.findNode(toTreeView, this.calculateToIndex(e));

    if(e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
      return;
    }

    const fromTopVisibleItemId = this.getTopVisibleNodeId(e.fromComponent);
    const toTopVisibleItemId = this.getTopVisibleNodeId(e.toComponent);

    const fromItems = this.state[this.getStateFieldName(e.fromData)];
    const toItems = this.state[this.getStateFieldName(e.toData)];
    this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

    let state = {};
    state[this.getStateFieldName(e.fromData)] = [...fromItems];
    state[this.getStateFieldName(e.toData)] = [...toItems];

    this.setState(state);
    fromTreeView.scrollToItem(fromTopVisibleItemId);
    toTreeView.scrollToItem(toTopVisibleItemId);
  }

  getTreeView(driveName) {
    return driveName === 'driveC'
      ? this.treeViewDriveC
      : this.treeViewDriveD;
  }

  getStateFieldName(driveName) {
    return driveName === 'driveC'
      ? 'itemsDriveC'
      : 'itemsDriveD';
  }

  calculateToIndex(e) {
    if(e.fromComponent != e.toComponent || e.dropInsideItem) {
      return e.toIndex;
    }

    return e.fromIndex >= e.toIndex
      ? e.toIndex
      : e.toIndex + 1;
  }

  findNode(treeView, index) {
    const nodes = treeView.element().querySelectorAll('.dx-treeview-node');
    if(nodes.length <= index) {
      return null;
    }

    const id = nodes[index].getAttribute('data-item-id');
    return this.findNodeById(treeView.getNodes(), id);
  }

  findNodeById(nodes, id) {
    for(var i = 0; i < nodes.length; i++) {
      if (nodes[i].itemData.id === id) {
        return nodes[i];
      } else {
        var node = this.findNodeById(nodes[i].children, id);
        if(node !== null) {
          return node;
        }
      }
    }

    return null;
  }

  moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
    const fromNodeContainingArray = this.getNodeContainingArray(fromNode, fromItems);
    const fromIndex = fromNodeContainingArray.findIndex(item => item.id == fromNode.itemData.id);
    fromNodeContainingArray.splice(fromIndex, 1);

    if(isDropInsideItem) {
      toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
    } else {
      const toNodeContainingArray = this.getNodeContainingArray(toNode, toItems);
      const toIndex = toNode === null
        ? toNodeContainingArray.length
        : toNodeContainingArray.findIndex(item => item.id == toNode.itemData.id);
      toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
    }
  }

  getNodeContainingArray(node, rootArray) {
    return node === null || node.parent === null
      ? rootArray
      : node.parent.itemData.items;
  }

  getTopVisibleNodeId(component) {
    const treeViewElement = component.element();
    const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
    const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
    for(let i = 0; i < nodes.length; i++) {
      const nodeTopPosition = nodes[i].getBoundingClientRect().top;
      if(nodeTopPosition >= treeViewTopPosition) {
        return nodes[i].getAttribute('data-item-id');
      }
    }

    return null;
  }
}

function renderTreeViewItem(item) {
  return <div><i className={item.isDirectory ? 'icon dx-icon-activefolder' : 'icon dx-icon-file'}></i>{ item.name }</div>;
}

export default App;
