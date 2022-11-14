sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/f/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Sorter, MessageBox, fioriLibrary) {
        "use strict";

        return Controller.extend("syncbiginspection1.controller.Master", {
            onInit: function () {
                // this.oView = this.getView();
                // this._bDescendingSort = false;
                // this.oProductsTable = this.oView.byId("productsTable");
                this.oRouter = this.getOwnerComponent().getRouter();

            },

            onAfterRendering: function() { 
                var oView = this.getView();
                var oModel = oView.getModel();
                var that = this;
                oModel.read("/vbakSet", {
                    success: function (oEvent) {
                        var oModelApp = that.getView().getModel("app");
                        oModelApp.setProperty("/lines", oEvent.results.length);
                    }
                } );

            },

            onSearch: function (oEvent) {
                // var oTableSearchState = [],
                // 	sQuery = oEvent.getParameter("query");
    
                // if (sQuery && sQuery.length > 0) {
                // 	oTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
                // }
    
                // this.oProductsTable.getBinding("items").filter(oTableSearchState, "Application");
                MessageBox.information("Search Button is pressed.", {title: "Aw, Snap!"});
            },
    
            onAdd: function () {
                MessageBox.information("This functionality is not ready yet.", {title: "Aw, Snap!"});
            },
    
            onSort: function () {
                // this._bDescendingSort = !this._bDescendingSort;
                // var oBinding = this.oProductsTable.getBinding("items"),
                // 	oSorter = new Sorter("Name", this._bDescendingSort);
    
                // oBinding.sort(oSorter);
                MessageBox.information("Sort Button is pressed.", {title: "Aw, Snap!"});
            },
    
            onListItemPress: function (oEvent) {
                var oSource = oEvent.getSource();
                var product = oSource.mAggregations.cells[1].mProperties.title
    
                this.oRouter.navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, product: product});
            }
        });
    });
