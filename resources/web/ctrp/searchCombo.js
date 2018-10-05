
// The following store and combobox are used in the profstudies.js
var statusCategories = Ext4.create('LABKEY.ext4.data.Store', {
  fields: ['value', 'name'],
  data: [
    {'name':'shipping', 'value':'shipping'},
    {'name':'billing-invoiced', 'value':'billing-invoiced'},
    {'name':'billing-paid', 'value':'billing-paid'},
    {'name':'billing-shipped', 'value':'billing-shipped'},
    {'name':'canceled', 'value':'canceled'},
    {'name': 'billing-bad debt', 'value':'billing-bad debt'},

    {'name':'show all', 'value':''}
  ],
  storeId: 'statusCategories'
});


var searchComboProfStudy = Ext4.create('Ext4.form.field.ComboBox', {
    fieldLabel: 'Select a status category',
    displayField: 'name',
    valueField: 'value',
    width: 320,
    labelWidth: 150,
    store: statusCategories,
    editable:false,
    // multiSelect: false,
    queryMode: 'local',
    itemId:'searchComboProfStudy',
    listeners:{
      'select': function(combo, record) {
        var theGrid = combo.up('grid');
        var theStore = theGrid.getStore();
        var filter = record[0].data.value;

        if (filter === '') {
          theStore.clearFilter();
        } else {
          theStore.filterBy( function(rec) {
              if(rec.get('workflow_category') === filter) {
                return true;
              }
              else
              {
                return false;
              }
          });
        }


      }
    }
});

// This combo is used in orders/billing.
var statusCombo = Ext4.create('Ext4.form.field.ComboBox', {
    fieldLabel: 'Select status',
    displayField: 'name',
    valueField: 'value',
    width: 300,
    labelWidth: 100,
    store: statusCategories,
    editable:false,
    queryMode: 'local',
    itemId:'statusCombo',
    listeners:{
      'select': function(combo, record, eOpts, collapseAccordion) {
        statusComboFilterPurchasesByCategory(record, collapseAccordion);
      }
    }
});
