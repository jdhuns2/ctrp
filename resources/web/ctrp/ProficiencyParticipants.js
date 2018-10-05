Ext4.define('ProficiencyParticipants.store.ProfstudiesStore',{
	extend:'LABKEY.ext4.data.Store',
	schemaName: 'ctrp_admin',
    queryName: 'profStudiesView',
    storeId: 'profStudiesStore',
    autoLoad: true,
});


Ext4.define('ProficiencyParticipants.store.ReportCommentsStore',{
	extend:'LABKEY.ext4.data.Store',
	schemaName: 'profstudydata',
    queryName: 'report_comments',
    storeId: 'reportComments',
    autoLoad: true

});


Ext4.define('ProficiencyParticipants.store.ProfStudiesStoreEditAllowed',{
	extend: 'LABKEY.ext4.data.Store',
	schemaName: 'profstudydata',
	queryName: 'profstudy',
	autoLoad: true,
	storeId: 'profstudyId'
});

Ext4.define('ProficiencyParticipants.view.ProficiencyGrid', {
    extend: 'Ext4.grid.Panel',
	alias: 'widget.proficiencygrid',

	title: 'Proficiency Studies',
    itemId: 'profStudyGrid',
    resizable: true,
    width: '99%',
	store:'ProfstudiesStore',
    features: [{
         ftype: 'summary'
    }],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [
                {
                  xtype: 'tbfill'
                }, {
                  xtype: 'button',
                  text: 'Export to Excel',
                  handler: function(){
					  convertGridToExcel(this.up('grid'));
				  }
                }, /*{
                  xtype: 'button',
                  text: 'Save Chart',
                  handler: function() {
                    var salesChart = Ext4.ComponentQuery.query('#salesChart')[0]
                    salesChart.save({
                        type: 'image/png'
                    });
                  }
                }*/
              ]
          }],
          columns: [{
              id: 'Purchase Id',
              header: 'Purchase Id',
              width: 80,
              sortable: true,
              dataIndex: 'purchase_id',
              summaryType: 'count',
              summaryRenderer: function(value) {
                return Ext4.String.format('<strong>total: {0}</strong>', value );
              }

          }, {
            header: 'Prof Study Id',
            width: 80,
            sortable: true,
            dataIndex: 'prof_study_id'
          }, {
            header: 'Type',
            dataIndex: 'mach_arch',
            width: 75,
            sortable: true,
			renderer:function(value){
				return value.charAt(0).toUpperCase() + value.slice(1);
			}
          }, {
            header: 'Round',
            dataIndex: 'profstudy_reference_id',
            width: 75,
            sortable: true
          }, {
            header: 'Institution',
            dataIndex: 'shipping_institution',
            flex: 1,
            sortable: true
          }, {
            header: 'User',
            dataIndex: 'username_display',
            flex: 1,
            sortable: true
          }, {
            header: 'Data',
            dataIndex: 'dataloaded',
            width: 60,
            sortable: true,
			renderer:function(value){
				if(value.includes('no')){
					return '<span style=color:"red">'+value+'</span>'
				}
				else{
					return '<span style=color:"green">'+value+'</span>'
				}
			},
            summaryType: this.countTotalDataLoaded,

          },{
            header: 'Shipping',
            dataIndex: 'shipping',
            width: 60,
            sortable: true,
            hidden: true
          }, {
            header: 'Billing',
            dataIndex: 'billing',
            width: 60,
            sortable: true,
            hidden: true
          }, {
            header: 'Created',
            dataIndex: 'created',
            width: 100,
            sortable: true,
            type: 'date',
            dateFormat: 'Y/m/d H:i:s',
            renderer: Ext4.util.Format.dateRenderer('m/d/Y H:i:s')
          }, {
            header: 'Order Status',
            dataIndex: 'description',
            flex: 1,
            sortable: true
          },
            {
             header: "Submission Status",
             dataIndex: 'status',
             flex: 1,
             sortable: true,

            }, {
             header: "Comments",
             dataIndex: 'report_comments',
             flex: 1,
             sortable: false,
			       editor: {xtype: 'editstatus'}
            },
           {
            header: 'Workflow Category',
            dataIndex: 'workflow_category',
            flex: 1,
            sortable: true,
            hidden: true
          }],


          listeners: {
            'cellclick' : function(theGrid,tb,index,item){
                columnName = theGrid.getGridColumns()[index]['dataIndex'];
                if(columnName == 'status' ){

                    this.fireEvent('submitClicked',item);

                }else if(columnName == 'report_comments'){

                    this.fireEvent('commentClicked',item);
                }
            },
			'beforeitemdblclick': function( theGrid, record, item, index )  {
              var URL = 'https://mcclabkey.uky.edu/labkey/project/CTRP_Admin/begin.view?purchase_id='+record.data.purchase_id;
              window.open(URL, '_blank');
            }
          },

		  countTotalDataLoaded: function(val) {
		  var totalSubmitted = 0;
		  for(i = 0; i < val.length; i++){
			  if(val[i].get('dataloaded').includes('yes')){
				  totalSubmitted++;
			  }
		  }
        console.log('===RECORDS', val);
        return totalSubmitted;
      },


});

Ext4.define('ProficiencyParticipants.view.EditStatus',{
	  extend: 'Ext.window.Window',
      alias : 'widget.editstatus',
      title: 'Update Status',
      layout: 'fit',
      autoShow: true,
      modal: true,

	  items:[{
		  xtype: 'combobox',
			   fieldLabel: 'status',
		       valueField: 'status',
		       displayField: 'status',
		       itemId: 'StatusCombo',
		       store:   ['complete','resubmit'],
		       emptyText: 'select status'
	  }],
	  buttons:[{
		  text: 'Save',
          action: 'save'
	  },{
		  text: 'Cancel',
          action:'cancel'
	  }]

});

Ext4.define('ProficiencyParticipants.view.EditComment',{
      extend: 'Ext.window.Window',
      alias : 'widget.editcomment',
      title: 'Update Comment',
      layout: 'fit',
      autoShow: true,
      modal: true,
      width      : 600,
      height    : 400,
      bodyPadding: 20,
      autoScroll: true,
	  buttons:[{
                text: 'Save',
                action: 'save'
            },{
                text: 'Cancel',
				action: 'cancel'
            }]
});

Ext4.define('ProficiencyParticipants.controller.ProficiencyController', {
    extend: 'Ext4.app.Controller',
	views:['ProficiencyGrid','EditStatus','EditComment'],
    refs:[
		{ref:'proficiencygrid',//this will generate a getControlPanel() function
		selector:'proficiencygrid'//same as the widget name
		},
		{
			ref: 'editstatus',
			selector: 'editstatus'
		},
    {
      ref: 'editcomment',
      selector: 'editcomment'
    }
	],
	stores:['ProfstudiesStore','ReportCommentsStore','ProfStudiesStoreEditAllowed'],
	init: function() {
		this.getProfstudiesStoreStore().load();
		this.getReportCommentsStoreStore().load();
		this.getProfStudiesStoreEditAllowedStore().load();
		this.listen({
			controller:{
				'*':{
					roundChanged:'onRoundChanged'
				}
			},
			global:{
					'RefireEvents':this.fireEvents
				},

			});

		this.control({

			'proficiencygrid': {
				submitClicked: this.editStatus,
        commentClicked: this.editComment
			},
			'editstatus  button[action=save]' :{
				click: this.updateStatus
			},
      'editcomment  button[action=save]' :{
        click: this.updateComment
      },
		  'editcomment button[action=cancel]': {
			  click: this.closeFunction
		  },
		  'editstatus button[action=cancel]': {
			  click: this.closeFunction
		  }

		});

	},
closeFunction:function(button){
	button.up('window').close();
},
	updateStatus: function(button){

		var win = button.up('window'),
			combobox = win.down('combobox'),
			values = combobox.getValue();

			if(values != 'complete' && values != 'resubmit')
					return;

			store = this.getProfStudiesStoreEditAllowedStore();
			if(record = store.findRecord('id',this.record.get('prof_study_id'))){
				var status = record.get('status');
				var reg = new RegExp('[0-9]+');
				var result = reg.exec(status);
				if(result != null){
					record.set('status', values + ' (' + result[0] + ')');
					this.record.set('status', values + ' (' + result[0] + ')');
				}
				else{
					this.record.set('status',values); //for grid view T_T
					record.set('status',values); //for profstudy table T_T
				}
				store.sync();
			}else{
				console.log("error invalid id");
			}
			//store.sync();
			win.close();
	},

  updateComment: function(button){
      var win = button.up('window'),

      store = this.getReportCommentsStoreStore();
      textfields = win.items.items;
	  for(i = 0; i < textfields.length; i++){
		  win.commentRecords[i].set('blinded_comment',textfields[i].getValue());
	  }

      store.sync();
      win.close();
  },

  editComment: function(record){

    store = this.getReportCommentsStoreStore();
    store.clearFilter(true);
    store.filter('profstudy_id',record.get('prof_study_id'));
    //commentRecords = store.data.items;
	commentRecords = store.getRange();

    if(commentRecords.length > 0){
      var view = Ext4.widget('editcomment');
      view.commentRecords = commentRecords;

          for(i = 0; i < commentRecords.length; i++){

            view.add({
                     xtype     : 'textareafield',
                     grow      : true,
                     name      : 'message',
                     fieldLabel: 'comment ' + i ,
                     anchor: '100%',
                     value: commentRecords[i].data['blinded_comment']
            });

          }
    }

  },

	editStatus: function(record){
		var view = Ext4.widget('editstatus');
		view.record = record;
		this.record = record;
	},

	onRoundChanged:function(record){
        this.getProfstudiesStoreStore().clearFilter();
		this.getProfstudiesStoreStore().filter('profstudy_reference_id',record.get('profstudy_reference_id'));
	}

});
