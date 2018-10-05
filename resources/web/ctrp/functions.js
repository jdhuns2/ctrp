/**
*************
* FUNCTIONS *
*************
*/


var userInfo = {
  'bront@kcr.uky.edu': {
    defaultWorkflow: 'billing-shipped',
    defaultView: ['billing']
  },
  'matthew.craft1@uky.edu': {
    defaultWorkflow: 'shipping',
    defaultView: ['shipping']
  },
  'erin.pyrek@uky.edu': {
    defaultWorkflow: 'shipping',
    defaultView: ['shipping']
  },
  'james.hall@uky.edu': {
    defaultWorkflow: 'shipping',
    defaultView: ['shipping']
  },
  'evice0@uky.edu': {
    defaultWorkflow: 'billing-shipped',
    defaultView: ['billing']
  },
  'ochamb@uky.edu': {
    defaultWorkflow: 'billing-paid',
    defaultView: ['billing']
  },
  'james@kcr.uky.edu': {
    defaultWorkflow: 'billing-shipped',
    defaultView: ['billing']
  }
};
var storesLeft;
var rec = null;
var initialLoad = true;
var workflowCategoryDefault = 'shipping';

if(LABKEY.ActionURL.getBaseURL().includes('dev')){
  var URL = 'https://refcig-dev.uky.edu';
}
else{
  var URL = 'https://ctrp.uky.edu';
}


// DEPRECATED
// Replaced with "show all" = blank in searchCombo, which clears filters on store.
function showAllOrders() {
  var purchaseGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
  var purchaseGridStore = purchaseGrid.getStore();
  var statusCombo = Ext4.ComponentQuery.query('#statusCombo')[0];
  var searchId = Ext4.ComponentQuery.query('#searchId')[0];
  statusCombo.select('');
  searchId.setValue('');
  purchaseGridStore.removeFilter();
}

// Select Status programatically.
function selectWorkflowCategory(workflowCategory) {
  var statusCombo = Ext4.ComponentQuery.query('#statusCombo')[0];
  var rec;
  var statusCategory;

  if (workflowCategory) {
    statusCategory = workflowCategory;
  } else {

    if (userInfo[LABKEY.user.email]) {
      statusCategory = userInfo[LABKEY.user.email].defaultWorkflow;
      if (!statusCategory) {
        statusCategory = workflowCategoryDefault;
      }
    } else {
      statusCategory = workflowCategoryDefault;
    }

  }

  rec = [statusCombo.findRecordByValue(statusCategory)];
  statusCombo.fireEvent('select', statusCombo, rec, null, false);
  statusCombo.select(statusCategory);

}

//
function doPurchaseDetailsLayout() {

  var panels = userInfo[LABKEY.user.email].defaultView;

  for (i = 0, len = panels.length; i < len; i++) {

    if (panels[i] === 'purchaseDetails') {

      var purchaseDetailsGrid = Ext4.ComponentQuery.query('#purchaseDetailsGrid')[0];
      purchaseDetailsGrid.show();

    }
  }
}

function convertGridToExcel(grid) {
	//loop through grid and get all columns that are not hidden.
	var columnHeaders = [];
	var columnDataIndexes = [];
	var excelData = [];
	var store = grid.getStore();
	grid.columns.forEach(function(col){
		if(col.hidden == false){
			columnHeaders.push(col.text);
			columnDataIndexes.push(col.dataIndex);
		}
	});

	//add column headers to data for export
  excelData.push(columnHeaders);
  //iterate store and get data
  store.each(function(record){
	  currentRow = [];
	  for(i = 0; i < columnHeaders.length; i++){
		  currentRow.push({value:record.get(columnDataIndexes[i])})
	  }
	  //rowData.push(currentRow);
	  excelData.push(currentRow);
  });
  LABKEY.Utils.convertToExcel( {
        fileName : 'output.xls',
        sheets : [{
            name : 'Data',
            data : excelData
        }]
    });
}

function convertGridToExcelWithHeaders(grid, requestedHeaders) {
  //requestedHeaders is an array of strings representing column names or dataIndex of column
  //the columns will be output in the order that they appear in requestedHeaders
  //if requestedHeaders is null then all columns are output
  //Uses column names from grid as headers

  var excelData = [];
  var columnHeaders = [];
  var columnDataIndexes = [];
  var store = grid.getStore();
  //iterate grid and requested headers to get display names of requested headers
  if (typeof requestedHeaders !== 'undefined' && requestedHeaders !== null && requestedHeaders.length > 0 ) {
	  requestedHeaders.forEach( function( header ) {
              found = false;
			  colIndex = 0;
			  while (!found && colIndex < grid.columns.length){
				  column = grid.columns[colIndex];
				  if(column.text == header || column.dataIndex == header){
					 columnHeaders.push(column.text);
					 columnDataIndexes.push(column.dataIndex);
					 found = true;
				 }
				 colIndex++;
			  }
			  //column not found in grid, check store for equivalent dataIndex
			  record = grid.getStore().getAt(0);
			  if(record !=null){
				  colIndex = 0;
				  while (!found && colIndex < record.fields.keys.length){
					  column = record.fields.keys[colIndex];
					if(column == header){
						 columnHeaders.push(column);
						 columnDataIndexes.push(column);
						 found = true;
					}
					colIndex++;
				  }
			  }
          });
  }
  else{//no requested headers just dump all data
		grid.columns.forEach(function(item){
				columnHeaders.push(item.text);
				columnDataIndexes.push(item.dataIndex);
			}
		)
  }
  //add column headers to data for export
  excelData.push(columnHeaders);
  //iterate store and get data
  store.each(function(record){
	  currentRow = [];
	  for(i = 0; i < columnHeaders.length; i++){
		  currentRow.push({value:record.get(columnDataIndexes[i])})
	  }
	  //rowData.push(currentRow);
	  excelData.push(currentRow);
  });
  LABKEY.Utils.convertToExcel( {
        fileName : 'output.xls',
        sheets : [{
            name : 'Data',
            data : excelData
        }]
    });

}


function convertStoreToExcel(store, requestedHeaders) {

  var excelData = [];

  // Iterate store...
  if ( store.totalCount > 0 ) {
    store.each( function( rec ) {
        var rowData = [], columnHeaders = [];

        // If requestedHeaders variable is present, iterate it to match header with rec.data property.
        if ( typeof requestedHeaders !== 'undefined' && requestedHeaders !== null && requestedHeaders.length > 0 ) {
          requestedHeaders.forEach( function( header ) {
              if ( rec.data.hasOwnProperty( header ) ) {
                // Upon iterating over the first record in the store, push Excel headers onto columnHeaders array.
                if ( rec.index === 0 ) {
                  columnHeaders.push( header );
                }
                // Push values of rec.data properties that match requestedHeader onto rowData array.
                rowData.push( rec.get( header ) );
              }
          });
        }
        else
        {
          //  Upon iterating over the first record in the store, push Excel headers onto columnHeaders array.
          if ( rec.index === 0 ) {
            var storeItems = store.getFields().items;
            storeItems.forEach( function( header ) {
                columnHeaders.push( header.fieldLabel );
            });
          }
          // Push all rec.data values onto row array.
          var recData = rec.getData();
          for ( var value in recData ) {
            if ( recData.hasOwnProperty( value ) ) {
              rowData.push( recData [ value ] );
            }
          }
        }
        // Add headers to Excel file.
        if ( columnHeaders.length > 0 ) {
          excelData.push( columnHeaders );
        }
        // Push rowData onto excelData array.
        excelData.push( rowData );
    } );

    LABKEY.Utils.convertToExcel( {
        fileName : 'output.xls',
        sheets : [{
            name : 'Data',
            data : excelData
        }]
    });
  }
  else
  {
    Ext4.Msg.alert( 'Alert', 'ERROR -- Store has no records' );
  }
}

//function convertStoreToExcel_old(store,requestedHeaders) {
//	//requested headers is an array of strings representing header names
//  var headers = [], data = [], dataIndexes = [], storeItems = store.getFields().items;
//  // get headers
//  if(requestedHeaders == null || requestedHeaders.length ==0){
//	storeItems.forEach(function(y) {
//		headers.push(y.fieldLabel);
//	});
//  }
//  else{//get the requested dataIndexes/headers and check that the headers are there
//	  requestedHeaders.forEach(function(y){

//		  var h = this.find(function(header){
//			  if(header.fieldKey == this || header.fieldLabel == this || header.dataIndex == this){
//				  dataIndexes.push(header.dataIndex);
//				  return header.fieldLabel;
//			  }
//			  else{
//				  console.log('Could not find requested header: '+this);
//				  return null;
//			  }
//		  },y);
//		  if(h != null){
//			  headers.push(h.fieldLabel);
//		  }
//	  },storeItems);
//  }


//  if (storeItems.length > 0) {

//    data.push(headers);
//    store.each(
//      function(rec) {
//        //this refers to dataIndexes here
//        var row = [];
//        var member = rec.getData();
//		if(this.length > 0){
//				for (var i = 0; i < this.length; i++){
//					if (member.hasOwnProperty(this[i])) {
//						row.push(member[this[i]]);
//					}
//				}
//		}
//		else{
//			for (var value in member) {
//			  if (member.hasOwnProperty(value)) {
//				row.push(member[value]);
//			  }
//			}
//		}
//        data.push(row);
//      },dataIndexes
//      );

//    LABKEY.Utils.convertToExcel({
//        fileName: 'output.xls',
//        sheets: [{
//            name: 'Data',
//            data: data
//        }
//        ]
//    });
//  }
//  else {
//    Ext4.Msg.alert('Alert', 'ERROR -- Store has no records');
//  }
//}

//
function getCurrentWorkflowCategory() {
  var statusCombo = Ext4.ComponentQuery.query('#statusCombo')[0];
  var workflowCategory = statusCombo.getValue();
  return workflowCategory;
}

// Search for purchases by id or institution.
function searchPurchases(searchValue) {

  var grid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
  purchaseStore = grid.getStore();
  purchaseStore.clearFilter(true);

  if (searchValue === '') {
    selectWorkflowCategory(getCurrentWorkflowCategory());
  } else {

    /*
    In order to search three store fields (id, po_number, and country) the following code
    iterates the store evaluating searchValue (re) against the fields. If there is a match,
    the id value is pushed into an array. After the iteration is complete, the arrays are merged
    and the purchaseStore is filtered by the values in the agg(aggregate) array.
    */

    grid.mask();
    var re = new RegExp(searchValue, "i");

    var agg = [];
    var ids = [];
    var pos = [];
    var countries = [];
    var refs = [];

    purchaseStore.each(function(rec) {

        if (re.test(rec.data.id)) {
          Ext4.Array.push(ids, rec.data.id);
        }

        if (re.test(rec.data.po_number)) {
          Ext4.Array.push(pos, rec.data.id);
        }

        if (re.test(rec.data.country)) {
          Ext4.Array.push(countries, rec.data.id);
        }

        if (rec.data.reference_number) {
          Ext4.Array.push(refs, rec.data.reference_number);
        }

        if (re.test(rec.data.reference_number)) {
          Ext4.Array.push(countries, rec.data.id);
        }
    });

    agg = Ext4.Array.merge(ids, pos, countries);

    purchaseStore.filterBy(
      function(rec, id) {
        if (Ext4.Array.contains(agg, rec.data.id)) {
          return true;
        } else {
          return false;
        }
      });

    grid.unmask();
  }
}

// called from statusCombo
function statusComboFilterPurchasesByCategory(record, collapseAccordion) {

  var purchaseGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
  var purchaseGridStore = purchaseGrid.getStore();
  var filter = record[0].data.value;
  var accordionPanel = Ext4.ComponentQuery.query('#accordionPanel')[0];

  if (filter === '')
  {
    purchaseGridStore.removeFilter(true);
  }
  else
  {
    purchaseGridStore.filterBy(function(rec) {
        if (rec.get('workflow_category') === filter) {
          return true;
        } else {
          return false;
        }
    });
  }

  if (collapseAccordion !== false) {
    accordionPanel.collapse();
    accordionPanel.setTitle('Purchase Details');
  }

}


// processedFiles is a list that determines if there are new files associated with a user's purchase. If so, the order id is turned red in the Purchases grid.
// Once the admin selects that row, however, the processedFile list is updated and the id returns to it's normal color, signifying that it has been administered...
function insertUpdateProcessedFile(fileid, total) {

  LABKEY.Query.executeSql({
      schemaName: 'lists',
      sql: 'SELECT fileid, total FROM processedFiles WHERE fileid = ' + fileid,
      successCallback: function(data) {

        if (data.rowCount === 0) {

          LABKEY.Query.insertRows({
              schemaName: 'lists',
              queryName: 'processedFiles',
              rows: [{
                  "fileid": fileid,
                  "total": total
              }],
              successCallback: function(data) {},
              failureCallback: function(data) {}
          });

        } else {

          LABKEY.Query.updateRows({
              schemaName: 'lists',
              queryName: 'processedFiles',
              rows: [{
                  "fileid": fileid,
                  "total": total
              }],
              successCallback: function(data) {},
              failureCallback: function(data) {}
          });
        }
      },
      failureCallback: function(data) {
        // add message
      }
  });
}

function manageQAChecklist(state, qaRecord, purchaseId) {

  // states: load record/mask, no record/unmask, save record/mask

  var checkList = Ext4.ComponentQuery.query('#qaChecklist')[0];
  var checkListForm = checkList.getForm();

  // Checklist already saved
  if (state === 'load' && qaRecord !== null) {
    checkListForm.reset();
    checkListForm.loadRecord(qaRecord);
    checkList.mask();
  }

  // Unsaved checklist
  if (state === 'load' && qaRecord === null) {
    checkListForm.reset();
    checkList.unmask();

    // Set hidden values in QA checklist form
    var qa_purchase_id = checkListForm.findField('purchase_id');
    var qa_email = checkListForm.findField('email');
    var qa_date = checkListForm.findField('date');

    qa_purchase_id.setValue(purchaseId);
    qa_email.setValue(LABKEY.Security.currentUser.email);
    qa_date.setValue(new Date());
  }

  // Mask checklist immediately after save
  if (state === 'update' && qaRecord === null && purchaseId === null) {
    checkList.mask();
  }

}

function insertQAChecklist (form) {
  var that = this;
  var formFields = form.getFieldValues();

  LABKEY.Query.saveRows({
      commands: [{
          "schemaName": "ctrp_admin",
          "queryName": "qa_checklist",
          "command": "insert",
          "rows": [
            formFields
          ]
      }],
      successCallback: function() {
        that.manageQAChecklist('update', null, null);
      }
  });
}

//
function loadPurchaseDetails(record, purchaseGrid) {
  rec = record;
  if (rec.data.newFileFlag) {
    insertUpdateProcessedFile(rec.data.newFileFlag, rec.data.newFileTotal);
  }
  var purchaseId = rec.data.id;
  var shippingAddress = rec.data.shipping_address;
  var billingAddress = rec.data.billing_address;

  // clear store filters
  //purchaseDetailsStore.clearFilter(true);
  //addressesStore.clearFilter(true);
  //additionalInfoStore.clearFilter(true);
  //fileStore.clearFilter(true);
  //billingStore.clearFilter(true);
  qaChecklistStore.clearFilter(true);

  // filter stores by purchase id
  /*
  purchaseDetailsStore.filter({
      property: 'purchase_id',
      value: purchaseId,
      exactMatch: true
  });
  addressesStore.filter({
      property: 'purchase_id',
      value: purchaseId,
      exactMatch: true
  });
  additionalInfoStore.filter({
      property: 'purchase_id',
      value: purchaseId,
      exactMatch: true
  });
  fileStore.filter({
      property: 'purchase_id',
      value: purchaseId,
      exactMatch: true
  });
  billingStore.filter({
      property: 'purchase_id',
      value: purchaseId,
      exactMatch: true
  });*/
  //need to query stores based on purchase
  storesLeft = 5;

  purchaseDetailsStore.parameters = {'purchaseId':purchaseId};
  //addressesStore.parameters = {'purchaseId':purchaseId};
  addressesStore.parameters = {'shipping_address_id':shippingAddress, 'billing_address_id': billingAddress};
  additionalInfoStore.parameters = {'purchaseId':purchaseId};
  fileStore.parameters = {'purchaseId':purchaseId};
  billingStore.parameters = {'purchaseId':purchaseId};
  purchaseDetailsStore.load({callback : storeLoadSuccess});
  addressesStore.load({callback : storeLoadSuccess});
  additionalInfoStore.load({callback : storeLoadSuccess});
  fileStore.load({callback : storeLoadSuccess});
  billingStore.load({callback : storeLoadSuccess});
}
function storeLoadSuccess(){
  storesLeft --;
  if(storesLeft == 0){
    finishedLoadingHelperStores();
  }
}


function finishedLoadingHelperStores(){
  var purchaseId = rec.data.id;
  var accordionPanel = Ext4.ComponentQuery.query('#accordionPanel')[0];
  accordionPanel.setTitle('Purchase Details for: ' + purchaseId);
  //after user selects a purchase other stores are loaded then this code is called.
  var qaRecord = qaChecklistStore.findRecord('purchase_id', purchaseId);

  // Layout accordion panels
  doPurchaseDetailsLayout();

  var accordionToolbar = Ext4.ComponentQuery.query('#accordionToolbar')[0];

  if (fileStore.count() === 0) {
    var fileGrid = Ext4.ComponentQuery.query('#filesGrid')[0];
    fileGrid.collapse();
  }

  var fileUploadPanel = Ext4.ComponentQuery.query('#fileUploadForm')[0];
  var fileUploadForm = fileUploadPanel.getForm();
  if (rec.data.id) {
    fileUploadForm.setValues({
        description: rec.data.id
    });
  }

  var purchasePanel = Ext4.ComponentQuery.query('#purchaseForm')[0];
  purchasePanel.loadRecord(rec);

  var billingUI = Ext4.ComponentQuery.query('#billingUI')[0];
  var billing = Ext4.ComponentQuery.query('#billingForm')[0];
  var billingForm = billing.getForm();
  billingForm.setValues({
      'purchase_id': rec.data.id
  });

  var shippingAddressPanel = Ext4.ComponentQuery.query('#shippingAddressForm')[0];
  var shippingAddressForm = shippingAddressPanel.getForm();
  var billingAddressPanel = Ext4.ComponentQuery.query('#billingAddressForm')[0];
  var billingAddressForm = billingAddressPanel.getForm();

  if(addressesStore.totalCount == 1){//same address used for billing and shipping
    let rec = addressesStore.getAt(0);
    shippingAddressForm.setValues({
        shipping_institution: rec.data.institution_string,
        shipping_firstname: rec.data.firstname,
        shipping_lastname: rec.data.lastname,
        shipping_address: rec.data.address,
        shipping_city: rec.data.city,
        shipping_state: rec.data.state,
        shipping_zip: rec.data.zip,
        shipping_country: rec.data.country,
        shipping_email: rec.data.email,
        shipping_fax: rec.data.fax
    });
    billingAddressForm.setValues({
        billing_institution: rec.data.institution_string,
        billing_firstname: rec.data.firstname,
        billing_lastname: rec.data.lastname,
        billing_address: rec.data.address,
        billing_city: rec.data.city,
        billing_state: rec.data.state,
        billing_zip: rec.data.zip,
        billing_country: rec.data.country,
        billing_email: rec.data.email,
        billing_fax: rec.data.fax
    });
  }
  else{
    addressesStore.each(function(rec) {

        if (rec.data.addresstype === 'shipping') {
          shippingAddressForm.setValues({
              shipping_institution: rec.data.institution_string,
              shipping_firstname: rec.data.firstname,
              shipping_lastname: rec.data.lastname,
              shipping_address: rec.data.address,
              shipping_city: rec.data.city,
              shipping_state: rec.data.state,
              shipping_zip: rec.data.zip,
              shipping_country: rec.data.country,
              shipping_email: rec.data.email,
              shipping_fax: rec.data.fax
          });
        }

        if (rec.data.addresstype === 'billing') {
          billingAddressForm.setValues({
              billing_institution: rec.data.institution_string,
              billing_firstname: rec.data.firstname,
              billing_lastname: rec.data.lastname,
              billing_address: rec.data.address,
              billing_city: rec.data.city,
              billing_state: rec.data.state,
              billing_zip: rec.data.zip,
              billing_country: rec.data.country,
              billing_email: rec.data.email,
              billing_fax: rec.data.fax
          });
        }
  });


  }

  manageQAChecklist('load', qaRecord, purchaseId);

  // Setup default views for users.
  var defaultUserWorkflow = userInfo[LABKEY.user.email].defaultWorkflow;

  if (defaultUserWorkflow === 'shipping') {
    purchasePanel.expand();
  }

  if (defaultUserWorkflow === 'billing') {
    billingUI.expand();
  }

  if (accordionPanel.collapsed) {
    accordionPanel.expand();
  }

  // masked in grid_purchase.js onSelect
  purchaseGrid.unmask();

}

// Update purchase from purchase form, reload purchaseStore, select current workflow_category, and reselect row...
function updatePurchase(form) {

  var workFlowCategory = form.findField('workflow_category').getValue();
  var formFields = form.getFieldValues();
  var purchasesGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
  var purchasesStore = purchasesGrid.getStore();

  LABKEY.Query.saveRows({
      commands: [{
          "schemaName": "ctrp_admin",
          "queryName": "purchase",
          "command": "update",
          "rows": [
            formFields
          ]
      }],
      successCallback: function() {

        // Add field selectedRecord to purchaseDetailStore to re-select selected record after store reload.
        purchasesStore.selectedRecord = formFields.id;

        purchasesStore.load({
            callback: function(records, operation, success) {

              if (success) {

                // filter store and reset search combo to workflow_category associated with newly set status
                if (workFlowCategory) {
                  this.filterBy(function(rec) {
                      if (rec.get('workflow_category') === workFlowCategory) {
                        return true;
                      } else {
                        return false;
                      }
                  });

                  selectWorkflowCategory(workFlowCategory);

                } else {
                  this.filterBy(function(rec) {
                      if (rec.get('workflow_category') === workFlowCategoryDefault) {
                        return true;
                      } else {
                        return false;
                      }
                  });

                  selectWorkflowCategory(null, test);
                }

                // When this store is reloaded via the updatePurchase success callback, it has an extra field appended, selectedRecord.
                // If selectedRecord is defined, get grid --> store --> selection model --> find record by id (purchase_id) and select it.
                if (this.selectedRecord) {

                  var purchasesGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
                  var purchasesStore = purchasesGrid.getStore();
                  var sm = purchasesGrid.getSelectionModel();
                  var i = purchasesStore.findRecord('id', this.selectedRecord);

                  sm.select(i);
                }
              }
            }
        });
      },
      failureCallback: function() {
        Ext4.Msg.alert('Alert', 'ERROR -- Purchase NOT Updated');
      }
  });
}

//
function downloadFile(rec) {

  var purchaseId = rec.get('purchase_id');
  var fileId = rec.get('id');

  if (purchaseId !== '' && Ext4.isNumeric(purchaseId) === true) {

    var actionUrl = URL + '/refcig-services/admin/ctrpfiles/' + fileId;

    var frame = Ext4.getBody().createChild({
        tag: 'iframe',
        cls: 'x-hidden',
        id: 'xf',
        name: 'xf'
    });

    var downloadForm = Ext4.getBody().createChild({
        tag: 'form',
        cls: 'x-hidden',
        id: 'hiddenform-form',
        action: Ext4.htmlEncode(encodeURI(actionUrl)),
        target: 'iframe',
        method: 'POST'
    });

    downloadForm.dom.submit();
    downloadForm.destroy();
    frame.destroy();
  } else {
    Ext4.Msg.alert('Alert', 'Incorrect ID. File cannot be downloaded.');
  }
}



/**
*********************
* BILLING FUNCTIONS *
*********************
*/

//
function handleBilling(combobox) {

  var billing = Ext4.ComponentQuery.query('#billingForm')[0];
  var billingForm = billing.getForm();
  var chargeTypeCombo = billingForm.findField('chargetype');
  var paymentTypeCombo = billingForm.findField('paymenttype');

  var chargeFields = Ext4.ComponentQuery.query('#chargeFields')[0];
  var paymentFields = Ext4.ComponentQuery.query('#paymentFields')[0];
  var credit = billingForm.findField('credit');
  var debit = billingForm.findField('debit');
  var billingType = billingForm.findField('billingtype_id');

  if (combobox.name === 'chargetype') {
    paymentTypeCombo.hide();
    chargeFields.show();
    paymentFields.disable();
    credit.setValue(true);
    billingType.setValue(chargeTypeCombo.getValue());
  }

  if (combobox.name === 'paymenttype') {
    chargeTypeCombo.hide();
    paymentFields.show();
    chargeFields.disable();
    debit.setValue(true);
    billingType.setValue(paymentTypeCombo.getValue());
  }

}

// refresh billing grid
function resetBilling() {
  var billing = Ext4.ComponentQuery.query('#billingForm')[0];
  var billingForm = billing.getForm();
  billingForm.reset();

  var purchaseIdField = billingForm.findField('purchase_id');
  var chargeTypeCombo = billingForm.findField('chargetype');
  var paymentTypeCombo = billingForm.findField('paymenttype');
  var chargeFields = Ext4.ComponentQuery.query('#chargeFields')[0];
  var paymentFields = Ext4.ComponentQuery.query('#paymentFields')[0];
  purchaseIdField.setValue(currentPurchaseId);

  chargeTypeCombo.show();
  paymentTypeCombo.show();
  chargeFields.enable();
  paymentFields.enable();
  chargeFields.hide();
  paymentFields.hide();

}

// Refresh billing store.
function refreshBillingStore() {
  var billingGrid = Ext4.ComponentQuery.query('#billingGrid')[0];
  var billingStore = billingGrid.getStore();
  billingStore.load();
}

// Save billing form values to billing table... refresh the billing grid
function saveBilling() {
  var billing = Ext4.ComponentQuery.query('#billingForm')[0];
  var billingForm = billing.getForm();
  var billingtype_id;
  var formFields;
  var chargeTypeCombo = billingForm.findField('chargetype');
  var paymentTypeCombo = billingForm.findField('paymenttype');

  if (chargeTypeCombo.getValue() !== null) {
    formFields = {
      'purchase_id': billingForm.findField('purchase_id').getValue(),
      'billingtype_id': billingForm.findField('billingtype_id').getValue(),
      'amount': billingForm.findField('chargeAmount').getValue(),
      'comments': billingForm.findField('chargeComments').getValue()
    };
  }

  if (paymentTypeCombo.getValue() !== null) {
    formFields = {
      'purchase_id': billingForm.findField('purchase_id').getValue(),
      'billingtype_id': billingForm.findField('billingtype_id').getValue(),
      'amount': billingForm.findField('paymentAmount').getValue(),
      'comments': billingForm.findField('paymentComments').getValue(),
      'check_number': billingForm.findField('checknumber').getValue(),
      'payment_date': billingForm.findField('paymentdate').getRawValue()
    };
  }

  LABKEY.Query.saveRows({
      commands: [{
          "schemaName": "ctrp_admin",
          "queryName": "billing",
          "command": "insert",
          "rows": [
            formFields
          ]
      }],
      successCallback: function() {
        var billingGrid = Ext4.ComponentQuery.query('#billingGrid')[0];
        billingGrid.mask();
        billingGrid.getStore().reload({
            callback: function(records, operation, success) {
              billingGrid.getStore().filterBy(function(rec) {
                  // Using the equality operator instead of strict identity because this if statement evaluates strings/numbers, respectively.
                  if (rec.data.purchase_id == currentPurchaseId) {
                    return true;
                  } else {
                    return false;
                  }
              });
            }
        });

        resetBilling();
        billingGrid.unmask();

      },
      failureCallback: function() {
        Ext4.Msg.alert('Alert', 'ERROR -- Purchase NOT Updated');
      }
  });
}

function fileUpload() {

  var form = Ext4.ComponentQuery.query('#fileUploadForm')[0];
  var f = form.getForm();

  if (f.isValid()) {
    f.errorReader = new Ext4.data.XmlReader({
        record: 'multistatus',
        success: 'status'
    }, ['status']);

    f.submit({
        url: LABKEY.ActionURL.getBaseURL() + '_webdav/CTRP_Admin/%40files/uploads/?Accept=application/json&overwrite=F',
        //waitMsg: 'Uploading your file...',
        success: function(fp, o) {
          Ext.Msg.alert('Success', 'Your file "' + o.result.file + '" has been uploaded.');
          fp.reset();
        },
        failure: function(fp, o) {
          var dq = Ext4.DomQuery;
          var xml = o.response.responseXML;
          var node = dq.selectNode('status', xml);
          var status = dq.selectValue('status', xml);

          if (status === 'HTTP/1.1 200 OK') {
            Ext4.Msg.alert('Status', 'File upload successful');
          } else {
            Ext4.Msg.alert('Status', 'That did not seem to work. Status: ' + status);
          }
        }
    });
  }

}
