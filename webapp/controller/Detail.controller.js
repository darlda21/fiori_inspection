sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, MessageBox, MessageToast) {
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
			var oTable = this.getView().byId("suppliersTable");
			var oTableRows = oTable.getRows();
			var selectedIndices = oTable.getSelectedIndices();

			var itemTable = [];		// 선택한 itemTable
			var insValid = true;	// 검수가능 flag
			var oIntyp;				// 검수타입 select 
			var oIntme;				// 검수량 input

			// 선택한 item이 있는지 확인
			if(selectedIndices.length === 0) {
				MessageBox.error("검수할 항목을 선택해주세요.");
			} else {
				for(var i = 0; i < selectedIndices.length; i++) {
					var selectedRow = oTableRows[selectedIndices[i]];
					var sRowPath = selectedRow.getBindingContext().sPath;
					var oItem = selectedRow.getModel().getObject(sRowPath);	// 선택한 row의 item

					oIntyp = selectedRow.getCells()[8].getSelectedKey();	// 검수타입 select 
					oIntme = selectedRow.getCells()[9].getValue();			// 검수량 input

					// 검수 가능한 조건인지 확인
					if(oItem.Dstat !== 'A') { // 배송전 item이 있는지 확인
						MessageBox.error("배송전인 항목은 검수가 불가능합니다.");
						insValid = false;
						break;
					} else if(selectedRow.getCells()[9].getValueState() === 'Error') { // item의 검수량이 구매량보다 작은지 확인
						MessageBox.error("검수량은 구매량보다 많을 수 없습니다.");
						insValid = false;
						break;
					} else {
						// 검수할 item을 itemTable에 저장
						oItem.Intyp = oIntyp;
						oItem.Intme = oIntme;

						itemTable.push(oItem);
					}
				}

				// 검수
				if(insValid) {
					// 선택한 라인의 데이터를 JSON 형태로 생성
					// URL Encode 방식으로 인코딩 <-- 영어대소문자, 숫자를 제외한 한글, 특수문자등이 포함될 때만 추가
					// Base64 방식으로 인코딩

					let json = JSON.stringify(itemTable);
					let uri = encodeURI(json);
					let base64 = btoa(uri);
					let oBody = {"Data" : base64};

					debugger;
					this.oModel.create("/jsonSet", oBody, {
						success: function (oReturn) {
							console.log("success",oReturn);
							MessageToast.show("검수가 완료되었습니다.");
						},
						error: function (oError) {
							console.log("error", oError);
						}
					})
				}
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
