var purchaseGrid = new Ext4.grid.GridPanel({
    title: 'Purchases <span style="background-color:white; color:red; margin-left:30%;">	Current Purchases includes all orders placed on 7/1/2016 and afterwards</span>',
    store:  purchasesViewStore,
    itemId: 'purchasesGrid',
    maxHeight: 500,
    width: '99%',
    tools:[
      {
        type:'refresh',
        tooltip: 'Refresh Grid Data',
        handler: function(event, toolEl, panelHeader) {
          var purchaseGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
          purchaseGrid.getStore().reload();
        }
      }
    ],
    dockedItems:[
      {
        xtype: 'toolbar',
        dock: 'top',
        items: [
          statusCombo,
          {
            xtype:'form',
            itemId: 'searchForm',
            layout: 'hbox',
            margin: '0, 0, 0, 5',
            items: [
              {
                xtype: 'textfield',
                hideTrigger: true,
                name: 'searchId',
                itemId: 'searchId',
                maskRe: /[A-Za-z0-9]/,
                listeners: {
                  'change': function( that, newValue, oldValue, eOpts ) {
                    searchPurchases(newValue);
                  }
                }
              },
              {
                xtype: 'button',
                text: 'Clear',
                margin: '0, 0, 0, 5',
                handler: function() {
                  var formPanel = this.up();
                  var searchId = formPanel.getForm().findField('searchId');
                  searchId.setValue('');
                  selectWorkflowCategory();
                }
              }
            ]
          },
          {
            xtype: 'tbfill'
          },
          {
            xtype: 'button',
            text: 'Show All Orders',
            handler: function() {
              showAllOrders();
            }
          },{
			  xtype: 'button',
			  text:'Export To Excel',
			  handler:function(){
				  convertGridToExcel(this.up('gridpanel'));
			  }
		  }
        ]
      }
    ],
    columns: [
      {
        id: 'Id',
        header: 'Id',
        width: 50,
        sortable: true,
        dataIndex: 'id',
        renderer: function (value, metaData, record) {
          if (record.data.newFileFlag) {

            var newFileFlag = record.data.newFileFlag;
            var newFileTotal = record.data.newFileTotal;

            // if record is flagged, mark it as new file
            var processed = false;
            processedFilesStore.each(function(record) {

                // Todo... fix model so newfile* are recognized as ints
                if (record.data.fileid === parseInt(newFileFlag, 10) && record.data.total === parseInt(newFileTotal, 10) ) {
                  processed = true;
                }
            });

            if (processed === false ) {
              value = '<span style="color:red;font-weight:bold"> ' + value + '</span>';
            }

          }
          return value;
        }
      },
      {header: 'Institution', dataIndex: 'institution', width: 300, sortable: true},
      {header: 'User', dataIndex: 'username_display', width: 175, sortable: true},
      {header: 'Email', dataIndex: 'email', width: 270, sortable: true, hidden:true},
      {header: 'Lot #', dataIndex: 'lot_numbers', width: 270, sortable: true, hidden:true},
      {
        header: 'Status',
        dataIndex: 'description',
        flex: 1,
        sortable: true
      },
      {
        header: 'Purchase Date',
        dataIndex: 'purchase_date',
        width: 150,
        sortable: true,
        type: 'date',
        dateFormat: 'Y/m/d H:i:s',
        renderer: Ext4.util.Format.dateRenderer('m/d/Y')
      },
      {
        header: 'PO',
        dataIndex: 'po_number',
        width: 150,
        sortable: true,
        type: 'string'
      },{
		header: 'State',
		dataIndex:'state',
		width:100,
		sortable:true,
		type:'string',
		hidden:true
	  },{
        header: 'Country',
        dataIndex: 'country',
        width: 150,
        sortable: true,
        type: 'string'
      },
      {
        header: 'Shipped Date',
        dataIndex: 'shipped_date',
        width: 100,
        sortable: true,
        type: 'date',
        hidden: true,
        dateFormat: 'Y/m/d',
        renderer: Ext4.util.Format.dateRenderer('m/d/Y')
      },
      {
        header: 'Ref Numbers',
        dataIndex: 'reference_number',
        width: 100,
        sortable: true,
        type: 'int',
        hidden: true
      }
    ],
    selType: 'rowmodel',
    listeners: {

      select: function(theRowModel, record, item, index) {

        //reset id color to normal on click...
        var purchaseGrid = Ext4.ComponentQuery.query('#purchasesGrid')[0];
        var view = purchaseGrid.getView();
        var node = view.getNodeByRecord(record);
        var idCell = node.childNodes[0];
        var span = idCell.getElementsByTagName('span')[0];
        if (span) {
          span.style.color = "#000000";
          span.style.fontWeight = 'normal';
        }

        currentPurchaseId = record.data.id;
        loadPurchaseDetails(record, purchaseGrid);
      },
      'afterlayout': function(theGrid) {

        // console.log('after layout');
        if (LABKEY.ActionURL.getParameter('purchase_id')) {
          var gridStore = theGrid.getStore();
          var record = gridStore.findRecord("id", LABKEY.ActionURL.getParameter('purchase_id'));

          if (record.data.id >= 0) {
            theGrid.getView().scrollRowIntoView(record.index);
            theGrid.getSelectionModel().select(record.index);
          } else {
            Ext4.Msg.alert('Alert', 'ERROR -- Record not found ' + LABKEY.ActionURL.getParameter('purchase_id'));
          }
        }
      },
      'afterrender': function(theGrid) {

        // console.log('after render');
        if (!LABKEY.ActionURL.getParameter('purchase_id')) {
          selectWorkflowCategory();
        }

      }
    },
    stripeRows : true
});
