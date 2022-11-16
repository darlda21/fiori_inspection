sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("syncbiginspection1.controller.Detail", {
        onInit: function() {
			var oOwnerComponent = this.getOwnerComponent();

			this.oObjectPage = this.getView().byId("ObjectPageLayout");
			this.bCurrentShowFooterState = this.oObjectPage.getShowFooter();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
        },

		_onProductMatched: function (oEvent) {
			this._product = oEvent.getParameter("arguments").product || this._product || "0";

			// 이벤트 값을 가져오는 방법
			// var oModelApp = this.getOwnerComponent().getModel("app");
			// alert( oModelApp.getProperty("/product") );
			// alert( '이벤트에서 받아온 ' + this._product );

			// var oFilter = [new Filter('Vbeln', FilterOperator.EQ, this._product)];
			var oFilter = [new Filter({
				filters:[
					new Filter('Vbeln', FilterOperator.EQ, this._product),
					new Filter('Vpins', FilterOperator.NE, "2")	// 검수전
				],
				and: true
			})];

			var oFilter2 = [new Filter({
				filters:[
					new Filter('Vbeln', FilterOperator.EQ, this._product),
					new Filter('Vpins', FilterOperator.EQ, "2") // 검수완료
				],
				and: true
			})];

			var oFilter3 = [new Filter('Vbeln', FilterOperator.EQ, this._product)]; // 선택한 구매오더 번호

			var oList = this.getView().byId("suppliersTable");		// 검수리스트
			var oList2 = this.getView().byId("suppliersTable2");	// 검수내역
			var oList3 = this.getView().byId("vbakHeaderBox");		// 구매정보 헤더
			var oList4 = this.getView().byId("vbakTitleBox");		// 구매정보 제목

			if ( oList ){
				var oBinding = oList.getBinding("rows");
				if ( oBinding ){oBinding.filter(oFilter);}
			}

			if ( oList2 ){
				var oBinding = oList2.getBinding("rows");
				if ( oBinding ){oBinding.filter(oFilter2);}
			}

			if ( oList3 ){
				var oBinding = oList3.getBinding("items");
				if ( oBinding ){oBinding.filter(oFilter);}
			}

			if ( oList4 ){
				var oBinding = oList4.getBinding("items");
				if ( oBinding ){oBinding.filter(oFilter3);}
			}
			
		},

		onEditToggleButtonPress: function() {
			this.oObjectPage.setShowFooter(!this.bCurrentShowFooterState);
			this.bCurrentShowFooterState = !this.bCurrentShowFooterState;
		},

		onPressAccept: function() {
			var selectedIndices = this.getView().byId("suppliersTable").getSelectedIndices();

			// 선택한 item이 있는지 확인
			for(var i; i < selectedIndices.length; i++) {
				// selectedIndicator에 해당하는 item path 저장
				// item의 검수량이 구매량보다 작은지 확인
				// 조건에 부합하다면 update

			}

			this.oObjectPage.setShowFooter(!this.bCurrentShowFooterState);
			this.bCurrentShowFooterState = !this.bCurrentShowFooterState;
		},

		onPressReject: function() {
			this.oObjectPage.setShowFooter(!this.bCurrentShowFooterState);
			this.bCurrentShowFooterState = !this.bCurrentShowFooterState;
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});
