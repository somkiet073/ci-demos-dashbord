var DemoApp = angular.module('DemoApp', ['dx']);

DemoApp.controller('DemoController', function DemoController($scope) {
    $scope.itemsDriveC = itemsDriveC;
    $scope.itemsDriveD = itemsDriveD;

    $scope.treeViewDriveCOptions = createTreeViewOptions('itemsDriveC', 'treeViewDriveC');
    $scope.treeViewDriveDOptions = createTreeViewOptions('itemsDriveD', 'treeViewDriveD');

    $scope.sortableDriveCOptions = createSortableOptions('driveC');
    $scope.sortableDriveDOptions = createSortableOptions('driveD');    

    function createTreeViewOptions(itemsName, treeViewName) {
        return {
            dataStructure: 'plain',
            expandNodesRecursive: false,
            width: 250,
            height: 380,
            itemTemplate: function(item) {
                var icon = item.isDirectory ? 'activefolder' : 'file';
                return "<div><i class=\"icon dx-icon-" + icon +"\"></i>"  + item.name + "</div>";
            },            
            onInitialized: function(e) {
                $scope[treeViewName] = e.component;
            },
            bindingOptions: {
                items: itemsName
            }
        };
    };

    function createSortableOptions(driveName) {
        return {
            filter: ".dx-treeview-item",
            data: driveName,
            group: "shared",
            allowDropInsideItem: true,
            allowReordering: true,
            onDragChange: function(e) {
                if(e.fromComponent === e.toComponent) {
                    var $nodes = e.element.find(".dx-treeview-node");
                    var isDragIntoChild = $nodes.eq(e.fromIndex).find($nodes.eq(e.toIndex)).length > 0;
                    if(isDragIntoChild) {
                        e.cancel = true;
                    }
                }
            },        
            onDragEnd: function(e) {
                if(e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
                    return;
                }

                var fromTreeView = getTreeView(e.fromData);
                var toTreeView = getTreeView(e.toData);
    
                var fromNode = findNode(fromTreeView, e.fromIndex);
                var toNode = findNode(toTreeView, calculateToIndex(e));
    
                if(e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
                    return;
                }

                var fromTopVisibleItemId = getTopVisibleNodeId(e.fromComponent);
                var toTopVisibleItemId = getTopVisibleNodeId(e.toComponent);

                var fromItems = fromTreeView.option('items');
                var toItems = toTreeView.option('items');
                moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

                fromTreeView.option('items', fromItems);
                toTreeView.option('items', toItems);
                fromTreeView.scrollToItem(fromTopVisibleItemId);
                toTreeView.scrollToItem(toTopVisibleItemId);
            }            
        };
    };
    
    function getTreeView(driveName) {
        return driveName === 'driveC'
            ? $scope.treeViewDriveC
            : $scope.treeViewDriveD;
    }

    function calculateToIndex(e) {
        if(e.fromComponent != e.toComponent || e.dropInsideItem) {
            return e.toIndex;
        }

        return e.fromIndex >= e.toIndex 
            ? e.toIndex 
            : e.toIndex + 1;
    }

    function findNode(treeView, index) {
        var $nodes = treeView.element().find(".dx-treeview-node");
        if($nodes.length <= index) {
            return null;
        }
        
        var id = $nodes.eq(index).attr("data-item-id");
        return findNodeById(treeView.getNodes(), id);
    }
    
    function findNodeById(nodes, id) {
        for(var i = 0; i < nodes.length; i++) {
            if (nodes[i].itemData.id === id) {
                return nodes[i];
            } else {
                var node = findNodeById(nodes[i].children, id);
                if(node !== null) {
                    return node;
                }
            }
        }
        
        return null;
    }    

    function moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
        var fromIndex = findIndex(fromItems, fromNode.itemData.id);
        fromItems.splice(fromIndex, 1);
    
        var toIndex = toNode === null || isDropInsideItem
            ? toItems.length
            : findIndex(toItems, toNode.itemData.id);
        toItems.splice(toIndex, 0, fromNode.itemData);

        moveChildren(fromNode, fromItems, toItems);    
        if(isDropInsideItem) {
            fromNode.itemData.parentId = toNode.itemData.id;
        } else {
            fromNode.itemData.parentId = toNode != null
                ? toNode.itemData.parentId
                : undefined;
        }
    }
    
    function moveChildren(node, fromItems, toItems) {
        if(!node.itemData.isDirectory) {
            return;
        }
    
        node.children.forEach(function(child) {
            if(child.itemData.isDirectory) {
                moveChildren(child, fromItems, toItems);
            }
    
            var fromIndex = findIndex(fromItems, child.itemData.id);
            fromItems.splice(fromIndex, 1);
            toItems.splice(toItems.length, 0, child.itemData);
        });
    }

    function findIndex(array, id) {
        var idsArray = array.map(function(elem) { return elem.id; });
        return idsArray.indexOf(id);
    }

    function getTopVisibleNodeId(component) {
        var treeViewElement = component.element().get(0);
        var treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
        var nodes = treeViewElement.querySelectorAll(".dx-treeview-node");
        for(var i = 0; i < nodes.length; i++) {
            var nodeTopPosition = nodes[i].getBoundingClientRect().top;
            if(nodeTopPosition >= treeViewTopPosition) {
                return nodes[i].getAttribute('data-item-id');
            }
        }

        return null;
    }
});