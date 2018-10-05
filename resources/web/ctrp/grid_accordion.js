// Accordion purchase details
var accordion = Ext4.create('Ext4.panel.Panel', {
    title: 'Purchase Details',
    itemId: 'accordionPanel',
    collapsed: true,
    hidden: false,
    width: '99%',
    forceFit: true,
    layout: {
      type: 'accordion',
      fill: true,
      titleCollapse: false,
      animate: true,
      activeOnTop: false,
      multi: true
    },
    items: [
      {
        xtype: 'gridpanel',
        title: 'Details',
        store: purchaseDetailsStore,
        itemId: 'purchaseDetailsGrid',
        hidden: false,
        width: '90%',
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        columns: [
          { header: 'Name', width: 300, sortable: true, dataIndex: 'name' },
          {
            header: 'Qty',
            width: 75,
            sortable: true,
            dataIndex: 'quantity_ordered',
            renderer: function(value, meta, record) {
              var qty = '';

              if (value > 1) {
                qty = record.get('quantity_ordered') + ' ' + record.get('unit_plural');
              } else {
                qty = record.get('quantity_ordered') + ' ' + record.get('unit');
              }

              return qty;
            }
          },
          {
            header: 'Price',
            width: 100,
            sortable: true,
            dataIndex: 'price_per_unit',
            renderer: function(v) { return Ext4.util.Format.usMoney(v); },
            align: 'right'
          },
          {
            header: 'Subtotal',
            width: 100,
            sortable: true,
            dataIndex: 'subtotal',
            flex: 1 ,
            renderer: function(v) { return Ext4.util.Format.usMoney(v); },
            align: 'right',
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
              return "<strong>" + Ext4.util.Format.usMoney(value) + "</strong>";
            }
          }
        ],
        features: [{
            ftype: 'summary'
        }]
      },
      {
        xtype: 'gridpanel',
        title: 'Addresses',
        store: addressesStore,
        itemId: 'addressesGrid',
        hidden: false,
        minHeight: 100,
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        columns: [
          { header: 'Institution', width: 250, sortable: true, dataIndex: 'institution_string' },
          { header: 'First Name', width: 100, sortable: true, dataIndex: 'firstname' },
          { header: 'Last Name', width: 100, sortable: true, dataIndex: 'lastname' },
          { header: 'Address', width: 200, sortable: true, dataIndex: 'address',flex:1,renderer:function(value,meta,record){

			  if(record.get('address2')!=null){
				  return value + '<br/>' + record.get('address2');
			  }
			  else{
				  return value;
			  }
		  }},
          { header: 'City', width: 150, sortable: true, dataIndex: 'city' },
          { header: 'State', width: 100, sortable: true, dataIndex: 'state' },
          { header: 'Zip', width: 150, sortable: true, dataIndex: 'zip' },
          { header: 'Country', width: 100, sortable: true, dataIndex: 'country' },
          { header: 'Zip', width: 75, sortable: true, dataIndex: 'zip' },
          { header: 'Email', width: 150, sortable: true, dataIndex: 'email', hidden:true },
          { header: 'Phone', width: 150, sortable: true, dataIndex: 'phone' },
          { header: 'Fax', width: 150, sortable: true, dataIndex: 'fax', hidden:true },
          { header: 'Type', width: 150, sortable: true, dataIndex: 'addresstype' }
        ]
      },
      {
        xtype: 'gridpanel',
        title: 'Files',
        store: fileStore,
        itemId: 'filesGrid',
        hidden: false,
        minHeight: 75,
        emptyText: 'No files have been associated with this purchase',

        header: {
          xtype: 'header',
          titlePosition: 2,
        },
        tools: [{
            type: 'refresh',
            tooltip: 'Refresh Grid Data',
            align: 'right',
            handler: function(event, toolEl, panelHeader) {

              var filesGrid = Ext4.ComponentQuery.query('#filesGrid')[0];
              filesGrid.mask();
              filesGrid.getStore().reload({
                  callback: function(records, operation, success) {

                    filesGrid.getStore().filterBy(function(rec) {

                        if (rec.data.purchase_id === currentPurchaseId) {
                          return true;
                        } else {
                          return false;
                        }
                    });
                  }
              });

              filesGrid.unmask();

            }
        }],
        columns: [
          { header: 'Id', width: 50, sortable: true, dataIndex: 'id'},
          { header: 'Purchase Id', width: 75, sortable: true, dataIndex: 'purchase_id'},
          { header: 'File', width: 150, sortable: true, dataIndex: 'file_name'},
          { header: 'File Size', width: 150, sortable: true, dataIndex: 'file_size', hidden:true},
          { header: 'File Type', width: 150, sortable: true, dataIndex: 'file_type', hidden:true},
          { header: 'Category', width: 150, sortable: true, dataIndex: 'category', hidden:true},
          { header: 'Description', flex:1, sortable: true, dataIndex: 'description'},
          { header: 'Username', width: 150, sortable: true, dataIndex: 'username'},
          { header: 'Institution', width: 150, sortable: true, dataIndex: 'institution'},
          { header: 'Hidden', width: 50, sortable: true, dataIndex: 'hidden', hidden:true},
          { header: 'Start Date', width: 100, sortable: true, dataIndex: 'start_date', hidden:true, renderer: Ext4.util.Format.dateRenderer('Y-m-d')},
          { header: 'End Date', width: 100, sortable: true, dataIndex: 'end_date', hidden:true, renderer: Ext4.util.Format.dateRenderer('Y-m-d')},
          { header: 'Created', width: 100, sortable: true, dataIndex: 'created', renderer: Ext4.util.Format.dateRenderer('Y-m-d')},
          { header: 'Modified', width: 100, sortable: true, dataIndex: 'modified', hidden:true, renderer: Ext4.util.Format.dateRenderer('Y-m-d')},
          {
            xtype:'actioncolumn',
            header: 'Download',
            align: 'center',
            width:100,
            items: [{
                icon: '/labkey/_webdav/CTRP_Admin/%40files/web/images/download.png',
                tooltip: 'click for details',
                handler: function(grid, rowIndex, colIndex) {
                  var rec = grid.getStore().getAt(rowIndex);
                  downloadFile(rec);
                }
            }]
          }
        ],
        dockedItems: [
          {
            xtype: 'toolbar',
            dock: 'bottom',
            border: false,
            items: [
              {
                xtype:'tbfill'
              },
              {
                xtype: 'tbtext',
                text: 'Remember to login to <a target="_blank" href="https://ctrp.uky.edu">https://ctrp.uky.edu</a> before downloading file(s).'
              }
            ]
          }
        ]
      },
      {
        xtype: 'form',
        title: 'File Upload',
        itemId: 'fileUploadForm',
        collapsible: true,
        collapsed: true,
        hidden: false,
        bodyPadding: 20,
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        items: [
          {
            xtype: 'hidden',
            name: 'description',
            itemId: 'fileUploadDescription',
            allowBlank: false,
            width: 600
          },
          {
            xtype: 'filefield',
            name: 'file',
            fieldLabel: 'File',
            itemId: 'file',
            labelWidth: 100,
            msgTarget: 'side',
            allowBlank: false,
            width: 600,
            buttonText: 'Select File...',
            buttonMargin: 10
          }
        ],
        dockedItems: [{
            xtype: 'toolbar',
            hidden: false,
            border: false,
            dock: 'bottom',
            items: [
              {
                xtype: 'tbfill'
              },
              {
                xtype: 'button',
                text: 'Upload File',
                handler: function() {
                  fileUpload();
                }
              }
            ]
        }]
      },
      {
        xtype:'form',
        layout: 'hbox',
        title: 'Purchase Info',
        itemId: 'purchaseForm',
        hidden: false,
        bodyPadding: 5,
        collapsible: true,
        collapsed: true,
        defaults: {
          height: 300,
          border: false
        },
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        items: [
          {
            xtype: 'fieldset',
            flex: 0.5,
            margin: '0, 10, 0, 0',
            defaults: {
              xtype: 'textfield',
              allowBlank: true,
              padding: 5,
              labelAlign: 'top',
              anchor: '100%'
            },
            items:[
              {
                name: 'id',
                xtype: 'hidden'
              },
              {
                fieldLabel: 'PO Number',
                name: 'po_number'
              },
              {
                fieldLabel: 'Reference Number',
                name: 'reference_number'
              },
              {
                fieldLabel: 'Tracking Number',
                name: 'tracking_number'
              },
              {
                fieldLabel: 'Lot Number(s)',
                name: 'lot_numbers'
              },
              {
                fieldLabel: 'Status',
                xtype: 'combobox',
                forceSelection: true,
                editable: false,
                triggerAction: 'all',
                allowBlank: false,
                name:'status_id',
                valueField:'status_id',
                displayField:'status_description',
                store: statusStore,
                listeners: {
                  'select': function() {

                    // find statusId and use it to set workflow_category... used by updatePurchase
                    var statusId = this.getValue();
                    var record = this.store.findRecord('status_id', statusId);
                    var workflowCategory = record.get('workflow_category');
                    var workflowCategoryField = Ext4.ComponentQuery.query('#workflow_category')[0];
                    workflowCategoryField.setValue(workflowCategory);

                  }
                }
              },
              {
                xtype: 'hidden',
                name: 'workflow_category',
                itemId: 'workflow_category'
              }
            ]
          },
          {
            xtype: 'fieldset',
            flex: 0.5,
            defaults: {
              allowBlank: true,
              padding: 5,
              labelAlign: 'top'
            },
            items:[
              {
                xtype: 'combobox',
                fieldLabel: 'Shipping Method',
                name: 'shipping_method',
                forceSelection: true,
                editable: false,
                triggerAction: 'all',
                name:'shipping_method',
                valueField:'id',
                displayField:'value',
                store: shippingOptions,
                width: 250
              },
              {
                xtype: 'datefield',
                fieldLabel: 'Shipped Date',
                name: 'shipped_date',
                width: 250
              },
              {
                fieldLabel: 'Internal Notes',
                name: 'internal_notes',
                xtype: 'textareafield',
                height: 175,
                anchor: '100%'
              }
            ]
          }
        ],
        dockedItems: [{
            xtype: 'toolbar',
            hidden: false,
            border: false,
            itemId: '',
            dock: 'bottom',
            items: [
              {
                xtype: 'tbfill'
              },
              {
                xtype: 'button',
                text: 'Update Purchase',
                handler: function() {
                  var form = this.up('form').getForm();
                  if (form.isValid()) {
                    updatePurchase(form);
                  }
                }
              }
            ]
        }]
      },

      /**
      *****************
      * Billing Panel *
      *****************
      */
      {
        xtype: 'panel',
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        title: 'Billing',
        hidden: false,
        minHeight: 200,
        maxHeight: 325,
        bodyPadding: '5',
        itemId: 'billingUI',
        scrollable: true,
        overflowY: 'scroll',
        collapsible: true,
        collapsed: true,
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        items: [
          {
            xtype:'form',
            itemId: 'billingForm',
            title: 'Add Charges/Payments Info',
            bodyPadding: 10,
            flex: 0.35,
            minHeight: 200,
            maxHeight: 325,
            scrollable: true,
            overflowY: 'scroll',
            margin: '0 5 0 0',
            defaults: {
              anchor: '100%'
            },
            tools:[
              {
                type:'refresh',
                tooltip: 'Refresh Grid Data',
                handler: function(event, toolEl, panelHeader) {
                  resetBilling();
                }
              }
            ],
            items: [
              {
                xtype: 'hidden',
                name: 'purchase_id'
              },
              {
                xtype: 'hidden',
                name: 'billingtype_id'
              },
              {
                xtype: 'combobox',
                width: 350,
                fieldLabel: 'Add Charge',
                name: 'chargetype',
                queryMode: 'local',
                store: billingChargeTypesStore,
                valueField: 'id',
                displayField: 'billing',
                forceSelection:true,
                editable: false,
                validateOnBlur: true,
                listeners: {
                  'change' : function(value) {
                    handleBilling(value);
                  }
                }
              },
              {
                xtype: 'combobox',
                width: 350,
                fieldLabel: 'Add Payment',
                name: 'paymenttype',
                queryMode: 'local',
                store: billingPaymentTypesStore,
                valueField: 'id',
                displayField: 'billing',
                forceSelection:true,
                editable: false,
                validateOnBlur: true,
                listeners: {
                  'change' : function(value) {
                    handleBilling(value);
                  }
                }
              },
              {
                xytype: 'fieldset',
                itemId: 'chargeFields',
                hidden:true,
                bodyPadding: 10,
                border: false,
                defaults: {
                  anchor: '100%'
                },
                items: [
                  {
                    fieldLabel: 'Dollar Amount',
                    name: 'chargeAmount',
                    xtype: 'numberfield',
                    minValue: 0
                  },
                  {
                    fieldLabel: 'Comments',
                    name: 'chargeComments',
                    xtype: 'textarea',
                    labelAlign: 'top',
                    allowBlank: true,
                    height: 100,
                    flex:1,
                    width: '100%'
                  },
                  {
                    xtype:'hidden',
                    name:'debit'
                  },
                  {
                    xtype: 'toolbar',
                    border: false,
                    items: [
                      {
                        xtype: 'button',
                        text: 'Cancel',
                        handler: function() {
                          resetBilling();
                        }
                      },
                      {
                        xtype: 'tbfill'
                      },
                      {
                        xtype: 'button',
                        text: 'Save',
                        handler: function() {
                          saveBilling();
                        }
                      }
                    ]
                  }
                ]
              },
              {
                xytype: 'fieldset',
                itemId: 'paymentFields',
                hidden:true,
                bodyPadding: 10,
                border: false,
                items: [
                  {
                    fieldLabel: 'Dollar Amount',
                    name: 'paymentAmount',
                    xtype: 'numberfield',
                    decimalPrecision: 2,
                    minValue: 0
                  },
                  {
                    fieldLabel: 'Check Number',
                    name: 'checknumber',
                    xtype: 'numberfield',
                    minValue: 0
                  },
                  {
                    fieldLabel: 'Payment Date',
                    name: 'paymentdate',
                    xtype: 'datefield',
                    format:'Y-m-d'
                  },
                  {
                    fieldLabel: 'Comments',
                    name: 'paymentComments',
                    xtype: 'textarea',
                    labelAlign: 'top',
                    allowBlank: true,
                    height: 100,
                    width: '100%'
                  },
                  {
                    xtype:'hidden',
                    name:'credit'
                  },
                  {
                    xtype: 'toolbar',
                    items: [
                      {
                        xtype: 'button',
                        text: 'cancel',
                        handler: function() {
                          resetBilling();
                        }
                      },
                      {
                        xtype: 'tbfill'
                      },
                      {
                        xtype: 'button',
                        text: 'Save',
                        handler: function() {
                          saveBilling();
                        }
                      }
                    ]
                  }
                ]
              },
              {
                xtype: 'combobox',
                width: 150,
                fieldLabel: 'Prepay and Add',
                name: 'prepayAdd',
                itemId: 'prepayAdd',
                queryMode: 'local',
                store: prepayAddStore,
                valueField: 'id',
                displayField: 'value',
                forceSelection:true,
                editable: false,
                validateOnBlur: true,
                listeners: {
                  'afterrender' : function() {
                    this.setValue('yes');
                  }
                }
              }
            ]
          },
          {
            xtype:'gridpanel',
            itemId:'billingGrid',
            title: 'Billing Info',
            store: billingStore,
            flex: 0.65,
            tools:[
              {
                type:'refresh',
                tooltip: 'Refresh Grid Data',
                handler: function(event, toolEl, panelHeader) {
                  refreshBillingStore();
                }
              }
            ],
            columns: [
              {header: 'Id', dataIndex:'id', hidden:true},
              {header:'Purchase Id', dataIndex:'purchase_id', hidden:true},
              {header:'Purchasedetail Id', dataIndex:'purchasedetail_id', hidden:true},
              {header:'Transaction Detail', dataIndex:'transaction_detail', flex:1},
              {
                header:'Billing',
                dataIndex:'amount',
                renderer: function(v) { return Ext4.util.Format.usMoney(v); },
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex) {
                  return "<strong>"+Ext4.util.Format.usMoney(value)+"</strong>";
                }
              },
              {header:'Check Number', dataIndex:'check_number'},
              {header:'Comments', dataIndex:'comments'},
              {header:'Payment Date', dataIndex:'payment_date', xtype:'datecolumn', format: 'Y-m-d' },
              {header:'Created', dataIndex:'created', xtype:'datecolumn', format:'Y-m-d', hidden: true },
              {header:'Modified', dataIndex:'modified', xtype:'datecolumn', format:'Y-m-d', hidden: true }
            ],
            features: [{
                ftype: 'summary'
            }],
            dockedItems: [
              {
                xtype: 'toolbar',
                dock: 'bottom',
                border: false,
                items: [
                  {
                    xtype:'tbfill'
                  },
                  {
                    xtype: 'tbtext',
                    text: 'Remember to login to <a target="_blank" href="https://ctrp.uky.edu">https://ctrp.uky.edu</a> before creating invoice.'
                  },
                  {
                    xtype: 'button',
                    text: 'Create Invoice',
                    handler: function() {

                      var prepayAddCombo = Ext4.ComponentQuery.query('#prepayAdd')[0];
                      var prepayAdd = prepayAddCombo.getValue();

                      var shippingAddressPanel = Ext4.ComponentQuery.query('#shippingAddressForm')[0];
                      var shippingForm = shippingAddressPanel.getForm();
                      var billingAddressPanel = Ext4.ComponentQuery.query('#billingAddressForm')[0];
                      var billingForm = billingAddressPanel.getForm();
                      var shippingValues = Ext4.Object.toQueryString(shippingForm.getValues());
                      var billingValues = Ext4.Object.toQueryString(billingForm.getValues());
                      var createInvoiceAndDownload = URL + '/refcig-services/admin/invoice/' + currentPurchaseId + '/addresses?' + shippingValues + '&' + billingValues + '&prepayAdd=' + prepayAdd  ;

                      window.open(createInvoiceAndDownload);
                      // Ext.Msg.alert('Status', 'If invoice was created, please refresh the file grid to see the file.');
                    }
                  }
                ]
              }
            ]
        }]
      },



      /**
      *****************
      * QA Checklist
      *****************
      */
      {
        xtype:'form',
        layout: 'hbox',
        title: 'QA Checklist',
        itemId: 'qaChecklist',
        hidden: false,
        bodyPadding: 4,
        collapsible: true,
        collapsed: true,
        height: 600,
        border: false,
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        layout: {
          type: 'vbox',
          align: 'stretch'
        },
        items: [
          {
            xtype: 'panel',
            border: false,
            layout: {
              type: 'hbox',
              align: 'stretch'
            },
            scrollable: true,
            overflowY: 'scroll',
            defaults: {
              columnWidth: 0.5
            },
            items: [
              {
                xtype: 'fieldset',
                border: false,
                margin: '0, 10, 0, 0',
                flex: 0.5,
                defaults: {
                  xtype: 'checkbox',
                  allowBlank: true,
                  padding: 1,
                  labelAlign: 'top',
                  allowBlank: false
                },
                items:[
                  {
                    xtype: 'container',
                    html: '<h3>Remove reference materials from cold storage unit</h3><ol><li>Enter electronic code and use key to open</li><li>Product removed by two CTRP staff members</li><li>Record on the paper log located in the cold storage unit: (1) the amount and type of reference products removed; (2) date; (3) invoice number; and (4) initialed by both CTRP staff members</li><li>Lock the cold storage unit</li> </ol>'
                  },
                  {
                    boxLabel: 'Requirements identified in the “Remove reference material” section above are complete',
                    name: 'materials',
                    inputValue: 'true',
                    id: 'materialsCheckbox',
                    msgTarget: 'side',
                    invalidText: 'This value is not valid!'
                  },
                  {
                    xtype: 'container',
                    html: '<h3>This product has been inspected and found to be free of:</h3><ol><li>Crushed box</li><li>Torn cellophane</li><li>Water damage or spots</li><li>Dust from storage</li></ol><p>If damaged, please complete Damaged Product Report.</p>'
                  },
                  {
                    boxLabel: 'Requirements identified in the “Inspection” section above are complete.',
                    name: 'inspection',
                    inputValue: 'true',
                    id: 'inspectionCheckbox',
                    msgTarget: 'side'
                  }
                ]
              },
              {
                xtype: 'fieldset',
                border: false,
                margin: '0, 0, 0, 0',
                flex: 0.5,
                defaults: {
                  xtype: 'checkbox',
                  allowBlank: true,
                  padding: 1,
                  labelAlign: 'top'
                },
                items:[
                  {
                    xtype: 'container',
                    html: '<h3>Shipping</h3><ol><li>Assemble box</li><li>Insert reference materials and add packing materials as necessary to protect the product</li><li>Insert protocol and/or attach other relevant shipping documents</li><li>Properly seal package with packing tape</li><li>Process shipment with shipping company. Complete shipping documentation and affix to box</li><li>Electronic notice sent or phone call made to logistic provider for package pickup</li></ol>'
                  },
                  {
                    boxLabel: 'Requirements identified in the “Shipping” section above are complete.',
                    name: 'shipping',
                    inputValue: 'true',
                    id: 'shippingCheckbox',
                    msgTarget: 'side'
                  },
                  {
                    xtype: 'container',
                    html: '<h3>Update Customer Order on CTRP website (electronic records stored in database)</h3><ol><li>Enter product lot number</li><li>Enter shipping information and tracking number</li><li>Change customer order status to shipped</li></ol>'
                  },
                  {
                    boxLabel: 'Requirements identified in the “Update Customer Order” section above are complete.',
                    name: 'orderupdate',
                    inputValue: 'true',
                    id: 'orderUpdateCheckbox',
                    msgTarget: 'side'
                  }
                ]
              }
            ]
          },
          {
            xtype: 'fieldset',
            border: false,
            margin: '10 50 0 0',
            layout: {
              type: 'hbox',
              pack: 'end',
              align: 'middle'
            },
            maxHeight: 50,
            defaults: {
              xtype: 'textfield',
              labelAlign: 'right'
            },
            items: [
              {
                name: 'signature',
                fieldLabel: 'Signature',
                width: 300,
                allowBlank: false
              },
              {
                xtype: 'hidden',
                name: 'purchase_id',
                fieldLabel: 'Purchase id'
              },
              {
                xtype: 'hidden',
                name: 'email',
                fieldLabel: 'Completed by'
              },
              {
                xtype: 'hidden',
                name: 'date',
                fieldLabel: 'Date'
              }
            ]
          }
        ],
        dockedItems: [{
            xtype: 'toolbar',
            hidden: false,
            border: false,
            itemId: '',
            dock: 'bottom',
            items: [
              {
                xtype: 'tbfill'
              },
              {
                xtype: 'button',
                text: 'Save QA Checklist',
                handler: function() {

                   var checkList = Ext4.ComponentQuery.query('#qaChecklist')[0];
                   var checkListForm = checkList.getForm();
                   var invalidForm = false;

                   checkListForm.getFields().items.forEach(function(item) {

                       if (item.xtype === 'checkbox' && item.value !== true) {
                        // console.log('item ', item.xtype, item.value);
                        item.markInvalid('required');
                        invalidForm = true;
                       }

                       if (item.xtype === 'textfield' && item.value === '') {
                        // console.log('item ', item.xtype, item.value);
                        item.markInvalid('required');
                        invalidForm = true;
                       }

                       if (item.xtype === 'datefield' && item.value === '') {
                        // console.log('item ', item.xtype, item.value);
                        item.markInvalid('required');
                        invalidForm = true;
                       }

                   });

                   if (invalidForm === false) {
                     insertQAChecklist(checkListForm);
                   }

                }
              }
            ]
        }]


      },

      /**
      *****************
      * Address Editor *
      *****************
      */
      {
        xtype: 'panel',
        title: 'Address Editor',
        itemId: 'addressForm',
        layout: 'hbox',
        collapsible: true,
        collapsed: true,
        hidden:false,
        bodyPadding: '5',
        defaults: {
          border: false,
          flex: 0.45,
          bodyPadding: '5',
          margin: '5'
        },
        header: {
          xtype: 'header',
          titlePosition: 2
        },
        items: [
          {
            xtype:'form',
            title: 'Billing Address',
            itemId: 'billingAddressForm',
            defaults: {
              xtype: 'textfield',
              width:500
            },
            items:[
              {
                fieldLabel: 'Institution',
                name: 'billing_institution'
              },
              {
                fieldLabel: 'First Name',
                name: 'billing_firstname'
              },
              {
                fieldLabel: 'Last Name',
                name: 'billing_lastname'
              },
              {
                fieldLabel: 'Address',
                name: 'billing_address'
              },
              {
                fieldLabel: 'City',
                name: 'billing_city'
              },
              {
                fieldLabel: 'State',
                name: 'billing_state'
              },
              {
                fieldLabel: 'Zip',
                name: 'billing_zip'
              },
              {
                fieldLabel: 'Country',
                name: 'billing_country'
              },
              {
                fieldLabel: 'Email',
                name: 'billing_email'
              },
              {
                fieldLabel: 'Fax',
                name: 'billing_fax'
              }
            ]
          },
          {
            xtype:'form',
            title: 'Shipping Address',
            itemId: 'shippingAddressForm',
            defaults: {
              xtype: 'textfield',
              width:500
            },
            items:[
              {
                fieldLabel: 'Institution',
                name: 'shipping_institution'
              },
              {
                fieldLabel: 'First Name',
                name: 'shipping_firstname'
              },
              {
                fieldLabel: 'Last Name',
                name: 'shipping_lastname'
              },
              {
                fieldLabel: 'Address',
                name: 'shipping_address'
              },
              {
                fieldLabel: 'City',
                name: 'shipping_city'
              },
              {
                fieldLabel: 'State',
                name: 'shipping_state'
              },
              {
                fieldLabel: 'Zip',
                name: 'shipping_zip'
              },
              {
                fieldLabel: 'Country',
                name: 'shipping_country'
              },
              {
                fieldLabel: 'Email',
                name: 'shipping_email'
              },
              {
                fieldLabel: 'Fax',
                name: 'shipping_fax'
              }
            ]
          }
        ]
      }
    ],
    dockedItems: [{
        xtype: 'toolbar',
        hidden: false,
        itemId: 'accordionToolbar',
        dock: 'top',
        items: [
          {
            xtype: 'tbfill'
          },
          {
            xtype: 'button',
            text: 'Packing List',
            handler: function() {
              var purchaseDetails = Ext4.StoreManager.lookup('purchaseDetailsStore');
              var purchaseId = purchaseDetails.getAt(0).data.purchase_id;
              var purchaseGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
              var purchaseStore = purchaseGrid.getStore();
              var purchase = purchaseStore.findRecord('id', purchaseId);
              var addresses = Ext4.StoreManager.lookup('addressesStore');
              var fileStore = Ext4.StoreManager.lookup('fileView');
              var additionalInfoStore = Ext4.StoreManager.lookup('additionalInfoView');

              printOrderSummary(purchase, purchaseDetails, addresses, additionalInfoStore, fileStore, true);
            }
          },
          {
            xtype: 'button',
            text: 'Printer-Friendly Order Summary',
            handler: function() {
              var purchaseDetails = Ext4.StoreManager.lookup('purchaseDetailsStore');
              var purchaseId = purchaseDetails.getAt(0).data.purchase_id;
              var purchaseGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
              var purchaseStore = purchaseGrid.getStore();
              var purchase = purchaseStore.findRecord('id', purchaseId);
              var addresses = Ext4.StoreManager.lookup('addressesStore');
              var fileStore = Ext4.StoreManager.lookup('fileView');
              var additionalInfoStore = Ext4.StoreManager.lookup('additionalInfoView');

              printOrderSummary(purchase, purchaseDetails, addresses, additionalInfoStore, fileStore, false);
            }
        }]
    }],
    listeners: {
      'expand': function() {
        this.updateLayout();
      }
    }
});
