<template>
  <div class="form">
    <div class="drive-panel">
      <div><i class="icon dx-icon-activefolder"/>&nbsp;Drive C:</div>
      <DxSortable
        filter=".dx-treeview-item"
        group="shared"
        data="driveC"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        @drag-change="onDragChange"
        @drag-end="onDragEnd"
      >
        <DxTreeView
          id="treeviewDriveC"
          data-structure="plain"
          :expand-nodes-recursive="false"
          :ref="treeViewDriveCRef"
          :items="itemsDriveC"
          :width="250"
          :height="380"
        >
          <template #item="item">
            <div><i :class="item.data.isDirectory ? 'icon dx-icon-activefolder' : 'icon dx-icon-file'"/>{{ item.data.name }}</div>
          </template>
        </DxTreeView>
      </DxSortable>
    </div>
    <div class="drive-panel">
      <div><i class="icon dx-icon-activefolder"/>&nbsp;Drive D:</div>
      <DxSortable
        filter=".dx-treeview-item"
        group="shared"
        data="driveD"
        :allow-drop-inside-item="true"
        :allow-reordering="true"
        @drag-change="onDragChange"
        @drag-end="onDragEnd"
      >
        <DxTreeView
          id="treeviewDriveD"
          data-structure="plain"
          :expand-nodes-recursive="false"
          :ref="treeViewDriveDRef"
          :items="itemsDriveD"
          :width="250"
          :height="380"
        >
          <template #item="item">
            <div><i :class="item.data.isDirectory ? 'icon dx-icon-activefolder' : 'icon dx-icon-file'"/>{{ item.data.name }}</div>
          </template>
        </DxTreeView>
      </DxSortable>
    </div>
  </div>
</template>
<script>
import { DxTreeView, DxSortable } from 'devextreme-vue';
import service from './data.js';

const treeViewDriveCRef = 'treeViewDriveC';
const treeViewDriveDRef = 'treeViewDriveD';

export default {
  components: {
    DxTreeView, DxSortable
  },
  data() {
    return {
      itemsDriveC: service.getItemsDriveC(),
      itemsDriveD: service.getItemsDriveD(),
      treeViewDriveCRef,
      treeViewDriveDRef
    };
  },
  computed: {
    treeViewDriveC: function() {
      return this.$refs[treeViewDriveCRef].instance;
    },
    treeViewDriveD: function() {
      return this.$refs[treeViewDriveDRef].instance;
    }
  },
  methods: {
    onDragChange(e) {
      if(e.fromComponent === e.toComponent) {
        const nodes = e.element.querySelectorAll('.dx-treeview-node');
        const isDragIntoChild = nodes[e.fromIndex].querySelectorAll(`[data-item-id="${nodes[e.toIndex].getAttribute('data-item-id')}"]`).length > 0;
        if (isDragIntoChild) {
          e.cancel = true;
        }
      }
    },

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

      const fromItems = this.getItems(e.fromData);
      const toItems = this.getItems(e.toData);
      this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

      this.itemsDriveC = [].concat(this.itemsDriveC);
      this.itemsDriveD = [].concat(this.itemsDriveD);

      this.$root.$nextTick(() => {
        fromTreeView.scrollToItem(fromTopVisibleItemId);
        toTreeView.scrollToItem(toTopVisibleItemId);
      });
    },

    getTreeView(driveName) {
      return driveName === 'driveC'
        ? this.treeViewDriveC
        : this.treeViewDriveD;
    },

    getItems(driveName) {
      return driveName === 'driveC'
        ? this.itemsDriveC
        : this.itemsDriveD;
    },

    calculateToIndex(e) {
      if(e.fromComponent != e.toComponent || e.dropInsideItem) {
        return e.toIndex;
      }

      return e.fromIndex >= e.toIndex
        ? e.toIndex
        : e.toIndex + 1;
    },

    findNode(treeView, index) {
      const nodes = treeView.element().querySelectorAll('.dx-treeview-node');
      if(nodes.length <= index) {
        return null;
      }

      const id = nodes[index].getAttribute('data-item-id');
      return this.findNodeById(treeView.getNodes(), id);
    },

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
    },

    moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
      const fromIndex = fromItems.findIndex(item => item.id == fromNode.itemData.id);
      fromItems.splice(fromIndex, 1);

      const toIndex = toNode === null || isDropInsideItem
        ? toItems.length
        : toItems.findIndex(item => item.id == toNode.itemData.id);
      toItems.splice(toIndex, 0, fromNode.itemData);

      this.moveChildren(fromNode, fromItems, toItems);
      if(isDropInsideItem) {
        fromNode.itemData.parentId = toNode.itemData.id;
      } else {
        fromNode.itemData.parentId = toNode != null
          ? toNode.itemData.parentId
          : undefined;
      }
    },

    moveChildren(node, fromDataSource, toDataSource) {
      if(!node.itemData.isDirectory) {
        return;
      }

      node.children.forEach(child => {
        if(child.itemData.isDirectory) {
          this.moveChildren(child, fromDataSource, toDataSource);
        }

        const fromIndex = fromDataSource.findIndex(item => item.id == child.itemData.id);
        fromDataSource.splice(fromIndex, 1);
        toDataSource.splice(toDataSource.length, 0, child.itemData);
      });
    },

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
};
</script>
<style scoped>
.form {
    display: flex;
}

.form>div {
    display: inline-block;
    vertical-align: top;
}

#treeviewDriveC,
#treeviewDriveD {
    margin-top: 10px;
}

.drive-panel {
    padding: 20px 30px;
    font-size: 115%;
    font-weight: bold;
    border: 1px solid #dadada;
    height: 100%;
}

.dx-treeview-item .icon {
    position: relative;
    left: -4px;
    top: 1px;
}

.drive-panel:last-of-type {
    border-left-width: 0px;
}
</style>
