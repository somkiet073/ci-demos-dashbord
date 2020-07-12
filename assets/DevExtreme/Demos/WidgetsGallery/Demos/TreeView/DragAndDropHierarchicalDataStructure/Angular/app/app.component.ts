import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxTreeViewModule, DxTreeViewComponent, DxSortableModule } from 'devextreme-angular';
import { Service, FileSystemItem } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})
export class AppComponent {
    @ViewChild('treeviewDriveC') treeviewDriveC: DxTreeViewComponent;
    @ViewChild('treeviewDriveD') treeviewDriveD: DxTreeViewComponent;

    itemsDriveC: FileSystemItem[];
    itemsDriveD: FileSystemItem[];

    constructor(service: Service) {
        this.itemsDriveC = service.getItemsDriveC();
        this.itemsDriveD = service.getItemsDriveD();
    }

    onDragChange(e) {
        if(e.fromComponent === e.toComponent) {
            const nodes = e.element.querySelectorAll(".dx-treeview-node");
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

        const fromItems = fromTreeView.option('items');
        const toItems = toTreeView.option('items');
        this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

        fromTreeView.option('items', fromItems);
        toTreeView.option('items', toItems);
        fromTreeView.scrollToItem(fromTopVisibleItemId);
        toTreeView.scrollToItem(toTopVisibleItemId);
    }

    getTreeView(driveName) {
        return driveName === 'driveC'
            ? this.treeviewDriveC.instance
            : this.treeviewDriveD.instance;
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
        const nodes = treeView.element().querySelectorAll(".dx-treeview-node");
        if(nodes.length <= index) {
            return null;
        }
        const id = nodes[index].getAttribute("data-item-id");
        return this.findNodeById(treeView.getNodes(), id);
    }    

    findNodeById(nodes, id) {
        for(let i = 0; i < nodes.length; i++) {
            if (nodes[i].itemData.id === id) {
                return nodes[i];
            } else {
                const node = this.findNodeById(nodes[i].children, id);
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
        const nodes = treeViewElement.querySelectorAll(".dx-treeview-node");
        for(let i = 0; i < nodes.length; i++) {
            const nodeTopPosition = nodes[i].getBoundingClientRect().top;
            if(nodeTopPosition >= treeViewTopPosition) {
                return nodes[i].getAttribute('data-item-id');
            }
        }

        return null;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule,
        DxSortableModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);