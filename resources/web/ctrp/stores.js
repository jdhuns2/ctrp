/**
*********
* MODELS *
**********
*/
Ext4.define('purchases', {
    extend: 'Ext.data.Model',
    fields: [
      {name:'id', type:'int'},
      {name:'internal_notes', type:'string'},
      {name:'po_number', type:'string'},
      {name:'reference_number', type:'string'},
      {name:'tracking_number', type:'string'},
      {name:'purchase_date', type:'date'},
      {name:'shipped_date', type:'date'},
      {name:'shipping_instructions', type:'string'},
      {name:'shipping_method', type:'string'},
      {name:'status_type', type:'int'},
      {name:'description', type:'string'},
      {name:'workflow_category', type:'string'},
      {name:'authority', type:'string'},
      {name:'institution_type', type:'string'},
      {name:'username', type:'string'},
      {name:'username_display', type:'string'},
      {name:'email', type:'string'},
      {name:'telephone', type:'string'},
      {name:'institution', type:'string'},
      {name:'terms_and_conditions', type:'string'},
      {name:'lot_numbers', type:'string'},
      {name: 'shipped_date', type:'date'},
      {name:'created', type:'date'},
      {name:'modified', type:'date'},
      {name:'newFileFlag', type:'int'},
      {name:'newFileTotal', type:'int'}
    ]
});

Ext4.define('purchaseDetailsModel', {
    extend: 'Ext.data.Model',
    fields: [  {name:'id', type:'int'}  ]
});

Ext4.define('statusModel', {
    extend: 'Ext.data.Model',
    fields: [ 'id', 'description'  ]
});

Ext4.define('additionalInfoModel', {
    extend: 'Ext.data.Model',
    fields: [ 'id', 'purchase_id', 'question_id', 'question_text', 'answer_text', 'answer_value'  ]
});

Ext4.define('fileModel', {
    extend: 'Ext.data.Model',
    fields: [ 'id', 'file_name', 'file_size', 'file_type', 'hidden', 'category', 'description', 'username', 'institution', 'purchase_id', 'start_date', 'end_date', 'created', 'modified' ]
});
Ext4.define('qaChecklistModel', {
    extend: 'Ext.data.Model',
    fields: [ 'id', 'purchase_id', 'materials', 'inspection', 'shipping', 'orderupdate', 'final', 'name', 'signature', 'date']
});


/**
*********
* STORES *
**********
*/
var processedFilesStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'lists',
    queryName:'processedFiles',
    autoLoad: false,
    storeId: 'processedFilesStore'
});

var purchasesViewStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'purchases',
    queryName:'currentPurchasesWithFileNotification',
    storeId:'purchasesViewStore',
    parameters:{'purchaseId':0},
    autoLoad: false
});

var purchaseDetailsStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'purchaseDetailsModel',
    queryName:'purchaseDetailsViewQuery',
    storeId:'purchaseDetailsStore',
    parameters:{'purchaseId':0},
    autoLoad:false
});

var addressesStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'addressesModel',
    queryName:'addressViewQuery',
    storeId:'addressesStore',
    //parameters:{'purchaseId':0},
    parameters: {shipping_address_id:0, billing_address_id:0},
    autoLoad:false
});

var statusStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'statusModel',
    queryName:'statusView',
    storeId:'statusView',
    autoLoad: false
});

var additionalInfoStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'additionalInfoModel',
    queryName:'additionalInfoViewQuery',
    storeId:'additionalInfoView',
    parameters:{'purchaseId':0},
    autoLoad:false
});

var fileStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'fileModel',
    queryName:'fileViewQuery',
    parameters:{'purchaseId':0},
    storeId:'fileView'
});

var shippingOptions = Ext4.create('Ext4.data.Store', {
    fields: ['id', 'value'],
    data : [
      {"id":"DHL", "value":"DHL"},
      {"id":"UPS", "value":"UPS"},
      {"id":"Fedex", "value":"Fedex"},
      {"id":"Other", "value":"Other"}
    ],
    storeId: 'shippingOptions'
});

var qaChecklistStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'qaChecklistModel',
    queryName:'qa_checklist',
    storeId:'qaChecklist',
    autoLoad: false
});

/**
 ***********
 * BILLING *
 ***********
*/

var billingStore = Ext4.create('LABKEY.ext4.data.Store', {
    schemaName: 'ctrp_admin',
    model:'billingModel',
    queryName:'billingViewQuery',
    storeId:'billingView',
    parameters:{'purchaseId':0},
    autoLoad:false
});

var billingChargeTypesStore = Ext4.create('LABKEY.ext4.data.Store', {
    fields: ['id', 'billing'],
    schemaName: 'ctrp_admin',
    sql: 'select id, billing from billingtype where debitcredit = 1',
    storeId: 'billingChargeTypesStore',
    autoLoad:false
});

var billingPaymentTypesStore = Ext4.create('LABKEY.ext4.data.Store', {
    fields: ['id', 'billing'],
    schemaName: 'ctrp_admin',
    sql: 'select id, billing from billingtype where debitcredit = -1',
    storeId: 'billingChargeTypesStore',
    autoLoad:false
});

var prepayAddStore = Ext4.create('Ext4.data.Store', {
    fields: ['id', 'value'],
    data : [
      {"id":"yes", "value":"yes"},
      {"id":"no", "value":"no"}
    ],
    storeId: 'prepayAdd'
});

/**
***********
* STATUS *
***********
*/

var statusCategories = Ext4.create('LABKEY.ext4.data.Store', {
    fields: ['value', 'name'],
    data: [
      {'name':'shipping', 'value':'shipping'},
      {'name':'billing-invoiced', 'value':'billing-invoiced'},
      {'name':'billing-paid', 'value':'billing-paid'},
      {'name':'billing-shipped', 'value':'billing-shipped'},
      {'name':'canceled', 'value':'canceled'},
      {'name':'show all', 'value':''}
    ],
    storeId: 'statusCategories'
});
